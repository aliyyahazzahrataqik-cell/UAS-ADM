import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import SiteLayout from "@/components/SiteLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  title: "Aliyyah | Toko Bunga Online Premium",
  description: "FloraShop menyediakan rangkaian bunga segar berkualitas premium untuk setiap momen spesial Anda. Buket bunga, bunga papan, hand bouquet, dan hamper bunga dengan pengiriman cepat.",
  keywords: ["toko bunga", "buket bunga", "florist", "bunga papan", "hand bouquet", "rangkaian bunga"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
