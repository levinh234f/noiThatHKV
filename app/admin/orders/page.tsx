import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import AdminOrderStatusActions from "./order-status-actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quản lý đơn hàng",
  description: "Trang quản trị đơn hàng HKV Interior.",
};

type OrderStatus = "pending" | "confirmed" | "shipping" | "completed" | "cancelled";

type AdminOrderItem = {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type AdminOrder = {
  id: number;
  order_number: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  full_name: string;
  phone: string;
  address: string;
  note: string | null;
  items: AdminOrderItem[];
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Đã giao",
  cancelled: "Đã hủy",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function normalizeOrder(order: AdminOrder): AdminOrder {
  return {
    ...order,
    total: Number(order.total),
    items: Array.isArray(order.items) ? order.items : [],
  };
}

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_hkv_admin");

  if (adminError) {
    console.error("Admin page authorization error:", adminError);
    notFound();
  }

  if (!isAdmin) notFound();

  const { data, error } = await supabase.rpc("admin_list_orders");

  if (error) {
    console.error("Admin orders load error:", error);
  }

  const orders = ((data ?? []) as AdminOrder[]).map(normalizeOrder);
  const counts = orders.reduce(
    (current, order) => ({
      ...current,
      [order.status]: current[order.status] + 1,
    }),
    {
      pending: 0,
      confirmed: 0,
      shipping: 0,
      completed: 0,
      cancelled: 0,
    } satisfies Record<OrderStatus, number>
  );

  return (
    <main className="min-h-screen bg-[#f6f6f2] text-[#2c2c2c]">
      <SiteHeader />

      <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7d65]">
              Quản trị HKV
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Quản lý đơn hàng
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777]">
              Cập nhật trạng thái đơn hàng và theo dõi thông tin giao hàng mới nhất.
            </p>
          </div>
          <Link
            href="/account"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#6b7d65]/35 bg-white px-5 text-sm font-semibold text-[#5f7159]"
          >
            Tài khoản
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {(Object.keys(statusLabels) as OrderStatus[]).map((status) => (
            <div key={status} className="rounded-2xl border border-black/5 bg-white p-4 shadow-[0_10px_28px_rgba(37,47,34,0.04)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">{statusLabels[status]}</p>
              <p className="mt-2 text-2xl font-semibold text-[#6b7d65]">{counts[status]}</p>
            </div>
          ))}
        </div>

        {error ? (
          <div className="rounded-2xl border border-[#f0c6c0] bg-[#fff4f2] p-6 text-sm text-[#b42318]">
            Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-black/5 bg-white p-8 text-center shadow-[0_14px_40px_rgba(37,47,34,0.05)]">
            <div>
              <p className="text-lg font-semibold">Chưa có đơn hàng</p>
              <p className="mt-2 text-sm text-[#888]">Các đơn hàng mới sẽ xuất hiện tại đây.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-[#e8e8e2] bg-white p-5 shadow-[0_12px_34px_rgba(37,47,34,0.05)] transition hover:border-[#bac4b5] sm:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-[#333]">Đơn #{order.order_number}</h2>
                      <span className="text-xs text-[#999]">{formatDate(order.created_at)}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#555]">{order.full_name}</p>
                    <p className="mt-1 text-sm text-[#777]">{order.phone}</p>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-[#777]">{order.address}</p>
                    {order.note && <p className="mt-2 text-xs text-[#999]">{order.note}</p>}
                  </div>

                  <div className="shrink-0 lg:min-w-[280px] lg:text-right">
                    <AdminOrderStatusActions orderId={order.id} initialStatus={order.status} />
                    <p className="mt-4 text-xs font-medium uppercase tracking-wider text-[#999]">Tổng tiền</p>
                    <p className="mt-1 text-xl font-semibold text-[#6b7d65]">{formatPrice(order.total)}</p>
                  </div>
                </div>

                <div className="mt-5 border-t border-[#eeeeea] pt-4">
                  <div className="space-y-2">
                    {order.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                        <p className="min-w-0 truncate text-[#555]">
                          {item.product_name} <span className="text-[#999]">× {item.quantity}</span>
                        </p>
                        <p className="shrink-0 font-medium text-[#555]">{formatPrice(Number(item.line_total))}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#999]">
                    <span>
                      {order.items.length > 4
                        ? `+ ${order.items.length - 4} sản phẩm khác`
                        : `${order.items.length} sản phẩm`}
                    </span>
                    <span>Trạng thái hiện tại: {statusLabels[order.status]}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
