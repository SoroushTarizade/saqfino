import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سقفینو | خرید، فروش و اجاره ملک",
  description: "سقفینو؛ پلتفرم جستجو، خرید، فروش و اجاره ملک",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}