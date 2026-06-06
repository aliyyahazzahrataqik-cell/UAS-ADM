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
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error loading categories:", err);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getCategoryImage = (slug: string) => {
    if (slug.includes("papan")) return "/images/cat_papan.png";
    if (slug.includes("hand") || slug.includes("buket")) return "/images/cat_hand_bouquet.png";
    if (slug.includes("meja")) return "/images/cat_meja.png";
    if (slug.includes("hamper")) return "/images/cat_hamper.png";
    if (slug.includes("pernikahan")) return "/images/hero_flower_2.png";
    return "/images/hero_flower_1.png"; // Fallback
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
          {[1, 2, 3, 4].map((i) => (
            <div className="card category-card" key={i}>
              <div className="skeleton" style={{ height: "180px", borderRadius: "12px", marginBottom: "1rem" }}></div>
              <div className="skeleton skeleton--title" style={{ width: "60%", margin: "0 auto 0.5rem" }}></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <Link href={`/kategori/${cat.slug}`} className="card category-card" key={cat.id} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="category-card__img-wrapper">
                <img src={getCategoryImage(cat.slug)} alt={cat.name} className="category-card__img" loading="lazy" />
              </div>
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
