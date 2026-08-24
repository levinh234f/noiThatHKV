"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CartButton from "@/components/cart-button";
import { createClient } from "@/lib/supabase/client";

const sideMenuItems = [
  { name: "Sản phẩm mới" },
  { name: "Sản phẩm", href: "/products" },
  { name: "Sofa và Armchair", arrow: true },
  { name: "Bàn", arrow: true },
  { name: "Ghế", arrow: true },
  { name: "Giường ngủ", arrow: true },
  { name: "Tủ và Kệ", arrow: true },
  { name: "Bếp", arrow: true },
  { name: "Hàng trang trí", arrow: true },
  { name: "Phòng", arrow: true },
  { name: "TÌM CỬA HÀNG >>", red: true },
  { name: "Giảm giá đặc biệt", href: "/products?sale=1" },
  { name: "Thiết kế nội thất" },
  { name: "Bộ sưu tập" },
  { name: "Tiếng Việt", arrow: true },
];

const featureItems = [
  "Phào chỉ & ốp tường cổ điển",
  "Đèn chùm pha lê, nến vàng",
  "Nội thất chạm khắc tinh xảo",
  "Gam màu kem, be, vàng gold",
  "Sàn đá marble & gỗ tự nhiên",
  "Gương & khung tranh mạ vàng",
];

const spaces = [
  {
    title: "Phòng khách Tân Cổ Điển",
    tag: "Phòng Khách",
    desc: "Chandelier vàng · Sofa chạm khắc · Ốp tường phào chỉ",
    image: "/images/article-tan-co-dien-living-room.png",
    className: "left-0 top-0 h-[419px] w-[671px]",
  },
  {
    title: "Phòng ngủ Master",
    tag: "Phòng Ngủ",
    desc: "Giường tufted · Ốp tường vàng",
    image: "/images/article-tan-co-dien-bedroom.png",
    className: "left-[704px] top-0 h-[419px] w-[469px]",
  },
  {
    title: "Phòng ăn Tân Cổ Điển",
    tag: "Phòng Ăn",
    desc: "Bàn tròn · Chandelier pha lê",
    image: "/images/article-tan-co-dien-hero.png",
    className: "left-0 top-[435px] h-[246px] w-[369px]",
  },
  {
    title: "Bếp Tân Cổ Điển",
    tag: "Nhà Bếp",
    desc: "Tủ bếp cổ điển · Đảo bếp",
    image: "/images/article-tan-co-dien-kitchen.png",
    className: "left-[405px] top-[435px] h-[246px] w-[363px]",
  },
  {
    title: "Phòng tắm Luxury",
    tag: "Phòng Tắm",
    desc: "Bồn tắm · Gương mạ vàng",
    image: "/images/article-tan-co-dien-bathroom.png",
    className: "left-[808px] top-[435px] h-[246px] w-[365px]",
  },
];

export default function TanCoDienArticlePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, []);

  return (
    <main className="min-h-screen overflow-x-auto bg-[#F6F6F6] text-[#0A0A0A]">
      <div className="relative mx-auto h-[2688px] w-[1440px] bg-[#F6F6F6]">
        {/* HEADER — giữ đồng bộ site hiện tại */}
        <header className="absolute left-0 top-0 z-50 flex h-[90px] w-[1440px] items-center justify-center bg-white">
          <div className="flex items-center gap-[71px]">
            <div className="flex items-center gap-[7px]">
              <div className="flex items-center">
                <button
                  type="button"
                  aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
                  aria-expanded={isMenuOpen}
                  onClick={() => setIsMenuOpen((current) => !current)}
                  className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center"
                >
                  <img
                    src="/images/menu.png"
                    alt=""
                    className="h-[30px] w-[30px] object-contain"
                  />
                </button>

                <Link href="/">
                  <img
                    src="/images/logo-hkv.png"
                    alt="HKV"
                    className="h-[90px] w-[90px] object-contain"
                  />
                </Link>
              </div>

              <nav className="flex items-center gap-[13px]">
                <Link href="/#phong-cach" className="px-[10px] text-[23px] leading-[1.2] whitespace-nowrap">
                  Phong cách
                </Link>
                <Link href="/products" className="px-[10px] text-[23px] leading-[1.2] whitespace-nowrap">
                  Sản Phẩm
                </Link>
                <Link href="/#bo-suu-tap" className="px-[10px] text-[23px] leading-[1.2] whitespace-nowrap">
                  Bộ Sưu tập
                </Link>
                <Link href="/#footer" className="px-[10px] text-[23px] leading-[1.2] whitespace-nowrap">
                  Về HKV
                </Link>
                <Link href="/#footer" className="px-[10px] text-[23px] leading-[1.2] whitespace-nowrap">
                  Liên Hệ
                </Link>
              </nav>
            </div>

            <div className="flex h-[43px] w-[442px] items-center justify-center gap-[13px]">
              <div className="flex h-[32px] w-[256px] items-center rounded-[15px] bg-[#E9E9E9] px-[13px]">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm"
                  className="h-full min-w-0 flex-1 bg-transparent text-[12px] outline-none"
                />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <CartButton iconSrc="/images/cart.png" />

              <Link
                href={isLoggedIn ? "/account" : "/login"}
                className="flex h-[43px] w-[114px] items-center justify-center rounded-full bg-[#6B7D65] text-[19px] text-white"
              >
                {isLoggedIn ? "TÀI KHOẢN" : "ĐĂNG NHẬP"}
              </Link>
            </div>
          </div>
        </header>

        {isMenuOpen && (
          <button
            type="button"
            aria-label="Đóng menu"
            onClick={() => setIsMenuOpen(false)}
            className="absolute inset-x-0 bottom-0 top-[90px] z-30 cursor-default"
          />
        )}

        <aside
          className={`absolute left-[88px] top-[90px] z-40 flex w-[371px] flex-col items-start gap-[9px] bg-white transition-all duration-200 ${
            isMenuOpen
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "-translate-y-2 opacity-0 pointer-events-none"
          }`}
        >
          {sideMenuItems.map((item) =>
            item.href ? (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex h-[45px] w-full items-center justify-between px-[10px] text-[16px] ${
                  item.red ? "text-[#CB0606]" : "text-[#121110]"
                } hover:bg-[#F6F6F6]`}
              >
                <span>{item.name}</span>
              </Link>
            ) : (
              <button
                key={item.name}
                type="button"
                className={`flex h-[45px] w-full items-center justify-between px-[10px] text-left text-[16px] ${
                  item.red ? "text-[#CB0606]" : "text-[#121110]"
                } hover:bg-[#F6F6F6]`}
              >
                <span>{item.name}</span>
                {item.arrow && <span>›</span>}
              </button>
            )
          )}
        </aside>

        {/* ARTICLE INTRO */}
        <section className="absolute left-[155px] top-[108px] h-[980px] w-[1130px]">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[13px] font-bold text-[#C9A96E]">
                Phong cách thiết kế
              </p>
              <h1 className="mt-[8px] text-[48px] font-bold leading-[1.2]">
                Đa dạng phong cách,
                <br />
                một đẳng cấp
              </h1>
            </div>

            <Link
              href="/products"
              className="mb-[7px] flex items-center gap-[6px] text-[14px] font-medium text-[#A07840]"
            >
              Xem tất cả phong cách <span>→</span>
            </Link>
          </div>

          <div className="mt-[65px] flex h-[42px] gap-[8px]">
            <span className="flex items-center justify-center rounded-full bg-[#6B7D65] px-[20px] text-[14px] font-medium text-white shadow">
              Tân Cổ Điển
            </span>
            <span className="flex items-center justify-center rounded-full border border-[#E8E0D4] bg-white px-[20px] text-[14px] text-[#717182]">
              Hiện Đại
            </span>
            <span className="flex items-center justify-center rounded-full border border-[#E8E0D4] bg-white px-[20px] text-[14px] text-[#717182]">
              Đông Dương
            </span>
          </div>

          <div className="relative mt-[80px] h-[596px]">
            <div className="absolute left-0 top-0 w-[549px]">
              <span className="inline-flex h-[24px] items-center rounded-full bg-[#FDF3E3] px-[12px] text-[12px] font-medium tracking-[1.2px] text-[#A07840]">
                PHONG CÁCH TÂN CỔ ĐIỂN
              </span>

              <h2 className="mt-[14px] text-[30px] font-bold leading-[36px]">
                Sang trọng vượt thời gian,
                <br />
                tinh tế từng đường nét
              </h2>

              <p className="mt-[20px] w-[488px] text-[16px] leading-[1.45] text-[#717182]">
                Phong cách Tân Cổ Điển là sự giao thoa tinh tế giữa vẻ đẹp cổ điển châu Âu và sự tiện nghi của cuộc sống hiện đại. Lấy cảm hứng từ kiến trúc Baroque và Neoclassicism thế kỷ 18–19, phong cách này giữ lại ngôn ngữ trang trí sang trọng — phào chỉ chạm khắc, đèn chùm pha lê, gương mạ vàng — nhưng được diễn giải lại bằng vật liệu và kỹ thuật hiện đại.
              </p>

              <p className="mt-[20px] w-[488px] text-[16px] leading-[1.45] text-[#717182]">
                Bảng màu chủ đạo xoay quanh các tông kem, be, vàng gold và trắng ngà, tạo ra không gian ấm áp, bề thế nhưng không kém phần tinh tế. Đây là lựa chọn hoàn hảo cho những ai muốn ngôi nhà của mình toát lên khí chất quý phái và đẳng cấp vượt thời gian.
              </p>

              <div className="mt-[22px] grid w-[488px] grid-cols-2 gap-x-[18px] gap-y-[12px]">
                {featureItems.map((item) => (
                  <div key={item} className="flex items-center gap-[10px] text-[16px] text-[#717182]">
                    <span className="text-[10px] text-[#C9A96E]">✦</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-[24px] flex gap-[8px]">
                {["Sang trọng", "Quý phái", "Ấm áp", "Tinh tế", "Vượt thời gian"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#E8D9BC] bg-[#FDF8F0] px-[13px] py-[5px] text-[12px] text-[#A07840]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute left-[574px] top-[60px] h-[437px] w-[573px] overflow-hidden rounded-[16px]">
              <img
                src="/images/article-tan-co-dien-hero.png"
                alt="Không gian Tân Cổ Điển"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-[59px] bottom-[26px] grid h-[74px] grid-cols-3 rounded-[14px] bg-white/90 px-[16px] py-[16px]">
                {[
                  ["120+", "Dự án TCD"],
                  ["98%", "Hài lòng"],
                  ["8+", "Năm KN"],
                ].map(([value, label], index) => (
                  <div
                    key={label}
                    className={`text-center ${index < 2 ? "border-r border-[#E8E0D4]" : ""}`}
                  >
                    <p className="text-[16px] font-bold text-[#A07840]">{value}</p>
                    <p className="mt-[2px] text-[12px] text-[#717182]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-[18px] flex justify-center">
            <Link
              href="/products"
              className="flex h-[44px] items-center gap-[8px] rounded-[14px] bg-[#6B7D65] px-[28px] text-[14px] text-white"
            >
              Xem toàn bộ dự án Tân Cổ Điển <span>→</span>
            </Link>
          </div>
        </section>

        {/* SPACES SECTION */}
        <section className="absolute left-[132px] top-[1150px] h-[1050px] w-[1176px]">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[12px] uppercase tracking-[2.4px] text-[#C9A96E]">
                Phong cách thiết kế
              </p>
              <h2 className="mt-[8px] text-[30px] font-bold leading-[36px]">
                Đa dạng phong cách,
                <br />
                một đẳng cấp
              </h2>
            </div>

            <Link
              href="/products"
              className="mb-[7px] flex items-center gap-[6px] text-[14px] font-medium text-[#A07840]"
            >
              Xem tất cả phong cách <span>→</span>
            </Link>
          </div>

          <div className="mt-[40px] flex h-[42px] gap-[8px]">
            <span className="flex items-center rounded-full bg-[#6B7D65] px-[20px] text-[14px] text-white shadow">
              Tân Cổ Điển
            </span>
            <span className="flex items-center rounded-full border border-[#E8E0D4] bg-white px-[20px] text-[14px] text-[#717182]">
              Hiện Đại
            </span>
            <span className="flex items-center rounded-full border border-[#E8E0D4] bg-white px-[20px] text-[14px] text-[#717182]">
              Đông Dương
            </span>
          </div>

          <div className="relative mt-[40px] h-[681px]">
            {spaces.map((space) => (
              <article
                key={space.title}
                className={`absolute overflow-hidden rounded-[16px] ${space.className}`}
              >
                <img
                  src={space.image}
                  alt={space.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-[16px] left-[16px] text-white">
                  <span className="inline-flex rounded-full bg-white/20 px-[10px] py-[4px] text-[12px] tracking-[0.96px]">
                    {space.tag}
                  </span>
                  <h3 className="mt-[6px] text-[16px] font-semibold">{space.title}</h3>
                  <p className="mt-[2px] text-[12px] text-white/70">{space.desc}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-[32px] flex justify-center">
            <Link
              href="/products"
              className="flex h-[44px] items-center gap-[8px] rounded-[15px] bg-[#6B7D65] px-[28px] text-[14px] text-white"
            >
              Xem toàn bộ dự án Tân Cổ Điển <span>→</span>
            </Link>
          </div>

          <div className="mt-[44px] flex items-center gap-[16px]">
            <div className="h-px flex-1 bg-[#E8E0D4]" />
            <span className="text-[12px] tracking-[1.2px] text-[#717182]">
              CÁC KHÔNG GIAN TIÊU BIỂU
            </span>
            <div className="h-px flex-1 bg-[#E8E0D4]" />
          </div>
        </section>

        {/* FOOTER — giữ như các trang đang đúng */}
        <footer
          id="footer"
          className="absolute left-0 top-[2272px] h-[416px] w-[1440px] bg-[#6B7D65] text-white"
        >
          <div className="relative mx-auto h-full w-[1176px]">
            <div className="absolute left-[39px] top-[17px] flex flex-col items-center">
              <div className="flex h-[123px] w-[123px] items-center justify-center rounded-full bg-[#F6F6F6]">
                <img src="/images/logo-hkv.png" alt="HKV" className="h-[111px] w-[111px] object-contain" />
              </div>
              <p className="mt-[15px] text-[20px]">FOLLOW US</p>
              <p className="mt-[16px] text-[14px]">Instagram - Facebook</p>
            </div>

            <div className="absolute left-[293px] top-[31px] flex flex-col gap-[31px] text-[14px]">
              <Link href="/">Giới thiệu</Link>
              <Link href="/products">Sản phẩm</Link>
              <Link href="#">Thẻ hội viên</Link>
              <Link href="#">Đổi trả hàng</Link>
            </div>

            <div className="absolute left-[814px] top-[188px] w-[362px]">
              <h3 className="text-[20px]">THÔNG TIN LIÊN HỆ</h3>
              <div className="mt-[26px] flex justify-between text-[14px]">
                <span>Email:</span>
                <span>Hotline:</span>
              </div>
            </div>

            <button
              type="button"
              className="absolute left-0 top-[246px] flex h-[40px] w-[212px] items-center justify-center border border-[#D9D9D9] text-[20px]"
            >
              HỆ THỐNG CỬA HÀNG
            </button>

            <div className="absolute left-0 top-[295px] w-full border-t border-white/50" />

            <div className="absolute left-0 top-[326px] grid w-full grid-cols-6 items-center justify-items-center">
              {[
                "/images/partner-1.png",
                "/images/partner-2.png",
                "/images/partner-3.png",
                "/images/partner-4.png",
                "/images/partner-5.png",
                "/images/partner-6.png",
              ].map((partner, index) => (
                <img
                  key={partner}
                  src={partner}
                  alt={`Đối tác ${index + 1}`}
                  className="h-[30px] w-[100px] object-contain"
                />
              ))}
            </div>

            <div className="absolute bottom-[25px] left-0 w-full border-t border-white/50" />
          </div>
        </footer>
      </div>
    </main>
  );
}
