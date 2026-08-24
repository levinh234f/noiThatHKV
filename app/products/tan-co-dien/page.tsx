import StyleProductPage, { type StyleProduct } from "@/components/style-product-page";

const products: StyleProduct[] = [
  ["Giường Uhuhu", "giuong-uhuhu-tan-co-dien", "Giường cao cấp", 18900000],
  ["Ghế ngồi bọc nỉ", "ghe-ngoi-boc-ni-tan-co-dien", "Nỉ cao cấp", 10450000],
  ["Ghế hoàng gia", "ghe-hoang-gia-tan-co-dien", "Bọc da cao cấp", 45800000],
  ["Bàn hoàng gia", "ban-hoang-gia-tan-co-dien", "Gỗ tự nhiên, bọc da cao cấp", 20300000],
  ["Giường Ahaha", "giuong-ahaha-tan-co-dien", "Giường cao cấp", 18900000],
  ["Bộ bàn ghế hơi siêu cấp", "bo-ban-ghe-hoi-sieu-cap-tan-co-dien", "Bàn đá, bọc da cao cấp", 7450000],
  ["Bộ bàn ghế siêu cấp", "bo-ban-ghe-sieu-cap-tan-co-dien", "Gỗ thơm, bọc da cao cấp", 15800000],
  ["Sofa Luna", "sofa-luna-tan-co-dien", "Bọc da cao cấp", 10300000],
  ["Ghế mạ Au", "ghe-ma-au-tan-co-dien", "Ghế cao cấp", 18900000],
  ["Bàn kính", "ban-kinh-tan-co-dien", "Kính chống đạn", 7450000],
  ["Giường SUUU", "giuong-suuu-tan-co-dien", "Nội thất cao cấp", 15800000],
  ["Bàn Long", "ban-long-tan-co-dien", "Đá tự nhiên cao cấp", 20300000],
].map(([name, slug, material, price], index) => ({ name: String(name), slug: String(slug), material: String(material), price: Number(price), image: `/images/tan-co-dien-product-${String(index + 1).padStart(2, "0")}.png` }));

export default function TanCoDienProductsPage() {
  return <StyleProductPage title="Tân Cổ Điển" description="Cân đối, thanh lịch và sang trọng trong từng đường nét. Bộ sưu tập kết hợp tinh thần cổ điển cùng công năng hiện đại." badgeClassName="bg-[#c59c54]" products={products} />;
}

