"use client";

import { useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({ nama: "", email: "", subjek: "", pesan: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/kontak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("ok");
      setForm({ nama: "", email: "", subjek: "", pesan: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="contact">
      <h2 className="section-title">
        Hubungi <span className="text-gradient">Kami</span>
      </h2>
      <p className="section-subtitle">
        Ada pertanyaan tentang pesanan, kustomisasi buket, atau kerjasama? Kami siap membantu dengan sepenuh hati.
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nama">Nama Lengkap</label>
            <input
              id="nama"
              type="text"
              required
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Contoh: Budi Santoso"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="budi@email.com"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="subjek">Subjek Pesan</label>
          <input
            id="subjek"
            type="text"
            required
            value={form.subjek}
            onChange={(e) => setForm({ ...form, subjek: e.target.value })}
            placeholder="Contoh: Custom Buket Pernikahan"
          />
        </div>
        <div className="form-group">
          <label htmlFor="pesan">Detail Pesan</label>
          <textarea
            id="pesan"
            rows={5}
            required
            value={form.pesan}
            onChange={(e) => setForm({ ...form, pesan: e.target.value })}
            placeholder="Tuliskan pertanyaan atau kebutuhan detail Anda di sini..."
          />
        </div>

        <button type="submit" className="cta-button" disabled={status === "sending"} style={{ width: "100%" }}>
          {status === "sending" ? "MENGIRIM PESAN..." : "KIRIM PESAN SEKARANG"}
        </button>

        {status === "ok" && (
          <p className="form-msg form-msg--ok">✅ Pesan terkirim! Tim FloraShop akan segera membalas email Anda.</p>
        )}
        {status === "error" && (
          <p className="form-msg form-msg--err">❌ Gagal mengirim pesan. Silakan coba beberapa saat lagi.</p>
        )}
      </form>
    </section>
  );
}
