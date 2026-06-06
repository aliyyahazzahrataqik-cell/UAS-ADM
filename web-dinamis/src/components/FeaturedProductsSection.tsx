"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  discount_price: string | null;
  short_desc: string;
  category_name: string;
  primary_image: string | null;
}

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?featured=1&limit=4")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(price));
  };

  return (
    <section id="featured" className="vision">
      <div className="vision-flex" style={{ flexDirection: "column", gap: "2rem" }}>
        <div style={{ textAlign: "center", width: "100%" }}>
          <span className="hero-tagline">Koleksi Spesial</span>
          <h2 className="section-title">
            Produk <span className="text-gradient">Pilihan</span>
          </h2>
          <p className="section-subtitle" style={{ marginBottom: "2rem" }}>
            Rangkaian bunga terpopuler yang dirangkai khusus oleh florist profesional kami
          </p>
        </div>

        {loading ? (
          <div className="products-grid">
            {[1, 2, 3, 4].map((i) => (
              <div className="card product-card" key={i}>
                <div className="skeleton skeleton--img"></div>
                <div className="skeleton skeleton--title"></div>
                <div className="skeleton skeleton--text"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, i) => (
              <Link href={`/produk/${product.slug}`} className="card product-card" key={product.id} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="product-card__img">
                  {product.primary_image ? (
                    <img src={product.primary_image} alt={product.name} loading="lazy" />
                  ) : (
                    <span className="product-card__placeholder">🌸</span>
                  )}
                </div>
                <div className="product-card__body">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <span className="product-card__category">{product.category_name}</span>
                    {product.discount_price && <span className="product-card__badge">PROMO</span>}
                  </div>
                  <h3 className="product-card__name">{product.name}</h3>
                  <p className="product-card__desc">{product.short_desc}</p>
                  <div className="product-card__price-row">
                    <span className="product-card__price">
                      {formatPrice(product.discount_price || product.price)}
                    </span>
                    {product.discount_price && (
                      <span className="product-card__price--old">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div style={{ textAlign: "center", marginTop: "2rem", width: "100%" }}>
          <Link href="/produk" className="cta-button cta-button--gold">
            LIHAT SEMUA PRODUK
          </Link>
        </div>
      </div>
    </section>
  );
}
