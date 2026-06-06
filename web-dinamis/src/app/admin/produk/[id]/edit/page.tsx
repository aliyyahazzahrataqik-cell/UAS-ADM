import { updateProduk } from "@/app/actions/produk";
import { query } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProdukPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const products = await query<any>("SELECT * FROM products WHERE id = ?", [id]);
  if (!products || products.length === 0) notFound();
  const product = products[0];

  const categories = await query<any>("SELECT id, name FROM categories WHERE is_active = 1 ORDER BY name ASC");

  return (
    <div style={{ maxWidth: "800px" }}>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/produk" className="admin-btn admin-btn-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <div>
            <div className="admin-page-title">Edit Produk</div>
            <div className="admin-page-subtitle">{product.name}</div>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: "32px" }}>
        <form action={async (formData) => {
          "use server";
          await updateProduk(Number(id), formData);
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}>Status Publikasi</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Tampilkan produk ini di website</div>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="checkbox" name="is_featured" defaultChecked={product.is_featured === 1} style={{ width: "16px", height: "16px", accentColor: "#d4a76a" }} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Featured (Pilihan)</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="checkbox" name="is_active" defaultChecked={product.is_active === 1} style={{ width: "16px", height: "16px", accentColor: "#e8637a" }} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Aktif</span>
              </label>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="admin-form-label">Nama Produk <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="name" required type="text" className="admin-form-input" defaultValue={product.name} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Kategori <span style={{ color: "#ef4444" }}>*</span></label>
              <select name="category_id" required className="admin-form-input" defaultValue={product.category_id}>
                <option value="">-- Pilih Kategori --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">SKU / Kode Produk</label>
              <input name="sku" type="text" className="admin-form-input" defaultValue={product.sku || ""} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Harga Asli (Rp) <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="price" required type="number" min="0" className="admin-form-input" defaultValue={product.price} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Harga Diskon (Rp) opsional</label>
              <input name="discount_price" type="number" min="0" className="admin-form-input" defaultValue={product.discount_price || ""} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Stok <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="stock" required type="number" min="0" className="admin-form-input" defaultValue={product.stock} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Berat (Gram)</label>
              <input name="weight_gram" type="number" min="0" className="admin-form-input" defaultValue={product.weight_gram || ""} />
            </div>

            <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="admin-form-label">Deskripsi Singkat <span style={{ color: "#ef4444" }}>*</span></label>
              <textarea name="short_desc" required className="admin-form-textarea" style={{ minHeight: "80px" }} defaultValue={product.short_desc} />
            </div>

            <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="admin-form-label">Deskripsi Lengkap <span style={{ color: "#ef4444" }}>*</span></label>
              <textarea name="description" required className="admin-form-textarea" style={{ minHeight: "160px" }} defaultValue={product.description} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
            <Link href="/admin/produk" className="admin-btn admin-btn-secondary">Batal</Link>
            <button type="submit" className="admin-btn admin-btn-primary" style={{ background: "#e8637a" }}>
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
