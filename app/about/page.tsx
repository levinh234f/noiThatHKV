import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { Reveal } from "@/components/motion";

export const metadata: Metadata = {
  title: "Về HKV / About HKV",
  description: "Câu chuyện, giá trị và phong cách nội thất của HKV Interior.",
};

const values = [
  {
    title: "Tinh tế",
    text: "HKV ưu tiên đường nét cân bằng, chất liệu chọn lọc và cảm giác sống thanh lịch trong từng sản phẩm.",
  },
  {
    title: "Bền vững",
    text: "Mỗi thiết kế hướng tới giá trị sử dụng lâu dài, dễ kết hợp và đồng hành cùng nhiều nhịp sống khác nhau.",
  },
  {
    title: "Cá nhân hóa",
    text: "Không gian đẹp bắt đầu từ thói quen sống, gu thẩm mỹ và nhu cầu thật của từng gia đình.",
  },
];

const styles = [
  {
    name: "Đông Dương",
    text: "Ấm áp, hoài cổ và giàu bản sắc Á Đông trong tinh thần đương đại.",
    image: "/images/phong-cach-indochine.png",
    href: "/products/dong-duong",
  },
  {
    name: "Hiện Đại",
    text: "Tối giản, thoáng đãng và tập trung vào công năng tinh gọn.",
    image: "/images/phong-cach-hien-dai.png",
    href: "/products/hien-dai",
  },
  {
    name: "Tân Cổ Điển",
    text: "Cân đối, sang trọng và tinh xảo trong từng chi tiết hoàn thiện.",
    image: "/images/phong-cach-neo-classical.png",
    href: "/products/tan-co-dien",
  },
];

const process = [
  "Lắng nghe nhu cầu",
  "Định hình phong cách",
  "Chọn sản phẩm và chất liệu",
  "Hoàn thiện không gian sống",
];

export default function AboutPage() {
  return (
    <main className="bg-[#f6f6f6] text-[#171717]">
      <SiteHeader />

      <section className="mx-auto max-w-[1176px] px-4 pt-6 sm:px-6 lg:pt-8 xl:px-0">
        <div className="relative min-h-[420px] overflow-hidden rounded-[8px] bg-[#dcdad2] sm:min-h-[520px]">
          <Image
            src="/images/products-hero.png"
            alt="Không gian nội thất HKV"
            fill
            priority
            sizes="(min-width: 1280px) 1176px, 100vw"
            className="motion-hero-zoom object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/18 to-transparent" />
          <div className="relative flex min-h-[420px] max-w-[620px] flex-col justify-end px-6 py-10 text-white sm:min-h-[520px] sm:px-10 lg:px-14 lg:py-14">
            <Reveal delay={80}>
              <p className="text-xs uppercase tracking-[0.26em] text-white/80">
                HKV Interior
              </p>
            </Reveal>
            <Reveal delay={160}>
              <h1 className="mt-4 text-[42px] font-semibold leading-none sm:text-[64px] lg:text-[78px]">
                Về HKV
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-5 max-w-[540px] text-[15px] leading-7 text-white/88 sm:text-base">
                HKV kiến tạo nội thất cao cấp cho những không gian sống tinh tế,
                nơi thẩm mỹ, công năng và cảm xúc được đặt trong cùng một nhịp.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1176px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-24 xl:px-0">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b7d65]">
            Câu chuyện HKV
          </p>
          <h2 className="mt-4 max-w-[560px] text-[32px] font-semibold leading-tight sm:text-[44px]">
            Nội thất được chọn để sống lâu cùng ngôi nhà.
          </h2>
        </Reveal>
        <Reveal delay={100} className="space-y-5 text-[15px] leading-7 text-[#5d5d57]">
          <p>
            HKV theo đuổi vẻ đẹp vừa sang trọng vừa gần gũi: những đường nét
            đủ tiết chế để không gian luôn thoáng, nhưng vẫn có chiều sâu qua
            chất liệu, tỷ lệ và điểm nhấn phong cách.
          </p>
          <p>
            Từ phòng khách, phòng ngủ đến các góc sinh hoạt riêng, HKV chọn
            sản phẩm như một phần của tổng thể sống, không chỉ là món đồ đơn lẻ.
          </p>
        </Reveal>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1176px] px-4 py-16 sm:px-6 lg:py-24 xl:px-0">
          <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b7d65]">
                Giá trị thương hiệu
              </p>
              <h2 className="mt-4 text-[30px] font-semibold sm:text-[42px]">
                3 giá trị thương hiệu
              </h2>
            </div>
            <p className="max-w-[420px] text-sm leading-6 text-[#6a6a64]">
              Một tiêu chuẩn thẩm mỹ yên tĩnh, tập trung vào trải nghiệm sống
              thật và giá trị sử dụng dài lâu.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {values.map((value, index) => (
              <Reveal
                key={value.title}
                delay={index * 80}
                className="rounded-[8px] border border-[#e4e3dd] bg-[#fbfbf8] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#6b7d65]/40"
              >
                <span className="text-sm text-[#6b7d65]">
                  0{index + 1}
                </span>
                <h3 className="mt-8 text-2xl font-semibold">{value.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#66665f]">
                  {value.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1176px] px-4 py-16 sm:px-6 lg:py-24 xl:px-0">
        <Reveal className="max-w-[720px]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b7d65]">
            Phong cách HKV
          </p>
          <h2 className="mt-4 text-[30px] font-semibold leading-tight sm:text-[42px]">
            Phong cách Đông Dương / Hiện Đại / Tân Cổ Điển
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {styles.map((style) => (
            <Link
              key={style.name}
              href={style.href}
              className="group overflow-hidden rounded-[8px] bg-white"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#e6e4dc]">
                <Image
                  src={style.image}
                  alt={style.name}
                  width={760}
                  height={570}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <h3 className="text-2xl font-semibold">{style.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[#66665f]">
                  {style.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#ecece7]">
        <div className="mx-auto max-w-[1176px] px-4 py-16 sm:px-6 lg:py-24 xl:px-0">
          <Reveal className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b7d65]">
                Quy trình
              </p>
              <h2 className="mt-4 text-[30px] font-semibold leading-tight sm:text-[42px]">
                Quy trình từ ý tưởng đến không gian sống
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {process.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[8px] border border-white/70 bg-white/72 p-5"
                >
                  <span className="text-xs font-semibold text-[#6b7d65]">
                    Bước {index + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold">{item}</h3>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1176px] px-4 py-16 sm:px-6 lg:py-24 xl:px-0">
        <Reveal className="grid overflow-hidden rounded-[8px] bg-[#6b7d65] text-white lg:grid-cols-[1fr_0.82fr]">
          <div className="p-7 sm:p-10 lg:p-14">
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">
              HKV Collections
            </p>
            <h2 className="mt-4 max-w-[620px] text-[30px] font-semibold leading-tight sm:text-[44px]">
              Khám phá các bộ sưu tập nội thất HKV.
            </h2>
            <p className="mt-5 max-w-[560px] text-sm leading-6 text-white/82">
              Chọn phong cách phù hợp và bắt đầu hoàn thiện không gian sống
              theo cách tinh tế hơn.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#5f7159]"
              >
                Xem sản phẩm
              </Link>
              <Link
                href="/#phong-cach"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/70 px-7 text-sm font-semibold text-white"
              >
                Xem phong cách
              </Link>
            </div>
          </div>
          <Reveal variant="image-mask" className="relative min-h-[260px] lg:min-h-full">
            <Image
              src="/images/phong-cach-indochine.png"
              alt="Không gian Đông Dương"
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
          </Reveal>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
