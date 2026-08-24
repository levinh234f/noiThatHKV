"use client";

import { addToCart } from "@/lib/cart";

type QuickAddToCartButtonProps = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock?: number;
  className?: string;
};

export default function QuickAddToCartButton({
  id,
  name,
  slug,
  price,
  stock = 1,
  className = "",
}: QuickAddToCartButtonProps) {
  const handleAdd = (button: HTMLButtonElement) => {
    if (stock <= 0) return;

    addToCart({
      id,
      name,
      slug,
      price,
    });

    // Nút + nảy nhẹ khi click
    button.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.88)" },
        { transform: "scale(1.18)" },
        { transform: "scale(1)" },
      ],
      {
        duration: 320,
        easing: "cubic-bezier(.2,.8,.2,1)",
      }
    );

    // Hiệu ứng bay nhẹ về giỏ hàng
    const cartTarget = document.querySelector<HTMLElement>(
      "[data-cart-target='true']"
    );

    if (!cartTarget) return;

    const start = button.getBoundingClientRect();
    const end = cartTarget.getBoundingClientRect();

    const flyer = document.createElement("div");

    flyer.textContent = "+";
    flyer.setAttribute("aria-hidden", "true");

    Object.assign(flyer.style, {
      position: "fixed",
      left: `${start.left + start.width / 2 - 12}px`,
      top: `${start.top + start.height / 2 - 12}px`,
      width: "24px",
      height: "24px",
      borderRadius: "9999px",
      background: "#6B7D65",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "1",
      zIndex: "9999",
      pointerEvents: "none",
      boxShadow: "0 6px 16px rgba(0,0,0,0.16)",
      transform: "translate3d(0,0,0) scale(1)",
      opacity: "1",
      transition:
        "transform 560ms cubic-bezier(.22,.72,.25,1), opacity 560ms ease",
    });

    document.body.appendChild(flyer);

    const deltaX =
      end.left +
      end.width / 2 -
      (start.left + start.width / 2);

    const deltaY =
      end.top +
      end.height / 2 -
      (start.top + start.height / 2);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flyer.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.35)`;
        flyer.style.opacity = "0.25";
      });
    });

    window.setTimeout(() => {
      flyer.remove();

      // Icon giỏ hàng pulse nhẹ khi "nhận" sản phẩm
      cartTarget.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.16)" },
          { transform: "scale(0.96)" },
          { transform: "scale(1)" },
        ],
        {
          duration: 360,
          easing: "cubic-bezier(.2,.8,.2,1)",
        }
      );
    }, 500);
  };

  return (
    <button
      type="button"
      aria-label={`Thêm ${name} vào giỏ hàng`}
      title={stock <= 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
      disabled={stock <= 0}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        handleAdd(event.currentTarget);
      }}
      className={`
        group flex cursor-pointer items-center justify-center
        transition-transform duration-200 ease-out
        hover:scale-110 active:scale-95
        disabled:cursor-not-allowed disabled:opacity-35
        ${className}
      `}
    >
      <span
        className="
          block text-[28px] font-medium leading-none
          transition-transform duration-200 ease-out
          group-hover:scale-125 group-hover:rotate-90
        "
      >
        +
      </span>
    </button>
  );
}