import type { Metadata } from "next";
import SiteTranslator from "@/components/site-translator";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HKV Interior",
    template: "%s | HKV Interior",
  },
  description: "Nội thất HKV – kiến tạo không gian sống tinh tế.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className="h-full scroll-smooth antialiased">
      <body className="flex min-h-full flex-col">
        <SiteTranslator />
        {children}
      </body>
    </html>
  );
}
