"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";

export default function CartButton({
  iconSrc,
}: {
  iconSrc: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const total = getCart().reduce(
        (sum, item) => sum + Number(item.quantity),
        0
      );

      setCount(total);
    };

    updateCount();

    window.addEventListener("hkv-cart-updated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("hkv-cart-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return (
    <Link
      href="/cart"
      data-cart-target="true"
      aria-label={`Giỏ hàng${count > 0 ? `, ${count} sản phẩm` : ""}`}
      className="
        relative flex h-[38px] w-[38px] cursor-pointer
        items-center justify-center
        transition-transform duration-200 ease-out
        hover:scale-105
      "
    >
      <img
        src={iconSrc}
        alt=""
        className="h-[30px] w-[30px] object-contain"
      />

      {count > 0 && (
        <span
          className="
            absolute -right-[5px] -top-[5px]
            flex min-h-[18px] min-w-[18px] items-center justify-center
            rounded-full bg-[#CB0606] px-[4px]
            text-[10px] font-medium leading-none text-white
            shadow-sm
          "
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
