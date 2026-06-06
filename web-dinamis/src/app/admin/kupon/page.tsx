import { query } from "@/lib/db";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import { toggleActiveKupon, deleteKupon } from "@/app/actions/kupon";

export const dynamic = "force-dynamic";

export default async function AdminKuponPage() {
  const coupons = await query<any>("SELECT * FROM coupons ORDER BY created_at DESC");

  const formatValue = (type: string, value: string) => {
    if (type === 'percent') return `${value}%`;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(value));
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Kelola Kupon Promo</div>
          <div className="admin-page-subtitle">Daftar kode kupon diskon pelanggan</div>
        </div>
        <Link href="/admin/kupon/create" className="admin-btn admin-btn-primary">+ Tambah Kupon</Link>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Kode Kupon</th>
              <th>Nilai Diskon</th>
              <th>Min. Belanja</th>
              <th>Batas Pemakaian</th>
              <th>Masa Berlaku</th>
              <th>Status</th>
              <th align="right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>Belum ada kupon diskon.</td></tr>
            ) : coupons.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 700, color: "#1e293b", fontFamily: "monospace", fontSize: "14px" }}>{c.code}</td>
                <td style={{ fontWeight: 600, color: "#16a34a" }}>
                  {c.type === 'percent' ? 'Diskon ' : 'Potongan '}{formatValue(c.type, c.value)}
                </td>
                <td>{formatValue('fixed', c.min_purchase)}</td>
                <td>{c.used_count} / {c.usage_limit}</td>
                <td>{c.expired_at ? new Date(c.expired_at).toLocaleDateString("id-ID") : "Selamanya"}</td>
                <td>
                  <form action={async () => { "use server"; await toggleActiveKupon(c.id, c.is_active); }}>
                    <button type="submit" className={`admin-badge ${c.is_active ? "admin-badge-green" : "admin-badge-gray"}`} style={{ border: "none", cursor: "pointer" }}>
                      {c.is_active ? "Aktif" : "Nonaktif"}
                    </button>
                  </form>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <Link href={`/admin/kupon/${c.id}/edit`} className="admin-btn admin-btn-icon" title="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </Link>
                    <DeleteButton action={async () => { "use server"; await deleteKupon(c.id); }} message={`Hapus kupon ${c.code}?`} />
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
