"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { createClient } from "@/lib/supabase/client";
import { getCart, saveCart, type CartItem } from "@/lib/cart";

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("vi-VN").format(price)} đ`;
}

type RequiredField =
  | "fullName"
  | "phone"
  | "province"
  | "ward"
  | "address";

type PaymentMethod = "visa" | "vnpay" | "cod";

const DELIVERY_REQUIRED_FIELDS: RequiredField[] = [
  "fullName",
  "phone",
  "province",
  "ward",
  "address",
];

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("visa");
  const [invalidFields, setInvalidFields] = useState<RequiredField[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      const fullCart = getCart();
      let checkoutCart = fullCart;

      const rawSelection = localStorage.getItem(
        "hkv-checkout-selected-ids"
      );

      if (rawSelection !== null) {
        try {
          const selectedIds = JSON.parse(rawSelection);

          if (Array.isArray(selectedIds)) {
            const selectedSet = new Set(
              selectedIds.map((id) => Number(id))
            );

            checkoutCart = fullCart.filter((item) =>
              selectedSet.has(item.id)
            );
          }
        } catch {
          checkoutCart = fullCart;
        }
      }

      setCart(checkoutCart);
      setLoaded(true);
    });

  }, []);

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const hasFieldError = (field: RequiredField) =>
    invalidFields.includes(field);

  const hasDeliveryError = invalidFields.some((field) =>
    DELIVERY_REQUIRED_FIELDS.includes(field)
  );

  const selectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const clearFieldError = (field: RequiredField) => {
    setInvalidFields((current) =>
      current.filter((item) => item !== field)
    );
  };

  const animateInvalidFields = (
    fields: RequiredField[]
  ) => {
    window.setTimeout(() => {
      fields.forEach((field, index) => {
        const element = document.getElementById(field);

        element?.animate(
          [
            { transform: "translateX(0) scale(1)" },
            { transform: "translateX(-7px) scale(1.01)" },
            { transform: "translateX(6px) scale(1.01)" },
            { transform: "translateX(-4px) scale(1.005)" },
            { transform: "translateX(3px) scale(1.005)" },
            { transform: "translateX(0) scale(1)" },
          ],
          {
            duration: 430,
            delay: index * 28,
            easing: "cubic-bezier(.2,.8,.2,1)",
          }
        );
      });

      document.getElementById(fields[0])?.focus();
    }, 0);
  };

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (cart.length === 0) {
      router.push("/cart");
      return;
    }

    const requiredValues: Record<RequiredField, string> = {
      fullName,
      phone,
      province,
      ward,
      address,
    };

    const missingFields = (
      Object.entries(requiredValues) as [
        RequiredField,
        string
      ][]
    )
      .filter(([, value]) => !value.trim())
      .map(([field]) => field);

    if (missingFields.length > 0) {
      setInvalidFields(missingFields);
      setErrorMessage("");
      setLoading(false);
      animateInvalidFields(missingFields);
      return;
    }

    setInvalidFields([]);
    setErrorMessage("");

    if (paymentMethod === "visa") {
      localStorage.setItem(
        "hkv-visa-checkout",
        JSON.stringify({
          fullName,
          phone,
          email,
          province,
          ward,
          address,
        })
      );
      router.push("/checkout/visa");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setErrorMessage("Bạn cần đăng nhập trước khi đặt hàng.");
      return;
    }

    const shippingAddress = [address, ward, province]
      .map((value) => value.trim())
      .filter(Boolean)
      .join(", ");

    const items = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    const { data, error } = await supabase.rpc("create_order", {
      p_full_name: fullName.trim(),
      p_phone: phone.trim(),
      p_address: shippingAddress,
      p_note: email.trim() ? `Email: ${email.trim()}` : "",
      p_items: items,
    });

    if (error) {
      console.error("Create order error:", error);
      setLoading(false);

      if (error.message.toLowerCase().includes("tồn kho")) {
        setErrorMessage(
          "Một hoặc nhiều sản phẩm không còn đủ số lượng trong kho."
        );
      } else {
        setErrorMessage(
          error.message ||
            "Không thể tạo đơn hàng. Vui lòng thử lại."
        );
      }

      return;
    }

    const fullCart = getCart();
    const purchasedIds = new Set(cart.map((item) => item.id));

    saveCart(
      fullCart.filter((item) => !purchasedIds.has(item.id))
    );

    localStorage.removeItem("hkv-checkout-selected-ids");

    const orderNumber = data?.order_number ?? "";

    router.push(
      `/order-success?order=${encodeURIComponent(orderNumber)}`
    );
    router.refresh();
  }

  if (!loaded) {
    return null;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F6F6F6] text-black">
      <SiteHeader />
      <style>{`
        @keyframes hkvValidationIn {
          0% {
            opacity: 0;
            transform: translateY(-8px) scale(0.985);
          }
          55% {
            opacity: 1;
            transform: translateY(2px) scale(1.005);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      <section className="mx-auto w-full max-w-3xl px-4 py-7 sm:px-6 xl:hidden">
        <div className="border-b border-[#E0E0D8] pb-4">
          <h1 className="text-2xl font-medium sm:text-3xl">Địa Chỉ Giao Hàng</h1>
        </div>

        {cart.length === 0 ? (
          <section className="mt-6 rounded-[15px] bg-[#F0F0E5] px-5 py-14 text-center">
            <h2 className="text-xl">Chưa có sản phẩm được chọn</h2>
            <p className="mt-3 text-sm text-black/60">
              Quay lại giỏ hàng và chọn sản phẩm bạn muốn đặt.
            </p>
            <Link href="/cart" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[15px] border-2 border-[#6B7D65] px-5 text-sm">
              QUAY LẠI GIỎ HÀNG
            </Link>
          </section>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-5">
            <section className="rounded-[15px] bg-[#F0F0E5] p-4 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="fullNameMobile" className="mb-2 block text-xs">Họ và tên <span className="text-[#FF0606]">*</span></label>
                  <input
                    id="fullNameMobile"
                    type="text"
                    value={fullName}
                    onChange={(event) => {
                      setFullName(event.target.value);
                      if (event.target.value.trim()) clearFieldError("fullName");
                    }}
                    aria-invalid={hasFieldError("fullName")}
                    placeholder="Nhập họ tên"
                    className={`min-h-12 w-full rounded-[15px] border bg-transparent px-3 text-base outline-none placeholder:text-black/50 ${
                      hasFieldError("fullName") ? "border-[rgba(178,0,0,0.65)] bg-[#FFF8F7]" : "border-[rgba(107,125,101,0.65)]"
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="phoneMobile" className="mb-2 block text-xs">Số điện thoại <span className="text-[#FF0606]">*</span></label>
                  <input
                    id="phoneMobile"
                    type="tel"
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);
                      if (event.target.value.trim()) clearFieldError("phone");
                    }}
                    aria-invalid={hasFieldError("phone")}
                    placeholder="Nhập số điện thoại"
                    className={`min-h-12 w-full rounded-[15px] border bg-transparent px-3 text-base outline-none placeholder:text-black/50 ${
                      hasFieldError("phone") ? "border-[rgba(178,0,0,0.65)] bg-[#FFF8F7]" : "border-[rgba(107,125,101,0.65)]"
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="emailMobile" className="mb-2 block text-xs">Địa chỉ email (tùy chọn)</label>
                  <input id="emailMobile" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Nhập email" className="min-h-12 w-full rounded-[15px] border border-[rgba(107,125,101,0.65)] bg-transparent px-3 text-base outline-none placeholder:text-black/50" />
                </div>
                <div>
                  <label htmlFor="provinceMobile" className="mb-2 block text-xs">Tỉnh/thành phố <span className="text-[#FF0606]">*</span></label>
                  <input
                    id="provinceMobile"
                    type="text"
                    value={province}
                    onChange={(event) => {
                      setProvince(event.target.value);
                      if (event.target.value.trim()) clearFieldError("province");
                    }}
                    aria-invalid={hasFieldError("province")}
                    placeholder="Chọn tỉnh/thành phố"
                    className={`min-h-12 w-full rounded-[15px] border bg-transparent px-3 text-base outline-none placeholder:text-black/50 ${
                      hasFieldError("province") ? "border-[rgba(178,0,0,0.65)] bg-[#FFF8F7]" : "border-[rgba(107,125,101,0.65)]"
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="wardMobile" className="mb-2 block text-xs">Phường/xã <span className="text-[#FF0606]">*</span></label>
                  <input
                    id="wardMobile"
                    type="text"
                    value={ward}
                    onChange={(event) => {
                      setWard(event.target.value);
                      if (event.target.value.trim()) clearFieldError("ward");
                    }}
                    aria-invalid={hasFieldError("ward")}
                    placeholder="Chọn phường/xã"
                    className={`min-h-12 w-full rounded-[15px] border bg-transparent px-3 text-base outline-none placeholder:text-black/50 ${
                      hasFieldError("ward") ? "border-[rgba(178,0,0,0.65)] bg-[#FFF8F7]" : "border-[rgba(107,125,101,0.65)]"
                    }`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="addressMobile" className="mb-2 block text-xs">Địa chỉ <span className="text-[#FF0606]">*</span></label>
                  <input
                    id="addressMobile"
                    type="text"
                    value={address}
                    onChange={(event) => {
                      setAddress(event.target.value);
                      if (event.target.value.trim()) clearFieldError("address");
                    }}
                    aria-invalid={hasFieldError("address")}
                    placeholder="Nhập địa chỉ"
                    className={`min-h-12 w-full rounded-[15px] border bg-transparent px-3 text-base outline-none placeholder:text-black/50 ${
                      hasFieldError("address") ? "border-[rgba(178,0,0,0.65)] bg-[#FFF8F7]" : "border-[rgba(107,125,101,0.65)]"
                    }`}
                  />
                </div>
              </div>

              {hasDeliveryError && (
                <p role="alert" className="mt-4 text-sm text-[#FF0000]">
                  Vui lòng điền đầy đủ thông tin vào các mục có dấu *
                </p>
              )}
              {!hasDeliveryError && errorMessage && (
                <div className="mt-4 rounded-[12px] border border-[#E4B4AD] bg-[#FFF4F2] px-4 py-3">
                  <p role="alert" className="text-sm text-[#B42318]">{errorMessage}</p>
                  {errorMessage.includes("đăng nhập") && (
                    <Link href="/login" className="mt-2 inline-block text-sm font-medium underline underline-offset-4">Đăng nhập ngay</Link>
                  )}
                </div>
              )}
            </section>

            <aside className="rounded-[15px] border border-[#6B7D65] bg-[#F0F0E5]">
              <div className="bg-[#6B7D65] px-5 py-4">
                <h2 className="text-xl text-white/65">TÓM TẮT ĐƠN HÀNG</h2>
              </div>
              <div className="space-y-4 p-5 text-sm">
                <div className="flex justify-between gap-4"><span>Tạm tính</span><span>{formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between gap-4"><span>Vận chuyển</span><span className="max-w-[210px] text-right text-xs text-black/65">Phí giao hàng sẽ được chúng tôi thực hiện theo thực tế</span></div>
                <div className="border-t border-[#AEB1A8] pt-4">
                  <div className="flex justify-between gap-4 text-lg font-medium"><span>Tổng Cộng</span><span>{formatPrice(totalPrice)}</span></div>
                </div>
                <div className="flex overflow-hidden rounded-[15px]">
                  <input type="text" placeholder="MÃ GIẢM GIÁ" className="min-h-12 min-w-0 flex-1 border border-[rgba(107,125,101,0.6)] bg-[rgba(107,125,101,0.25)] px-3 text-sm outline-none" />
                  <button type="button" className="min-h-12 shrink-0 bg-[#6B7D65] px-4 text-sm text-white">ÁP DỤNG</button>
                </div>
                <div>
                  <p className="text-xs">PHƯƠNG THỨC THANH TOÁN</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {(["visa", "vnpay", "cod"] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => selectPaymentMethod(method)}
                        className={`flex min-h-12 items-center justify-center rounded-[8px] border bg-white px-2 text-sm font-medium ${
                          paymentMethod === method ? "border-[#1A4A9C] bg-[#F7F3EA]" : "border-[#DDE0D8]"
                        }`}
                      >
                        {method === "visa" ? <span role="img" aria-label="Visa" className="block h-7 w-full bg-[url('/images/payment-visa.svg')] bg-contain bg-center bg-no-repeat" /> : method === "vnpay" ? <span role="img" aria-label="VNPAY" className="block h-7 w-full bg-[url('/images/payment-vnpay.svg')] bg-contain bg-center bg-no-repeat" /> : "COD"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/products" className="flex min-h-12 flex-1 items-center justify-center rounded-[15px] border-2 border-[#6B7D65] text-sm">MUA SẮM TIẾP</Link>
                  <button type="submit" disabled={loading} className="min-h-12 flex-1 rounded-[15px] bg-[#6B7D65] text-sm text-white disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG"}
                  </button>
                </div>
              </div>
            </aside>
          </form>
        )}
      </section>

      <div className="relative mx-auto hidden min-h-[1556px] w-[1440px] bg-[#F6F6F6] xl:block">
        <section className="absolute left-[132px] top-[163px] h-[130px] w-[1176px]">
          <h1 className="absolute left-0 top-[65px] text-[32px] leading-normal whitespace-nowrap">
            Địa Chỉ Giao Hàng
          </h1>
          <div className="absolute bottom-0 left-0 h-px w-full bg-[#E0E0D8]" />
        </section>

        {cart.length === 0 ? (
          <section className="absolute left-[132px] top-[317px] flex h-[551px] w-[1176px] flex-col items-center justify-center rounded-[15px] bg-[#F0F0E5] text-center">
            <h2 className="text-[28px]">Chưa có sản phẩm được chọn</h2>
            <p className="mt-3 text-[14px] text-black/60">
              Quay lại giỏ hàng và chọn sản phẩm bạn muốn đặt.
            </p>
            <Link
              href="/cart"
              className="mt-7 flex h-[48px] w-[190px] items-center justify-center rounded-[15px] border-2 border-[#6B7D65] transition-transform duration-150 hover:scale-[1.03] active:scale-95"
            >
              QUAY LẠI GIỎ HÀNG
            </Link>
          </section>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="contents">
            <section className="absolute left-[132px] top-[317px] h-[551px] w-[672px] rounded-[15px] bg-[#F0F0E5]">
              <label
                htmlFor="fullName"
                className="absolute left-0 top-[25px] text-[11px]"
              >
                Họ và tên <span className="text-[8px] text-[#FF0606]">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  if (event.target.value.trim()) {
                    clearFieldError("fullName");
                  }
                }}
                aria-invalid={hasFieldError("fullName")}
                placeholder="Nhập họ tên"
                className={`absolute left-0 top-[44px] h-[48px] w-[672px] rounded-[15px] border bg-transparent px-[10px] text-[24px] outline-none placeholder:text-black/50 transition-[border-color,background-color,box-shadow] duration-200 ${
                  hasFieldError("fullName")
                    ? "border-[rgba(178,0,0,0.65)] bg-[#FFF8F7] shadow-[0_0_0_2px_rgba(178,0,0,0.05)] focus:border-[#B20000]"
                    : "border-[rgba(107,125,101,0.65)] focus:border-[#6B7D65]"
                }`}
              />

              <label
                htmlFor="phone"
                className="absolute left-0 top-[129px] text-[11px]"
              >
                Số điện thoại <span className="text-[8px] text-[#FF0606]">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  if (event.target.value.trim()) {
                    clearFieldError("phone");
                  }
                }}
                aria-invalid={hasFieldError("phone")}
                placeholder="Nhập số điện thoại"
                className={`absolute left-0 top-[148px] h-[48px] w-[372px] rounded-[15px] border bg-transparent px-[10px] text-[20px] outline-none placeholder:text-black/50 transition-[border-color,background-color,box-shadow] duration-200 ${
                  hasFieldError("phone")
                    ? "border-[rgba(178,0,0,0.65)] bg-[#FFF8F7] shadow-[0_0_0_2px_rgba(178,0,0,0.05)] focus:border-[#B20000]"
                    : "border-[rgba(107,125,101,0.65)] focus:border-[#6B7D65]"
                }`}
              />

              <label
                htmlFor="email"
                className="absolute left-[403px] top-[129px] text-[11px]"
              >
                Địa chỉ email (tùy chọn)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Nhập email"
                className="absolute left-[403px] top-[148px] h-[48px] w-[269px] rounded-[15px] border border-[rgba(107,125,101,0.65)] bg-transparent px-[10px] text-[20px] outline-none placeholder:text-black/50 focus:border-[#6B7D65]"
              />

              <label
                htmlFor="province"
                className="absolute left-0 top-[234px] text-[11px]"
              >
                Tỉnh/thành phố <span className="text-[8px] text-[#FF0606]">*</span>
              </label>
              <input
                id="province"
                type="text"
                value={province}
                onChange={(event) => {
                  setProvince(event.target.value);
                  if (event.target.value.trim()) {
                    clearFieldError("province");
                  }
                }}
                aria-invalid={hasFieldError("province")}
                placeholder="Chọn tỉnh/thành phố"
                className={`absolute left-0 top-[252px] h-[48px] w-[372px] rounded-[15px] border bg-transparent px-[10px] text-[20px] outline-none placeholder:text-black/50 transition-[border-color,background-color,box-shadow] duration-200 ${
                  hasFieldError("province")
                    ? "border-[rgba(178,0,0,0.65)] bg-[#FFF8F7] shadow-[0_0_0_2px_rgba(178,0,0,0.05)] focus:border-[#B20000]"
                    : "border-[rgba(107,125,101,0.65)] focus:border-[#6B7D65]"
                }`}
              />

              <label
                htmlFor="ward"
                className="absolute left-[403px] top-[234px] text-[11px]"
              >
                Phường/xã <span className="text-[8px] text-[#FF0606]">*</span>
              </label>
              <input
                id="ward"
                type="text"
                value={ward}
                onChange={(event) => {
                  setWard(event.target.value);
                  if (event.target.value.trim()) {
                    clearFieldError("ward");
                  }
                }}
                aria-invalid={hasFieldError("ward")}
                placeholder="Chọn phường/xã"
                className={`absolute left-[403px] top-[252px] h-[48px] w-[269px] rounded-[15px] border bg-transparent px-[10px] text-[20px] outline-none placeholder:text-black/50 transition-[border-color,background-color,box-shadow] duration-200 ${
                  hasFieldError("ward")
                    ? "border-[rgba(178,0,0,0.65)] bg-[#FFF8F7] shadow-[0_0_0_2px_rgba(178,0,0,0.05)] focus:border-[#B20000]"
                    : "border-[rgba(107,125,101,0.65)] focus:border-[#6B7D65]"
                }`}
              />

              <label
                htmlFor="address"
                className="absolute left-0 top-[337px] text-[11px]"
              >
                Địa chỉ <span className="text-[8px] text-[#FF0606]">*</span>
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(event) => {
                  setAddress(event.target.value);
                  if (event.target.value.trim()) {
                    clearFieldError("address");
                  }
                }}
                aria-invalid={hasFieldError("address")}
                placeholder="Nhập địa chỉ"
                className={`absolute left-0 top-[356px] h-[48px] w-[672px] rounded-[15px] border bg-transparent px-[10px] text-[24px] outline-none placeholder:text-black/50 transition-[border-color,background-color,box-shadow] duration-200 ${
                  hasFieldError("address")
                    ? "border-[rgba(178,0,0,0.65)] bg-[#FFF8F7] shadow-[0_0_0_2px_rgba(178,0,0,0.05)] focus:border-[#B20000]"
                    : "border-[rgba(107,125,101,0.65)] focus:border-[#6B7D65]"
                }`}
              />

              {hasDeliveryError ? (
                <p
                  role="alert"
                  className="absolute left-[10px] top-[430px] text-[16px] text-[#FF0000]"
                  style={{
                    animation:
                      "hkvValidationIn 320ms cubic-bezier(.2,.8,.2,1) both",
                  }}
                >
                  Vui lòng điền đầy đủ thông tin vào các mục có dấu *
                </p>
              ) : (
                errorMessage && (
                  <div
                    className="absolute left-0 top-[430px] w-[672px] rounded-[12px] border border-[#E4B4AD] bg-[#FFF4F2] px-4 py-3"
                    style={{
                      animation:
                        "hkvValidationIn 320ms cubic-bezier(.2,.8,.2,1) both",
                    }}
                  >
                    <p role="alert" className="text-[13px] text-[#B42318]">
                      {errorMessage}
                    </p>

                    {errorMessage.includes("đăng nhập") && (
                      <Link
                        href="/login"
                        className="mt-2 inline-block text-[13px] font-medium underline underline-offset-4"
                      >
                        Đăng nhập ngay
                      </Link>
                    )}
                  </div>
                )
              )}
            </section>

            <aside className="absolute left-[837px] top-[317px] h-[551px] w-[471px] overflow-hidden rounded-[15px] border-[0.5px] border-[#6B7D65] bg-[#F0F0E5]">
              <div className="relative h-[80px] w-full bg-[#6B7D65]">
                <h2 className="absolute left-[29px] top-[23px] text-[32px] leading-[1.2] text-white/45 whitespace-nowrap">
                  TÓM TẮT ĐƠN HÀNG
                </h2>
              </div>

              <div className="relative h-[110px] w-full">
                <div className="absolute left-[30px] top-[8px] h-px w-[412px] bg-[#D9D9D0]" />

                <p className="absolute left-[33px] top-[24px] text-[16px]">
                  Tạm tính
                </p>
                <p className="absolute right-[29px] top-[24px] text-[16px]">
                  {formatPrice(totalPrice)}
                </p>

                <p className="absolute left-[33px] top-[68px] text-[16px]">
                  Vận chuyển
                </p>
                <p className="absolute right-[29px] top-[62px] w-[240px] text-right text-[11px] leading-[1.2] text-black/65">
                  Phí giao hàng sẽ được chúng tôi thực hiện theo thực tế
                </p>

                <div className="absolute left-[30px] top-[106px] h-px w-[412px] bg-[#AEB1A8]" />
              </div>

              <div className="relative h-[267px] w-full">
                <p className="absolute left-[34px] top-[20px] text-[24px] font-medium">
                  Tổng Cộng
                </p>
                <p className="absolute right-[28px] top-[22px] text-[20px] font-medium">
                  {formatPrice(totalPrice)}
                </p>

                <p className="absolute left-[34px] top-[69px] text-[13px]">
                  MÃ GIẢM GIÁ
                </p>

                <div className="absolute left-[34px] top-[105px] flex h-[56px] w-[409px] overflow-hidden rounded-[15px]">
                  <input
                    type="text"
                    placeholder="MA GIAM GIA"
                    className="h-full flex-1 border-[0.5px] border-[rgba(107,125,101,0.6)] bg-[rgba(107,125,101,0.45)] px-[10px] text-[16px] outline-none placeholder:text-black/45"
                  />
                  <button
                    type="button"
                    className="flex h-[56px] w-[108px] cursor-pointer items-center justify-center bg-[#6B7D65] text-[24px] text-white transition-transform duration-150 hover:scale-[1.03] active:scale-95"
                  >
                    ÁP DỤNG
                  </button>
                </div>

                <Link
                  href="/products"
                  className="absolute left-[34px] top-[198px] flex h-[48px] w-[172px] items-center justify-center gap-[8px] rounded-[15px] border-2 border-[#6B7D65] text-[16px] transition-transform duration-150 hover:scale-[1.03] active:scale-95"
                >
                  <span className="text-[20px] leading-none">«</span>
                  MUA SẮM TIẾP
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="absolute left-[279px] top-[199px] flex h-[48px] w-[172px] cursor-pointer items-center justify-center rounded-[15px] bg-[#6B7D65] text-[20px] text-white transition-transform duration-150 hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG"}
                </button>
              </div>

              <div className="absolute bottom-0 left-0 h-[94px] w-full border-t-[0.5px] border-[rgba(107,125,101,0.29)]">
                <p className="absolute left-[34px] top-[10px] text-[13px]">
                  PHƯƠNG THỨC THANH TOÁN
                </p>

                <div className="absolute left-[49px] top-[38px] flex w-[372px] justify-between">
                  <button
                    type="button"
                    onClick={() => selectPaymentMethod("visa")}
                    className={`flex h-[44px] w-[112px] cursor-pointer items-center justify-center rounded-[8px] border bg-white px-[12px] transition-[border-color,background-color,box-shadow] hover:shadow-[0_8px_18px_rgba(32,42,29,0.08)] ${
                      paymentMethod === "visa"
                        ? "border-[#1A4A9C] bg-[#F7F3EA]"
                        : "border-[#DDE0D8]"
                    }`}
                  >
                    <span
                      role="img"
                      aria-label="Visa"
                      className="block h-[28px] w-[82px] bg-[url('/images/payment-visa.svg')] bg-contain bg-center bg-no-repeat"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => selectPaymentMethod("vnpay")}
                    className={`flex h-[44px] w-[112px] cursor-pointer items-center justify-center rounded-[8px] border bg-white px-[12px] transition-[border-color,background-color,box-shadow] hover:shadow-[0_8px_18px_rgba(32,42,29,0.08)] ${
                      paymentMethod === "vnpay"
                        ? "border-[#1A4A9C] bg-[#F7F3EA]"
                        : "border-[#DDE0D8]"
                    }`}
                  >
                    <span
                      role="img"
                      aria-label="VNPAY"
                      className="block h-[28px] w-[82px] bg-[url('/images/payment-vnpay.svg')] bg-contain bg-center bg-no-repeat"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => selectPaymentMethod("cod")}
                    className={`flex h-[44px] w-[112px] cursor-pointer items-center justify-center rounded-[8px] border bg-white px-[12px] text-[17px] font-medium tracking-[0.04em] transition-[border-color,background-color,box-shadow] hover:shadow-[0_8px_18px_rgba(32,42,29,0.08)] ${
                      paymentMethod === "cod"
                        ? "border-[#1A4A9C] bg-[#F7F3EA]"
                        : "border-[#DDE0D8]"
                    }`}
                  >
                    COD
                  </button>
                </div>
              </div>
            </aside>
          </form>
        )}

        <footer
          id="footer"
          className="absolute left-0 top-[1140px] h-[416px] w-[1440px] bg-[#6B7D65] text-white"
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
      <div className="xl:hidden">
        <SiteFooter />
      </div>
    </main>
  );
}
