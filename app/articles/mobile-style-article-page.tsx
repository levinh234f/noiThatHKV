"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type StyleKey = "tan-co-dien" | "hien-dai" | "dong-duong";

type GalleryItem = {
  title: string;
  label: string;
  image: string;
  alt: string;
  description?: string;
};

type Stat = [string, string];

const tabItems: Array<{ key: StyleKey; label: string; href: string }> = [
  { key: "tan-co-dien", label: "Tân Cổ Điển", href: "/articles/tan-co-dien" },
  { key: "hien-dai", label: "Hiện Đại", href: "/articles/hien-dai" },
  { key: "dong-duong", label: "Đông Dương", href: "/articles/dong-duong" },
];

function MobileArticleStyleTabs({ active }: { active: StyleKey }) {
  const router = useRouter();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>, href: string) {
    const button = event.currentTarget;

    button.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.12)" },
        { transform: "scale(0.97)" },
        { transform: "scale(1)" },
      ],
      { duration: 260, easing: "cubic-bezier(.2,.8,.2,1)" }
    );

    if (window.location.pathname === href) return;

    window.setTimeout(() => {
      router.push(href);
    }, 175);
  }

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {tabItems.map((item) => {
        const isActive = item.key === active;

        return (
          <button
            key={item.key}
            type="button"
            onClick={(event) => handleClick(event, item.href)}
            aria-current={isActive ? "page" : undefined}
            className={[
              "flex h-11 shrink-0 cursor-pointer select-none items-center justify-center rounded-full border px-5 text-sm",
              "transition-[transform,box-shadow,background-color,color] duration-200 ease-out",
              "hover:scale-[1.03] active:scale-[0.96]",
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

export default function MobileStyleArticlePage({
  active,
  badge,
  introTitle,
  intro,
  features,
  tags,
  heroImage,
  heroAlt,
  stats,
  gallery,
  ctaLabel,
  productHref,
}: {
  active: StyleKey;
  badge: string;
  introTitle: ReactNode;
  intro: ReactNode;
  features: string[];
  tags: string[];
  heroImage: string;
  heroAlt: string;
  stats: Stat[];
  gallery: GalleryItem[];
  ctaLabel: string;
  productHref: string;
}) {
  const router = useRouter();

  function goToProducts(event: React.MouseEvent<HTMLButtonElement>) {
    const button = event.currentTarget;

    button.animate(
      [
        { transform: "scale(1)", boxShadow: "0 0 0 rgba(107,125,101,0)" },
        { transform: "scale(1.09)", boxShadow: "0 10px 28px rgba(107,125,101,.28)" },
        { transform: "scale(.97)", boxShadow: "0 4px 10px rgba(107,125,101,.16)" },
        { transform: "scale(1)", boxShadow: "0 0 0 rgba(107,125,101,0)" },
      ],
      { duration: 310, easing: "cubic-bezier(.2,.8,.2,1)" }
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
      { duration: 360, easing: "ease-out" }
    );

    flashAnimation.onfinish = () => flash.remove();

    window.setTimeout(() => {
      router.push(productHref);
    }, 215);
  }

  return (
    <div className="bg-[#F6F6F6] px-4 pb-14 pt-8 sm:px-6">
      <section className="mx-auto max-w-2xl">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C9A96E]">
              Phong cách thiết kế
            </p>
            <h1 className="mt-5 text-[32px] font-bold leading-[1.12]">
              Đa dạng phong cách,
              <br />
              một đẳng cấp
            </h1>
          </div>

          <Link href="/products" className="text-sm font-medium text-[#A07840]">
            Xem tất cả phong cách <span>→</span>
          </Link>
        </div>

        <div className="mt-10">
          <MobileArticleStyleTabs active={active} />
        </div>

        <div className="mt-12 grid gap-8">
          <div>
            <span className="inline-flex min-h-6 items-center rounded-full bg-[#FDF3E3] px-3 py-1 text-xs font-medium tracking-[1.2px] text-[#A07840]">
              {badge}
            </span>
            <h2 className="mt-4 text-[29px] font-bold leading-[1.18] tracking-[-0.3px]">
              {introTitle}
            </h2>
            <div className="mt-5 space-y-5 text-[15px] leading-6 text-[#717182]">
              {intro}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {features.map((item) => (
                <div key={item} className="flex items-start gap-3 text-[15px] leading-6 text-[#717182]">
                  <span className="mt-1 text-[10px] text-[#C9A96E]">✦</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#E8D9BC] bg-[#FDF8F0] px-3 py-1.5 text-xs leading-4 text-[#A07840]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[16px]">
            <img src={heroImage} alt={heroAlt} className="aspect-[4/3] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute inset-x-4 bottom-4 grid grid-cols-3 rounded-[14px] bg-white/90 p-3">
              {stats.map(([value, label], index) => (
                <div
                  key={label}
                  className={`text-center ${index < stats.length - 1 ? "border-r border-[#E8E0D4]" : ""}`}
                >
                  <p className="text-base font-bold leading-6 text-[#A07840]">{value}</p>
                  <p className="mt-0.5 text-[11px] leading-4 text-[#717182]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 mt-10 flex justify-center">
          <button
            type="button"
            onClick={goToProducts}
            className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#6B7D65] px-6 text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            {ctaLabel} <span>→</span>
          </button>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-2xl">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C9A96E]">
              Phong cách thiết kế
            </p>
            <h2 className="mt-5 text-[30px] font-bold leading-[1.18]">
              Đa dạng phong cách,
              <br />
              một đẳng cấp
            </h2>
          </div>

          <Link href="/products" className="text-sm font-medium text-[#A07840]">
            Xem tất cả phong cách <span>→</span>
          </Link>
        </div>

        <div className="mt-10">
          <MobileArticleStyleTabs active={active} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {gallery.map((item, index) => (
            <article
              key={item.title}
              className={`relative overflow-hidden rounded-[16px] ${index === 0 ? "sm:col-span-2" : ""}`}
            >
              <img
                src={item.image}
                alt={item.alt}
                className={`${index === 0 ? "aspect-[4/3]" : "aspect-[1.08]"} w-full object-cover`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 text-white">
                <span className="inline-flex rounded-full bg-white/20 px-2.5 py-1 text-xs tracking-[0.96px]">
                  {item.label}
                </span>
                <h3 className="mt-2 text-base font-bold leading-6">{item.title}</h3>
                {item.description ? (
                  <p className="mt-1 text-sm leading-5 text-white/75">{item.description}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <div className="mb-6 mt-10 flex justify-center">
          <button
            type="button"
            onClick={goToProducts}
            className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-[15px] bg-[#6B7D65] px-6 text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            {ctaLabel} <span>→</span>
          </button>
        </div>

        <div className="mt-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#E8E0D4]" />
          <span className="text-center text-xs tracking-[1.2px] text-[#717182]">
            CÁC KHÔNG GIAN TIÊU BIỂU
          </span>
          <div className="h-px flex-1 bg-[#E8E0D4]" />
        </div>
      </section>
    </div>
  );
}
