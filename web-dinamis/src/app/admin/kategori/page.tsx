import { query } from "@/lib/db";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import { toggleActiveKategori, deleteKategori } from "@/app/actions/kategori";

export const dynamic = "force-dynamic";

export default async function AdminKategoriPage() {
  const categories = await query<any>("SELECT * FROM categories ORDER BY sort_order ASC, created_at DESC");

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Kelola Kategori</div>
          <div className="admin-page-subtitle">Daftar kategori produk FloraShop</div>
        </div>
        <Link href="/admin/kategori/create" className="admin-btn admin-btn-primary">+ Tambah Kategori</Link>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nama Kategori</th>
              <th>Deskripsi</th>
              <th>Urutan</th>
              <th>Status</th>
              <th align="right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>Belum ada kategori.</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id}>
                <td style={{ fontWeight: 600, color: "#1e293b" }}>{cat.name}</td>
                <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.description}</td>
                <td>{cat.sort_order}</td>
                <td>
                  <form action={async () => { "use server"; await toggleActiveKategori(cat.id, cat.is_active); }}>
                    <button type="submit" className={`admin-badge ${cat.is_active ? "admin-badge-green" : "admin-badge-gray"}`} style={{ border: "none", cursor: "pointer" }}>
                      {cat.is_active ? "Aktif" : "Draft"}
                    </button>
                  </form>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <Link href={`/admin/kategori/${cat.id}/edit`} className="admin-btn admin-btn-icon" title="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </Link>
                    <DeleteButton action={async () => { "use server"; await deleteKategori(cat.id); }} message={`Hapus kategori ${cat.name}?`} />
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
