import { createProduk } from "@/app/actions/produk";
import { query } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CreateProdukPage() {
  const categories = await query<any>("SELECT id, name FROM categories WHERE is_active = 1 ORDER BY name ASC");

  return (
    <div style={{ maxWidth: "800px" }}>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/produk" className="admin-btn admin-btn-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <div>
            <div className="admin-page-title">Tambah Produk</div>
            <div className="admin-page-subtitle">Tambahkan produk baru ke katalog</div>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: "32px" }}>
        <form action={createProduk}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}>Status Publikasi</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Tampilkan produk ini di website</div>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="checkbox" name="is_featured" style={{ width: "16px", height: "16px", accentColor: "#d4a76a" }} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Featured (Pilihan)</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="checkbox" name="is_active" defaultChecked style={{ width: "16px", height: "16px", accentColor: "#e8637a" }} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Aktif</span>
              </label>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="admin-form-label">Nama Produk <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="name" required type="text" className="admin-form-input" placeholder="Contoh: Premium Rose Hand Bouquet" />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Kategori <span style={{ color: "#ef4444" }}>*</span></label>
              <select name="category_id" required className="admin-form-input">
                <option value="">-- Pilih Kategori --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">SKU / Kode Produk</label>
              <input name="sku" type="text" className="admin-form-input" placeholder="FL-001" />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Harga Asli (Rp) <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="price" required type="number" min="0" className="admin-form-input" placeholder="350000" />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Harga Diskon (Rp) opsional</label>
              <input name="discount_price" type="number" min="0" className="admin-form-input" placeholder="299000" />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Stok <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="stock" required type="number" min="0" defaultValue="10" className="admin-form-input" />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Berat (Gram)</label>
              <input name="weight_gram" type="number" min="0" className="admin-form-input" placeholder="500" />
            </div>
            
            <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="admin-form-label">URL Gambar Utama</label>
              <input name="image_url" type="url" className="admin-form-input" placeholder="https://..." />
            </div>

            <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="admin-form-label">Deskripsi Singkat <span style={{ color: "#ef4444" }}>*</span></label>
              <textarea name="short_desc" required className="admin-form-textarea" style={{ minHeight: "80px" }} />
            </div>

            <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="admin-form-label">Deskripsi Lengkap <span style={{ color: "#ef4444" }}>*</span></label>
              <textarea name="description" required className="admin-form-textarea" style={{ minHeight: "160px" }} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
            <Link href="/admin/produk" className="admin-btn admin-btn-secondary">Batal</Link>
            <button type="submit" className="admin-btn admin-btn-primary" style={{ background: "#e8637a" }}>
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
