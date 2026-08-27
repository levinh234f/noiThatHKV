import { createClient } from "@/lib/supabase/server";

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

  const { data, error } = await supabase
    .rpc("update_order_status", {
      p_order_id: orderId,
      p_status: "cancelled",
      p_admin_only: false,
    })
    .single();

  if (error) {
    console.error("Cancel order error:", error);
    return Response.json(
      { error: error.message || "Could not cancel order." },
      { status: error.code === "42501" ? 403 : 409 }
    );
  }

  const cancelledOrder = data as { status: string };

  return Response.json({ status: cancelledOrder.status });
}
