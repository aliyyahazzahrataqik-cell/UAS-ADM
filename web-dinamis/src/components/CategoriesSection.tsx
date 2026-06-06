"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Helper to map category to emoji for visual flair
  const getCategoryEmoji = (slug: string) => {
    if (slug.includes("papan")) return "🖼️";
    if (slug.includes("hand") || slug.includes("buket")) return "💐";
    if (slug.includes("meja")) return "🏺";
    if (slug.includes("hamper")) return "🎁";
    if (slug.includes("pernikahan")) return "💍";
    return "🌹";
  };

  return (
    <section id="categories" className="services">
      <h2 className="section-title">
        Kategori <span className="text-gradient">Bunga</span>
      </h2>
      <p className="section-subtitle">
        Temukan rangkaian bunga yang paling tepat untuk menyempurnakan hari istimewa Anda
      </p>

      {loading ? (
        <div className="categories-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div className="card category-card" key={i}>
              <div className="skeleton" style={{ height: "60px", width: "60px", margin: "0 auto 1rem", borderRadius: "50%" }}></div>
              <div className="skeleton skeleton--title" style={{ width: "60%", margin: "0 auto 0.5rem" }}></div>
              <div className="skeleton skeleton--text" style={{ height: "40px" }}></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <Link href={`/kategori/${cat.slug}`} className="card category-card" key={cat.id} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="category-card__emoji">{getCategoryEmoji(cat.slug)}</span>
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
              <div className="card-shine" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
