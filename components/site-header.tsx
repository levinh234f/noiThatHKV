"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import CartButton from "@/components/cart-button";
import { LanguageToggleButton } from "@/components/site-translator";
import { createClient } from "@/lib/supabase/client";

const menuItems = [
  { label: "Phong cách", href: "/#phong-cach" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Bộ sưu tập", href: "/#bo-suu-tap" },
  { label: "Về HKV", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

const drawerItems: Array<{ label: string; href: string; accent?: boolean; hideArrow?: boolean }> = [
  { label: "Sản phẩm mới", href: "/products" },
  { label: "Phong Cách Hiện Đại", href: "/products/hien-dai" },
  { label: "Phong Cách Tân Cổ Điển", href: "/products/tan-co-dien" },
  { label: "Phong Cách Đông Dương", href: "/products/dong-duong" },
  { label: "Giảm giá đặc biệt", href: "/#discounted-products" },
  { label: "Bộ sưu tập", href: "/#bo-suu-tap" },
  { label: "Về HKV", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function SiteHeader({
  overlayHeroId,
}: {
  overlayHeroId?: string;
}) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [query, setQuery] = useState("");
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [isHeroVisible, setIsHeroVisible] = useState(Boolean(overlayHeroId));
  const isHomeOverlay = Boolean(overlayHeroId);
  const isTransparent = isHomeOverlay && isHeroVisible;
  const menuButtonLabel = isMenuOpen ? "Đóng menu" : "Mở menu";
  const accountLabel = isLoggedIn ? "TÀI KHOẢN" : "ĐĂNG NHẬP";
  const hydrationSafeText = (label: string) =>
    isHydrated ? (
      label
    ) : (
      <span aria-hidden="true" className="before:content-[attr(data-label)]" data-label={label} />
    );
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(Boolean(user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session?.user));
    });

    return () => subscription.unsubscribe();
  }, []);

  const openMenu = useCallback(() => {
    setIsMenuMounted(true);

    if (prefersReducedMotion()) {
      setIsMenuOpen(true);
      return;
    }

    window.requestAnimationFrame(() => setIsMenuOpen(true));
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    if (prefersReducedMotion()) setIsMenuMounted(false);
  }, []);

  const toggleMenu = useCallback(() => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [closeMenu, isMenuOpen, openMenu]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeMenu, isMenuOpen]);

  useEffect(() => {
    if (!isMenuMounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuMounted]);

  useEffect(() => {
    if (!overlayHeroId) return;

    const hero = document.getElementById(overlayHeroId);
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [overlayHeroId]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/products?q=${encodeURIComponent(value)}` : "/products");
    closeMenu();
  }

  return (
    <header
      className={`z-50 w-full transition-[background-color,border-color,color] duration-300 ease-out ${
        isHomeOverlay ? "fixed left-0 right-0 top-0" : "relative"
      } ${
        isTransparent
          ? "border-b border-transparent bg-transparent text-white shadow-none"
          : "border-b border-black/10 bg-white text-[#111] shadow-[0_1px_12px_rgba(0,0,0,0.06)]"
      }`}
    >
      <Link
        href="/"
        aria-label={isHydrated ? "Trang chủ HKV" : undefined}
        className="absolute left-1/2 top-0 z-10 flex h-[74px] -translate-x-1/2 items-center lg:hidden"
      >
        <img
          src="/images/logo-hkv.png"
          alt="HKV"
          className={`size-[68px] translate-x-px object-contain transition duration-300 ${
            isTransparent ? "brightness-0 invert" : ""
          }`}
        />
      </Link>

      <div className="flex min-h-[74px] w-full items-center justify-between gap-4 px-4 sm:px-6 lg:min-h-[90px] lg:px-10">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-label={isHydrated ? menuButtonLabel : undefined}
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
            className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${
              isTransparent ? "hover:bg-white/15" : "hover:bg-[#f3f3f1]"
            }`}
          >
            <img
              src="/images/menu.png"
              alt=""
              className={`size-[30px] object-contain transition duration-300 ${
                isTransparent ? "brightness-0 invert" : ""
              }`}
            />
          </button>

          <Link href="/" aria-label={isHydrated ? "Trang chủ HKV" : undefined} className="hidden shrink-0 lg:block">
            <img
              src="/images/logo-hkv.png"
              alt="HKV"
              className={`size-[68px] object-contain transition duration-300 lg:size-[90px] ${
                isTransparent ? "brightness-0 invert" : ""
              }`}
            />
          </Link>

          <nav className="ml-1 hidden items-center gap-1 xl:flex" aria-label={isHydrated ? "Điều hướng chính" : undefined}>
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`motion-nav-link rounded-lg px-3 py-2 text-[18px] whitespace-nowrap transition-colors 2xl:text-[20px] ${
                  isTransparent ? "hover:bg-white/15" : "hover:bg-[#f3f3f1]"
                }`}
              >
                {hydrationSafeText(item.label)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          <form
            onSubmit={submitSearch}
            className={`hidden h-8 w-[220px] items-center rounded-[15px] pl-3 transition-colors lg:flex 2xl:w-64 ${
              isTransparent ? "bg-white/20" : "bg-[#e9e9e9]"
            }`}
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              aria-label={isHydrated ? "Tìm sản phẩm" : undefined}
              placeholder={isHydrated ? "Tìm sản phẩm" : undefined}
              className={`min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:transition-colors ${
                isTransparent ? "text-white placeholder:text-white/85" : "text-[#111] placeholder:text-black/50"
              }`}
            />
            <button type="submit" aria-label={isHydrated ? "Tìm kiếm" : undefined} className="flex size-8 items-center justify-center">
              <img
                src="/images/products-search.svg"
                alt=""
                className={`size-8 transition duration-300 ${isTransparent ? "brightness-0 invert" : ""}`}
              />
            </button>
          </form>

          <div
            className={`[&_img]:transition [&_img]:duration-300 ${
              isTransparent ? "[&_img]:brightness-0 [&_img]:invert" : ""
            }`}
          >
            <CartButton iconSrc="/images/cart.png" />
          </div>

          <Link
            href={isLoggedIn ? "/account" : "/login"}
            className="hidden h-[43px] items-center justify-center rounded-full bg-[#6b7d65] px-5 text-sm text-white transition-colors hover:bg-[#586a53] sm:flex"
          >
            {hydrationSafeText(accountLabel)}
          </Link>
        </div>
      </div>

      <form
        onSubmit={submitSearch}
        className={`mx-4 mb-3 flex h-9 items-center rounded-[15px] pl-3 transition-colors lg:hidden ${
          isTransparent ? "bg-white/20" : "bg-[#e9e9e9]"
        }`}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
          aria-label={isHydrated ? "Tìm sản phẩm" : undefined}
          placeholder={isHydrated ? "Tìm sản phẩm" : undefined}
          className={`min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:transition-colors ${
            isTransparent ? "text-white placeholder:text-white/85" : "text-[#111] placeholder:text-black/50"
          }`}
        />
        <button type="submit" aria-label={isHydrated ? "Tìm kiếm" : undefined} className="flex size-9 items-center justify-center">
          <img
            src="/images/products-search.svg"
            alt=""
            className={`size-8 transition duration-300 ${isTransparent ? "brightness-0 invert" : ""}`}
          />
        </button>
      </form>

      {isMenuMounted && (
        <button
          type="button"
          aria-label="Đóng menu"
          onClick={closeMenu}
          className={`fixed inset-0 top-[110px] z-40 bg-black/20 backdrop-blur-[1px] transition-opacity duration-[240ms] motion-reduce:transition-none lg:top-[90px] ${
            isMenuOpen
              ? "pointer-events-auto opacity-100 ease-out"
              : "pointer-events-none opacity-0 ease-in"
          }`}
        />
      )}

      {isMenuMounted && (
        <aside
          aria-hidden={!isMenuOpen}
          onTransitionEnd={(event) => {
            if (event.currentTarget !== event.target || event.propertyName !== "transform") return;
            if (!isMenuOpen) setIsMenuMounted(false);
          }}
          className={`absolute left-0 top-full z-50 w-full max-w-[390px] bg-white px-4 py-4 text-neutral-900 shadow-2xl transition-[transform,opacity] duration-[260ms] motion-reduce:transition-none sm:left-6 sm:rounded-b-2xl ${
            isMenuOpen
              ? "pointer-events-auto translate-x-0 opacity-100 ease-out"
              : "pointer-events-none -translate-x-full opacity-0 ease-in"
          }`}
        >
          <nav className="grid" aria-label="Danh mục sản phẩm">
            {drawerItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className={`flex min-h-11 cursor-pointer items-center justify-between border-b border-neutral-200 px-3 text-sm text-neutral-900 transition-colors hover:bg-[#eef2ec] hover:text-[#6b7d65] ${
                  item.accent
  ? "font-medium !text-[#b42318] hover:!text-[#b42318]"
  : "text-neutral-900 hover:text-[#6b7d65]"
                }`}
              >
                {hydrationSafeText(item.label)}
                {!item.hideArrow && <span aria-hidden="true">→</span>}
              </Link>
            ))}
          </nav>

          <LanguageToggleButton className="flex min-h-11 w-full cursor-pointer items-center justify-between border-b border-neutral-200 px-3 text-sm text-neutral-900 transition-colors hover:bg-[#eef2ec] hover:text-[#6b7d65]" />

          <Link
            href={isLoggedIn ? "/account" : "/login"}
            onClick={closeMenu}
            className="mt-4 flex h-11 items-center justify-center rounded-full bg-[#6b7d65] text-sm text-white sm:hidden"
          >
            {hydrationSafeText(accountLabel)}
          </Link>
        </aside>
      )}
    </header>
  );
}
