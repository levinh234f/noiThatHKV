"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AuthShell, {
  authInputClass,
  authLinkClass,
  authMessageClass,
  authPrimaryButtonClass,
} from "@/components/auth-shell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setIsError(false);
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);

    if (error) {
      console.error("Reset password error:", error);

      setIsError(true);

      if (error.message.toLowerCase().includes("rate limit")) {
        setMessage(
          "Bạn đã yêu cầu gửi email quá nhiều lần. Vui lòng thử lại sau."
        );
      } else {
        setMessage(
          "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại."
        );
      }

      return;
    }

    setIsError(false);
    setMessage(
      "Email đặt lại mật khẩu đã được gửi. Hãy kiểm tra hộp thư và thư rác."
    );
  }

  return (
    <AuthShell
      eyebrow="Hỗ trợ tài khoản"
      title="Quên mật khẩu"
      description="Nhập email đã đăng ký để HKV gửi liên kết đặt lại mật khẩu cho bạn."
      footer={
        <Link href="/login" className={authLinkClass}>
          Quay lại đăng nhập
        </Link>
      }
    >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-[13px] font-semibold uppercase text-[#555]"
            >
              EMAIL
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Nhập email của bạn"
              className={authInputClass}
            />
          </div>

          {message && (
            <p
              role={isError ? "alert" : undefined}
              className={`${authMessageClass} ${
                isError
                  ? "border-[#f0c6c0] bg-[#fff4f2] text-[#B42318]"
                  : "border-[#cdd9c8] bg-[#f2f6ef] text-[#4D6847]"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={authPrimaryButtonClass}
          >
            {loading ? "ĐANG GỬI..." : "GỬI EMAIL"}
          </button>
        </form>
    </AuthShell>
  );
}
