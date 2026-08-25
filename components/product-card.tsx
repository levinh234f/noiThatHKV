"use client";

import Link from "next/link";
import QuickAddToCartButton from "@/components/quick-add-to-cart-button";

export type ProductCardData = {
  id?: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  oldPrice?: number | null;
  stock?: number;
  image: string;
  badge?: string;
  badgeClassName?: string;
};

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("vi-VN").format(price)} đ`;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const content = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-[15px] bg-[#ebeae6]">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="min-h-[132px] p-4 pr-12">
        {product.badge && <span className={`inline-flex rounded-full px-3 py-1 text-[10px] text-white ${product.badgeClassName ?? "bg-[#6b7d65]"}`}>{product.badge}</span>}
        <h3 className="mt-2 line-clamp-1 text-base font-medium sm:text-lg">{product.name}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-black/55">{product.description || "Nội thất HKV"}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium sm:text-base">{formatPrice(product.price)}</span>
          {product.oldPrice && <span className="text-xs text-black/45 line-through">{formatPrice(product.oldPrice)}</span>}
        </div>
      </div>
    </>
  );

  return (
    <article className="group relative overflow-hidden rounded-[15px] bg-white shadow-[0_8px_28px_rgba(20,24,20,0.06)] transition-transform duration-300 hover:-translate-y-0.5">
      {product.slug ? <Link href={`/products/${product.slug}`} className="block">{content}</Link> : content}
      {product.id !== undefined && product.slug && (
        <QuickAddToCartButton
          id={product.id}
          name={product.name}
          slug={product.slug}
          price={product.price}
          stock={product.stock ?? 0}
          className="absolute bottom-3 right-3 size-9 rounded-full bg-[#edf0eb] text-[#42513e]"
        />
      )}
    </article>
  );
}
