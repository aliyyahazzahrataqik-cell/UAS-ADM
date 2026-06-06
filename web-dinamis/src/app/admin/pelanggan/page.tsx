import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPelangganPage() {
  const customers = await query<any>(
    `SELECT c.*, 
     (SELECT COUNT(*) FROM orders WHERE customer_id = c.id) as total_orders
     FROM customers c 
     ORDER BY c.created_at DESC`
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Pelanggan</div>
          <div className="admin-page-subtitle">Daftar pelanggan terdaftar</div>
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Lengkap</th>
              <th>Email</th>
              <th>No. Telepon</th>
              <th>Total Pesanan</th>
              <th>Tgl Mendaftar</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>Belum ada pelanggan terdaftar.</td></tr>
            ) : customers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td style={{ fontWeight: 600, color: "#1e293b" }}>{c.first_name} {c.last_name}</td>
                <td>{c.email}</td>
                <td>{c.phone || "-"}</td>
                <td>{c.total_orders} pesanan</td>
                <td>{new Date(c.created_at).toLocaleDateString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
