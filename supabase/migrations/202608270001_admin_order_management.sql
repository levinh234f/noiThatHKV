create or replace function public.is_hkv_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins admin
    where admin.user_id = auth.uid()
  );
$$;

grant execute on function public.is_hkv_admin() to authenticated;

create or replace function public.admin_list_orders()
returns table (
  id bigint,
  order_number text,
  status text,
  total numeric,
  created_at text,
  full_name text,
  phone text,
  address text,
  note text,
  items jsonb
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_hkv_admin() then
    raise exception 'Admin access required.' using errcode = '42501';
  end if;

  return query
  select
    orders.id::bigint,
    orders.order_number::text,
    orders.status::text,
    orders.total::numeric,
    orders.created_at::text,
    orders.full_name::text,
    orders.phone::text,
    orders.address::text,
    orders.note::text,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', order_items.id,
          'product_name', order_items.product_name,
          'quantity', order_items.quantity,
          'unit_price', order_items.unit_price,
          'line_total', order_items.line_total
        )
        order by order_items.id
      ) filter (where order_items.id is not null),
      '[]'::jsonb
    ) as items
  from public.orders
  left join public.order_items on order_items.order_id = orders.id
  group by
    orders.id,
    orders.order_number,
    orders.status,
    orders.total,
    orders.created_at,
    orders.full_name,
    orders.phone,
    orders.address,
    orders.note
  order by orders.created_at desc;
end;
$$;

grant execute on function public.admin_list_orders() to authenticated;

create or replace function public.update_order_status(
  p_order_id bigint,
  p_status text,
  p_admin_only boolean default false
)
returns table (
  id bigint,
  status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_order record;
  is_admin boolean;
begin
  if p_status not in ('pending', 'confirmed', 'shipping', 'completed', 'cancelled') then
    raise exception 'Invalid order status.' using errcode = '22023';
  end if;

  select orders.id, orders.user_id, orders.status
  into current_order
  from public.orders
  where orders.id = p_order_id
  for update;

  if not found then
    raise exception 'Order not found.' using errcode = 'P0002';
  end if;

  is_admin := public.is_hkv_admin();

  if p_admin_only and not is_admin then
    raise exception 'Admin access required.' using errcode = '42501';
  end if;

  if not is_admin and (current_order.user_id is distinct from auth.uid() or p_status <> 'cancelled') then
    raise exception 'Order status update is not allowed.' using errcode = '42501';
  end if;

  if current_order.status = 'cancelled' and p_status = 'cancelled' then
    return query select current_order.id::bigint, current_order.status::text;
    return;
  end if;

  if is_admin then
    if not (
      (current_order.status = 'pending' and p_status in ('confirmed', 'cancelled')) or
      (current_order.status = 'confirmed' and p_status in ('shipping', 'cancelled')) or
      (current_order.status = 'shipping' and p_status = 'completed')
    ) then
      raise exception 'Invalid order status transition.' using errcode = '22023';
    end if;
  else
    if current_order.status <> 'pending' then
      raise exception 'Order status update is not allowed.' using errcode = '42501';
    end if;
  end if;

  if p_status = 'cancelled' then
    with restored_items as (
      select
        order_items.product_id,
        sum(order_items.quantity)::integer as quantity
      from public.order_items
      where order_items.order_id = current_order.id
        and order_items.product_id is not null
      group by order_items.product_id
    )
    update public.products
    set stock = coalesce(products.stock, 0) + restored_items.quantity
    from restored_items
    where products.id = restored_items.product_id;
  end if;

  update public.orders
  set status = p_status
  where orders.id = current_order.id
  returning orders.id, orders.status
  into current_order;

  return query select current_order.id::bigint, current_order.status::text;
end;
$$;

grant execute on function public.update_order_status(bigint, text, boolean) to authenticated;
