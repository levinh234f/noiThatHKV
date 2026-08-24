"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderStatusActionsProps = {
  orderId: number;
  initialStatus: string;
  align?: "left" | "right";
};

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao hàng",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };
  return labels[status] ?? status;
}

function getStatusClass(status: string) {
  if (status === "completed") return "bg-emerald-50 text-emerald-700";
  if (status === "cancelled") return "bg-red-50 text-red-600";
  if (status === "shipping") return "bg-blue-50 text-blue-700";
  return "bg-amber-50 text-amber-700";
}

function getConfirmMessage() {
  if (typeof window === "undefined") {
    return "Bạn có chắc chắn muốn hủy đơn hàng này?";
  }

  return localStorage.getItem("hkv-language") === "en"
    ? "Are you sure you want to cancel this order?"
    : "Bạn có chắc chắn muốn hủy đơn hàng này?";
}

export default function OrderStatusActions({
  orderId,
  initialStatus,
  align = "left",
}: OrderStatusActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const canCancel = status === "pending";

  const cancelOrder = async () => {
    if (!canCancel || loading) return;
    if (!window.confirm(getConfirmMessage())) return;

    setLoading(true);
    setErrorMessage("");

    const response = await fetch(`/api/orders/${orderId}/cancel`, {
      method: "POST",
    });
    const data = await response.json().catch(() => null) as {
      status?: string;
    } | null;

    setLoading(false);

    if (!response.ok || !data?.status) {
      if (data?.status) setStatus(data.status);
      setErrorMessage("Không thể hủy đơn hàng này. Vui lòng thử lại.");
      return;
    }

    setStatus(data.status);
    router.refresh();
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${align === "right" ? "justify-end" : ""}`}>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(status)}`}>
        {getStatusLabel(status)}
      </span>

      {canCancel && (
        <button
          type="button"
          onClick={cancelOrder}
          disabled={loading}
          className="rounded-full border border-[#b42318]/25 bg-white px-3 py-1 text-xs font-semibold text-[#b42318] hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Đang hủy..." : "Hủy đơn hàng"}
        </button>
      )}

      {errorMessage && (
        <p className="basis-full text-xs text-[#b42318]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
