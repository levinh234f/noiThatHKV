HKV - PUBLIC IMAGE BUNDLE

Mục tiêu:
- Không còn dùng link ảnh tạm của Figma trong trang /products.
- Trang /articles/tan-co-dien cũng dùng ảnh local /public/images.
- Sau khi deploy, ảnh đi cùng website và không phụ thuộc Figma.

Cách dùng:
1) Giải nén bundle vào thư mục project noi-that-web.
2) Copy:
   app/products/page.tsx
   app/articles/tan-co-dien/page.tsx
   download-all-images-to-public.ps1
3) Mở PowerShell tại thư mục gốc project:
   C:\Users\GIGABYTE\noi-that-web
4) Chạy:
   powershell -ExecutionPolicy Bypass -File .\download-all-images-to-public.ps1
5) Kiểm tra public\images đã có các file mới.
6) Chạy:
   npx tsc --noEmit
7) npm run dev

Lưu ý:
- Script tải ảnh Figma một lần vào public/images.
- Sau khi tải xong, code chỉ dùng /images/... nên link Figma hết hạn cũng không ảnh hưởng.
