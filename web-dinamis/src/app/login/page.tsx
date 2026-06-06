"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Email atau password salah");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-color)",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "var(--glass)",
        padding: "40px",
        borderRadius: "20px",
        border: "1px solid var(--glass-border)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
            <span style={{ color: "#fff" }}>Flora</span><span style={{ color: "var(--accent-rose)" }}>Shop</span>
          </div>
          <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>Admin Panel Login</p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
            textAlign: "center",
            border: "1px solid rgba(239, 68, 68, 0.2)"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "var(--text-dim)" }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(0,0,0,0.4)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                color: "#fff",
                outline: "none",
                transition: "all 0.3s"
              }}
              placeholder="admin@florashop.com"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "var(--text-dim)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(0,0,0,0.4)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                color: "#fff",
                outline: "none",
                transition: "all 0.3s"
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "10px",
              padding: "14px",
              background: "linear-gradient(45deg, var(--accent-rose), var(--accent-gold))",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.3s"
            }}
          >
            {loading ? "MEMPROSES..." : "MASUK"}
          </button>
        </form>
        
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Link href="/" style={{ color: "var(--text-dim)", textDecoration: "none", fontSize: "13px" }}>
            &larr; Kembali ke Website
          </Link>
        </div>
      </div>
    </div>
  );
}
