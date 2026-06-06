import { createKupon } from "@/app/actions/kupon";
import Link from "next/link";

export default function CreateKuponPage() {
  return (
    <div style={{ maxWidth: "600px" }}>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/kupon" className="admin-btn admin-btn-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <div>
            <div className="admin-page-title">Tambah Kupon</div>
            <div className="admin-page-subtitle">Buat kode diskon baru</div>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: "32px" }}>
        <form action={createKupon}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}>Status Publikasi</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Aktifkan kupon ini agar bisa digunakan</div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" name="is_active" defaultChecked style={{ width: "16px", height: "16px", accentColor: "#e8637a" }} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Aktif</span>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="admin-form-label">Kode Kupon <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="code" required type="text" className="admin-form-input" placeholder="Contoh: WELCOME10" style={{ textTransform: "uppercase", fontFamily: "monospace" }} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Tipe Diskon</label>
              <select name="type" className="admin-form-input">
                <option value="percent">Persentase (%)</option>
                <option value="fixed">Nominal (Rp)</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Nilai Diskon <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="value" required type="number" className="admin-form-input" placeholder="Contoh: 10 (jika %), atau 50000 (jika Rp)" />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Minimal Belanja (Rp)</label>
              <input name="min_purchase" type="number" className="admin-form-input" defaultValue="0" />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Batas Kupon (Total Pemakaian)</label>
              <input name="usage_limit" type="number" className="admin-form-input" defaultValue="100" />
            </div>

            <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="admin-form-label">Masa Berlaku (Expired At)</label>
              <input name="expired_at" type="date" className="admin-form-input" />
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Kosongkan jika kupon berlaku selamanya</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
            <Link href="/admin/kupon" className="admin-btn admin-btn-secondary">Batal</Link>
            <button type="submit" className="admin-btn admin-btn-primary" style={{ background: "#e8637a" }}>
              Simpan Kupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
