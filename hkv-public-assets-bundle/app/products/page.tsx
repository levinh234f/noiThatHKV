"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CartButton from "@/components/cart-button";
import QuickAddToCartButton from "@/components/quick-add-to-cart-button";
import { createClient } from "@/lib/supabase/client";

type ProductImage = {
  image_url: string;
  is_primary: boolean | null;
  sort_order: number | null;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  sale_price: number | null;
  sku: string | null;
  material: string | null;
  stock: number;
  featured: boolean;
  product_images: ProductImage[] | null;
};

const heroImage =
  "/images/products-hero.png";

const searchIcon =
  "/images/products-search.svg";

const expandArrow =
  "/images/products-expand-arrow.png";

const plusIcon =
  "/images/products-plus.png";

const heartIcon =
  "/images/products-heart.png";

const backIcon =
  "/images/products-page-back.png";

const forwardIcon =
  "/images/products-page-forward.png";

const typeCards = [
  {
    name: "Sofa",
    image: "/images/category-sofa.png",
    width: 116,
    imageClass: "absolute inset-0 h-full w-full object-cover opacity-[0.69]",
  },
  {
    name: "Ghế",
    image: "/images/category-chair.png",
    width: 116,
    imageClass: "absolute h-[89.7%] left-[19.11%] top-[-0.45%] w-[61.86%] object-contain",
  },
  {
    name: "Giường",
    image: "/images/category-bed.png",
    width: 107,
    imageClass: "absolute h-[106.6%] left-[18.35%] top-[-13.74%] w-[62.7%] object-contain",
  },
  {
    name: "Bàn",
    image: "/images/category-table.png",
    width: 116,
    imageClass: "absolute h-[108.64%] left-[12.2%] top-[-8.26%] w-[74.92%] object-contain",
  },
  {
    name: "Tủ Kệ",
    image: "/images/category-cabinet.png",
    width: 116,
    imageClass: "absolute h-[117.42%] left-[9.45%] top-[-14.09%] w-[80.98%] object-contain",
  },
  {
    name: "Đèn",
    image: "/images/category-lamp.png",
    width: 116,
    imageClass: "absolute h-[103.87%] left-[14.23%] top-[-14.92%] w-[71.63%] object-contain",
  },
  {
    name: "Thảm",
    image: "/images/category-rug.png",
    width: 116,
    imageClass: "absolute h-[108.71%] left-[12.51%] top-[-8.94%] w-[74.97%] object-contain",
  },
  {
    name: "Trang trí",
    image: "/images/category-decor.png",
    width: 106,
    imageClass: "absolute h-[95.08%] left-[22.01%] top-[-9.77%] w-[55.93%] object-contain",
  },
] as const;

const styleCards = [
  {
    name: "Hiện Đại",
    description: "Tối giản, tiện nghi\nvà hiện đại.",
    image: "/images/style-modern.png",
    href: "/products",
  },
  {
    name: "Đông Dương",
    description: "Bản sắc Á Đông trong\ntinh thần đương đại.",
    image: "/images/style-indochine.png",
    href: "/products",
  },
  {
    name: "Tân Cổ Điển",
    description: "Cân đối, thanh lịch\nvà sang trọng.",
    image: "/images/style-neoclassical.png",
    href: "/articles/tan-co-dien",
  },
];

const fallbackProductImages = [
  "/images/product-sofa-elara.png",
  "/images/product-chair-dong-duong.png",
  "/images/product-table-luna.png",
  "/images/product-bed-victoria.png",
];

const figmaDemoProducts = [
  {
    id: "demo-sofa",
    name: "Sofa Elara",
    slug: "",
    short_description: "Sofa cao cấp",
    price: 18900000,
    sale_price: null,
    tag: "Hiện Đại",
    tagClass: "bg-[#857868]",
    image: "/images/product-sofa-elara.png",
  },
  {
    id: "demo-ghe",
    name: "Ghế Mây Đông Dương",
    slug: "",
    short_description: "Ghế mây tự nhiên",
    price: 7450000,
    sale_price: null,
    tag: "Đông Dương",
    tagClass: "bg-[#5E7259]",
    image: "/images/product-chair-dong-duong.png",
  },
  {
    id: "demo-ban",
    name: "Bàn Ăn Luna",
    slug: "",
    short_description: "Gỗ sồi tự nhiên",
    price: 15800000,
    sale_price: null,
    tag: "Hiện Đại",
    tagClass: "bg-[#857868]",
    image: "/images/product-table-luna.png",
  },
  {
    id: "demo-giuong",
    name: "Giường Victoria",
    slug: "",
    short_description: "Gỗ tự nhiên, bọc nỉ cao cấp",
    price: 18900000,
    sale_price: null,
    tag: "Tân Cổ Điển",
    tagClass: "bg-[#C59C54]",
    image: "/images/product-bed-victoria.png",
  },
] as const;

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

function formatPrice(price: number | null) {
  if (price === null) return "Liên hệ";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

function getProductStyleBadge(name: string) {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized.includes("dong duong")) {
    return {
      tag: "Đông Dương",
      tagClass: "bg-[#5E7259]",
    };
  }

  if (normalized.includes("victoria") || normalized.includes("tan co dien")) {
    return {
      tag: "Tân Cổ Điển",
      tagClass: "bg-[#C59C54]",
    };
  }

  return {
    tag: "Hiện Đại",
    tagClass: "bg-[#857868]",
  };
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSalePage, setIsSalePage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsSalePage(
      new URLSearchParams(window.location.search).get("sale") === "1"
    );

    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    const loadProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          short_description,
          description,
          price,
          sale_price,
          sku,
          material,
          stock,
          featured,
          product_images (
            image_url,
            is_primary,
            sort_order
          )
        `)
        .eq("is_active", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Products error:", error);
      }

      setProducts((data ?? []) as Product[]);
      setLoading(false);
    };

    loadProducts();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, []);

  const displayedProducts = useMemo(() => {
    if (!isSalePage) return products;

    return products.filter(
      (product) =>
        product.sale_price !== null &&
        Number(product.sale_price) < Number(product.price)
    );
  }, [products, isSalePage]);

  const counts = useMemo(() => {
    const count = (keyword: string) =>
      displayedProducts.filter((product) =>
        normalizeText(product.name).includes(keyword)
      ).length;

    return [
      ["Sofa", count("sofa")],
      ["Ghế", count("ghe")],
      ["Bàn", count("ban")],
      ["Giường", count("giuong")],
      [
        "Tủ & Kệ",
        displayedProducts.filter((product) => {
          const name = normalizeText(product.name);
          return name.includes("tu") || name.includes("ke");
        }).length,
      ],
    ] as const;
  }, [displayedProducts]);

  return (
    <main className="min-h-screen overflow-x-auto bg-[#F6F6F6] text-[#212121]">
      {/* 
        Desktop frame của Figma là 1440px.
        Giữ fixed canvas để các vị trí khớp trực tiếp node 331:304.
        Không ép font ở đây: dùng đúng font global của project giống trang chủ.
      */}
      <div className="relative mx-auto h-[1561px] w-[1440px] bg-[#F6F6F6]">
        {/* HEADER — top 0 */}
        <header className="absolute left-0 top-0 z-50 flex h-[90px] w-[1440px] items-center justify-center bg-white">
          <div className="flex items-center gap-[71px]">
            <div className="flex items-center gap-[7px]">
              <div className="flex items-center">
                <button
                  type="button"
                  aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
                  aria-expanded={isMenuOpen}
                  onClick={() => setIsMenuOpen((current) => !current)}
                  className="flex h-[30px] w-[30px] items-center justify-center"
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
                <img src={searchIcon} alt="" className="h-[32px] w-[32px] object-contain" />
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

        {/* CLICK-OUT OVERLAY */}
        {isMenuOpen && (
          <button
            type="button"
            aria-label="Đóng menu"
            onClick={() => setIsMenuOpen(false)}
            className="absolute inset-x-0 bottom-0 top-[90px] z-30 cursor-default"
          />
        )}

        {/* SIDE MENU giống trang chủ */}
        <aside
          className={`absolute left-[88px] top-[90px] z-40 flex w-[371px] flex-col items-start gap-[9px] bg-white transition-all duration-200 ease-out ${
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
                className={`flex h-[45px] w-full items-center justify-between px-[10px] text-left text-[16px] leading-[1.2] ${
                  item.red ? "text-[#CB0606]" : "text-[#121110]"
                } hover:bg-[#F6F6F6]`}
              >
                <span>{item.name}</span>
                {item.arrow && (
                  <img src={expandArrow} alt="" className="h-[20px] w-[20px] object-contain" />
                )}
              </Link>
            ) : (
              <button
                key={item.name}
                type="button"
                className={`flex h-[45px] w-full items-center justify-between px-[10px] text-left text-[16px] leading-[1.2] ${
                  item.red ? "text-[#CB0606]" : "text-[#121110]"
                } hover:bg-[#F6F6F6]`}
              >
                <span>{item.name}</span>
                {item.arrow && (
                  <img src={expandArrow} alt="" className="h-[20px] w-[20px] object-contain" />
                )}
              </button>
            )
          )}
        </aside>

        {/* HERO — Figma x132 y104 w1176 h320 */}
        <section className="absolute left-[132px] top-[104px] h-[320px] w-[1176px] overflow-hidden rounded-[21px]">
          <img
            src={heroImage}
            alt="Không gian nội thất HKV"
            className="h-full w-full object-cover"
          />
        </section>

        {/* PRODUCT TYPE — Figma x133 y450 */}
        <section className="absolute left-[133px] top-[450px] flex w-[1175px] items-center gap-[32px]">
          <p className="h-[40px] w-[108px] shrink-0 text-[16px] leading-normal">
            Bạn đang tìm sản phẩm gì?
          </p>

          <div className="flex w-[1035px] items-center justify-between">
            {typeCards.map((item) => (
              <div
                key={item.name}
                style={{ width: item.width }}
                className="relative h-[80px] shrink-0 overflow-hidden rounded-[15px] border border-[#D9D9D9] bg-white"
              >
                <img
                  src={item.image}
                  alt=""
                  className={item.imageClass}
                />

                <div className="absolute inset-x-0 bottom-[7px] z-10 text-center text-[12px] leading-none text-black">
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STYLE — Figma x132 y564 w1176 h143 */}
        <section className="absolute left-[132px] top-[564px] flex h-[143px] w-[1176px] items-center gap-[8px]">
          <p className="h-[40px] w-[117px] shrink-0 text-[16px] leading-normal">
            Khám phá theo phong cách
          </p>

          <div className="ml-0 flex h-[142px] flex-1 gap-[8px]">
            {styleCards.map((style) => (
              <article
                key={style.name}
                className="relative h-[142px] w-[345px] overflow-hidden rounded-[15px]"
              >
                <img src={style.image} alt={style.name} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/10" />

                <div className="relative z-10 flex h-full flex-col items-start pl-[13px] pt-[18px] text-white">
                  <h2 className="text-[16px]">{style.name}</h2>
                  <p className="mt-[5px] whitespace-pre-line text-[14px] leading-normal">
                    {style.description}
                  </p>
                  <Link
                    href={style.href}
                    className="mt-[5px] flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[rgba(217,217,217,0.82)] text-[22px] text-black"
                  >
                    →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* LEFT FILTER — Figma x25 y707 w208 h341 */}
        <aside className="absolute left-[25px] top-[707px] h-[395px] w-[208px] rounded-[15px] bg-[rgba(217,217,217,0.5)] px-[20px] py-[26px]">
          <div className="flex w-[168px] flex-col gap-[16px]">
            <p className="text-[16px]">Bộ lọc</p>
            <p className="text-[16px]">Loại&nbsp; sản phẩm</p>

            <div className="flex flex-col gap-[15px] text-[12px]">
              {counts.map(([name, count]) => (
                <div key={name} className="grid grid-cols-[12px_1fr_auto] items-center gap-[13px]">
                  <span className="h-[12px] w-[12px] rounded-[2px] border border-[#D9D9D9] bg-white" />
                  <span>{name}</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-[10px] text-[12px]">
              <span>Xem thêm</span>
              <img src={expandArrow} alt="" className="h-[12px] w-[12px]" />
            </div>

            <div className="h-px w-full bg-[#8F8F8F]" />
            <p className="text-[16px]">Không gian</p>
            <div className="h-px w-full bg-[#8F8F8F]" />
          </div>
        </aside>

        {/* FILTER BAR — exact positions from Figma */}
        <div className="absolute left-[267px] top-[726px] h-[30px] w-[1042px]">
          <button
            type="button"
            className="absolute left-0 top-0 flex h-[30px] w-[132px] items-center justify-center gap-[5px] rounded-[15px] border border-[#D9D9D9] text-[12px]"
          >
            Loại sản phẩm
            <img src={expandArrow} alt="" className="h-[12px] w-[12px]" />
          </button>

          <button
            type="button"
            className="absolute left-[142px] top-0 flex h-[30px] w-[113px] items-center justify-center gap-[4px] rounded-[15px] border border-[#D9D9D9] text-[12px]"
          >
            Không gian
            <img src={expandArrow} alt="" className="h-[12px] w-[12px]" />
          </button>

          <button
            type="button"
            className="absolute left-[265px] top-0 flex h-[30px] w-[118px] items-center justify-center gap-[7px] rounded-[15px] border border-[#D9D9D9] text-[12px]"
          >
            Phong cách
            <img src={expandArrow} alt="" className="h-[12px] w-[12px]" />
          </button>

          <button
            type="button"
            className="absolute left-[393px] top-0 flex h-[30px] w-[100px] items-center justify-center gap-[6px] rounded-[15px] border border-[#D9D9D9] text-[12px]"
          >
            Chất liệu
            <img src={expandArrow} alt="" className="h-[12px] w-[12px]" />
          </button>

          <button
            type="button"
            className="absolute left-[503px] top-0 flex h-[30px] w-[98px] items-center justify-center gap-[8px] rounded-[15px] border border-[#D9D9D9] text-[12px]"
          >
            Mức giá
            <img src={expandArrow} alt="" className="h-[12px] w-[12px]" />
          </button>

          <p className="absolute left-[627px] top-[8px] h-[13px] w-[169px] text-[11px] leading-none">
            {loading
              ? "Đang tải sản phẩm..."
              : isSalePage
              ? `Hiển thị ${displayedProducts.length} sản phẩm giảm giá`
              : `Hiển thị ${displayedProducts.length} trên 100 sản phẩm`}
          </p>

          <select
            aria-label="Sắp xếp sản phẩm"
            defaultValue="default"
            className="absolute left-[802px] top-0 h-[30px] w-[168px] rounded-[15px] border border-[#D9D9D9] bg-[#F6F6F6] px-[12px] text-[11px] outline-none"
          >
            <option value="default">Sắp xếp</option>
            <option value="low">Giá thấp đến cao</option>
            <option value="high">Giá cao đến thấp</option>
          </select>

          <div className="absolute left-[976px] top-0 flex h-[30px] w-[30px] items-center justify-center rounded-[5px] bg-[#5E7259]">
            <img
              src="/images/cart.png"
              alt=""
              className="h-[24px] w-[24px] object-contain"
            />
          </div>

          <div className="absolute left-[1012px] top-0 flex h-[30px] w-[30px] items-center justify-center rounded-[5px] bg-[#D9D9D9]">
            <img
              src="/images/menu.png"
              alt=""
              className="h-[24px] w-[24px] object-contain opacity-60"
            />
          </div>
        </div>

        {/* PRODUCT GRID — 4 cards exactly like Figma */}
        <section className="absolute left-[254px] top-[794px] w-[1054px]">
          {loading ? (
            <div className="flex h-[197px] items-center justify-center text-[12px]">
              Đang tải sản phẩm...
            </div>
          ) : isSalePage ? (
            displayedProducts.length === 0 ? (
              <div className="flex h-[197px] items-center justify-center text-[12px]">
                Hiện chưa có sản phẩm giảm giá.
              </div>
            ) : (
              <div className="flex gap-[10px]">
                {displayedProducts.slice(0, 4).map((product, index) => {
                  const sortedImages = Array.isArray(product.product_images)
                    ? [...product.product_images].sort((a, b) => {
                        if (a.is_primary && !b.is_primary) return -1;
                        if (!a.is_primary && b.is_primary) return 1;
                        return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
                      })
                    : [];

                  const image =
                    sortedImages[0]?.image_url ||
                    fallbackProductImages[index % fallbackProductImages.length];

                  const hasSale =
                    product.sale_price !== null &&
                    Number(product.sale_price) < Number(product.price);

                  const displayPrice = hasSale
                    ? Number(product.sale_price)
                    : Number(product.price);

                  return (
                    <article
                      key={product.id}
                      className="relative h-[197px] w-[256px] shrink-0 overflow-hidden rounded-[15px] bg-[rgba(217,217,217,0.6)]"
                    >
                      <Link href={`/products/${product.slug}`} className="block">
                        <div className="absolute left-0 top-0 h-[118px] w-[256px] overflow-hidden rounded-t-[15px]">
                          <img src={image} alt={product.name} className="h-full w-full object-cover" />
                          <img src={heartIcon} alt="" className="absolute right-[11px] top-[22px] h-[12px] w-[12px]" />
                        </div>

                        <div className="absolute left-[10px] top-[125px] flex h-[20px] items-center rounded-[6px] bg-[#857868] px-[10px] text-[8px] text-white">
                          Giảm Giá
                        </div>

                        <p className="absolute left-[10px] top-[143px] max-w-[190px] truncate text-[12px]">
                          {product.name}
                        </p>

                        <p className="absolute left-[10px] top-[159px] max-w-[190px] truncate text-[10px]">
                          {product.short_description || product.material || "Nội thất HKV"}
                        </p>

                        <div className="absolute left-[10px] top-[176px] flex items-center gap-[6px]">
                          <span className="text-[12px]">{formatPrice(displayPrice)}</span>
                          {hasSale && (
                            <span className="text-[9px] text-[#777] line-through">
                              {formatPrice(Number(product.price))}
                            </span>
                          )}
                        </div>
                      </Link>

                      <QuickAddToCartButton
                        id={product.id}
                        name={product.name}
                        slug={product.slug}
                        price={displayPrice}
                        stock={product.stock}
                        className="absolute bottom-[4px] right-[4px] h-[28px] w-[28px]"
                      />
                    </article>
                  );
                })}
              </div>
            )
          ) : (
            <div className="flex gap-[10px]">
              {[
                ...displayedProducts.slice(0, 4).map((product, index) => {
                  const sortedImages = Array.isArray(product.product_images)
                    ? [...product.product_images].sort((a, b) => {
                        if (a.is_primary && !b.is_primary) return -1;
                        if (!a.is_primary && b.is_primary) return 1;
                        return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
                      })
                    : [];

                  const image =
                    sortedImages[0]?.image_url ||
                    fallbackProductImages[index % fallbackProductImages.length];

                  const hasSale =
                    product.sale_price !== null &&
                    Number(product.sale_price) < Number(product.price);

                  const styleBadge = getProductStyleBadge(product.name);

                  return {
                    id: `real-${product.id}`,
                    cartId: product.id,
                    name: product.name,
                    slug: product.slug,
                    short_description:
                      product.short_description ||
                      product.material ||
                      "Nội thất HKV",
                    price: hasSale
                      ? Number(product.sale_price)
                      : Number(product.price),
                    oldPrice: hasSale ? Number(product.price) : null,
                    tag: hasSale ? "Giảm Giá" : styleBadge.tag,
                    tagClass: hasSale ? "bg-[#CB0606]" : styleBadge.tagClass,
                    image,
                    stock: product.stock,
                    real: true,
                  };
                }),
                ...figmaDemoProducts
                  .slice(Math.min(displayedProducts.length, 4))
                  .map((product) => ({
                    ...product,
                    cartId: null,
                    stock: 0,
                    oldPrice: null,
                    real: false,
                  })),
              ]
                .slice(0, 4)
                .map((product) => (
                  <article
                    key={product.id}
                    className="relative h-[197px] w-[256px] shrink-0 overflow-hidden rounded-[15px] bg-[rgba(217,217,217,0.6)]"
                  >
                    {product.real && product.slug ? (
                      <Link href={`/products/${product.slug}`} className="block">
                        <div className="absolute left-0 top-0 h-[118px] w-[256px] overflow-hidden rounded-t-[15px]">
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          <img src={heartIcon} alt="" className="absolute right-[11px] top-[22px] h-[12px] w-[12px]" />
                        </div>

                        <div className={`absolute left-[10px] top-[125px] flex h-[20px] items-center rounded-[6px] px-[10px] text-[8px] text-white ${product.tagClass}`}>
                          {product.tag}
                        </div>

                        <p className="absolute left-[10px] top-[143px] max-w-[190px] truncate text-[12px]">
                          {product.name}
                        </p>

                        <p className="absolute left-[10px] top-[159px] max-w-[190px] truncate text-[10px]">
                          {product.short_description}
                        </p>

                        <div className="absolute left-[10px] top-[176px] flex items-center gap-[6px]">
                          <span className="text-[12px]">{formatPrice(Number(product.price))}</span>
                          {product.oldPrice !== null && (
                            <span className="text-[9px] text-[#777] line-through">
                              {formatPrice(Number(product.oldPrice))}
                            </span>
                          )}
                        </div>
                      </Link>
                    ) : (
                      <>
                        <div className="absolute left-0 top-0 h-[118px] w-[256px] overflow-hidden rounded-t-[15px]">
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          <img src={heartIcon} alt="" className="absolute right-[11px] top-[22px] h-[12px] w-[12px]" />
                        </div>

                        <div className={`absolute left-[10px] top-[125px] flex h-[20px] items-center rounded-[6px] px-[10px] text-[8px] text-white ${product.tagClass}`}>
                          {product.tag}
                        </div>

                        <p className="absolute left-[10px] top-[143px] max-w-[190px] truncate text-[12px]">
                          {product.name}
                        </p>

                        <p className="absolute left-[10px] top-[159px] max-w-[190px] truncate text-[10px]">
                          {product.short_description}
                        </p>

                        <p className="absolute left-[10px] top-[176px] text-[12px]">
                          {formatPrice(Number(product.price))}
                        </p>
                      </>
                    )}

                    {product.real && product.cartId !== null ? (
                      <QuickAddToCartButton
                        id={product.cartId}
                        name={product.name}
                        slug={product.slug}
                        price={Number(product.price)}
                        stock={product.stock}
                        className="absolute bottom-[4px] right-[4px] h-[28px] w-[28px]"
                      />
                    ) : (
                      <button
                        type="button"
                        disabled
                        title="Sản phẩm mẫu - chưa có trong Supabase"
                        className="absolute bottom-[4px] right-[4px] flex h-[28px] w-[28px] cursor-not-allowed items-center justify-center opacity-35"
                      >
                        <span className="text-[28px] font-medium leading-none">+</span>
                      </button>
                    )}
                  </article>
                ))}
            </div>
          )}
        </section>

        {/* PAGINATION — Figma x553 y1021 w335 h24 */}
        <div className="absolute left-[553px] top-[1021px] flex h-[24px] w-[335px] items-center justify-between text-[12px]">
          <img src={backIcon} alt="" className="h-[24px] w-[24px]" />
          <span className="flex h-[20px] w-[30px] items-center justify-center rounded-[4px] bg-[#5E7259] text-white">1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>...</span>
          <span>10</span>
          <img src={forwardIcon} alt="" className="h-[24px] w-[24px]" />
        </div>

        {/* FOOTER — Figma top 1145 h416 */}
        <footer id="footer" className="absolute left-0 top-[1145px] h-[416px] w-[1440px] bg-[#6B7D65] text-white">
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
