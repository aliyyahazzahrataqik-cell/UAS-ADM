import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="logo">FloraShop</Link>
          <p className="footer-tagline">Rangkaian Bunga Segar & Eksklusif</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Menu Utama</h4>
            <Link href="/#hero">Beranda</Link>
            <Link href="/#categories">Kategori Bunga</Link>
            <Link href="/produk">Katalog Produk</Link>
            <Link href="/#promo">Promo Spesial</Link>
          </div>
          <div className="footer-col">
            <h4>Kategori Populer</h4>
            <span>Buket Bunga (Hand Bouquet)</span>
            <span>Bunga Papan (Steekwerk)</span>
            <span>Bunga Meja (Vase Arrangement)</span>
            <span>Hamper & Parsel Bunga</span>
          </div>
          <div className="footer-col">
            <h4>Hubungi Kami</h4>
            <span>halo@florashop.com</span>
            <span>+62 812 3456 7890</span>
            <span>Jl. Bunga Raya No. 1, Jakarta</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FloraShop. Semua hak dilindungi undang-undang.</p>
        <p className="footer-credit">Website Toko Bunga Eksklusif</p>
      </div>
    </footer>
  );
}
