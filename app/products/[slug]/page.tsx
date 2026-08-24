import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/product-gallery";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import { getProductImage } from "@/lib/product-images";
import AddToCartButton from "./add-to-cart-button";

function formatPrice(price: number | null) {
  if (price === null) return "Liên hệ";
  return `${new Intl.NumberFormat("vi-VN").format(price)} đ`;
}

const salePriceBySlug: Record<string, { original: number; discounted: number }> = {
  "ke-tidi-dong-duong": { original: 4000000, discounted: 2500000 },
  "ban-go-dong-duong": { original: 6900000, discounted: 6490000 },
  "giuong-ngu-hkv": { original: 40000000, discounted: 37500000 },
  "ghe-cao-cap-dong-duong-01": { original: 10000000, discounted: 8850000 },
};

function getProductCollection(slug: string) {
  if (slug.endsWith("-dong-duong")) {
    return {
      label: "Bộ sưu tập Đông Dương",
      href: "/products/dong-duong",
    };
  }

  if (slug.endsWith("-hien-dai")) {
    return {
      label: "Bộ sưu tập Hiện Đại",
      href: "/products/hien-dai",
    };
  }

  if (slug.endsWith("-tan-co-dien")) {
    return {
      label: "Bộ sưu tập Tân Cổ Điển",
      href: "/products/tan-co-dien",
    };
  }

  if (slug === "giuong-ngu-hkv") {
    return {
      label: "Bộ sưu tập Đông Dương",
      href: "/products/dong-duong",
    };
  }

  return null;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product, error } = await supabase.from("products").select("id,name,slug,short_description,description,price,sale_price,sku,material,dimensions,color,stock,featured").eq("slug", slug).maybeSingle();

  if (error) console.error("Product detail error:", error);
  if (!product) notFound();

  const { data: storedImages } = await supabase.from("product_images").select("id,image_url,alt_text,sort_order,is_primary").eq("product_id", product.id).order("sort_order", { ascending: true });
  const images = storedImages?.length
    ? storedImages
    : [{ id: -product.id, image_url: getProductImage(product.slug) || "/images/product-sofa-elara.png", alt_text: product.name, sort_order: 0, is_primary: true }];
  const collection = getProductCollection(product.slug);
  const promotion = salePriceBySlug[product.slug];
  const hasDbSale = product.sale_price !== null && Number(product.sale_price) < Number(product.price);
  const hasSale = Boolean(promotion) || hasDbSale;
  const originalPrice = promotion?.original ?? Number(product.price);
  const displayPrice = promotion?.discounted ?? Number(hasDbSale ? product.sale_price : product.price);
  const detailLabel = collection?.label ?? (product.featured ? "Sản phẩm nổi bật" : "Nội thất HKV");

  return (
    <main className="bg-[#f6f6f6] text-[#101828]">
      <SiteHeader />
      <section className="mx-auto max-w-[1152px] px-4 py-8 sm:px-6 lg:py-12 xl:px-0">
        <nav className="mb-6 flex flex-wrap gap-2 text-xs text-black/45" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link><span>/</span><Link href="/products">Sản phẩm</Link>{collection && <><span>/</span><Link href={collection.href}>{collection.label}</Link></>}<span>/</span><span className="text-black/70">{product.name}</span>
        </nav>

        <div className="grid gap-9 lg:grid-cols-2 lg:gap-10">
          <ProductGallery images={images} productName={product.name} badge={detailLabel} />

          <div className="lg:pt-1">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6b7d65]">{detailLabel}</p>
            <h1 className="mt-3 text-[30px] font-bold leading-tight tracking-[-0.01em] sm:text-4xl">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs"><span className="text-[#f5b301]">★★★★★</span><span className="text-black/35">4.9 · 248 đánh giá</span><span className="text-black/20">|</span><span className={product.stock > 0 ? "text-[#2d6a4f]" : "text-[#b42318]"}>{product.stock > 0 ? "Còn hàng" : "Hết hàng"}</span></div>

            <div className="mt-6 flex items-end gap-3">{hasSale && <p className="pb-1 text-sm text-black/40 line-through">{formatPrice(originalPrice)}</p>}<p className="text-[28px] font-bold text-black">{formatPrice(displayPrice)}</p></div>
            {product.short_description && <p className="mt-4 text-sm leading-6 text-[#6a7282]">{product.short_description}</p>}

            <div className="mt-7 space-y-5 text-sm">
              {product.color && <div><span className="font-medium">Màu sắc:</span><span className="ml-2 text-[#99a1af]">{product.color}</span><span className="mt-2 block size-7 rounded-full border border-black/10 bg-[#efe4cc]" /></div>}
              {product.material && <div><span className="font-medium">Chất liệu:</span><span className="ml-2 text-[#99a1af]">{product.material}</span><div className="mt-2 inline-flex rounded-[14px] bg-[#101828] px-4 py-2 text-xs text-white">Cao cấp</div></div>}
              <div className="flex flex-col gap-2 rounded-[14px] border border-[#f3f4f6] bg-[#f9fafb] px-4 py-3 text-xs text-[#6a7282] sm:flex-row sm:items-center sm:justify-between sm:gap-4"><span>{product.dimensions || "Kích thước theo tiêu chuẩn HKV"}</span><span className="shrink-0 underline">Thông số đầy đủ</span></div>
            </div>

            <AddToCartButton product={{ id: product.id, name: product.name, slug: product.slug, price: displayPrice, stock: product.stock }} />

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[['⌁','Miễn phí giao','Toàn quốc'],['↻','Đổi trả 30 ngày','Miễn phí'],['♢','Bảo hành 3 năm','Toàn bộ sản phẩm']].map(([icon, title, text]) => <div key={title} className="rounded-[14px] bg-[#f9fafb] p-3 text-center"><span className="text-[#6b7d65]">{icon}</span><p className="mt-1 text-[11px] font-medium sm:text-xs">{title}</p><p className="mt-1 text-[10px] text-[#99a1af] sm:text-[11px]">{text}</p></div>)}
            </div>

            <div className="mt-5 space-y-1 border-t border-[#f0f0ed] pt-4">
              {[['Chăm sóc & Bảo quản','Lau bằng khăn mềm, tránh hóa chất có tính ăn mòn.'],['Vận chuyển & Lắp ráp','HKV hỗ trợ vận chuyển và lắp ráp theo khu vực.'],['Chất liệu & Xuất xứ',product.material || 'Vật liệu tuyển chọn theo tiêu chuẩn HKV.']].map(([title, content]) => <details key={title} className="rounded-[14px] border border-[#f0f0ed] bg-white px-4 py-3 text-sm"><summary className="cursor-pointer list-none font-medium">{title}<span className="float-right text-black/35">⌄</span></summary><p className="mt-3 text-xs leading-5 text-[#6a7282]">{content}</p></details>)}
            </div>
          </div>
        </div>

        {product.description && <section className="mt-12 rounded-2xl bg-white p-6 sm:p-9"><p className="text-xs uppercase tracking-[0.18em] text-[#6b7d65]">Chi tiết sản phẩm</p><h2 className="mt-2 text-2xl font-medium">Mô tả</h2><p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#6a7282]">{product.description}</p></section>}
      </section>
      <SiteFooter />
    </main>
  );
}
