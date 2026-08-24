"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ResponsiveCanvas from "@/components/responsive-canvas";
import SiteHeader from "@/components/site-header";

const features = [
  "Ốp Tường Gỗ Mây", "Rem lụa xuyên thấu", "Nội thất thiết kế tinh xảo",
  "Gam màu vàng nhạt, trắng kem", "Tinh tế ấm cúng", "Gỗ trầm hoài cổ",
];

const tags = ["Sang trọng", "Cổ Điển", "Lãng Mạn", "Tinh tế", "Tinh Xảo"];

const spaces = [
  { title: "Phòng khách Indochine", label: "Phòng Khách", image: "/images/article-dong-duong-living-room.png", big: true },
  { title: "Phòng ngủ Master", label: "Phòng Ngủ", image: "/images/article-dong-duong-bedroom.png", big: true },
  { title: "Bàn ăn Indochine", label: "Bàn ăn", image: "/images/article-dong-duong-dining-room.png" },
  { title: "Bàn gỗ Indochine", label: "Bàn làm việc", image: "/images/article-dong-duong-work-desk.png" },
  { title: "Phòng tắm Luxury", label: "Phòng Tắm", image: "/images/article-dong-duong-bathroom.png" },
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

export default function DongDuongArticlePage() {
  const router = useRouter();

  const goToDongDuongProducts = (
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
      router.push("/products/dong-duong");
    }, 215);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F6F6F6] text-[#0A0A0A]">
      <SiteHeader />
      <ResponsiveCanvas designHeight={2779}>
      <div className="relative mx-auto w-[1440px] bg-[#F6F6F6]">
        {/* SECTION 1: dùng flow, CTA không dùng absolute => không thể dính tag */}
        <section className="mx-auto w-[1177px] px-[24px] pb-[74px] pt-[18px]">
          <div className="flex h-[104px] items-end justify-between">
            <div><p className="text-[13px] font-bold text-[#C9A96E]">Phong cách thiết kế</p><h1 className="mt-[8px] text-[48px] font-bold leading-[1.2]">Đa dạng phong cách,<br />một đẳng cấp</h1></div>
            <Link href="/products" className="mb-[7px] text-[14px] font-medium text-[#A07840]">Xem tất cả phong cách →</Link>
          </div>
          <div className="mt-[65px]"><ArticleStyleTabs active="dong-duong" /></div>

          <div className="mt-[80px] grid grid-cols-[549px_573px] gap-[25px]">
            <div className="min-h-[632px]">
              <span className="inline-flex h-[24px] items-center rounded-full bg-[#FDF3E3] px-[12px] text-[12px] font-medium tracking-[1.2px] text-[#A07840]">PHONG CÁCH ĐÔNG DƯƠNG</span>
              <h2 className="mt-[14px] text-[30px] font-bold leading-[36px] tracking-[-0.6px]">Cổ Điển, Lãng Mạn, Sang Trọng.</h2>
              <p className="mt-[20px] w-[488px] text-[16px] leading-[1.2] text-[#717182]">Phong cách <strong>Đông Dương</strong> là bản giao hưởng hoàn hảo giữa nét mộc mạc của truyền thống Á Đông và vẻ đẹp lãng mạn, tinh tế đến từ kiến trúc Pháp. Điểm nhấn cuốn hút nhất của không gian này nằm ở việc ứng dụng khéo léo các vật liệu tự nhiên đậm chất bản địa như gỗ, mây, tre đan cùng gạch bông lát nền mang đậm dấu ấn thời gian. Với những gam màu nhiệt đới ấm áp như vàng nhạt hay xanh lá, Indochine kiến tạo nên một không gian sang trọng, thư thái.</p>
              <p className="mt-[20px] w-[488px] text-[16px] leading-[1.2] text-[#717182]">Bảng màu nội thất Đông Dương mang đậm nét hoài cổ và hơi thở nhiệt đới. Không gian ưu tiên tông nền vàng nhạt, trắng kem. Điểm nhấn nổi bật đến từ sắc xanh ngọc, đỏ gạch và nâu gỗ trầm, tạo nên không gian vô cùng tinh tế, ấm cúng.</p>
              <div className="mt-[20px] grid w-[488px] grid-cols-2 gap-x-[24px] gap-y-[12px]">
                {features.map(item => <div key={item} className="flex min-h-[20px] items-center gap-[10px] text-[16px] leading-[1.2] text-[#717182]"><span className="text-[10px] text-[#C9A96E]">✦</span><span>{item}</span></div>)}
              </div>
              <div className="mt-[24px] flex flex-wrap gap-[8px]">{tags.map(tag => <span key={tag} className="rounded-full border border-[#E8D9BC] bg-[#FDF8F0] px-[13px] py-[5px] text-[12px] text-[#A07840]">{tag}</span>)}</div>
            </div>

            <div className="pt-[60px]">
              <div className="relative h-[441px] overflow-hidden rounded-[16px]">
                <img src="/images/article-dong-duong-hero.png" alt="Không gian Đông Dương" className="h-[437px] w-full object-cover" />
                <div className="absolute inset-x-0 top-0 h-[437px] bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute left-[59px] top-[331px] grid h-[74px] w-[455px] grid-cols-3 rounded-[14px] bg-white/90 p-[16px]">
                  {[["100+","Dự án TCD"],["90%","Hài lòng"],["6+","Năm KN"]].map(([v,l],i)=><div key={l} className={`text-center ${i<2 ? "border-r border-[#E8E0D4]" : ""}`}><p className="text-[16px] font-bold text-[#A07840]">{v}</p><p className="mt-[2px] text-[12px] text-[#717182]">{l}</p></div>)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[56px] flex justify-center">
            <button
              type="button"
              onClick={goToDongDuongProducts}
              className="flex h-[44px] cursor-pointer items-center gap-[8px] rounded-[14px] bg-[#6B7D65] px-[28px] text-[14px] font-medium text-white transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
            >
              Xem toàn bộ dự án Đông Dương <span>→</span>
            </button>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="mx-auto w-[1204px] px-[24px] pb-[40px] pt-[36px]">
          <div className="flex items-end justify-between">
            <div><p className="text-[12px] uppercase tracking-[2.4px] text-[#C9A96E]">Phong cách thiết kế</p><h2 className="mt-[8px] text-[30px] font-bold leading-[36px]">Đa dạng phong cách,<br />một đẳng cấp</h2></div>
            <Link href="/products" className="mb-[7px] text-[14px] font-medium text-[#A07840]">Xem tất cả phong cách →</Link>
          </div>
          <div className="mt-[40px]"><ArticleStyleTabs active="dong-duong" /></div>

          <div className="mt-[40px] grid grid-cols-[671px_469px] gap-[33px]">
            {spaces.slice(0,2).map((space,idx)=><article key={space.title} className="relative h-[419px] overflow-hidden rounded-[16px]"><img src={space.image} alt={space.title} className="h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/><div className={`absolute ${idx===0 ? "bottom-[20px] left-[20px]" : "bottom-[16px] left-[16px]"} text-white`}><span className="inline-flex rounded-full bg-white/20 px-[10px] py-[4px] text-[12px] tracking-[0.96px]">{space.label}</span><h3 className={`${idx===0 ? "text-[18px] leading-[28px]" : "text-[16px] leading-[24px]"} mt-[6px] font-bold`}>{space.title}</h3></div></article>)}
          </div>

          <div className="mt-[16px] grid grid-cols-[369px_363px_365px] gap-[36px]">
            {spaces.slice(2).map(space=><article key={space.title} className="relative h-[246px] overflow-hidden rounded-[16px]"><img src={space.image} alt={space.title} className="h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"/><div className="absolute bottom-[16px] left-[16px] text-white"><span className="inline-flex rounded-full bg-white/20 px-[8px] py-[2px] text-[12px] tracking-[0.96px]">{space.label}</span><h3 className="mt-[5px] text-[14px] font-bold leading-[20px]">{space.title}</h3></div></article>)}
          </div>

          <div className="mt-[32px] flex justify-center"><button
              type="button"
              onClick={goToDongDuongProducts}
              className="flex h-[44px] cursor-pointer items-center gap-[8px] rounded-[15px] bg-[#6B7D65] px-[28px] text-[14px] font-medium text-white transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
            >
              Xem toàn bộ dự án Đông Dương <span>→</span>
            </button></div>
          <div className="mt-[40px] flex items-center gap-[16px]"><div className="h-px flex-1 bg-[#E8E0D4]"/><span className="text-[12px] tracking-[1.2px] text-[#717182]">CÁC KHÔNG GIAN TIÊU BIỂU</span><div className="h-px flex-1 bg-[#E8E0D4]"/></div>
        </section>

        <footer id="footer" className="mt-[16px] h-[416px] bg-[#6B7D65] text-white">
          <div className="relative mx-auto h-full w-[1176px]">
            <div className="absolute left-[39px] top-[17px] flex flex-col items-center"><div className="flex h-[123px] w-[123px] items-center justify-center rounded-full bg-[#F6F6F6]"><img src="/images/logo-hkv.png" alt="HKV" className="h-[111px] w-[111px] object-contain"/></div><p className="mt-[15px] text-[20px]">FOLLOW US</p><p className="mt-[16px] text-[14px]">Instagram - Facebook</p></div>
            <div className="absolute left-[293px] top-[31px] flex flex-col gap-[31px] text-[14px]"><Link href="/">Giới thiệu</Link><Link href="/products">Sản phẩm</Link><Link href="#">Thẻ hội viên</Link><Link href="#">Đổi trả hàng</Link></div>
            <div className="absolute left-[814px] top-[188px] w-[362px]"><h3 className="text-[20px]">THÔNG TIN LIÊN HỆ</h3><div className="mt-[26px] flex justify-between text-[14px]"><span>Email:</span><span>Hotline:</span></div></div>
            <button type="button" className="absolute left-0 top-[246px] flex h-[40px] w-[212px] items-center justify-center border border-[#D9D9D9] text-[20px]">HỆ THỐNG CỬA HÀNG</button>
            <div className="absolute left-0 top-[295px] w-full border-t border-white/50"/>
            <div className="absolute left-0 top-[326px] grid w-full grid-cols-6 items-center justify-items-center">{[1,2,3,4,5,6].map(n=><img key={n} src={`/images/partner-${n}.png`} alt={`Đối tác ${n}`} className="h-[30px] w-[100px] object-contain"/>)}</div>
            <div className="absolute bottom-[25px] left-0 w-full border-t border-white/50"/>
          </div>
        </footer>
      </div>
      </ResponsiveCanvas>
    </main>
  );
}
