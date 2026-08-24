"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";

type Props = {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
  };
};

export default function AddToCartButton({
  product,
}: Props) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  function handleAddToCart() {
    for (let index = 0; index < quantity; index += 1) {
      addToCart({ id: product.id, name: product.name, slug: product.slug, price: product.price });
    }

    setAdded(true);
  }

  if (product.stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className="mt-8 h-[54px] w-full bg-[#6B7D65] text-[15px] font-medium text-white opacity-50"
      >
        HẾT HÀNG
      </button>
    );
  }

  return (
    <div className="mt-7">
      <div className="flex gap-2">
        <div className="flex h-12 w-[112px] shrink-0 items-center overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white">
          <button type="button" aria-label="Giảm số lượng" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-full flex-1">−</button>
          <span className="text-sm">{quantity}</span>
          <button type="button" aria-label="Tăng số lượng" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} className="h-full flex-1">+</button>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="h-12 flex-1 rounded-[14px] bg-[#1a1a1a] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#6b7d65] sm:text-sm"
        >
        {added
          ? "ĐÃ THÊM VÀO GIỎ"
          : "THÊM VÀO GIỎ HÀNG"}
        </button>
        <button type="button" aria-label="Yêu thích" className="size-12 shrink-0 rounded-[14px] border border-[#e5e7eb] text-xl">♡</button>
      </div>

      {added && (
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="mt-3 h-[48px] w-full rounded-[14px] border border-[#6B7D65] text-[14px] font-medium text-[#6B7D65]"
        >
          XEM GIỎ HÀNG
        </button>
      )}
    </div>
  );
}
