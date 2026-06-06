import Link from "next/link";
import { query } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const products = await query<any>(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.slug = ? AND p.is_active = 1 LIMIT 1`,
    [slug]
  );

  if (!products || products.length === 0) {
    notFound();
  }

  const product = products[0];

  const images = await query<any>(
    "SELECT id, image_url, alt_text FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC",
    [product.id]
  );

  const primaryImage = images.length > 0 ? images[0].image_url : null;

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(price));
  };

  // WhatsApp link format for ordering
  const phoneNumber = "6281234567890";
  const message = `Halo FloraShop, saya ingin memesan: %0A*${product.name}* %0AURL: https://florashop.com/produk/${product.slug}`;
  const waLink = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <section className="product-detail">
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 5%", marginBottom: "2rem" }}>
        <Link href="/produk" style={{ color: "var(--text-dim)", textDecoration: "none", fontSize: "0.9rem" }}>
          &larr; Kembali ke Katalog
        </Link>
      </div>

      <div className="product-detail__grid">
        <div className="product-detail__image">
          {primaryImage ? (
            <img src={primaryImage} alt={product.name} />
          ) : (
            <span style={{ fontSize: "6rem", opacity: 0.3 }}>🌸</span>
          )}
        </div>

        <div className="product-detail__info">
          <Link href={`/kategori/${product.category_slug}`} className="product-detail__category-badge" style={{ textDecoration: "none" }}>
            {product.category_name}
          </Link>
          
          <h1 className="product-detail__title">{product.name}</h1>
          
          <div>
            <div className="product-detail__price">
              {formatPrice(product.discount_price || product.price)}
            </div>
            {product.discount_price && (
              <div style={{ color: "var(--text-dim)", textDecoration: "line-through", fontSize: "1.1rem", marginTop: "0.2rem" }}>
                {formatPrice(product.price)}
              </div>
            )}
          </div>

          <p className="product-detail__desc">
            {product.description || product.short_desc || "Deskripsi tidak tersedia."}
          </p>

          <div className="product-detail__meta">
            <div className="product-detail__meta-item">
              <div className="product-detail__meta-label">Stok Tersedia</div>
              <div className="product-detail__meta-value">{product.stock > 0 ? `${product.stock} Item` : "Habis"}</div>
            </div>
            {product.sku && (
              <div className="product-detail__meta-item">
                <div className="product-detail__meta-label">SKU</div>
                <div className="product-detail__meta-value" style={{ color: "var(--text-main)" }}>{product.sku}</div>
              </div>
            )}
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <a 
              href={product.stock > 0 ? waLink : "#"} 
              target={product.stock > 0 ? "_blank" : "_self"} 
              rel="noopener noreferrer"
              className="cta-button" 
              style={{ 
                width: "100%", 
                textAlign: "center", 
                opacity: product.stock > 0 ? 1 : 0.5,
                cursor: product.stock > 0 ? "pointer" : "not-allowed"
              }}
            >
              {product.stock > 0 ? "PESAN VIA WHATSAPP" : "STOK HABIS"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
