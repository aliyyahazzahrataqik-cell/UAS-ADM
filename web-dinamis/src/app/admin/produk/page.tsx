import { query } from "@/lib/db";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import { toggleActiveProduk, deleteProduk } from "@/app/actions/produk";

export const dynamic = "force-dynamic";

export default async function AdminProdukPage() {
  const products = await query<any>(
    `SELECT p.*, c.name as category_name 
     FROM products p 
     LEFT JOIN categories c ON p.category_id = c.id 
     ORDER BY p.created_at DESC`
  );

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(price));
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Kelola Produk</div>
          <div className="admin-page-subtitle">Daftar semua produk FloraShop</div>
        </div>
        <Link href="/admin/produk/create" className="admin-btn admin-btn-primary">+ Tambah Produk</Link>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Info Produk</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Status</th>
              <th align="right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>Belum ada produk.</td></tr>
            ) : products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div style={{ fontWeight: 600, color: "#1e293b" }}>{product.name}</div>
                  {product.sku && <div style={{ fontSize: "12px", color: "#64748b" }}>SKU: {product.sku}</div>}
                </td>
                <td>{product.category_name || "-"}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{formatPrice(product.discount_price || product.price)}</div>
                  {product.discount_price && <div style={{ fontSize: "12px", textDecoration: "line-through", color: "#94a3b8" }}>{formatPrice(product.price)}</div>}
                </td>
                <td>{product.stock}</td>
                <td>
                  <form action={async () => { "use server"; await toggleActiveProduk(product.id, product.is_active); }}>
                    <button type="submit" className={`admin-badge ${product.is_active ? "admin-badge-green" : "admin-badge-gray"}`} style={{ border: "none", cursor: "pointer" }}>
                      {product.is_active ? "Aktif" : "Draft"}
                    </button>
                  </form>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <Link href={`/admin/produk/${product.id}/edit`} className="admin-btn admin-btn-icon" title="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </Link>
                    <DeleteButton action={async () => { "use server"; await deleteProduk(product.id); }} message={`Hapus produk ${product.name}?`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
