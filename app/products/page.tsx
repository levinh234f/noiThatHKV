"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard, { type ProductCardData } from "@/components/product-card";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { createClient } from "@/lib/supabase/client";
import { getProductImage } from "@/lib/product-images";

type ProductImage = { image_url: string; is_primary: boolean | null; sort_order: number | null };
type Product = {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  price: number;
  sale_price: number | null;
  material: string | null;
  stock: number;
  product_images: ProductImage[] | null;
};

const productTypes = ["Tất cả", "Sofa", "Ghế", "Bàn", "Giường", "Tủ & Kệ"] as const;
type ProductType = (typeof productTypes)[number];

const categories = [
  ["Sofa", "/images/category-sofa.png"], ["Ghế", "/images/category-chair.png"],
  ["Giường", "/images/category-bed.png"], ["Bàn", "/images/category-table.png"],
  ["Tủ Kệ", "/images/category-cabinet.png"], ["Đèn", "/images/category-lamp.png"],
  ["Thảm", "/images/category-rug.png"], ["Trang trí", "/images/category-decor.png"],
] as const;

const styles = [
  { name: "Hiện Đại", text: "Tối giản, tiện nghi và hiện đại.", image: "/images/style-modern.png", href: "/products/hien-dai" },
  { name: "Đông Dương", text: "Bản sắc Á Đông trong tinh thần đương đại.", image: "/images/style-indochine.png", href: "/products/dong-duong" },
  { name: "Tân Cổ Điển", text: "Cân đối, thanh lịch và sang trọng.", image: "/images/style-neoclassical.png", href: "/products/tan-co-dien" },
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();
}

function matchesType(name: string, type: ProductType) {
  if (type === "Tất cả") return true;
  const value = normalize(name);
  if (type === "Sofa") return value.includes("sofa");
  if (type === "Ghế") return value.includes("ghe");
  if (type === "Bàn") return value.includes("ban");
  if (type === "Giường") return value.includes("giuong");
  return value.includes("tu") || value.includes("ke");
}

function styleBadge(name: string) {
  const value = normalize(name);
  if (value.includes("dong duong") || value.includes("may")) return ["Đông Dương", "bg-[#5e7259]"];
  if (value.includes("tan co dien") || value.includes("victoria")) return ["Tân Cổ Điển", "bg-[#c59c54]"];
  return ["Hiện Đại", "bg-[#857868]"];
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<ProductType>(() => {
    const type = searchParams.get("type");
    return productTypes.includes(type as ProductType) ? (type as ProductType) : "Tất cả";
  });
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

  const query = searchParams.get("q")?.trim() ?? "";
  const saleOnly = searchParams.get("sale") === "1";

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase.from("products").select(`id,name,slug,short_description,price,sale_price,material,stock,product_images(image_url,is_primary,sort_order)`).eq("is_active", true).order("featured", { ascending: false }).order("created_at", { ascending: false }).then(({ data, error }) => {
      if (!active) return;
      if (error) console.error("Products error:", error);
      setProducts((data ?? []) as Product[]);
      setLoading(false);
    });

    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query);
    const result = products.filter((product) => {
      const isSale = product.sale_price !== null && Number(product.sale_price) < Number(product.price);
      return (!saleOnly || isSale) && matchesType(product.name, selectedType) && (!normalizedQuery || normalize(`${product.name} ${product.short_description ?? ""} ${product.material ?? ""}`).includes(normalizedQuery));
    });

    if (sort === "low") return [...result].sort((a, b) => Number(a.sale_price ?? a.price) - Number(b.sale_price ?? b.price));
    if (sort === "high") return [...result].sort((a, b) => Number(b.sale_price ?? b.price) - Number(a.sale_price ?? a.price));
    return result;
  }, [products, query, saleOnly, selectedType, sort]);

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toCard(product: Product): ProductCardData {
    const images = [...(product.product_images ?? [])].sort((a, b) => Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary)) || Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
    const hasSale = product.sale_price !== null && Number(product.sale_price) < Number(product.price);
    const [badge, badgeClassName] = hasSale ? ["Giảm giá", "bg-[#b42318]"] : styleBadge(product.name);
    return {
      id: product.id, name: product.name, slug: product.slug, description: product.short_description || product.material,
      price: Number(hasSale ? product.sale_price : product.price), oldPrice: hasSale ? Number(product.price) : null,
      stock: product.stock, image: images[0]?.image_url || getProductImage(product.slug) || "/images/product-sofa-elara.png",
      badge, badgeClassName,
    };
  }

  return (
    <main className="bg-[#f6f6f6] text-[#171717]">
      <SiteHeader />
      <section className="mx-auto max-w-[1176px] px-4 pt-5 sm:px-6 lg:pt-7 xl:px-0">
        <div className="relative h-[220px] overflow-hidden rounded-[21px] sm:h-[280px] lg:h-[320px]">
          <img src="/images/products-hero.png" alt="Không gian nội thất HKV" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-transparent" />
          <div className="absolute bottom-7 left-6 text-white sm:bottom-10 sm:left-10">
            <p className="text-xs uppercase tracking-[0.22em]">HKV Interior</p>
            <h1 className="mt-2 text-3xl font-medium sm:text-4xl">Không gian sống tinh tế</h1>
          </div>
        </div>

        <section className="mt-7">
          <div className="flex items-end justify-between gap-4"><h2 className="text-lg font-medium">Bạn đang tìm sản phẩm gì?</h2><Link href="#danh-sach" className="text-xs text-[#5e7259]">Xem sản phẩm ↓</Link></div>
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-4">
            {categories.map(([name, image]) => <button key={name} type="button" onClick={() => { if (productTypes.includes(name as ProductType)) setSelectedType(name as ProductType); setPage(1); }} className="group overflow-hidden rounded-[15px] border border-[#ddd] bg-white p-1.5"><img src={image} alt="" className="mx-auto aspect-square w-full object-contain transition-transform group-hover:scale-105" /><span className="block pb-1 text-[10px] sm:text-xs">{name}</span></button>)}
          </div>
        </section>

        <section className="mt-8 grid gap-3 md:grid-cols-3">
          {styles.map((style) => <Link key={style.name} href={style.href} className="group relative min-h-[150px] overflow-hidden rounded-[15px] text-white"><img src={style.image} alt={style.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-black/25" /><div className="relative flex min-h-[150px] flex-col justify-end p-5"><h2 className="text-xl font-medium">{style.name}</h2><p className="mt-1 text-sm text-white/85">{style.text}</p></div></Link>)}
        </section>
      </section>

      <section id="danh-sach" className="mx-auto grid max-w-[1280px] gap-7 px-4 py-14 sm:px-6 lg:grid-cols-[220px_1fr] xl:px-0">
        <aside className="hidden h-fit rounded-[15px] bg-[#ececeb] p-5 lg:block">
          <h2 className="text-lg font-medium">Bộ lọc</h2><p className="mt-6 text-sm">Loại sản phẩm</p>
          <div className="mt-4 grid gap-3">{productTypes.map((type) => <label key={type} className="flex cursor-pointer items-center gap-3 text-sm"><input type="radio" name="product-type" checked={selectedType === type} onChange={() => { setSelectedType(type); setPage(1); }} className="accent-[#6b7d65]" />{type}</label>)}</div>
        </aside>

        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">{productTypes.map((type) => <button key={type} type="button" onClick={() => { setSelectedType(type); setPage(1); }} className={`shrink-0 rounded-full border px-4 py-2 text-xs ${selectedType === type ? "border-[#6b7d65] bg-[#6b7d65] text-white" : "border-[#d5d5d2] bg-white"}`}>{type}</button>)}</div>
            <p className="text-sm text-black/55">{loading ? "Đang tải sản phẩm..." : `${filtered.length} sản phẩm${query ? ` cho “${query}”` : ""}`}</p>
            <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} aria-label="Sắp xếp sản phẩm" className="h-10 rounded-full border border-[#d5d5d2] bg-white px-4 text-sm outline-none"><option value="featured">Nổi bật</option><option value="low">Giá thấp đến cao</option><option value="high">Giá cao đến thấp</option></select>
          </div>

          {loading ? <div className="grid grid-cols-2 gap-4 pt-7 md:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="aspect-[3/4] animate-pulse rounded-[15px] bg-[#e5e5e2]" />)}</div> : visible.length ? <div className="grid grid-cols-2 gap-4 pt-7 md:grid-cols-3 xl:grid-cols-4">{visible.map((product) => <ProductCard key={product.id} product={toCard(product)} />)}</div> : <div className="my-16 rounded-[15px] bg-white p-12 text-center"><h2 className="text-xl">Không tìm thấy sản phẩm</h2><button type="button" onClick={() => setSelectedType("Tất cả")} className="mt-5 rounded-full bg-[#6b7d65] px-6 py-3 text-sm text-white">Xóa bộ lọc</button></div>}

          {totalPages > 1 && <nav className="mt-10 flex justify-center gap-2" aria-label="Phân trang"><button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="size-9 rounded-full border disabled:opacity-30">‹</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => <button key={value} type="button" onClick={() => setPage(value)} className={`size-9 rounded-full border ${currentPage === value ? "border-[#6b7d65] bg-[#6b7d65] text-white" : "bg-white"}`}>{value}</button>)}<button type="button" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="size-9 rounded-full border disabled:opacity-30">›</button></nav>}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

export default function ProductsPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#f6f6f6]" />}><ProductsContent /></Suspense>;
}
