import { createClient } from "@/lib/supabase/server";

type OrderItem = {
  product_id: number | null;
  quantity: number | null;
};

type ProductStock = {
  id: number;
  stock: number | null;
};

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const orderId = Number(id);

  if (!Number.isInteger(orderId)) {
    return Response.json({ error: "Invalid order." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, status, order_items (product_id, quantity)")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (orderError) {
    console.error("Cancel order read error:", orderError);
    return Response.json({ error: "Could not read order." }, { status: 500 });
  }

  if (!order) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  if (order.status === "cancelled") {
    return Response.json({ status: "cancelled", restoredItems: [] });
  }

  if (order.status !== "pending") {
    return Response.json(
      { error: "Order cannot be cancelled.", status: order.status },
      { status: 409 }
    );
  }

  const restoreQuantities = new Map<number, number>();
  ((order.order_items ?? []) as OrderItem[]).forEach((item) => {
    if (!item.product_id || !item.quantity) return;
    restoreQuantities.set(
      item.product_id,
      (restoreQuantities.get(item.product_id) ?? 0) + Number(item.quantity)
    );
  });

  const productIds = [...restoreQuantities.keys()];
  const { data: products, error: productsError } = productIds.length
    ? await supabase.from("products").select("id, stock").in("id", productIds)
    : { data: [] as ProductStock[], error: null };

  if (productsError) {
    console.error("Cancel order products read error:", productsError);
    return Response.json({ error: "Could not read product stock." }, { status: 500 });
  }

  const productStocks = new Map(
    ((products ?? []) as ProductStock[]).map((product) => [product.id, product.stock])
  );
  const missingProduct = productIds.find((productId) => !productStocks.has(productId));

  if (missingProduct) {
    return Response.json({ error: "Product stock is unavailable." }, { status: 500 });
  }

  const restoredItems = productIds.map((productId) => ({
    productId,
    quantity: restoreQuantities.get(productId) ?? 0,
    stock: Number(productStocks.get(productId) ?? 0) + (restoreQuantities.get(productId) ?? 0),
  }));

  const stockResults = await Promise.all(
    restoredItems.map((item) =>
      supabase
        .from("products")
        .update({ stock: item.stock })
        .eq("id", item.productId)
    )
  );

  const stockError = stockResults.find((result) => result.error)?.error;

  if (stockError) {
    console.error("Cancel order stock restore error:", stockError);
    return Response.json({ error: "Could not restore product stock." }, { status: 500 });
  }

  const rollbackStockRestore = async () => {
    const rollbackResults = await Promise.all(
      restoredItems.map((item) =>
        supabase
          .from("products")
          .update({ stock: productStocks.get(item.productId) ?? 0 })
          .eq("id", item.productId)
      )
    );
    const rollbackError = rollbackResults.find((result) => result.error)?.error;
    if (rollbackError) console.error("Cancel order stock rollback error:", rollbackError);
  };

  const { data: cancelledOrder, error: cancelError } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)
    .eq("user_id", user.id)
    .eq("status", "pending")
    .select("status")
    .maybeSingle();

  if (cancelError) {
    console.error("Cancel order status update error:", cancelError);
    await rollbackStockRestore();
    return Response.json({ error: "Could not cancel order." }, { status: 500 });
  }

  if (!cancelledOrder) {
    await rollbackStockRestore();

    const { data: latestOrder } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .maybeSingle();

    return Response.json(
      {
        error: "Order was already updated.",
        status: latestOrder?.status ?? order.status,
      },
      { status: 409 }
    );
  }

  return Response.json({ status: cancelledOrder.status, restoredItems });
}
