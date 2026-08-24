import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getProductImage } from "@/lib/product-images";
import { createClient } from "@/lib/supabase/server";
import OrderStatusActions from "../../order-status-actions";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
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

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id, order_number, full_name, phone, address, note, status,
      subtotal, shipping_fee, total, created_at,
      order_items (id, product_id, product_name, sku, unit_price, quantity, line_total)
    `)
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) console.error("Order detail error:", error);
  if (!order) notFound();

  const productIds = [...new Set(order.order_items?.map((item) => item.product_id).filter(Boolean) ?? [])];
  const productMap = new Map<number, { slug: string; image: string }>();

  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("id, slug, product_images(image_url, is_primary, sort_order)")
      .in("id", productIds);

    products?.forEach((product) => {
      const images = [...(product.product_images ?? [])].sort(
        (a, b) =>
          Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary)) ||
          Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
      );
      productMap.set(product.id, {
        slug: product.slug,
        image: images[0]?.image_url || getProductImage(product.slug) || "/images/product-sofa-elara.png",
      });
    });
  }

  return (
    <main className="min-h-screen bg-[#f6f6f2] text-[#2c2c2c]">
      <SiteHeader />

      <section className="mx-auto w-full max-w-[1160px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <Link href="/account" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#6b7d65] transition hover:text-[#42503e]">
          <span aria-hidden="true">←</span> Quay lại tài khoản
        </Link>

        <div className="mb-6 rounded-2xl bg-[#6b7d65] p-5 text-white shadow-[0_16px_38px_rgba(45,59,41,0.14)] sm:p-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">Chi tiết đơn hàng</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Đơn #{order.order_number}</h1>
              <p className="mt-2 text-sm text-white/70">Đặt lúc {formatDate(order.created_at)}</p>
            </div>
            <div className="sm:text-right">
              <OrderStatusActions orderId={order.id} initialStatus={order.status} align="right" />
              <p className="mt-3 text-2xl font-semibold">{formatPrice(order.total)}</p>
            </div>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_12px_34px_rgba(37,47,34,0.05)] sm:p-7">
              <div className="flex items-center justify-between border-b border-[#ecece7] pb-4">
                <h2 className="text-xl font-semibold">Sản phẩm</h2>
                <span className="text-sm text-[#888]">{order.order_items?.length ?? 0} sản phẩm</span>
              </div>

              <div className="divide-y divide-[#ecece7]">
                {order.order_items?.map((item) => {
                  const product = productMap.get(item.product_id);
                  const content = (
                    <>
                      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f3f3ef] sm:h-24 sm:w-28">
                        {/* Product image URLs may come from Supabase Storage at runtime. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product?.image || "/images/product-sofa-elara.png"}
                          alt={item.product_name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-snug text-[#333]">{item.product_name}</p>
                        {item.sku && <p className="mt-1 text-xs text-[#999]">SKU: {item.sku}</p>}
                        <p className="mt-2 text-sm text-[#777]">{formatPrice(item.unit_price)} × {item.quantity}</p>
                      </div>
                    </>
                  );

                  return (
                    <div key={item.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:gap-4">
                      {product ? (
                        <Link href={`/products/${product.slug}`} className="group flex min-w-0 flex-1 items-center gap-4">
                          {content}
                        </Link>
                      ) : (
                        <div className="group flex min-w-0 flex-1 items-center gap-4">{content}</div>
                      )}
                      <p className="shrink-0 self-start text-sm font-semibold sm:pt-1 sm:text-base">{formatPrice(item.line_total)}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_12px_34px_rgba(37,47,34,0.05)] sm:p-7">
              <h2 className="mb-4 text-xl font-semibold">Tổng quan đơn hàng</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[#777]">Tạm tính</span>
                  <span className="font-medium">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#777]">Phí vận chuyển</span>
                  <span className="font-medium">{order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : "Chưa tính"}</span>
                </div>
                <div className="flex items-end justify-between gap-4 border-t border-[#ecece7] pt-4">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="text-xl font-semibold text-[#6b7d65]">{formatPrice(order.total)}</span>
                </div>
              </div>
            </section>
          </div>

          <aside className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_12px_34px_rgba(37,47,34,0.05)] sm:p-7 lg:sticky lg:top-28">
            <h2 className="text-xl font-semibold">Thông tin giao hàng</h2>
            <p className="mt-1 text-sm text-[#888]">Thông tin người nhận của đơn hàng.</p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">Người nhận</p>
                <p className="mt-1 font-medium">{order.full_name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">Số điện thoại</p>
                <p className="mt-1 font-medium">{order.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">Địa chỉ</p>
                <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#555]">{order.address}</p>
              </div>
              {order.note && (
                <div className="rounded-xl bg-[#f7f7f3] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">Ghi chú</p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#555]">{order.note}</p>
                </div>
              )}
            </div>

            <Link href="/products" className="mt-7 flex min-h-12 items-center justify-center rounded-full bg-[#6b7d65] px-5 text-sm font-semibold text-white transition hover:bg-[#596b54]">
              Tiếp tục mua sắm
            </Link>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
