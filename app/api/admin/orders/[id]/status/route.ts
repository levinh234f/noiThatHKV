import { createClient } from "@/lib/supabase/server";

const allowedStatuses = new Set([
  "pending",
  "confirmed",
  "shipping",
  "completed",
  "cancelled",
]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const orderId = Number(id);

  if (!Number.isInteger(orderId)) {
    return Response.json({ error: "Đơn hàng không hợp lệ." }, { status: 400 });
  }

  const body = await request.json().catch(() => null) as {
    status?: unknown;
  } | null;
  const nextStatus = typeof body?.status === "string" ? body.status : "";

  if (!allowedStatuses.has(nextStatus)) {
    return Response.json({ error: "Trạng thái không hợp lệ." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_hkv_admin");

  if (adminError) {
    console.error("Admin status check error:", adminError);
    return Response.json({ error: "Không thể kiểm tra quyền quản trị." }, { status: 500 });
  }

  if (!isAdmin) {
    return Response.json({ error: "Bạn không có quyền quản trị." }, { status: 403 });
  }

  const { data, error } = await supabase
    .rpc("update_order_status", {
      p_order_id: orderId,
      p_status: nextStatus,
      p_admin_only: true,
    })
    .single();

  if (error) {
    console.error("Admin order status update error:", error);
    return Response.json(
      { error: error.message || "Không thể cập nhật trạng thái đơn hàng." },
      { status: error.code === "42501" ? 403 : 409 }
    );
  }

  const updatedOrder = data as { status: string };

  return Response.json({ status: updatedOrder.status });
}
