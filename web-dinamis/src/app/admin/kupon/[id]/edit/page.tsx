import { updateKupon } from "@/app/actions/kupon";
import { query } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditKuponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const coupons = await query<any>("SELECT * FROM coupons WHERE id = ?", [id]);
  if (!coupons || coupons.length === 0) notFound();
  const coupon = coupons[0];

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toISOString().split('T')[0];
  };

  return (
    <div style={{ maxWidth: "600px" }}>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/kupon" className="admin-btn admin-btn-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <div>
            <div className="admin-page-title">Edit Kupon</div>
            <div className="admin-page-subtitle">{coupon.code}</div>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: "32px" }}>
        <form action={async (formData) => {
          "use server";
          await updateKupon(Number(id), formData);
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}>Status Publikasi</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Aktifkan kupon ini agar bisa digunakan</div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" name="is_active" defaultChecked={coupon.is_active === 1} style={{ width: "16px", height: "16px", accentColor: "#e8637a" }} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Aktif</span>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="admin-form-label">Kode Kupon <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="code" required type="text" className="admin-form-input" defaultValue={coupon.code} style={{ textTransform: "uppercase", fontFamily: "monospace" }} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Tipe Diskon</label>
              <select name="type" className="admin-form-input" defaultValue={coupon.type}>
                <option value="percent">Persentase (%)</option>
                <option value="fixed">Nominal (Rp)</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Nilai Diskon <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="value" required type="number" className="admin-form-input" defaultValue={coupon.value} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Minimal Belanja (Rp)</label>
              <input name="min_purchase" type="number" className="admin-form-input" defaultValue={coupon.min_purchase} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Batas Kupon (Total Pemakaian)</label>
              <input name="usage_limit" type="number" className="admin-form-input" defaultValue={coupon.usage_limit} />
            </div>

            <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="admin-form-label">Masa Berlaku (Expired At)</label>
              <input name="expired_at" type="date" className="admin-form-input" defaultValue={formatDateForInput(coupon.expired_at)} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
            <Link href="/admin/kupon" className="admin-btn admin-btn-secondary">Batal</Link>
            <button type="submit" className="admin-btn admin-btn-primary" style={{ background: "#e8637a" }}>
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
