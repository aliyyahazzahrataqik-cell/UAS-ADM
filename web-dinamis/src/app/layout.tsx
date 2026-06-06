import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import SiteLayout from "@/components/SiteLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "600", "800"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "FloraShop | Toko Bunga Online Terpercaya",
  description: "FloraShop menyediakan berbagai rangkaian bunga segar berkualitas untuk setiap momen spesial Anda. Buket bunga, bunga papan, hand bouquet, dan hamper bunga.",
  keywords: ["toko bunga", "buket bunga", "florist", "bunga papan", "hand bouquet", "rangkaian bunga"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
