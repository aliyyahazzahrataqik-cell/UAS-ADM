import Link from "next/link";
import { query } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const categories = await query<any>(
    "SELECT * FROM categories WHERE slug = ? AND is_active = 1 LIMIT 1",
    [slug]
  );

  if (!categories || categories.length === 0) {
    notFound();
  }

  const category = categories[0];

  const allCategories = await query<any>(
    "SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order"
  );

  const products = await query<any>(
    `SELECT p.*, c.name as category_name, 
     (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as primary_image
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.category_id = ? AND p.is_active = 1
     ORDER BY p.created_at DESC`,
    [category.id]
  );

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(price));
  };

  return (
    <section className="catalog-section" style={{ minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 className="section-title">Kategori <span className="text-gradient">{category.name}</span></h1>
        <p className="section-subtitle">{category.description}</p>
      </div>

      <div className="catalog-filter">
        <Link href="/produk" className="catalog-filter__btn">
          Semua Produk
        </Link>
        {allCategories.map((cat) => (
          <Link 
            key={cat.id} 
            href={`/kategori/${cat.slug}`} 
            className={`catalog-filter__btn ${cat.slug === slug ? "catalog-filter__btn--active" : ""}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="products-grid" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {products.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: "1/-1" }}>
            <span className="empty-state__emoji">🍃</span>
            <p className="empty-state__text">Belum ada produk di kategori ini.</p>
          </div>
        ) : (
          products.map((product, i) => (
            <Link href={`/produk/${product.slug}`} className="card product-card" key={product.id} style={{ animationDelay: `${i * 0.05}s` }}>
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
          ))
        )}
      </div>
    </section>
  );
}
