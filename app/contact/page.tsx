import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import ContactForm from "./contact-form";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { Reveal } from "@/components/motion";

export const metadata: Metadata = {
  title: "Liên hệ / Contact",
  description: "Liên hệ HKV Interior để được hỗ trợ về sản phẩm và phong cách nội thất.",
};

const contactItems = [
  ["Công ty", "HKV Interior"],
  ["Email", "hkvinterior@gmail.com"],
  ["Hotline", "0936986668"],
  ["Theo dõi HKV", "Instagram - Facebook"],
];

export default function ContactPage() {
  return (
    <main className="bg-[#f6f6f6] text-[#171717]">
      <SiteHeader />

      <section className="mx-auto max-w-[1176px] px-4 pt-6 sm:px-6 lg:pt-8 xl:px-0">
        <div className="relative min-h-[360px] overflow-hidden rounded-[8px] bg-[#d9d8d1] sm:min-h-[460px]">
          <Image
            src="/images/hero-bedroom.png"
            alt="Phòng ngủ HKV"
            fill
            priority
            sizes="(min-width: 1280px) 1176px, 100vw"
            className="motion-hero-zoom object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/58 via-black/16 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-6 py-9 text-white sm:px-10 lg:px-14 lg:py-12">
            <Reveal delay={80}>
              <p className="text-xs uppercase tracking-[0.26em] text-white/78">
                HKV Interior
              </p>
            </Reveal>
            <Reveal delay={160}>
              <h1 className="mt-4 text-[40px] font-semibold leading-none sm:text-[62px]">
                Liên hệ
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-white/88">
                HKV lắng nghe nhu cầu của bạn để gợi mở sản phẩm, phong cách và
                giải pháp phù hợp cho không gian sống.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1176px] gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:py-24 xl:px-0">
        <Reveal delay={80} className="h-fit rounded-[8px] bg-white p-6 shadow-[0_18px_44px_rgba(37,47,34,0.06)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b7d65]">
            Thông tin liên hệ
          </p>
          <h2 className="mt-4 text-[30px] font-semibold leading-tight">
            Kết nối với HKV
          </h2>
          <dl className="mt-8 divide-y divide-[#ecece7]">
            {contactItems.map(([label, value]) => (
              <div key={label} className="grid gap-2 py-4 sm:grid-cols-[130px_1fr]">
                <dt className="text-sm text-[#77776f]">{label}</dt>
                <dd className="text-sm font-medium text-[#171717]">
                  {label === "Email" ? (
                    <a href={`mailto:${value}`}>{value}</a>
                  ) : label === "Hotline" ? (
                    <a href={`tel:${value}`}>{value}</a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <Link
            href="/products"
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full border border-[#6b7d65] px-6 text-sm font-semibold text-[#5f7159]"
          >
            Xem sản phẩm HKV
          </Link>
        </Reveal>

        <Reveal delay={160} className="rounded-[8px] bg-white p-6 shadow-[0_18px_44px_rgba(37,47,34,0.06)] sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b7d65]">
            Gửi lời nhắn
          </p>
          <h2 className="mt-4 text-[30px] font-semibold leading-tight sm:text-[40px]">
            Chúng tôi có thể hỗ trợ gì cho bạn?
          </h2>
          <p className="mt-4 max-w-[620px] text-sm leading-6 text-[#66665f]">
            Điền thông tin bên dưới, HKV sẽ dùng thông tin bạn cung cấp để phản
            hồi tư vấn nội thất phù hợp.
          </p>

          <div className="mt-8">
            <ContactForm />
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
