"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MobileStyleArticlePage from "@/app/articles/mobile-style-article-page";
import ResponsiveCanvas from "@/components/responsive-canvas";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const features = [
  "Đường nét dứt khoát, mảng phẳng",
  "Không gian mở, nhiều ánh sáng",
  "Nội thất tối giản, đa công năng",
  "Tone màu trung tính chủ đạo",
  "Chất liệu kính, thép, gỗ",
  "Loại bỏ chi tiết rườm rà",
];

const tags = [
  "Tối giản",
  "Tiện nghi",
  "Hiện đại",
  "Thông thoáng",
  "Tinh tế",
];


type StyleKey = "tan-co-dien" | "hien-dai" | "dong-duong";

function ArticleStyleTabs({ active }: { active: StyleKey }) {
  const router = useRouter();

  const items: Array<{
    key: StyleKey;
    label: string;
    href: string;
  }> = [
    {
      key: "tan-co-dien",
      label: "Tân Cổ Điển",
      href: "/articles/tan-co-dien",
    },
    {
      key: "hien-dai",
      label: "Hiện Đại",
      href: "/articles/hien-dai",
    },
    {
      key: "dong-duong",
      label: "Đông Dương",
      href: "/articles/dong-duong",
    },
  ];

  useEffect(() => {
    items.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router]);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    href: string
  ) => {
    const button = event.currentTarget;

    button.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.12)" },
        { transform: "scale(0.97)" },
        { transform: "scale(1)" },
      ],
      {
        duration: 260,
        easing: "cubic-bezier(.2,.8,.2,1)",
      }
    );

    if (window.location.pathname === href) {
      return;
    }

    window.setTimeout(() => {
      router.push(href);
    }, 175);
  };

  return (
    <div className="flex h-[42px] items-center gap-[8px]">
      {items.map((item) => {
        const isActive = item.key === active;

        return (
          <button
            key={item.key}
            type="button"
            onClick={(event) => handleClick(event, item.href)}
            aria-current={isActive ? "page" : undefined}
            className={[
              "flex h-[42px] cursor-pointer select-none items-center justify-center rounded-full border px-[20px] text-[14px]",
              "transition-[transform,box-shadow,background-color,color] duration-200 ease-out",
              "hover:scale-[1.07] hover:shadow-[0_5px_12px_rgba(0,0,0,0.12)]",
              "active:scale-[0.96]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B7D65]/40",
              isActive
                ? "border-[#6B7D65] bg-[#6B7D65] font-medium text-white shadow-[0_4px_7px_rgba(0,0,0,0.12)]"
                : "border-[#E8E0D4] bg-white text-[#717182]",
            ].join(" ")}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default function HienDaiArticlePage() {
  const router = useRouter();

  const goToHienDaiProducts = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const button = event.currentTarget;

    button.animate(
      [
        { transform: "scale(1)", boxShadow: "0 0 0 rgba(107,125,101,0)" },
        { transform: "scale(1.09)", boxShadow: "0 10px 28px rgba(107,125,101,.28)" },
        { transform: "scale(.97)", boxShadow: "0 4px 10px rgba(107,125,101,.16)" },
        { transform: "scale(1)", boxShadow: "0 0 0 rgba(107,125,101,0)" },
      ],
      {
        duration: 310,
        easing: "cubic-bezier(.2,.8,.2,1)",
      }
    );

    const flash = document.createElement("div");

    Object.assign(flash.style, {
      position: "fixed",
      inset: "0",
      background: "#ffffff",
      opacity: "0",
      zIndex: "99999",
      pointerEvents: "none",
    });

    document.body.appendChild(flash);

    const flashAnimation = flash.animate(
      [
        { opacity: 0 },
        { opacity: 0.32, offset: 0.48 },
        { opacity: 0 },
      ],
      {
        duration: 360,
        easing: "ease-out",
      }
    );

    flashAnimation.onfinish = () => flash.remove();

    window.setTimeout(() => {
      router.push("/products/hien-dai");
    }, 215);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F6F6F6] text-[#0A0A0A]">
      <SiteHeader />
      <div className="xl:hidden">
        <MobileStyleArticlePage
          active="hien-dai"
          badge="PHONG CÁCH HIỆN ĐẠI"
          introTitle={
            <>
              Vẻ đẹp phóng khoáng,
              <br />
              tối ưu từng không gian sống
            </>
          }
          intro={
            <>
              <p>
                Phong cách Hiện đại là sự tôn vinh vẻ đẹp của sự tối giản, tập trung tối đa vào công năng sử dụng và giải phóng không gian. Bắt nguồn từ cuộc cách mạng kiến trúc đầu thế kỷ 20, phong cách này từ bỏ hoàn toàn các chi tiết trang trí rườm rà hay hoa văn phức tạp. Thay vào đó, nó thiết lập một ngôn ngữ thiết kế mới mẻ bằng những đường thẳng dứt khoát, hình khối mạnh mẽ, và sự kết hợp của các vật liệu công nghiệp mộc mạc nhưng sắc nét — như kính, thép, bê tông và gỗ.
              </p>
              <p>
                Bảng màu chủ đạo thường xoay quanh các tông màu trung tính như trắng, xám, đen và be, đôi khi được điểm xuyết bởi những gam màu nguyên bản để tạo sự tương phản và chiều sâu, mang lại một không gian thanh lịch, thoáng đãng nhưng không kém phần cá tính. Đây là lựa chọn hoàn hảo cho những ai yêu thích sự ngăn nắp, muốn ngôi nhà của mình toát lên vẻ đẹp tinh tế, tiện nghi và mang đậm nhịp thở năng động của thời đại mới.
              </p>
            </>
          }
          features={features}
          tags={tags}
          heroImage="/images/article-hien-dai-hero.png"
          heroAlt="Không gian nội thất Hiện Đại"
          stats={[
            ["100+", "Dự án TCD"],
            ["98%", "Hài lòng"],
            ["8+", "Năm KN"],
          ]}
          gallery={[
            {
              title: "Phòng khách Hiện Đại",
              label: "Phòng Khách",
              image: "/images/article-hien-dai-living-room.png",
              alt: "Phòng khách Hiện Đại",
              description: "Chandelier vàng · Sofa chạm khắc · Ốp tường phào chỉ",
            },
            {
              title: "Phòng ngủ Master",
              label: "Phòng Ngủ",
              image: "/images/article-hien-dai-bedroom.png",
              alt: "Phòng ngủ Master",
              description: "Giường tufted · Ốp tường vàng",
            },
            {
              title: "Phòng ăn Hiện Đại",
              label: "Phòng Ăn",
              image: "/images/article-hien-dai-dining-room.png",
              alt: "Phòng ăn Hiện Đại",
              description: "Bàn tròn · Chandelier pha lê",
            },
            {
              title: "Bếp Tân Hiện Đại",
              label: "Nhà Bếp",
              image: "/images/article-hien-dai-kitchen.png",
              alt: "Bếp Hiện Đại",
              description: "Tủ bếp cổ điển · Đảo bếp",
            },
            {
              title: "Phòng tắm Luxury",
              label: "Phòng Tắm",
              image: "/images/article-hien-dai-bathroom.png",
              alt: "Phòng tắm Luxury",
              description: "Bồn tắm · Gương mạ vàng",
            },
          ]}
          ctaLabel="Xem toàn bộ dự án Hiện Đại"
          productHref="/products/hien-dai"
        />
        <SiteFooter />
      </div>
      <div className="hidden xl:block">
      <ResponsiveCanvas designHeight={2779}>
      <div className="relative mx-auto h-[2779px] w-[1440px] bg-[#F6F6F6]">
        <section className="absolute left-[131px] top-[87px] h-[1115px] w-[1177px] px-[24px] pt-[21px]">
          <div className="absolute left-[24px] top-[21px] flex h-[104px] w-[1129px] items-end justify-between">
            <div>
              <p className="text-[13px] font-bold leading-[1.2] text-[#C9A96E]">
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
              className="mb-[8px] flex items-center gap-[6px] text-[14px] font-medium text-[#A07840]"
            >
              Xem tất cả phong cách <span>→</span>
            </Link>
          </div>

          {/* tabs */}
          <div className="absolute left-[24px] top-[190px]">
            <ArticleStyleTabs active="hien-dai" />
          </div>

          {/* left article */}
          <div className="absolute left-[24px] top-[320px] h-[632px] w-[549px]">
            <span className="inline-flex h-[24px] items-center rounded-full bg-[#FDF3E3] px-[12px] text-[12px] font-medium tracking-[1.2px] text-[#A07840]">
              PHONG CÁCH HIỆN ĐẠI
            </span>

            <h2 className="mt-[14px] text-[30px] font-bold leading-[36px] tracking-[-0.6px]">
              Vẻ đẹp phóng khoáng,
              <br />
              tối ưu từng không gian sống
            </h2>

            <p className="mt-[20px] w-[488px] text-[16px] leading-[1.2] text-[#717182]">
              Phong cách Hiện đại là sự tôn vinh vẻ đẹp của sự tối giản, tập trung tối đa vào công năng sử dụng và giải phóng không gian. Bắt nguồn từ cuộc cách mạng kiến trúc đầu thế kỷ 20, phong cách này từ bỏ hoàn toàn các chi tiết trang trí rườm rà hay hoa văn phức tạp. Thay vào đó, nó thiết lập một ngôn ngữ thiết kế mới mẻ bằng những đường thẳng dứt khoát, hình khối mạnh mẽ, và sự kết hợp của các vật liệu công nghiệp mộc mạc nhưng sắc nét — như kính, thép, bê tông và gỗ.
            </p>

            <p className="mt-[20px] w-[488px] text-[16px] leading-[1.2] text-[#717182]">
              Bảng màu chủ đạo thường xoay quanh các tông màu trung tính như trắng, xám, đen và be, đôi khi được điểm xuyết bởi những gam màu nguyên bản để tạo sự tương phản và chiều sâu, mang lại một không gian thanh lịch, thoáng đãng nhưng không kém phần cá tính. Đây là lựa chọn hoàn hảo cho những ai yêu thích sự ngăn nắp, muốn ngôi nhà của mình toát lên vẻ đẹp tinh tế, tiện nghi và mang đậm nhịp thở năng động của thời đại mới.
            </p>

            <div className="mt-[20px] grid w-[594px] grid-cols-[237px_319px] gap-x-[38px] gap-y-[12px]">
              {features.map((item) => (
                <div key={item} className="flex items-center gap-[10px] text-[16px] leading-[1.2] text-[#717182]">
                  <span className="text-[10px] text-[#C9A96E]">✦</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-[24px] flex gap-[8px]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#E8D9BC] bg-[#FDF8F0] px-[13px] py-[5px] text-[12px] leading-[16px] text-[#A07840]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-[56px] flex w-[1129px] justify-center">
              <button
                type="button"
                onClick={goToHienDaiProducts}
                className="flex h-[44px] cursor-pointer items-center gap-[8px] rounded-[14px] bg-[#6B7D65] px-[28px] text-[14px] font-medium text-white transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
              >
                Xem toàn bộ dự án Hiện Đại <span>→</span>
              </button>
            </div>
          </div>

          {/* hero */}
          <div className="absolute left-[598px] top-[380px] h-[441px] w-[573px] overflow-hidden rounded-[16px]">
            <img
              src="/images/article-hien-dai-hero.png"
              alt="Không gian nội thất Hiện Đại"
              className="h-[437px] w-full object-cover"
            />

            <div className="absolute inset-x-0 top-0 h-[437px] bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <div className="absolute left-[59px] top-[331px] grid h-[74px] w-[455px] grid-cols-3 rounded-[14px] bg-white/90 p-[16px]">
              {[
                ["100+", "Dự án TCD"],
                ["98%", "Hài lòng"],
                ["8+", "Năm KN"],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className={`text-center ${index < 2 ? "border-r border-[#E8E0D4]" : ""}`}
                >
                  <p className="text-[16px] font-bold leading-[24px] text-[#A07840]">{value}</p>
                  <p className="mt-[2px] text-[12px] leading-[16px] text-[#717182]">{label}</p>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* SECTION 2 — Figma node 703:1149 */}
        <section className="absolute left-[117px] top-[1202px] h-[1141px] w-[1204px] px-[24px] pt-[36px]">
          <div className="absolute left-[24px] top-[36px] flex w-[1173px] items-end justify-between">
            <div>
              <p className="text-[12px] uppercase leading-[16px] tracking-[2.4px] text-[#C9A96E]">
                Phong cách thiết kế
              </p>
              <h2 className="mt-[8px] text-[30px] font-bold leading-[36px] tracking-[-0.6px]">
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

          <div className="absolute left-[24px] top-[192px]">
            <ArticleStyleTabs active="hien-dai" />
          </div>

          {/* row 1 */}
          <article className="absolute left-[24px] top-[274px] h-[419px] w-[671px] overflow-hidden rounded-[16px]">
            <img
              src="/images/article-hien-dai-living-room.png"
              alt="Phòng khách Hiện Đại"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-[20px] left-[20px] text-white">
              <span className="inline-flex rounded-full bg-white/20 px-[10px] py-[4px] text-[16px]">
                Phòng Khách
              </span>
              <h3 className="mt-[6px] text-[16px] font-bold leading-[1.2]">
                Phòng khách Hiện Đại
              </h3>
              <p className="mt-[2px] text-[16px] leading-[1.2] text-white/70">
                Chandelier vàng · Sofa chạm khắc · Ốp tường phào chỉ
              </p>
            </div>
          </article>

          <article className="absolute left-[728px] top-[274px] h-[419px] w-[469px] overflow-hidden rounded-[16px]">
            <img
              src="/images/article-hien-dai-bedroom.png"
              alt="Phòng ngủ Master"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-[16px] left-[16px] text-white">
              <span className="inline-flex rounded-full bg-white/20 px-[10px] py-[4px] text-[16px]">
                Phòng Ngủ
              </span>
              <h3 className="mt-[6px] text-[19px] font-bold leading-[1.2]">
                Phòng ngủ Master
              </h3>
              <p className="mt-[2px] text-[13px] leading-[1.2] text-white/70">
                Giường tufted · Ốp tường vàng
              </p>
            </div>
          </article>

          {/* row 2 */}
          <article className="absolute left-[24px] top-[709px] h-[246px] w-[369px] overflow-hidden rounded-[16px]">
            <img
              src="/images/article-hien-dai-dining-room.png"
              alt="Phòng ăn Hiện Đại"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-[16px] left-[16px] text-white">
              <span className="inline-flex rounded-full bg-white/20 px-[8px] py-[2px] text-[16px]">
                Phòng Ăn
              </span>
              <h3 className="mt-[5px] text-[19px] font-bold leading-[1.2]">
                Phòng ăn Hiện Đại
              </h3>
              <p className="mt-[2px] text-[16px] leading-[1.2] text-white/70">
                Bàn tròn · Chandelier pha lê
              </p>
            </div>
          </article>

          <article className="absolute left-[429px] top-[709px] h-[246px] w-[363px] overflow-hidden rounded-[16px]">
            <img
              src="/images/article-hien-dai-kitchen.png"
              alt="Bếp Hiện Đại"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-[16px] left-[16px] text-white">
              <span className="inline-flex rounded-full bg-white/20 px-[8px] py-[2px] text-[16px]">
                Nhà Bếp
              </span>
              <h3 className="mt-[5px] text-[19px] font-bold leading-[1.2]">
                Bếp Tân Hiện Đại
              </h3>
              <p className="mt-[2px] text-[16px] leading-[1.2] text-white/70">
                Tủ bếp cổ điển · Đảo bếp
              </p>
            </div>
          </article>

          <article className="absolute left-[832px] top-[709px] h-[246px] w-[365px] overflow-hidden rounded-[16px]">
            <img
              src="/images/article-hien-dai-bathroom.png"
              alt="Phòng tắm Luxury"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-[16px] left-[16px] text-white">
              <span className="inline-flex rounded-full bg-white/20 px-[8px] py-[2px] text-[16px]">
                Phòng Tắm
              </span>
              <h3 className="mt-[5px] text-[19px] font-bold leading-[1.2]">
                Phòng tắm Luxury
              </h3>
              <p className="mt-[2px] text-[16px] leading-[1.2] text-white/70">
                Bồn tắm · Gương mạ vàng
              </p>
            </div>
          </article>

          <div className="absolute left-0 top-[987px] flex w-full justify-center">
            <button
              type="button"
              onClick={goToHienDaiProducts}
              className="flex h-[44px] cursor-pointer items-center gap-[8px] rounded-[15px] bg-[#6B7D65] px-[28px] text-[14px] font-medium text-white transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
            >
              Xem toàn bộ dự án Hiện Đại <span>→</span>
            </button>
          </div>

          <div className="absolute left-[24px] top-[1084px] flex w-[1173px] items-center gap-[16px]">
            <div className="h-px flex-1 bg-[#E8E0D4]" />
            <span className="text-[12px] tracking-[1.2px] text-[#717182]">
              CÁC KHÔNG GIAN TIÊU BIỂU
            </span>
            <div className="h-px flex-1 bg-[#E8E0D4]" />
          </div>
        </section>

        {/* FOOTER */}
        <footer
          id="footer"
          className="absolute left-0 top-[2363px] h-[416px] w-[1440px] bg-[#6B7D65] text-white"
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
      </ResponsiveCanvas>
      </div>
    </main>
  );
}
