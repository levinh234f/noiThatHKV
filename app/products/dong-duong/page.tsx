import StyleProductPage, { type StyleProduct } from "@/components/style-product-page";

const products: StyleProduct[] = [
  ["Giường cao cấp", "giuong-cao-cap-dong-duong", "Gỗ tự nhiên", 24900000],
  ["Ghế Mây Đông Dương", "ghe-may-dong-duong", "Ghế mây tự nhiên", 6490000],
  ["Giường cao cấp Laura", "giuong-cao-cap-laura-dong-duong", "Đan mây kết hợp gỗ tự nhiên", 27800000],
  ["Giường Victoria", "giuong-victoria-dong-duong-01", "Gỗ tự nhiên, bọc nỉ cao cấp", 20300000],
  ["Giường Á", "giuong-a-dong-duong", "Gỗ hương tự nhiên", 18900000],
  ["Ghế da", "ghe-da-dong-duong", "Da tự nhiên", 7450000],
  ["Kệ TiDi", "ke-tidi-dong-duong", "Gỗ sồi tự nhiên", 9800000],
  ["Giường Victoria", "giuong-victoria-dong-duong-02", "Gỗ tự nhiên, bọc nỉ cao cấp", 20300000],
  ["Bàn gỗ", "ban-go-dong-duong", "Gỗ cao cấp", 18900000],
  ["Ghế cao cấp", "ghe-cao-cap-dong-duong-01", "Bọc nỉ cao cấp", 4450000],
  ["Ghế cao cấp", "ghe-cao-cap-dong-duong-02", "Gỗ sồi tự nhiên", 15800000],
  ["Giường Victoria", "giuong-victoria-dong-duong-03", "Gỗ tự nhiên, bọc nỉ cao cấp", 20300000],
].map(([name, slug, material, price], index) => ({ name: String(name), slug: String(slug), material: String(material), price: Number(price), image: `/images/dong-duong-product-${String(index + 1).padStart(2, "0")}.png` }));

export default function DongDuongProductsPage() {
  return <StyleProductPage title="Đông Dương" description="Bản sắc Á Đông trong tinh thần đương đại, nổi bật với gỗ, mây và bảng màu ấm tạo nên không gian sang trọng, gần gũi." badgeClassName="bg-[#5e7259]" products={products} />;
}

