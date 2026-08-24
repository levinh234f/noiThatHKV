import Link from "next/link";
import { redirect } from "next/navigation";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";
import OrderStatusActions from "./order-status-actions";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id, order_number, status, total, created_at,
      order_items (id, product_name, quantity, unit_price, line_total)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#f6f6f2] text-[#2c2c2c]">
      <SiteHeader />

      <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7d65]">Tài khoản HKV</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Xin chào, {user.user_metadata?.full_name || "bạn"}
            </h1>
          </div>
          <p className="text-sm text-[#777]">Quản lý thông tin và theo dõi đơn hàng của bạn.</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[310px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_14px_40px_rgba(37,47,34,0.06)]">
            <div className="bg-[#6b7d65] px-6 py-6 text-white">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-lg font-semibold">
                {(user.user_metadata?.full_name || user.email || "H").charAt(0).toUpperCase()}
              </div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/70">Thành viên HKV</p>
              <p className="mt-1 truncate text-lg font-semibold">
                {user.user_metadata?.full_name || "Khách hàng HKV"}
              </p>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">Email</p>
                <p className="mt-1 break-all text-sm font-medium text-[#444]">{user.email}</p>
              </div>
              <div className="border-t border-[#ecece7] pt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">Đơn hàng</p>
                <p className="mt-1 text-2xl font-semibold text-[#6b7d65]">{orders?.length ?? 0}</p>
              </div>
              <LogoutButton />
            </div>
          </aside>

          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_14px_40px_rgba(37,47,34,0.05)] sm:p-7">
            <div className="mb-5 flex items-center justify-between border-b border-[#ecece7] pb-5">
              <div>
                <h2 className="text-xl font-semibold sm:text-2xl">Đơn hàng của bạn</h2>
                <p className="mt-1 text-sm text-[#888]">Cập nhật trạng thái mua hàng gần nhất.</p>
              </div>
              <span className="rounded-full bg-[#eef1eb] px-3 py-1 text-sm font-semibold text-[#5f7159]">
                {orders?.length ?? 0} đơn
              </span>
            </div>

            {!orders || orders.length === 0 ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl bg-[#fafaf7] px-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e9eee5] text-[#6b7d65]">0</div>
                <p className="font-semibold">Bạn chưa có đơn hàng nào</p>
                <p className="mt-1 max-w-sm text-sm leading-6 text-[#888]">
                  Khám phá các bộ sưu tập nội thất HKV để hoàn thiện không gian của bạn.
                </p>
                <Link href="/products" className="mt-5 rounded-full bg-[#6b7d65] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#596b54]">
                  Khám phá sản phẩm
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <article key={order.id} className="rounded-xl border border-[#e8e8e2] p-4 transition hover:border-[#bac4b5] hover:shadow-[0_8px_24px_rgba(37,47,34,0.05)] sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-[#333]">Đơn #{order.order_number}</h3>
                          <OrderStatusActions orderId={order.id} initialStatus={order.status} />
                        </div>
                        <p className="mt-2 text-sm text-[#888]">{new Date(order.created_at).toLocaleDateString("vi-VN")}</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-xs font-medium uppercase tracking-wider text-[#999]">Tổng tiền</p>
                        <p className="mt-1 text-lg font-semibold text-[#6b7d65]">{formatPrice(order.total)}</p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-[#eeeeea] pt-4">
                      <div className="space-y-2">
                        {order.order_items?.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                            <p className="min-w-0 truncate text-[#555]">
                              {item.product_name} <span className="text-[#999]">× {item.quantity}</span>
                            </p>
                            <p className="shrink-0 font-medium text-[#555]">{formatPrice(item.line_total)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <p className="text-xs text-[#999]">
                          {(order.order_items?.length ?? 0) > 2
                            ? `+ ${(order.order_items?.length ?? 0) - 2} sản phẩm khác`
                            : `${order.order_items?.length ?? 0} sản phẩm`}
                        </p>
                        <Link href={`/account/orders/${order.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#5f7159] transition hover:text-[#3f503b]">
                          Xem chi tiết <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
