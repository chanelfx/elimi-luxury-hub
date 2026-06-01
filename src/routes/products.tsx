import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/PublicShell";
import { useLanguage } from "@/i18n/LanguageContext";
import { z } from "zod";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductSummary } from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/categories";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(["newest", "price_low", "price_high", "most_liked"]).optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,
  component: ProductsPage,
  head: () => ({ meta: [{ title: "All Products — Elimi Trust Ltd" }] }),
});

function ProductsPage() {
  const { t } = useLanguage();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(search.q ?? "");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    let query = supabase
      .from("products")
      .select("id,slug,title,price,currency,location,category,status,is_featured,images,likes_count,views_count,created_at")
      .neq("status", "draft");
    if (search.category) query = query.eq("category", search.category);
    switch (search.sort) {
      case "price_low":
        query = query.order("price", { ascending: true, nullsFirst: false });
        break;
      case "price_high":
        query = query.order("price", { ascending: false, nullsFirst: false });
        break;
      case "most_liked":
        query = query.order("likes_count", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }
    query.limit(200).then(({ data }) => {
      setProducts(((data ?? []) as unknown) as ProductSummary[]);
      setLoading(false);
    });
  }, [search.category, search.sort]);

  const filtered = useMemo(() => {
    const query = (search.q ?? q).trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        (p.location ?? "").toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }, [products, q, search.q]);

  const updateSearch = (next: Partial<z.infer<typeof searchSchema>>) =>
    navigate({ search: (prev) => ({ ...prev, ...next }) });

  return (
    <PublicShell>
      <section className="container-luxe py-12 md:py-20">
        <div className="text-xs uppercase tracking-widest text-[var(--color-gold)] mb-2">
          Catalog
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{t.products.title}</h1>
        <p className="text-muted-foreground mt-3">{t.products.subtitle}</p>

        <div className="mt-8 flex flex-col md:flex-row gap-3">
          <div className="flex-1 glass rounded-2xl px-4 py-3 flex items-center gap-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.products.search}
              className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
            />
            {q && (
              <button onClick={() => setQ("")} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <select
            value={search.sort ?? "newest"}
            onChange={(e) => updateSearch({ sort: e.target.value as never })}
            className="glass rounded-2xl px-4 py-3 text-sm bg-transparent border-white/10 focus:border-[var(--color-gold)]/50 focus:outline-none"
          >
            <option value="newest">{t.products.newest}</option>
            <option value="price_low">{t.products.priceLow}</option>
            <option value="price_high">{t.products.priceHigh}</option>
            <option value="most_liked">{t.products.mostLiked}</option>
          </select>
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className="md:hidden glass rounded-2xl px-4 py-3 text-sm flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </button>
        </div>

        {/* Category chips */}
        <div className={`mt-5 flex flex-wrap gap-2 ${filterOpen ? "" : "hidden md:flex"}`}>
          <button
            onClick={() => updateSearch({ category: undefined })}
            className={`px-3 py-1.5 rounded-full text-xs border transition ${
              !search.category
                ? "border-[var(--color-gold)] text-[var(--color-gold)] bg-[var(--color-gold)]/10"
                : "border-white/10 text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.products.allCategories}
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => updateSearch({ category: c.slug })}
              className={`px-3 py-1.5 rounded-full text-xs border transition ${
                search.category === c.slug
                  ? "border-[var(--color-gold)] text-[var(--color-gold)] bg-[var(--color-gold)]/10"
                  : "border-white/10 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.categories[c.tKey]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-16 glass rounded-3xl p-16 text-center text-muted-foreground text-sm">
            Loading products…
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 glass rounded-3xl p-16 text-center">
            <div className="text-3xl mb-3">✨</div>
            <h2 className="text-xl font-semibold">{t.products.noResults}</h2>
            <p className="mt-2 text-muted-foreground text-sm">{t.products.noResultsSub}</p>
            <Link
              to="/products"
              search={{}}
              className="mt-6 inline-block text-xs text-[var(--color-gold)] underline"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </PublicShell>
  );
}
