"use client";

import { useState } from "react";

type GalleryImage = { id: number; image_url: string; alt_text: string | null; is_primary: boolean | null };

export default function ProductGallery({ images, productName, badge = "Nội thất HKV" }: { images: GalleryImage[]; productName: string; badge?: string }) {
  const initial = Math.max(0, images.findIndex((image) => image.is_primary));
  const [selected, setSelected] = useState(initial);

  if (images.length === 0) {
    return <div className="flex aspect-square items-center justify-center rounded-2xl bg-[#f0ede8] text-sm text-black/45">Chưa có ảnh sản phẩm</div>;
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f5f2ee] p-5 sm:p-8">
        <img src={images[selected].image_url} alt={images[selected].alt_text ?? productName} className="h-full w-full object-contain" />
        <span className="absolute left-4 top-4 rounded-full bg-[#5e7259] px-3 py-1 text-[11px] text-white">{badge}</span>
      </div>
      {images.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto p-1">{images.map((image, index) => <button key={image.id} type="button" onClick={() => setSelected(index)} className={`size-20 shrink-0 overflow-hidden rounded-[14px] bg-[#f5f2ee] p-1.5 transition-opacity sm:size-[108px] ${selected === index ? "ring-2 ring-[#2d6a4f]" : "opacity-60 hover:opacity-100"}`}><img src={image.image_url} alt={image.alt_text ?? `${productName} ${index + 1}`} className="h-full w-full object-contain" /></button>)}</div>}
      <p className="mt-3 rounded-[14px] bg-[#f9fafb] px-4 py-3 text-xs text-[#6a7282]">Hình ảnh sản phẩm · Chọn ảnh nhỏ để xem chi tiết</p>
    </div>
  );
}
