import { updateKategori } from "@/app/actions/kategori";
import { query } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditKategoriPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const categories = await query<any>("SELECT * FROM categories WHERE id = ?", [id]);
  if (!categories || categories.length === 0) notFound();
  const category = categories[0];

  return (
    <div style={{ maxWidth: "600px" }}>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/kategori" className="admin-btn admin-btn-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <div>
            <div className="admin-page-title">Edit Kategori</div>
            <div className="admin-page-subtitle">{category.name}</div>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: "32px" }}>
        <form action={async (formData) => {
          "use server";
          await updateKategori(Number(id), formData);
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}>Status Publikasi</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Aktifkan kategori ini</div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" name="is_active" defaultChecked={category.is_active === 1} style={{ width: "16px", height: "16px", accentColor: "#e8637a" }} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Aktif</span>
            </label>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Nama Kategori <span style={{ color: "#ef4444" }}>*</span></label>
            <input name="name" required type="text" className="admin-form-input" defaultValue={category.name} />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Urutan Tampil</label>
            <input name="sort_order" type="number" className="admin-form-input" defaultValue={category.sort_order} min="0" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Deskripsi Kategori</label>
            <textarea name="description" className="admin-form-textarea" style={{ minHeight: "100px" }} defaultValue={category.description || ""} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
            <Link href="/admin/kategori" className="admin-btn admin-btn-secondary">Batal</Link>
            <button type="submit" className="admin-btn admin-btn-primary" style={{ background: "#e8637a" }}>
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
