import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { Reveal } from "@/components/motion";

const saleProducts = [
  { name: "Kệ TiDi", slug: "ke-tidi-dong-duong", oldPrice: "4.000.000 đ", price: "2.500.000 đ", image: "/images/dong-duong-product-07.png" },
  { name: "Bàn gỗ", slug: "ban-go-dong-duong", oldPrice: "6.900.000 đ", price: "6.490.000 đ", image: "/images/dong-duong-product-09.png" },
  { name: "Giường ngủ HKV", slug: "giuong-ngu-hkv", oldPrice: "40.000.000 đ", price: "37.500.000 đ", image: "/images/giuong-indochine.png" },
  { name: "Ghế cao cấp", slug: "ghe-cao-cap-dong-duong-01", oldPrice: "10.000.000 đ", price: "8.850.000 đ", image: "/images/dong-duong-product-10.png" },
];

const bestSellers = [
  { name: "Sofa hiện đại", slug: "sofa-hien-dai-01", price: "7.450.000 đ", image: "/images/hien-dai-product-06.png" },
  { name: "Giường Victoria", slug: "giuong-victoria", price: "18.900.000 đ", image: "/images/product-bed-victoria.png" },
  { name: "Bàn Ăn Luna", slug: "ban-an-luna", price: "15.800.000 đ", image: "/images/product-table-luna.png" },
  { name: "Bàn đá cao cấp", slug: "ban-da-cao-cap-hien-dai", price: "20.300.000 đ", image: "/images/hien-dai-product-12.png" },
];

const styles = [
  { name: "Phong cách Hiện Đại", image: "/images/phong-cach-hien-dai.png", description: "Sự tối giản và tiện nghi được thể hiện trọn vẹn trong phong cách hiện đại. Với đường nét gọn gàng, bố cục tinh tế cùng chất liệu đa dạng, phong cách này mang đến không gian sống thoáng đãng, thanh lịch và đầy cuốn hút.", href: "/articles/hien-dai" },
  { name: "Phong cách Đông Dương", image: "/images/phong-cach-indochine.png", description: "Sự thanh lịch và tinh tế là nét đặc trưng nổi bật của phong cách Đông Dương. Vẻ đẹp lãng mạn của kiến trúc Pháp hòa cùng bản sắc Á Đông, chất liệu tự nhiên và gam màu ấm.", href: "/articles/dong-duong" },
  { name: "Phong cách Tân Cổ Điển", image: "/images/phong-cach-neo-classical.png", description: "Sự sang trọng và đẳng cấp được thể hiện trọn vẹn trong phong cách Tân Cổ Điển. Những đường nét cân đối, chi tiết tinh xảo và chất liệu cao cấp tạo nên không gian thanh lịch.", href: "/articles/tan-co-dien" },
];

function HomeProductCard({ product }: { product: { name: string; slug: string; price: string; image: string; oldPrice?: string } }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block min-w-0 transition-transform duration-300 hover:-translate-y-0.5">
      <div className="aspect-[270/338] overflow-hidden rounded-[15px] bg-[#ecebe7]">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      <h3 className="mt-4 truncate text-[20px] font-medium leading-[1.2] sm:text-[24px] xl:text-[28px]">{product.name}</h3>
      {product.oldPrice && <p className="mt-2 text-[16px] leading-[1.2] text-black/60 line-through sm:text-xl xl:text-2xl">{product.oldPrice}</p>}
      <p className={`${product.oldPrice ? "mt-1" : "mt-2"} text-[16px] leading-[1.2] sm:text-xl xl:text-2xl`}>{product.price}</p>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#f6f6f6] text-black">
      <SiteHeader overlayHeroId="home-hero" />
      <section id="home-hero" className="h-[100svh] w-screen overflow-hidden">
        <img src="/images/hero-bedroom.png" alt="Phòng ngủ HKV" className="motion-hero-zoom h-full w-full object-cover" />
      </section>

      <div className="mx-auto max-w-[1176px] px-5 py-16 sm:px-8 lg:py-[74px] xl:px-0">
        <section id="san-pham">
          <span id="discounted-products" className="block scroll-mt-[110px]" />
          <Reveal>
            <h2 className="mb-6 text-[27px] font-bold leading-[1.2] sm:text-4xl lg:text-[40px]">SẢN PHẨM GIẢM GIÁ</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-8">
            {saleProducts.map((product) => <HomeProductCard key={product.name} product={product} />)}
          </div>
        </section>

        <section id="bo-suu-tap" className="mt-20 lg:mt-[143px]">
          <Reveal>
            <h2 className="mb-6 text-[27px] font-bold leading-[1.2] sm:text-4xl lg:text-[40px]">SẢN PHẨM BÁN CHẠY</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-8">
            {bestSellers.map((product) => <HomeProductCard key={product.name} product={product} />)}
          </div>
        </section>

        <section id="phong-cach" className="mt-20 space-y-12 lg:mt-[130px] lg:space-y-[59px]">
          {styles.map((style, index) => (
            <Reveal key={style.name} delay={index * 70}>
              <article className="grid items-center gap-7 lg:grid-cols-2 lg:gap-8">
              <Reveal variant="parallax" className={`group overflow-hidden rounded-[15px] ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <img src={style.image} alt={style.name} className="motion-parallax-target h-[260px] w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-[320px] lg:h-[286px]" />
              </Reveal>
              <div className={`flex flex-col items-start ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <h3 className="text-[25px] font-medium leading-[1.2] sm:text-[30px] lg:text-[33px]">{style.name}</h3>
                <p className="mt-4 text-sm leading-6 sm:text-base">{style.description}</p>
                <Link href={style.href} className="mt-6 flex h-[46px] min-w-[169px] items-center justify-center rounded-[15px] border-2 border-[#6b7d65] px-6 text-[17px] font-medium text-[#6b7d65] transition-colors hover:bg-[#6b7d65] hover:text-white">Xem thêm</Link>
              </div>
            </article>
            </Reveal>
          ))}
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
