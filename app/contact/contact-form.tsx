"use client";

import { FormEvent, useState } from "react";

const inputClass =
  "h-[54px] w-full rounded-[8px] border border-[#d9d9d4] bg-[#fbfbf8] px-4 text-[15px] text-[#171717] outline-none transition placeholder:text-[#9a9a94] focus:border-[#6b7d65] focus:bg-white focus:ring-4 focus:ring-[#6b7d65]/10";

const textareaClass =
  "min-h-[150px] w-full resize-y rounded-[8px] border border-[#d9d9d4] bg-[#fbfbf8] px-4 py-3 text-[15px] text-[#171717] outline-none transition placeholder:text-[#9a9a94] focus:border-[#6b7d65] focus:bg-white focus:ring-4 focus:ring-[#6b7d65]/10";

type FormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const hasMissingField = Object.values(form).some(
      (value) => value.trim().length === 0
    );

    if (hasMissingField) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin liên hệ.");
      return;
    }

    setSuccessMessage(
      "Cảm ơn bạn đã gửi thông tin. HKV sẽ phản hồi trong thời gian sớm nhất."
    );
    setForm(initialState);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-[13px] font-semibold uppercase text-[#555]"
          >
            Họ và tên
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Nhập họ tên"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-[13px] font-semibold uppercase text-[#555]"
          >
            Số điện thoại
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="Nhập số điện thoại"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-[13px] font-semibold uppercase text-[#555]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="Nhập email"
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-[13px] font-semibold uppercase text-[#555]"
        >
          Lời nhắn
        </label>
        <textarea
          id="message"
          required
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Chia sẻ nhu cầu nội thất của bạn"
          className={textareaClass}
        />
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-[8px] border border-[#f0c6c0] bg-[#fff4f2] px-4 py-3 text-sm leading-6 text-[#B42318]"
        >
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p className="rounded-[8px] border border-[#cdd9c8] bg-[#f2f6ef] px-4 py-3 text-sm leading-6 text-[#4D6847]">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        className="inline-flex h-[54px] w-full items-center justify-center rounded-full bg-[#6b7d65] px-7 text-[15px] font-semibold text-white transition hover:bg-[#596b54] sm:w-auto"
      >
        Gửi liên hệ
      </button>
    </form>
  );
}
