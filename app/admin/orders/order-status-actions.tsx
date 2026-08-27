"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderStatus = "pending" | "confirmed" | "shipping" | "completed" | "cancelled";

type OrderStatusActionsProps = {
  orderId: number;
  initialStatus: OrderStatus;
};

const actionsByStatus: Record<OrderStatus, Array<{ status: OrderStatus; label: string; tone?: "danger" }>> = {
  pending: [
    { status: "confirmed", label: "Xác nhận đơn" },
    { status: "cancelled", label: "Hủy đơn", tone: "danger" },
  ],
  confirmed: [
    { status: "shipping", label: "Đang giao" },
    { status: "cancelled", label: "Hủy đơn", tone: "danger" },
  ],
  shipping: [{ status: "completed", label: "Đã giao" }],
  completed: [],
  cancelled: [],
};

const labels: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Đã giao",
  cancelled: "Đã hủy",
};

function getStatusClass(status: OrderStatus) {
  if (status === "completed") return "bg-emerald-50 text-emerald-700";
  if (status === "cancelled") return "bg-red-50 text-red-600";
  if (status === "shipping") return "bg-blue-50 text-blue-700";
  if (status === "confirmed") return "bg-[#eef1eb] text-[#5f7159]";
  return "bg-amber-50 text-amber-700";
}

export default function AdminOrderStatusActions({
  orderId,
  initialStatus,
}: OrderStatusActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [loadingStatus, setLoadingStatus] = useState<OrderStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const actions = actionsByStatus[status] ?? [];

  async function updateStatus(nextStatus: OrderStatus) {
    if (loadingStatus) return;

    if (nextStatus === "cancelled" && !window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    setLoadingStatus(nextStatus);
    setErrorMessage("");

    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const data = await response.json().catch(() => null) as {
      status?: OrderStatus;
      error?: string;
    } | null;

    setLoadingStatus(null);

    if (!response.ok || !data?.status) {
      setErrorMessage(data?.error || "Không thể cập nhật trạng thái đơn hàng.");
      return;
    }

    setStatus(data.status);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(status)}`}>
        {labels[status] ?? status}
      </span>

      {actions.map((action) => (
        <button
          key={action.status}
          type="button"
          onClick={() => updateStatus(action.status)}
          disabled={Boolean(loadingStatus)}
          className={
            action.tone === "danger"
              ? "rounded-full border border-[#b42318]/25 bg-white px-3 py-1 text-xs font-semibold text-[#b42318] hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              : "rounded-full border border-[#6b7d65]/25 bg-white px-3 py-1 text-xs font-semibold text-[#5f7159] hover:bg-[#eef1eb] disabled:cursor-not-allowed disabled:opacity-60"
          }
        >
          {loadingStatus === action.status ? "Đang cập nhật..." : action.label}
        </button>
      ))}

      {errorMessage && (
        <p className="basis-full text-right text-xs text-[#b42318]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
