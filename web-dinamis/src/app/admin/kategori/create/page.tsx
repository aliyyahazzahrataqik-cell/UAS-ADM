import { createKategori } from "@/app/actions/kategori";
import Link from "next/link";

export default function CreateKategoriPage() {
  return (
    <div style={{ maxWidth: "600px" }}>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/kategori" className="admin-btn admin-btn-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <div>
            <div className="admin-page-title">Tambah Kategori</div>
            <div className="admin-page-subtitle">Kategori untuk produk bunga</div>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: "32px" }}>
        <form action={createKategori}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}>Status Publikasi</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Aktifkan kategori ini</div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" name="is_active" defaultChecked style={{ width: "16px", height: "16px", accentColor: "#e8637a" }} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Aktif</span>
            </label>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Nama Kategori <span style={{ color: "#ef4444" }}>*</span></label>
            <input name="name" required type="text" className="admin-form-input" placeholder="Contoh: Buket Bunga" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Urutan Tampil</label>
            <input name="sort_order" type="number" className="admin-form-input" defaultValue="0" min="0" />
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Angka kecil = tampil lebih awal</div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Deskripsi Kategori</label>
            <textarea name="description" className="admin-form-textarea" style={{ minHeight: "100px" }} placeholder="Jelaskan secara singkat tentang kategori ini..." />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
            <Link href="/admin/kategori" className="admin-btn admin-btn-secondary">Batal</Link>
            <button type="submit" className="admin-btn admin-btn-primary" style={{ background: "#e8637a" }}>
              Simpan Kategori
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
