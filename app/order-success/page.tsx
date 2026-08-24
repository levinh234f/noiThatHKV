import Link from "next/link";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    order?: string;
  }>;
}) {
  const { order } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4EBE7] px-6 text-[#171717]">
      <section className="w-full max-w-[600px] bg-white px-8 py-14 text-center sm:px-14">
        <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#6B7D65] text-white">
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M5 12.5L9.2 16.5L19 6.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="mt-7 text-[13px] uppercase tracking-[2px] text-[#777]">
          HKV Interior
        </p>

        <h1 className="mt-2 text-[30px] font-medium">
          ĐẶT HÀNG THÀNH CÔNG
        </h1>

        <p className="mt-4 text-[15px] leading-7 text-[#666]">
          Cảm ơn bạn đã đặt hàng tại HKV.
          Chúng tôi sẽ liên hệ để xác nhận đơn hàng.
        </p>

        {order && (
          <div className="mt-7 bg-[#F4EBE7] p-5">
            <p className="text-[12px] uppercase tracking-[1px] text-[#777]">
              Mã đơn hàng
            </p>

            <p className="mt-2 text-[20px] font-medium">
              {order}
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/account"
            className="flex h-[50px] items-center justify-center bg-[#6B7D65] text-[14px] font-medium text-white"
          >
            XEM ĐƠN HÀNG
          </Link>

          <Link
            href="/products"
            className="flex h-[50px] items-center justify-center border border-[#6B7D65] text-[14px] font-medium text-[#6B7D65]"
          >
            TIẾP TỤC MUA SẮM
          </Link>
        </div>
      </section>
    </main>
  );
}