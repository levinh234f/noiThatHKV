"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/product-card";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { Reveal } from "@/components/motion";
import { createClient } from "@/lib/supabase/client";
import { getProductImage } from "@/lib/product-images";

export type StyleProduct = { name: string; slug: string; material: string; price: number; image: string };

type DbProduct = { id: number; slug: string; name: string; price: number; sale_price: number | null; stock: number; short_description: string | null; material: string | null };
const types = ["Tất cả", "Sofa", "Ghế", "Bàn", "Giường", "Tủ & Kệ"] as const;
type ProductType = (typeof types)[number];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();
}

function matches(name: string, type: ProductType) {
  if (type === "Tất cả") return true;
  const value = normalize(name);
  if (type === "Sofa") return value.includes("sofa");
  if (type === "Ghế") return value.includes("ghe");
  if (type === "Bàn") return value.includes("ban");
  if (type === "Giường") return value.includes("giuong");
  return value.includes("tu") || value.includes("ke");
}

export default function StyleProductPage({ title, description, badgeClassName, products }: { title: string; description: string; badgeClassName: string; products: StyleProduct[] }) {
  const [selectedType, setSelectedType] = useState<ProductType>("Tất cả");
  const [dbProducts, setDbProducts] = useState<Record<string, DbProduct>>({});

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    supabase.from("products").select("id,slug,name,price,sale_price,stock,short_description,material").in("slug", products.map((product) => product.slug)).then(({ data, error }) => {
      if (!active) return;
      if (error) console.error(`${title} products error:`, error);
      const next: Record<string, DbProduct> = {};
      for (const product of data ?? []) next[product.slug] = product as DbProduct;
      setDbProducts(next);
    });
    return () => { active = false; };
  }, [products, title]);

  const filtered = useMemo(() => products.filter((product) => matches(product.name, selectedType)), [products, selectedType]);

  return (
    <main className="bg-[#f6f6f6] text-[#171717]">
      <SiteHeader />
      <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:py-14 xl:px-0">
        <Reveal className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#6b7d65]">Bộ sưu tập HKV</p>
          <h1 className="mt-3 text-3xl font-medium sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-black/60 sm:text-base">{description}</p>
        </Reveal>

        <Reveal delay={70} className="mt-9 flex gap-2 overflow-x-auto pb-2">
          {types.map((type) => <button key={type} type="button" onClick={() => setSelectedType(type)} className={`shrink-0 rounded-full border px-5 py-2.5 text-sm transition-colors ${selectedType === type ? "border-[#6b7d65] bg-[#6b7d65] text-white" : "border-[#d7d7d3] bg-white hover:border-[#6b7d65]"}`}>{type}</button>)}
        </Reveal>

        {filtered.length ? <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">{filtered.map((product) => {
          const dbProduct = dbProducts[product.slug];
          const hasSale = dbProduct?.sale_price !== null && Number(dbProduct?.sale_price) < Number(dbProduct?.price);
          return <ProductCard key={product.slug} product={{ id: dbProduct?.id, name: dbProduct?.name ?? product.name, slug: dbProduct?.slug ?? "", description: dbProduct?.short_description || dbProduct?.material || product.material, price: dbProduct ? Number(hasSale ? dbProduct.sale_price : dbProduct.price) : product.price, oldPrice: hasSale ? Number(dbProduct.price) : null, stock: dbProduct?.stock ?? 0, image: getProductImage(product.slug) || product.image, badge: title, badgeClassName }} />;
        })}</div> : <div className="mt-10 rounded-[15px] bg-white p-12 text-center">Không có sản phẩm phù hợp.</div>}
      </section>
      <SiteFooter />
    </main>
  );
}
