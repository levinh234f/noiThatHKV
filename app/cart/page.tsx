"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import {
  getCart,
  removeFromCart,
  saveCart,
  updateCartQuantity,
  type CartItem,
} from "@/lib/cart";
import { getProductImage } from "@/lib/product-images";

const CART_SELECTION_KEY = "hkv-cart-selected-ids";

const cartFallbackImages = [
  "/images/den-de-ban.png",
  "/images/ghe-banh.png",
];

const recommendedProducts = [
  {
    name: "SOFA BỌC NỈ",
    oldPrice: 4000000,
    price: 2500000,
    image: "/images/sofa-boc-ni.png",
  },
  {
    name: "GIƯỜNG BỌC DA",
    oldPrice: 8000000,
    price: 7500000,
    image: "/images/giuong-boc-da.png",
  },
  {
    name: "BÀN ĂN GỖ",
    oldPrice: 15000000,
    price: 12500000,
    image: "/images/ban-an-go.png",
  },
  {
    name: "BÀN TRÀ HIỆN ĐẠI",
    oldPrice: 10000000,
    price: 8850000,
    image: "/images/ban-tra-hien-dai.png",
  },
];

function getCartImage(item: CartItem, index: number) {
  const mappedImage = getProductImage(item.slug);

  if (mappedImage) {
    return mappedImage;
  }

  const name = item.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (name.includes("den")) return "/images/den-de-ban.png";
  if (name.includes("ghe")) return "/images/ghe-banh.png";

  // Tách riêng 2 giường để không còn bị trùng hình.
  if (name.includes("victoria")) return "/images/giuong-boc-da.png";
  if (name.includes("giuong ngu hkv")) return "/images/giuong-indochine.png";
  if (name.includes("giuong")) return "/images/giuong-indochine.png";

  if (name.includes("ban an")) return "/images/ban-an-go.png";
  if (name.includes("ban")) return "/images/ban-indochine.png";
  if (name.includes("sofa")) return "/images/sofa-boc-ni.png";

  return cartFallbackImages[index % cartFallbackImages.length];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectionReady, setSelectionReady] = useState(false);

  const cartScrollRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef(0);
  const scrollFrameRef = useRef<number | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const initialCart = getCart();
      setCart(initialCart);

      try {
        const savedSelection = localStorage.getItem(CART_SELECTION_KEY);

        if (savedSelection === null) {
          setSelectedIds(initialCart.map((item) => item.id));
        } else {
          const parsed = JSON.parse(savedSelection) as number[];
          const validIds = new Set(initialCart.map((item) => item.id));

          setSelectedIds(
            parsed.filter((id) => validIds.has(Number(id))).map(Number)
          );
        }
      } catch {
        setSelectedIds(initialCart.map((item) => item.id));
      }

      setSelectionReady(true);
    });

    const refreshCart = () => {
      const latestCart = getCart();
      setCart(latestCart);

      setSelectedIds((current) => {
        const validIds = new Set(latestCart.map((item) => item.id));
        return current.filter((id) => validIds.has(id));
      });
    };

    window.addEventListener("hkv-cart-updated", refreshCart);

    return () => {
      window.removeEventListener("hkv-cart-updated", refreshCart);
    };
  }, []);

  useEffect(() => {
    if (!selectionReady) return;

    localStorage.setItem(
      CART_SELECTION_KEY,
      JSON.stringify(selectedIds)
    );
  }, [selectedIds, selectionReady]);

  const selectedIdSet = useMemo(
    () => new Set(selectedIds),
    [selectedIds]
  );

  const selectedCart = useMemo(
    () => cart.filter((item) => selectedIdSet.has(item.id)),
    [cart, selectedIdSet]
  );

  const total = useMemo(
    () =>
      selectedCart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      ),
    [selectedCart]
  );

  const totalQuantity = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const selectedQuantity = useMemo(
    () => selectedCart.reduce((sum, item) => sum + item.quantity, 0),
    [selectedCart]
  );

  const allSelected =
    cart.length > 0 && selectedIds.length === cart.length;

  const toggleItemSelection = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(allSelected ? [] : cart.map((item) => item.id));
  };

  const changeQuantity = (id: number, quantity: number) => {
    updateCartQuantity(id, quantity);
    setCart(getCart());
  };

  const removeItem = (id: number) => {
    removeFromCart(id);
    setCart(getCart());
    setSelectedIds((current) =>
      current.filter((selectedId) => selectedId !== id)
    );
  };

  const removeSelectedItems = () => {
    if (selectedIds.length === 0) return;

    const selectedIdSet = new Set(selectedIds);
    const nextCart = getCart().filter((item) => !selectedIdSet.has(item.id));

    localStorage.removeItem("hkv-checkout-selected-ids");
    saveCart(nextCart);
    setCart(nextCart);
    setSelectedIds([]);
  };

  const saveCheckoutSelection = () => {
    localStorage.setItem(
      "hkv-checkout-selected-ids",
      JSON.stringify(selectedIds)
    );
  };

  const handleSmoothWheel = (
    event: React.WheelEvent<HTMLDivElement>
  ) => {
    const element = cartScrollRef.current;
    if (!element) return;

    event.preventDefault();

    const maxScroll =
      element.scrollHeight - element.clientHeight;

    scrollTargetRef.current = Math.max(
      0,
      Math.min(
        maxScroll,
        scrollTargetRef.current + event.deltaY * 0.9
      )
    );

    if (scrollFrameRef.current !== null) {
      return;
    }

    const animateScroll = () => {
      const current = element.scrollTop;
      const distance =
        scrollTargetRef.current - current;

      if (Math.abs(distance) < 0.6) {
        element.scrollTop = scrollTargetRef.current;
        scrollFrameRef.current = null;
        return;
      }

      element.scrollTop =
        current + distance * 0.18;

      scrollFrameRef.current =
        requestAnimationFrame(animateScroll);
    };

    scrollFrameRef.current =
      requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    return () => {
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F6F6F6] text-black">
      <SiteHeader />

      <section className="mx-auto w-full max-w-3xl px-4 py-7 sm:px-6 xl:hidden">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E0E0D8] pb-4">
          <div>
            <h1 className="text-2xl font-medium sm:text-3xl">Giỏ Hàng</h1>
            <p className="mt-1 text-sm text-black/60">{totalQuantity} Sản Phẩm</p>
          </div>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={() => setCart(getCart())}
              className="rounded-[12px] bg-[#6B7D65] px-4 py-2 text-sm text-white"
            >
              CẬP NHẬT
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="mt-8 rounded-[15px] bg-[#F0F0E5] px-5 py-14 text-center">
            <h2 className="text-xl">Giỏ hàng đang trống</h2>
            <Link
              href="/products"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-[15px] border-2 border-[#6B7D65] px-6 text-sm"
            >
              MUA SẮM TIẾP
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between gap-3 rounded-[15px] border border-[#E1E1DA] bg-white px-4 py-3">
              <button
                type="button"
                onClick={selectAll}
                aria-pressed={allSelected}
                className="flex min-h-10 items-center gap-2 text-sm text-[#24251F]"
              >
                <span
                  className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-[4px] border border-[#6B7D65] text-[13px] text-white ${
                    allSelected ? "bg-[#6B7D65]" : "bg-white"
                  }`}
                >
                  {allSelected ? "✓" : ""}
                </span>
                Chọn tất cả
              </button>
              <span className="min-w-0 flex-1 truncate text-xs text-[#6F7268]">
                Đã chọn {selectedQuantity} sản phẩm
              </span>
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={removeSelectedItems}
                  className="shrink-0 rounded-[8px] border border-[#C9B8A4] bg-[#EFE7DC] px-3 py-2 text-xs font-medium text-[#6F3F35]"
                >
                  Xóa đã chọn
                </button>
              )}
            </div>

            <div className="space-y-3">
              {cart.map((item, index) => (
                <article key={item.id} className="rounded-[15px] border border-[#D9D9D9] bg-white p-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      aria-label={selectedIdSet.has(item.id) ? `Bỏ chọn ${item.name}` : `Chọn ${item.name}`}
                      onClick={() => toggleItemSelection(item.id)}
                      className={`mt-10 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-[4px] border border-[#6B7D65] text-[13px] text-white ${
                        selectedIdSet.has(item.id) ? "bg-[#6B7D65]" : "bg-white"
                      }`}
                    >
                      {selectedIdSet.has(item.id) ? "✓" : ""}
                    </button>
                    <Link href={`/products/${item.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-[12px] bg-[#ecebe7] sm:h-28 sm:w-28">
                      <img src={getCartImage(item, index)} alt={item.name} className="h-full w-full object-cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/products/${item.slug}`} className="block break-words text-base font-medium leading-snug sm:text-lg">
                        {item.name.toUpperCase()}
                      </Link>
                      <p className="mt-2 text-sm">{formatPrice(Number(item.price))}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="flex h-9 w-[108px] items-center overflow-hidden rounded-[15px] border border-[rgba(107,125,101,0.65)]">
                          <button type="button" aria-label="Giảm số lượng" onClick={() => changeQuantity(item.id, item.quantity - 1)} className="flex h-full w-9 items-center justify-center">−</button>
                          <span className="flex h-full w-9 items-center justify-center text-xs">{item.quantity}</span>
                          <button type="button" aria-label="Tăng số lượng" onClick={() => changeQuantity(item.id, item.quantity + 1)} className="flex h-full w-9 items-center justify-center">+</button>
                        </div>
                        <button type="button" onClick={() => removeItem(item.id)} className="min-h-9 rounded-full px-2 text-xl leading-none">×</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-[15px] border border-[#6B7D65] bg-[#F0F0E5]">
              <div className="bg-[#6B7D65] px-5 py-4">
                <h2 className="text-xl text-white/65">TÓM TẮT ĐƠN HÀNG</h2>
              </div>
              <div className="space-y-4 p-5 text-sm">
                <div className="flex justify-between gap-4"><span>Tạm tính</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between gap-4"><span>Vận chuyển</span><span className="max-w-[210px] text-right text-xs text-black/65">Phí giao hàng sẽ được chúng tôi thực hiện theo thực tế</span></div>
                <div className="border-t border-[#AEB1A8] pt-4">
                  <div className="flex justify-between gap-4 text-lg font-medium"><span>Tổng Cộng</span><span>{formatPrice(total)}</span></div>
                </div>
                <div className="flex overflow-hidden rounded-[15px]">
                  <input type="text" placeholder="MÃ GIẢM GIÁ" className="min-h-12 min-w-0 flex-1 border border-[rgba(107,125,101,0.6)] bg-[rgba(107,125,101,0.25)] px-3 text-sm outline-none" />
                  <button type="button" className="min-h-12 shrink-0 bg-[#6B7D65] px-4 text-sm text-white">ÁP DỤNG</button>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/products" className="flex min-h-12 flex-1 items-center justify-center rounded-[15px] border-2 border-[#6B7D65] text-sm">MUA SẮM TIẾP</Link>
                  {selectedIds.length > 0 ? (
                    <Link href="/checkout" onClick={saveCheckoutSelection} className="flex min-h-12 flex-1 items-center justify-center rounded-[15px] bg-[#6B7D65] text-sm text-white">ĐẶT HÀNG</Link>
                  ) : (
                    <button type="button" disabled className="min-h-12 flex-1 rounded-[15px] bg-[#6B7D65]/45 text-sm text-white">CHỌN SẢN PHẨM</button>
                  )}
                </div>
              </div>
            </aside>

            <section className="border-t border-[#D9D9D9] pt-8">
              <h2 className="text-xl font-medium text-[#739E53]">Có Thể Bạn Cũng Thích</h2>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {recommendedProducts.map((product) => (
                  <article key={product.name} className="min-w-0">
                    <div className="aspect-[270/338] overflow-hidden rounded-[15px] bg-[#ecebe7]">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <h3 className="mt-3 min-h-10 break-words text-sm font-medium leading-tight [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">{product.name}</h3>
                    <p className="mt-1 text-xs line-through">{formatPrice(product.oldPrice)}</p>
                    <p className="text-sm">{formatPrice(product.price)}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </section>

      <div className="relative mx-auto hidden min-h-[2035px] w-[1440px] bg-[#F6F6F6] xl:block">
        {/* CART TITLE ROW */}
        <section className="absolute left-[132px] top-[91px] h-[58px] w-[1176px]">
          <h1 className="absolute left-0 top-[9px] text-[32px] leading-normal whitespace-nowrap">
            Giỏ Hàng
          </h1>

          <p className="absolute left-[184px] top-[13px] text-[24px] leading-normal whitespace-nowrap">
            {totalQuantity} Sản Phẩm
          </p>

          <div className="absolute left-[340px] right-0 top-[31px] h-px bg-[#E0E0D8]" />
        </section>

        {/* CART ITEMS */}
        <section className="absolute left-[132px] top-[189px] h-[684px] w-[672px]">
          {cart.length === 0 ? (
            <div className="flex h-[550px] flex-col items-center justify-center text-center">
              <h2 className="text-[28px]">Giỏ hàng đang trống</h2>

              <Link
                href="/products"
                className="mt-6 flex h-[48px] w-[172px] items-center justify-center rounded-[15px] border-2 border-[#6B7D65] text-[16px]"
              >
                MUA SẮM TIẾP
              </Link>
            </div>
          ) : (
            <>
              {/* THANH CHỌN - nằm NGOÀI vùng cuộn để không đè sản phẩm */}
              <div className="ml-[24px] flex h-[52px] w-[620px] items-center justify-between gap-[16px] border-b border-[#E1E1DA] bg-[#F6F6F6] px-[2px]">
                <div className="flex min-w-0 items-center gap-[14px] whitespace-nowrap">
                  <button
                    type="button"
                    onClick={selectAll}
                    aria-pressed={allSelected}
                    className="flex cursor-pointer items-center gap-[8px] text-[14px] text-[#24251F] transition-opacity hover:opacity-75"
                  >
                    <span
                      className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-[4px] border border-[#6B7D65] text-[13px] text-white transition-colors duration-150 ${
                        allSelected ? "bg-[#6B7D65]" : "bg-white"
                      }`}
                    >
                      {allSelected ? "✓" : ""}
                    </span>
                    Chọn tất cả
                  </button>

                  <span className="text-[12px] text-[#6F7268]">
                    Đã chọn {selectedQuantity} sản phẩm
                  </span>
                </div>

                {selectedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={removeSelectedItems}
                    className="h-[32px] shrink-0 cursor-pointer rounded-[3px] border border-[#C9B8A4] bg-[#EFE7DC] px-[14px] text-[12px] font-medium text-[#6F3F35] transition-colors hover:border-[#6B7D65] hover:bg-[#E8EEE4] hover:text-[#4F604A]"
                  >
                    Xóa đã chọn
                  </button>
                )}
              </div>

              {/* KHUNG CUỘN: toolbar ở ngoài, sản phẩm không thể chui lên đè chữ */}
              <div
                ref={cartScrollRef}
                onWheel={handleSmoothWheel}
                className="h-[498px] w-full overflow-y-auto overscroll-contain pr-[8px] [scrollbar-gutter:stable] [scroll-behavior:smooth]"
              >
                <div className="pb-[10px] pt-[10px]">
                  {cart.map((item, index) => (
                    <article
                      key={item.id}
                      className="relative ml-[24px] h-[236px] w-[620px] border-b border-[#D9D9D9]"
                    >
                      {/* TICK CHỌN SẢN PHẨM */}
                      <button
                        type="button"
                        aria-label={
                          selectedIdSet.has(item.id)
                            ? `Bỏ chọn ${item.name}`
                            : `Chọn ${item.name}`
                        }
                        onClick={() => toggleItemSelection(item.id)}
                        className={`absolute left-[-23px] top-[88px] flex h-[19px] w-[19px] cursor-pointer items-center justify-center rounded-[4px] border border-[#6B7D65] text-[13px] text-white transition-all duration-150 hover:scale-[1.1] active:scale-[0.9] ${
                          selectedIdSet.has(item.id)
                            ? "bg-[#6B7D65] shadow-sm"
                            : "bg-white"
                        }`}
                      >
                        {selectedIdSet.has(item.id) ? "✓" : ""}
                      </button>

                      <Link
                        href={`/products/${item.slug}`}
                        className="absolute left-0 top-[20px] h-[156px] w-[140px] overflow-hidden"
                      >
                        <img
                          src={getCartImage(item, index)}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>

                      <div className="absolute left-[181px] top-[20px] w-[265px]">
                        <Link
                          href={`/products/${item.slug}`}
                          className="block text-[33px] font-medium leading-[1.2]"
                        >
                          {item.name.toUpperCase()}
                        </Link>

                        <p className="mt-[10px] text-[20px] leading-[1.2]">
                          {formatPrice(Number(item.price))}
                        </p>
                      </div>

                      {/* TĂNG / GIẢM SỐ LƯỢNG */}
                      <div className="absolute left-[457px] top-[82px] flex h-[32px] w-[108px] items-center overflow-hidden rounded-[15px] border-[0.5px] border-[rgba(107,125,101,0.65)]">
                        <button
                          type="button"
                          aria-label="Giảm số lượng"
                          onClick={() =>
                            changeQuantity(item.id, item.quantity - 1)
                          }
                          className="flex h-[32px] w-[36px] items-center justify-center"
                        >
                          <span className="text-[18px] leading-none">−</span>
                        </button>

                        <span className="flex h-[32px] w-[36px] items-center justify-center text-[11px]">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label="Tăng số lượng"
                          onClick={() =>
                            changeQuantity(item.id, item.quantity + 1)
                          }
                          className="flex h-[32px] w-[36px] items-center justify-center"
                        >
                          <span className="text-[18px] leading-none">+</span>
                        </button>
                      </div>

                      {/* XÓA SẢN PHẨM */}
                      <button
                        type="button"
                        aria-label={`Xóa ${item.name}`}
                        onClick={() => removeItem(item.id)}
                        className="absolute right-[7px] top-[77px] flex h-[42px] w-[42px] items-center justify-center"
                      >
                        <span className="text-[34px] font-light leading-none">
                          ×
                        </span>
                      </button>
                    </article>
                  ))}
                </div>
              </div>

              <div className="absolute left-[26px] top-[551px] h-px w-[637px] bg-[#D9D9D9]" />

              <button
                type="button"
                onClick={() => setCart(getCart())}
                className="absolute left-[27px] top-[579px] flex h-[48px] w-[270px] items-center justify-center rounded-[15px] bg-[#6B7D65] text-[24px] text-white"
              >
                CẬP NHẬT ĐƠN HÀNG
              </button>
            </>
          )}
        </section>

        {/* ORDER SUMMARY */}
        <aside className="absolute left-[817px] top-[189px] h-[551px] w-[471px] overflow-hidden rounded-[15px] border-[0.5px] border-[#6B7D65] bg-[#F0F0E5]">
          <div className="flex h-[80px] items-center bg-[#6B7D65] px-[29px]">
            <h2 className="text-[32px] text-white/45">
              TÓM TẮT ĐƠN HÀNG
            </h2>
          </div>

          <div className="relative h-[110px]">
            <div className="absolute left-[30px] top-[8px] h-px w-[412px] bg-[#D9D9D0]" />

            <p className="absolute left-[33px] top-[24px] text-[16px]">
              Tạm tính
            </p>

            <p className="absolute right-[29px] top-[24px] text-[16px]">
              {formatPrice(total)}
            </p>

            <p className="absolute left-[33px] top-[68px] text-[16px]">
              Vận chuyển
            </p>

            <p className="absolute right-[29px] top-[62px] w-[240px] text-right text-[11px] leading-[1.2] text-black/65">
              Phí giao hàng sẽ được chúng tôi thực hiện theo thực tế
            </p>

            <div className="absolute left-[30px] top-[106px] h-px w-[412px] bg-[#AEB1A8]" />
          </div>

          <div className="relative h-[267px]">
            <p className="absolute left-[34px] top-[20px] text-[24px] font-medium">
              Tổng Cộng
            </p>

            <p className="absolute right-[28px] top-[22px] text-[20px] font-medium">
              {formatPrice(total)}
            </p>

            <p className="absolute left-[34px] top-[69px] text-[13px]">
              MÃ GIẢM GIÁ
            </p>

            <div className="absolute left-[34px] top-[105px] flex h-[56px] w-[409px] overflow-hidden rounded-[15px]">
              <input
                type="text"
                placeholder="MÃ GIẢM GIÁ"
                className="h-full flex-1 border-[0.5px] border-[rgba(107,125,101,0.6)] bg-[rgba(107,125,101,0.45)] px-[10px] text-[16px] outline-none placeholder:text-black/45"
              />

              <button
                type="button"
                className="flex h-[56px] w-[108px] items-center justify-center bg-[#6B7D65] text-[24px] text-white"
              >
                ÁP DỤNG
              </button>
            </div>

            <Link
              href="/products"
              className="absolute left-[30px] top-[195px] flex h-[48px] w-[172px] items-center justify-center gap-[8px] rounded-[15px] border-2 border-[#6B7D65] text-[16px]"
            >
              <span className="text-[20px] leading-none">«</span>
              MUA SẮM TIẾP
            </Link>

            {selectedIds.length > 0 ? (
              <Link
                href="/checkout"
                onClick={saveCheckoutSelection}
                className="absolute left-[275px] top-[196px] flex h-[48px] w-[172px] cursor-pointer items-center justify-center rounded-[15px] bg-[#6B7D65] text-[20px] text-white transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
              >
                ĐẶT HÀNG
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="absolute left-[275px] top-[196px] flex h-[48px] w-[172px] cursor-not-allowed items-center justify-center rounded-[15px] bg-[#6B7D65]/45 text-[15px] text-white"
              >
                CHỌN SẢN PHẨM
              </button>
            )}
          </div>

          <div className="absolute bottom-0 left-0 h-[94px] w-full border-t-[0.5px] border-[rgba(107,125,101,0.29)]">
            <p className="absolute left-[34px] top-[10px] text-[13px]">
              PHƯƠNG THỨC THANH TOÁN
            </p>

            <div className="absolute left-[49px] top-[38px] flex w-[372px] justify-between">
              <div className="flex h-[44px] w-[112px] items-center justify-center rounded-[8px] border border-[#DDE0D8] bg-white px-[12px] transition-[border-color,box-shadow] hover:border-[#1A4A9C] hover:shadow-[0_8px_18px_rgba(32,42,29,0.08)]">
                <span
                  role="img"
                  aria-label="Visa"
                  className="block h-[28px] w-[82px] bg-[url('/images/payment-visa.svg')] bg-contain bg-center bg-no-repeat"
                />
              </div>

              <div className="flex h-[44px] w-[112px] items-center justify-center rounded-[8px] border border-[#DDE0D8] bg-white px-[12px] transition-[border-color,box-shadow] hover:border-[#1A4A9C] hover:shadow-[0_8px_18px_rgba(32,42,29,0.08)]">
                <span
                  role="img"
                  aria-label="VNPAY"
                  className="block h-[28px] w-[82px] bg-[url('/images/payment-vnpay.svg')] bg-contain bg-center bg-no-repeat"
                />
              </div>

              <div className="flex h-[44px] w-[112px] items-center justify-center rounded-[8px] border border-[#DDE0D8] bg-white px-[12px] text-[17px] font-medium tracking-[0.04em] transition-[border-color,box-shadow] hover:border-[#1A4A9C] hover:shadow-[0_8px_18px_rgba(32,42,29,0.08)]">
                COD
              </div>
            </div>
          </div>
        </aside>

        {/* DIVIDER */}
        <div className="absolute left-[156px] top-[873px] h-px w-[1152px] bg-[#D9D9D9]" />

        {/* RECOMMENDED TITLE */}
        <section className="absolute left-[167px] top-[945px] h-[48px] w-[436px]">
          <h2 className="absolute right-0 top-[9px] text-[24px] font-medium tracking-normal text-[#739E53]">
            Có Thể Bạn Cũng Thích
          </h2>
        </section>

        {/* RECOMMENDED CARDS */}
        <section className="absolute left-[132px] top-[993px] flex w-[1176px] gap-[32px] py-[20px]">
          {recommendedProducts.map((product) => (
            <article
              key={product.name}
              className="relative h-[466px] w-[270px] shrink-0"
            >
              <div className="h-[338px] w-[270px] overflow-hidden rounded-[15px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="mt-[20px] min-h-[80px] max-w-full overflow-hidden break-words text-[30px] font-medium leading-[1.2] tracking-normal [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                {product.name}
              </h3>

              <p className="mt-[2px] text-[28px] leading-[1.2] line-through">
                {formatPrice(product.oldPrice)}
              </p>

              <p className="text-[28px] leading-[1.2]">
                {formatPrice(product.price)}
              </p>
            </article>
          ))}
        </section>

        {/* FOOTER */}
        <footer
          id="footer"
          className="absolute left-0 top-[1619px] h-[416px] w-[1440px] bg-[#6B7D65] text-white"
        >
          <div className="relative mx-auto h-full w-[1176px]">
            <div className="absolute left-[39px] top-[17px] flex flex-col items-center">
              <div className="flex h-[123px] w-[123px] items-center justify-center rounded-full bg-[#F6F6F6]">
                <img
                  src="/images/logo-hkv.png"
                  alt="HKV"
                  className="h-[111px] w-[111px] object-contain"
                />
              </div>

              <p className="mt-[15px] text-[20px]">FOLLOW US</p>
              <p className="mt-[16px] text-[14px]">
                Instagram - Facebook
              </p>
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
      <div className="xl:hidden">
        <SiteFooter />
      </div>
    </main>
  );
}
