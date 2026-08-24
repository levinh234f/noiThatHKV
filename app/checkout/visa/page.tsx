"use client";

import Link from "next/link";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getCart, saveCart, type CartItem } from "@/lib/cart";
import { createClient } from "@/lib/supabase/client";

type PendingCheckout = {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  ward: string;
  address: string;
};

type PaymentField =
  | "cardNumber"
  | "cardType"
  | "expiryMonth"
  | "expiryYear"
  | "cvv"
  | "billingAddress"
  | "billingDistrict"
  | "billingProvince"
  | "billingPostalCode"
  | "billingCountry";

const CHECKOUT_KEY = "hkv-visa-checkout";

function getCheckoutCart() {
  const fullCart = getCart();
  const rawSelection = localStorage.getItem("hkv-checkout-selected-ids");

  if (rawSelection === null) {
    return fullCart;
  }

  try {
    const selectedIds = JSON.parse(rawSelection);

    if (!Array.isArray(selectedIds)) {
      return fullCart;
    }

    const selectedSet = new Set(selectedIds.map((id) => Number(id)));

    return fullCart.filter((item) => selectedSet.has(item.id));
  } catch {
    return fullCart;
  }
}

export default function VisaPaymentPage() {
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pendingCheckout, setPendingCheckout] =
    useState<PendingCheckout | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("visa");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingDistrict, setBillingDistrict] = useState("");
  const [billingProvince, setBillingProvince] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingCountry, setBillingCountry] = useState("");
  const [invalidFields, setInvalidFields] = useState<PaymentField[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      const checkoutCart = getCheckoutCart();
      const rawCheckout = localStorage.getItem(CHECKOUT_KEY);

      if (!rawCheckout) {
        router.push("/checkout");
        return;
      }

      try {
        const parsedCheckout = JSON.parse(rawCheckout) as PendingCheckout;

        if (checkoutCart.length === 0) {
          router.push("/cart");
          return;
        }

        setCart(checkoutCart);
        setPendingCheckout(parsedCheckout);
        setLoaded(true);
      } catch {
        router.push("/checkout");
      }
    });
  }, [router]);

  const hasFieldError = (field: PaymentField) =>
    invalidFields.includes(field);

  const clearFieldError = (field: PaymentField) => {
    setInvalidFields((current) =>
      current.filter((item) => item !== field)
    );
  };

  const fieldClass = (field: PaymentField) =>
    hasFieldError(field)
      ? "border-[rgba(178,0,0,0.65)] bg-[#FFF8F7] shadow-[0_0_0_2px_rgba(178,0,0,0.05)] focus:border-[#B20000]"
      : "border-[rgba(107,125,101,0.65)] focus:border-[#6B7D65]";

  const animateInvalidFields = (fields: PaymentField[]) => {
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!pendingCheckout) {
      router.push("/checkout");
      return;
    }

    const requiredValues: Record<PaymentField, string> = {
      cardNumber,
      cardType,
      expiryMonth,
      expiryYear,
      cvv,
      billingAddress,
      billingDistrict,
      billingProvince,
      billingPostalCode,
      billingCountry,
    };

    const missingFields = (
      Object.entries(requiredValues) as [PaymentField, string][]
    )
      .filter(([, value]) => !value.trim())
      .map(([field]) => field);

    const cardNumberDigits = cardNumber.replace(/\D/g, "");
    const cvvDigits = cvv.replace(/\D/g, "");
    const invalidPaymentFields: PaymentField[] = [];

    if (cardNumber.trim() && cardNumberDigits.length !== 16) {
      invalidPaymentFields.push("cardNumber");
    }

    if (cvv.trim() && cvvDigits.length !== 3) {
      invalidPaymentFields.push("cvv");
    }

    const invalidFormFields = Array.from(
      new Set([...missingFields, ...invalidPaymentFields])
    );

    if (invalidFormFields.length > 0) {
      setInvalidFields(invalidFormFields);
      setErrorMessage("");
      setLoading(false);
      animateInvalidFields(invalidFormFields);
      return;
    }

    setInvalidFields([]);
    setErrorMessage("");
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

    const shippingAddress = [
      pendingCheckout.address,
      pendingCheckout.ward,
      pendingCheckout.province,
    ]
      .map((value) => value.trim())
      .filter(Boolean)
      .join(", ");

    const items = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    const { data, error } = await supabase.rpc("create_order", {
      p_full_name: pendingCheckout.fullName.trim(),
      p_phone: pendingCheckout.phone.trim(),
      p_address: shippingAddress,
      p_note: pendingCheckout.email.trim()
        ? `Email: ${pendingCheckout.email.trim()}`
        : "",
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
    localStorage.removeItem(CHECKOUT_KEY);

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
        <form onSubmit={handleSubmit} noValidate className="rounded-[15px] border border-[rgba(107,125,101,0.65)] bg-white p-4 sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#E0E0D8] pb-5">
            <div>
              <p className="text-xs uppercase tracking-[1.8px] text-[#6B7D65]">VISA</p>
              <h1 className="mt-2 text-2xl font-medium">Thanh toán thẻ</h1>
            </div>
            <span role="img" aria-label="Visa" className="mt-1 block h-10 w-24 shrink-0 bg-[url('/images/payment-visa.svg')] bg-contain bg-center bg-no-repeat" />
          </div>

          <div className="grid gap-4">
            <div>
              <label htmlFor="cardNumberMobile" className="mb-2 block text-sm">Số thẻ:</label>
              <input
                id="cardNumberMobile"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={cardNumber}
                onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, "").slice(0, 16);
                  setCardNumber(digits);
                  if (digits.length === 16) clearFieldError("cardNumber");
                }}
                aria-invalid={hasFieldError("cardNumber")}
                className={`min-h-11 w-full rounded-[10px] border bg-white px-3 text-base outline-none ${fieldClass("cardNumber")}`}
              />
            </div>

            <div>
              <label htmlFor="cardTypeMobile" className="mb-2 block text-sm">Loại thẻ:</label>
              <div
                id="cardTypeMobile"
                className={`flex h-10 w-full max-w-[220px] items-center justify-between rounded-[6px] border border-dashed px-3 ${
                  hasFieldError("cardType") ? "border-[rgba(178,0,0,0.65)] bg-[#FFF8F7]" : "border-[#B995FF] bg-white"
                }`}
              >
                {[
                  { type: "visa", label: "Visa", logo: "/images/payment-visa.svg", size: "h-[16px] w-[42px]" },
                  { type: "mastercard", label: "Mastercard", logo: "/images/payment-mastercard.svg", size: "h-[22px] w-[42px]" },
                  { type: "amex", label: "American Express", logo: "/images/payment-amex.svg", size: "h-[22px] w-[42px]" },
                ].map(({ type, label, logo, size }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setCardType(type);
                      clearFieldError("cardType");
                    }}
                    aria-label={label}
                    className={`flex h-7 w-[54px] items-center justify-center rounded-[4px] ${cardType === type ? "bg-[#F7F3EA]" : "bg-transparent"}`}
                  >
                    <span role="img" aria-label={label} className={`block ${size} bg-contain bg-center bg-no-repeat`} style={{ backgroundImage: `url(${logo})` }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 sm:max-w-sm">
              <div>
                <label htmlFor="expiryMonthMobile" className="mb-2 block text-sm">Tháng</label>
                <select
                  id="expiryMonthMobile"
                  value={expiryMonth}
                  onChange={(event) => {
                    setExpiryMonth(event.target.value);
                    if (event.target.value) clearFieldError("expiryMonth");
                  }}
                  aria-invalid={hasFieldError("expiryMonth")}
                  className={`min-h-11 w-full rounded-[10px] border bg-white px-3 text-base outline-none ${fieldClass("expiryMonth")}`}
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, index) => {
                    const month = String(index + 1).padStart(2, "0");
                    return <option key={month} value={month}>{month}</option>;
                  })}
                </select>
              </div>
              <span className="pb-3 text-xl">/</span>
              <div>
                <label htmlFor="expiryYearMobile" className="mb-2 block text-sm">Năm</label>
                <select
                  id="expiryYearMobile"
                  value={expiryYear}
                  onChange={(event) => {
                    setExpiryYear(event.target.value);
                    if (event.target.value) clearFieldError("expiryYear");
                  }}
                  aria-invalid={hasFieldError("expiryYear")}
                  className={`min-h-11 w-full rounded-[10px] border bg-white px-3 text-base outline-none ${fieldClass("expiryYear")}`}
                >
                  <option value="">YYYY</option>
                  {Array.from({ length: 12 }, (_, index) => {
                    const year = String(new Date().getFullYear() + index);
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
            </div>

            <div className="sm:max-w-[180px]">
              <label htmlFor="cvvMobile" className="mb-2 block text-sm">Mã số bảo mật:</label>
              <input
                id="cvvMobile"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                value={cvv}
                onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, "").slice(0, 3);
                  setCvv(digits);
                  if (digits.length === 3) clearFieldError("cvv");
                }}
                aria-invalid={hasFieldError("cvv")}
                className={`min-h-11 w-full rounded-[10px] border bg-white px-3 text-base outline-none ${fieldClass("cvv")}`}
              />
            </div>
          </div>

          <h2 className="mt-8 text-lg font-medium">Địa chỉ hóa đơn</h2>
          <div className="mt-4 grid gap-4">
            {[
              ["billingAddress", "Địa chỉ:", billingAddress, setBillingAddress],
              ["billingDistrict", "Quận/huyện:", billingDistrict, setBillingDistrict],
              ["billingProvince", "Tỉnh/thành phố:", billingProvince, setBillingProvince],
              ["billingPostalCode", "Mã bưu điện:", billingPostalCode, setBillingPostalCode],
            ].map(([field, label, value, setter]) => (
              <div key={String(field)}>
                <label htmlFor={`${field}Mobile`} className="mb-2 block text-sm">{String(label)}</label>
                <input
                  id={`${field}Mobile`}
                  type="text"
                  value={String(value)}
                  onChange={(event) => {
                    (setter as Dispatch<SetStateAction<string>>)(event.target.value);
                    if (event.target.value.trim()) clearFieldError(field as PaymentField);
                  }}
                  aria-invalid={hasFieldError(field as PaymentField)}
                  className={`min-h-11 w-full rounded-[10px] border bg-white px-3 text-base outline-none ${fieldClass(field as PaymentField)}`}
                />
              </div>
            ))}
            <div>
              <label htmlFor="billingCountryMobile" className="mb-2 block text-sm">Quốc gia:</label>
              <select
                id="billingCountryMobile"
                value={billingCountry}
                onChange={(event) => {
                  setBillingCountry(event.target.value);
                  if (event.target.value) clearFieldError("billingCountry");
                }}
                aria-invalid={hasFieldError("billingCountry")}
                className={`min-h-11 w-full rounded-[10px] border bg-white px-3 text-base outline-none ${fieldClass("billingCountry")}`}
              >
                <option value="">--Chọn quốc gia--</option>
                <option value="Việt Nam">Việt Nam</option>
                <option value="United States">United States</option>
                <option value="Singapore">Singapore</option>
                <option value="Japan">Japan</option>
              </select>
            </div>
          </div>

          {invalidFields.length > 0 && (
            <p role="alert" className="mt-5 text-sm leading-relaxed text-[#FF0000]">
              Vui lòng kiểm tra thông tin thanh toán demo. Số thẻ gồm 16 chữ số, CVV gồm 3 chữ số.
            </p>
          )}
          {errorMessage && (
            <div className="mt-5 rounded-[12px] border border-[#E4B4AD] bg-[#FFF4F2] px-4 py-3">
              <p role="alert" className="text-sm text-[#B42318]">{errorMessage}</p>
              {errorMessage.includes("đăng nhập") && (
                <Link href="/login" className="mt-2 inline-block text-sm font-medium underline underline-offset-4">Đăng nhập ngay</Link>
              )}
            </div>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Link href="/checkout" className="flex min-h-12 items-center justify-center rounded-[15px] border-2 border-[#6B7D65] px-5 text-sm">QUAY LẠI</Link>
            <button type="submit" disabled={loading} className="min-h-12 rounded-[15px] bg-[#6B7D65] px-5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN THANH TOÁN"}
            </button>
          </div>
        </form>
      </section>

      <div className="relative mx-auto hidden min-h-[1776px] w-[1440px] bg-[#F6F6F6] xl:block">
        <form onSubmit={handleSubmit} noValidate className="contents">
          <section className="absolute left-[330px] top-[170px] h-[1040px] w-[780px] rounded-[15px] border-[0.5px] border-[rgba(107,125,101,0.65)] bg-white px-[36px] py-[42px]">
            <div className="mb-[34px] flex items-start justify-between border-b border-[#E0E0D8] pb-[22px]">
              <div>
                <p className="text-[13px] uppercase tracking-[1.8px] text-[#6B7D65]">
                  VISA
                </p>
                <h1 className="mt-[8px] text-[30px] font-medium">
                  Thanh toán thẻ
                </h1>
              </div>
              <span
                role="img"
                aria-label="Visa"
                className="mt-[6px] block h-[42px] w-[128px] bg-[url('/images/payment-visa.svg')] bg-contain bg-center bg-no-repeat"
              />
            </div>

            <div className="grid grid-cols-[190px_1fr] items-center gap-x-[34px] gap-y-[26px]">
              <label htmlFor="cardNumber" className="text-[18px]">
                Số thẻ:
              </label>
              <input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={cardNumber}
                onChange={(event) => {
                  const digits = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 16);

                  setCardNumber(digits);
                  if (digits.length === 16) {
                    clearFieldError("cardNumber");
                  }
                }}
                aria-invalid={hasFieldError("cardNumber")}
                className={`h-[42px] w-[360px] rounded-[10px] border bg-white px-[12px] text-[18px] outline-none transition-[border-color,background-color,box-shadow] duration-200 ${fieldClass(
                  "cardNumber"
                )}`}
              />

              <label htmlFor="cardType" className="text-[18px]">
                Loại thẻ:
              </label>
              <div
                id="cardType"
                className={`flex h-[36px] w-[188px] items-center justify-between rounded-[6px] border border-dashed px-[11px] transition-[border-color,background-color,box-shadow] duration-200 ${
                  hasFieldError("cardType")
                    ? "border-[rgba(178,0,0,0.65)] bg-[#FFF8F7] shadow-[0_0_0_2px_rgba(178,0,0,0.05)]"
                    : "border-[#B995FF] bg-white"
                }`}
              >
                {[
                  {
                    type: "visa",
                    label: "Visa",
                    logo: "/images/payment-visa.svg",
                    size: "h-[16px] w-[42px]",
                  },
                  {
                    type: "mastercard",
                    label: "Mastercard",
                    logo: "/images/payment-mastercard.svg",
                    size: "h-[22px] w-[42px]",
                  },
                  {
                    type: "amex",
                    label: "American Express",
                    logo: "/images/payment-amex.svg",
                    size: "h-[22px] w-[42px]",
                  },
                ].map(({ type, label, logo, size }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setCardType(type);
                      clearFieldError("cardType");
                    }}
                    aria-label={label}
                    className={`flex h-[26px] w-[50px] cursor-pointer items-center justify-center rounded-[4px] transition-colors ${
                      cardType === type
                        ? "bg-[#F7F3EA]"
                        : "bg-transparent hover:bg-[#F8F5F0]"
                    }`}
                  >
                    <span
                      role="img"
                      aria-label={label}
                      className={`block ${size} bg-contain bg-center bg-no-repeat`}
                      style={{ backgroundImage: `url(${logo})` }}
                    />
                  </button>
                ))}
              </div>

              <label className="text-[18px]">Ngày hết hạn:</label>
              <div className="flex items-center gap-[12px]">
                <select
                  id="expiryMonth"
                  value={expiryMonth}
                  onChange={(event) => {
                    setExpiryMonth(event.target.value);
                    if (event.target.value) {
                      clearFieldError("expiryMonth");
                    }
                  }}
                  aria-invalid={hasFieldError("expiryMonth")}
                  className={`h-[42px] w-[132px] rounded-[10px] border bg-white px-[10px] text-[16px] outline-none transition-[border-color,background-color,box-shadow] duration-200 ${fieldClass(
                    "expiryMonth"
                  )}`}
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, index) => {
                    const month = String(index + 1).padStart(2, "0");

                    return (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    );
                  })}
                </select>
                <span className="text-[20px]">/</span>
                <select
                  id="expiryYear"
                  value={expiryYear}
                  onChange={(event) => {
                    setExpiryYear(event.target.value);
                    if (event.target.value) {
                      clearFieldError("expiryYear");
                    }
                  }}
                  aria-invalid={hasFieldError("expiryYear")}
                  className={`h-[42px] w-[132px] rounded-[10px] border bg-white px-[10px] text-[16px] outline-none transition-[border-color,background-color,box-shadow] duration-200 ${fieldClass(
                    "expiryYear"
                  )}`}
                >
                  <option value="">YYYY</option>
                  {Array.from({ length: 12 }, (_, index) => {
                    const year = String(new Date().getFullYear() + index);

                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <label htmlFor="cvv" className="text-[18px]">
                Mã số bảo mật:
              </label>
              <input
                id="cvv"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                value={cvv}
                onChange={(event) => {
                  const digits = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 3);

                  setCvv(digits);
                  if (digits.length === 3) {
                    clearFieldError("cvv");
                  }
                }}
                aria-invalid={hasFieldError("cvv")}
                className={`h-[42px] w-[132px] rounded-[10px] border bg-white px-[12px] text-[18px] outline-none transition-[border-color,background-color,box-shadow] duration-200 ${fieldClass(
                  "cvv"
                )}`}
              />
            </div>

            <h2 className="mt-[42px] text-[20px] font-medium">
              Địa chỉ hóa đơn
            </h2>

            <div className="mt-[28px] grid grid-cols-[190px_1fr] items-center gap-x-[34px] gap-y-[26px]">
              <label htmlFor="billingAddress" className="text-[18px]">
                Địa chỉ:
              </label>
              <input
                id="billingAddress"
                type="text"
                value={billingAddress}
                onChange={(event) => {
                  setBillingAddress(event.target.value);
                  if (event.target.value.trim()) {
                    clearFieldError("billingAddress");
                  }
                }}
                aria-invalid={hasFieldError("billingAddress")}
                className={`h-[42px] w-[500px] rounded-[10px] border bg-white px-[12px] text-[16px] outline-none transition-[border-color,background-color,box-shadow] duration-200 ${fieldClass(
                  "billingAddress"
                )}`}
              />

              <label htmlFor="billingDistrict" className="text-[18px]">
                Quận/huyện:
              </label>
              <input
                id="billingDistrict"
                type="text"
                value={billingDistrict}
                onChange={(event) => {
                  setBillingDistrict(event.target.value);
                  if (event.target.value.trim()) {
                    clearFieldError("billingDistrict");
                  }
                }}
                aria-invalid={hasFieldError("billingDistrict")}
                className={`h-[42px] w-[500px] rounded-[10px] border bg-white px-[12px] text-[16px] outline-none transition-[border-color,background-color,box-shadow] duration-200 ${fieldClass(
                  "billingDistrict"
                )}`}
              />

              <label htmlFor="billingProvince" className="text-[18px]">
                Tỉnh/thành phố:
              </label>
              <input
                id="billingProvince"
                type="text"
                value={billingProvince}
                onChange={(event) => {
                  setBillingProvince(event.target.value);
                  if (event.target.value.trim()) {
                    clearFieldError("billingProvince");
                  }
                }}
                aria-invalid={hasFieldError("billingProvince")}
                className={`h-[42px] w-[500px] rounded-[10px] border bg-white px-[12px] text-[16px] outline-none transition-[border-color,background-color,box-shadow] duration-200 ${fieldClass(
                  "billingProvince"
                )}`}
              />

              <label htmlFor="billingPostalCode" className="text-[18px]">
                Mã bưu điện:
              </label>
              <input
                id="billingPostalCode"
                type="text"
                value={billingPostalCode}
                onChange={(event) => {
                  setBillingPostalCode(event.target.value);
                  if (event.target.value.trim()) {
                    clearFieldError("billingPostalCode");
                  }
                }}
                aria-invalid={hasFieldError("billingPostalCode")}
                className={`h-[42px] w-[300px] rounded-[10px] border bg-white px-[12px] text-[16px] outline-none transition-[border-color,background-color,box-shadow] duration-200 ${fieldClass(
                  "billingPostalCode"
                )}`}
              />

              <label htmlFor="billingCountry" className="text-[18px]">
                Quốc gia:
              </label>
              <select
                id="billingCountry"
                value={billingCountry}
                onChange={(event) => {
                  setBillingCountry(event.target.value);
                  if (event.target.value) {
                    clearFieldError("billingCountry");
                  }
                }}
                aria-invalid={hasFieldError("billingCountry")}
                className={`h-[42px] w-[300px] rounded-[10px] border bg-white px-[10px] text-[16px] outline-none transition-[border-color,background-color,box-shadow] duration-200 ${fieldClass(
                  "billingCountry"
                )}`}
              >
                <option value="">--Chọn quốc gia--</option>
                <option value="Việt Nam">Việt Nam</option>
                <option value="United States">United States</option>
                <option value="Singapore">Singapore</option>
                <option value="Japan">Japan</option>
              </select>
            </div>

            {invalidFields.length > 0 && (
              <p
                role="alert"
                className="mt-[26px] text-[14px] leading-[1.45] text-[#FF0000]"
                style={{
                  animation:
                    "hkvValidationIn 320ms cubic-bezier(.2,.8,.2,1) both",
                }}
              >
                Vui lòng kiểm tra thông tin thanh toán demo. Số thẻ gồm 16 chữ số, CVV gồm 3 chữ số.
              </p>
            )}

            {errorMessage && (
              <div
                className="mt-[24px] rounded-[12px] border border-[#E4B4AD] bg-[#FFF4F2] px-4 py-3"
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
            )}

            <div className="mt-[34px] flex items-center justify-between">
              <Link
                href="/checkout"
                className="flex h-[48px] w-[172px] items-center justify-center rounded-[15px] border-2 border-[#6B7D65] text-[16px] transition-transform duration-150 hover:scale-[1.03] active:scale-95"
              >
                QUAY LẠI
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex h-[48px] w-[240px] cursor-pointer items-center justify-center rounded-[15px] bg-[#6B7D65] text-[18px] text-white transition-transform duration-150 hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN THANH TOÁN"}
              </button>
            </div>
          </section>
        </form>

        <footer
          id="footer"
          className="absolute left-0 top-[1360px] h-[416px] w-[1440px] bg-[#6B7D65] text-white"
        >
          <div className="relative mx-auto h-full w-[1176px]">
            <div className="absolute left-[39px] top-[17px] flex flex-col items-center">
              <div className="flex h-[123px] w-[123px] items-center justify-center rounded-full bg-[#F6F6F6]">
                <span
                  role="img"
                  aria-label="HKV"
                  className="block h-[111px] w-[111px] bg-[url('/images/logo-hkv.png')] bg-contain bg-center bg-no-repeat"
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
                <span
                  key={partner}
                  role="img"
                  aria-label={`Đối tác ${index + 1}`}
                  className="h-[30px] w-[100px] bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${partner})` }}
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
