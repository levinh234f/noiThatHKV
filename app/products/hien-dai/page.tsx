import StyleProductPage, { type StyleProduct } from "@/components/style-product-page";

const products: StyleProduct[] = [
  ["Giường Elara", "giuong-elara-hien-dai", "Đệm cao cấp", 18900000],
  ["Ghế lười bọc nỉ", "ghe-luoi-boc-ni-hien-dai", "Nỉ cao cấp", 10450000],
  ["Bộ bàn ghế ăn", "bo-ban-ghe-an-hien-dai-01", "Gỗ sồi tự nhiên", 15800000],
  ["Bộ bàn ghế ăn", "bo-ban-ghe-an-hien-dai-02", "Gỗ tự nhiên, bọc da cao cấp", 20300000],
  ["Sofa Mimini", "sofa-mimini-hien-dai", "Sofa cao cấp", 18900000],
  ["Sofa hiện đại", "sofa-hien-dai-01", "Sofa cao cấp", 7450000],
  ["Sofa Luna", "sofa-luna-hien-dai", "Gỗ sồi tự nhiên", 15800000],
  ["Cầu tuột trẻ em", "cau-tuot-tre-em-hien-dai", "Thiết kế an toàn", 80300000],
  ["Sofa Lara", "sofa-lara-hien-dai", "Sofa cao cấp", 18900000],
  ["Giường hiện đại", "giuong-hien-dai-01", "Êm ái, thoải mái", 7450000],
  ["Ghế lông cao cấp", "ghe-long-cao-cap-hien-dai", "Lông cừu tự nhiên", 15800000],
  ["Bàn đá cao cấp", "ban-da-cao-cap-hien-dai", "Đá tự nhiên, thiết kế cao cấp", 20300000],
].map(([name, slug, material, price], index) => ({ name: String(name), slug: String(slug), material: String(material), price: Number(price), image: `/images/hien-dai-product-${String(index + 1).padStart(2, "0")}.png` }));

export default function HienDaiProductsPage() {
  return <StyleProductPage title="Hiện Đại" description="Tối giản, tiện nghi và phù hợp với nhịp sống đương đại. Từng sản phẩm tập trung vào công năng và vẻ đẹp gọn gàng." badgeClassName="bg-[#857868]" products={products} />;
}

