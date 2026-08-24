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

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

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

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(
        "Không thể tạo tài khoản. Vui lòng kiểm tra thông tin và thử lại."
      );
      return;
    }

    setSuccessMessage(
      "Đăng ký thành công. Hãy kiểm tra email để xác nhận tài khoản."
    );

    setPassword("");
    setConfirmPassword("");
  }

  return (
    <AuthShell
      eyebrow="Thành viên HKV"
      title="Tạo tài khoản"
      description="Lưu sản phẩm yêu thích, đặt hàng nhanh hơn và theo dõi các đơn nội thất của bạn."
      footer={
        <>
          <span>Đã có tài khoản? </span>
          <Link href="/login" className={authLinkClass}>
            Đăng nhập
          </Link>
          <div className="mt-4">
            <Link href="/" className="text-[13px] text-[#666] underline underline-offset-4 transition hover:text-[#171717]">
              Quay lại trang chủ
            </Link>
          </div>
        </>
      }
    >
        <form onSubmit={handleRegister} className="space-y-5">
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
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Nhập email của bạn"
              className={authInputClass}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-[13px] font-semibold uppercase text-[#555]"
            >
              MẬT KHẨU
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Tối thiểu 6 ký tự"
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
              placeholder="Nhập lại mật khẩu"
              className={authInputClass}
            />
          </div>

          {errorMessage && (
            <p role="alert" className={`${authMessageClass} border-[#f0c6c0] bg-[#fff4f2] text-[#B42318]`}>
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className={`${authMessageClass} border-[#cdd9c8] bg-[#f2f6ef] text-[#4D6847]`}>
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={authPrimaryButtonClass}
          >
            {loading ? "ĐANG TẠO TÀI KHOẢN..." : "ĐĂNG KÝ"}
          </button>
        </form>
    </AuthShell>
  );
}
