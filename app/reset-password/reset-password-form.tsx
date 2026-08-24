"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell, {
  authInputClass,
  authLinkClass,
  authMessageClass,
  authPrimaryButtonClass,
} from "@/components/auth-shell";

export default function ResetPasswordForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    if (password.length < 6) {
      setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setLoading(false);
      setErrorMessage("Không thể cập nhật mật khẩu. Vui lòng thử lại.");
      return;
    }

    await supabase.auth.signOut();

    router.push("/login?reset=success");
    router.refresh();
  }

  return (
    <AuthShell
      eyebrow="Bảo mật tài khoản"
      title="Đặt lại mật khẩu"
      description="Tạo mật khẩu mới để tiếp tục quản lý tài khoản và đơn hàng HKV."
      footer={
        <Link href="/login" className={authLinkClass}>
          Quay lại đăng nhập
        </Link>
      }
    >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-[13px] font-semibold uppercase text-[#555]"
            >
              MẬT KHẨU MỚI
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nhập mật khẩu mới"
              className={authInputClass}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-[13px] font-semibold uppercase text-[#555]"
            >
              NHẬP LẠI MẬT KHẨU
            </label>

            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              className={authInputClass}
            />
          </div>

          {errorMessage && (
            <p role="alert" className={`${authMessageClass} border-[#f0c6c0] bg-[#fff4f2] text-[#B42318]`}>
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={authPrimaryButtonClass}
          >
            {loading ? "ĐANG CẬP NHẬT..." : "ĐỔI MẬT KHẨU"}
          </button>
        </form>
    </AuthShell>
  );
}
