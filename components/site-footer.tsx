import Link from "next/link";
import { Reveal } from "@/components/motion";

const partners = Array.from({ length: 6 }, (_, index) => `/images/partner-${index + 1}.png`);
const email = "hkvinterior@gmail.com";
const hotline = "0936986668";
const contactLineClass = "flex items-center gap-1 whitespace-nowrap";
const contactLinkClass = "transition hover:text-white/75";

export default function SiteFooter() {
  return (
    <footer id="footer" className="bg-[#6b7d65] text-white">
      <Reveal className="mx-auto hidden h-[416px] max-w-[1176px] lg:block">
        <div className="relative h-full">
          <div className="absolute left-[39px] top-[17px] flex flex-col items-center">
            <div className="flex size-[123px] items-center justify-center rounded-full bg-[#f6f6f6]">
              <img src="/images/logo-hkv.png" alt="HKV" className="size-[111px] object-contain" />
            </div>
            <p className="mt-[15px] text-xl">FOLLOW US</p>
            <p className="mt-4 text-sm">Instagram - Facebook</p>
          </div>

          <nav className="absolute left-[293px] top-[31px] flex flex-col gap-[31px] text-sm" aria-label="Liên kết cuối trang">
            <Link href="/">Giới thiệu</Link>
            <Link href="/products">Sản phẩm</Link>
            <Link href="#footer">Thẻ hội viên</Link>
            <Link href="#footer">Đổi trả hàng</Link>
          </nav>

          <div className="absolute right-0 top-[188px] w-[362px]">
            <h2 className="text-xl">THÔNG TIN LIÊN HỆ</h2>
            <div className="mt-[26px] flex items-center justify-between gap-4 text-sm">
              <p className={contactLineClass}>
                <span>Email:</span>{" "}
                <a href={`mailto:${email}`} className={contactLinkClass}>
                  {email}
                </a>
              </p>
              <p className={contactLineClass}>
                <span>Hotline:</span>{" "}
                <a href={`tel:${hotline}`} className={contactLinkClass}>
                  {hotline}
                </a>
              </p>
            </div>
          </div>

          <Link href="#footer" className="absolute left-0 top-[246px] flex h-10 w-[212px] items-center justify-center border border-white/70 text-xl">
            HỆ THỐNG CỬA HÀNG
          </Link>

          <div className="absolute left-0 top-[295px] w-full border-t border-white/50" />
          <div className="absolute left-0 top-[326px] grid w-full grid-cols-6 items-center justify-items-center">
            {partners.map((partner, index) => <img key={partner} src={partner} alt={`Đối tác ${index + 1}`} className="h-[30px] w-[100px] object-contain" />)}
          </div>
          <div className="absolute bottom-[25px] left-0 w-full border-t border-white/50" />
        </div>
      </Reveal>

      <Reveal className="px-7 py-9 lg:hidden">
        <div className="flex size-[128px] items-center justify-center rounded-full bg-[#f6f6f6]">
          <img src="/images/logo-hkv.png" alt="HKV" className="size-[116px] object-contain" />
        </div>
        <p className="mt-5 text-xl">FOLLOW US</p>
        <p className="mt-2 text-sm">Instagram - Facebook</p>
        <Link href="#footer" className="mt-5 inline-flex h-10 items-center border border-white/70 px-4 text-base">HỆ THỐNG CỬA HÀNG</Link>

        <nav className="mt-8 grid gap-4 text-sm" aria-label="Liên kết cuối trang">
          <Link href="/">Giới thiệu</Link><Link href="/products">Sản phẩm</Link><Link href="#footer">Thẻ hội viên</Link><Link href="#footer">Đổi trả hàng</Link>
        </nav>

        <div className="mt-10">
          <h2 className="text-xl">THÔNG TIN LIÊN HỆ</h2>
          <p className={`${contactLineClass} mt-5 text-sm`}>
            <span>Email:</span>{" "}
            <a href={`mailto:${email}`} className={contactLinkClass}>
              {email}
            </a>
          </p>
          <p className={`${contactLineClass} mt-3 text-sm`}>
            <span>Hotline:</span>{" "}
            <a href={`tel:${hotline}`} className={contactLinkClass}>
              {hotline}
            </a>
          </p>
        </div>

        <div className="mt-10 grid grid-cols-3 items-center gap-x-5 gap-y-7 border-y border-white/40 py-7">
          {partners.map((partner, index) => <img key={partner} src={partner} alt={`Đối tác ${index + 1}`} className="mx-auto h-[30px] w-full max-w-[100px] object-contain" />)}
        </div>
      </Reveal>
    </footer>
  );
}
