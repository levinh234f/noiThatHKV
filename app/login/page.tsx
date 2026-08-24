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

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage("Email hoặc mật khẩu không đúng.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <AuthShell
      eyebrow="Tài khoản HKV"
      title="Đăng nhập"
      description="Tiếp tục mua sắm, theo dõi đơn hàng và quản lý thông tin thành viên của bạn."
      footer={
        <>
          <span>Chưa có tài khoản? </span>
          <Link href="/register" className={authLinkClass}>
            Đăng ký
          </Link>
          <div className="mt-4">
            <Link href="/" className="text-[13px] text-[#666] underline underline-offset-4 transition hover:text-[#171717]">
              Quay lại trang chủ
            </Link>
          </div>
        </>
      }
    >
        <form onSubmit={handleLogin} className="space-y-5">
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nhập mật khẩu"
              className={authInputClass}
            />
          </div>

          {errorMessage && (
            <p
              role="alert"
              className={`${authMessageClass} border-[#f0c6c0] bg-[#fff4f2] text-[#B42318]`}
            >
              {errorMessage}
            </p>
          )}

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-[13px] font-semibold text-[#5f7159] underline underline-offset-4 transition hover:text-[#3f503b]"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={authPrimaryButtonClass}
          >
            {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
          </button>
        </form>
    </AuthShell>
  );
}
