import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const authInputClass =
  "h-[54px] w-full rounded-[14px] border border-[#d9d9d4] bg-[#fbfbf8] px-4 text-[15px] text-[#171717] outline-none transition placeholder:text-[#9a9a94] focus:border-[#6b7d65] focus:bg-white focus:ring-4 focus:ring-[#6b7d65]/10";

export const authPrimaryButtonClass =
  "flex h-[54px] w-full items-center justify-center rounded-full bg-[#6b7d65] px-6 text-[15px] font-semibold text-white transition hover:bg-[#596b54] disabled:cursor-not-allowed disabled:opacity-60";

export const authLinkClass =
  "font-semibold text-[#5f7159] underline underline-offset-4 transition hover:text-[#3f503b]";

export const authMessageClass =
  "rounded-[14px] border px-4 py-3 text-[14px] leading-6";

type AuthShellProps = {
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export default function AuthShell({
  title,
  eyebrow,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#f6f6f6] text-[#171717]">
      <SiteHeader />

      <section className="mx-auto flex min-h-[calc(100svh-74px)] w-full max-w-[1176px] items-center px-4 py-8 sm:px-6 lg:min-h-[calc(100svh-90px)] lg:py-12 xl:px-0">
        <div className="grid w-full overflow-hidden rounded-[21px] border border-black/5 bg-white shadow-[0_18px_48px_rgba(37,47,34,0.08)] lg:grid-cols-[minmax(0,1.05fr)_minmax(440px,0.95fr)]">
          <aside className="relative hidden min-h-[640px] overflow-hidden bg-[#e8e6df] lg:block">
            <Image
              src="/images/products-hero.png"
              alt="Không gian nội thất HKV"
              fill
              priority
              sizes="560px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute bottom-10 left-10 max-w-[440px] text-white">
              <p className="text-sm uppercase">HKV Interior</p>
              <h2 className="mt-3 text-[36px] font-medium leading-tight">
                Kiến tạo không gian sống tinh tế
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/82">
                Tài khoản HKV giúp bạn lưu thông tin, theo dõi đơn hàng và tiếp tục khám phá các bộ sưu tập nội thất phù hợp với ngôi nhà của mình.
              </p>
            </div>
          </aside>

          <div className="flex items-center justify-center px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
            <div className="w-full max-w-[460px]">
              <Link href="/" aria-label="Trang chủ HKV" className="inline-flex">
                <Image
                  src="/images/logo-hkv.png"
                  alt="HKV"
                  width={84}
                  height={84}
                  className="size-[84px] object-contain"
                />
              </Link>

              <div className="mt-7">
                <p className="text-xs font-semibold uppercase text-[#6b7d65]">
                  {eyebrow}
                </p>
                <h1 className="mt-3 text-[32px] font-semibold leading-tight sm:text-[38px]">
                  {title}
                </h1>
                <p className="mt-3 text-[15px] leading-6 text-[#6a6a64]">
                  {description}
                </p>
              </div>

              <div className="mt-8">{children}</div>

              <div className="mt-8 border-t border-[#ecece7] pt-6 text-center text-[14px] text-[#555]">
                {footer}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
