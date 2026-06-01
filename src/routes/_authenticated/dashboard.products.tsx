import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Plus, Package, Pencil, Trash2, Star, Eye, Heart, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { deleteProduct, upsertProduct } from "@/lib/products.functions";
import { cldOptimized } from "@/lib/cloudinary";
import { CATEGORIES } from "@/lib/categories";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/products")({
  component: ProductsAdminPage,
});

interface Row {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: "draft" | "available" | "reserved" | "sold";
  price: number | null;
  currency: string;
  is_featured: boolean;
  images: { url: string }[];
  views_count: number;
  likes_count: number;
  created_at: string;
}

const statusStyles: Record<string, string> = {
  available: "bg-emerald-500/15 text-emerald-300",
  reserved: "bg-amber-500/15 text-amber-300",
  sold: "bg-red-500/15 text-red-300",
  draft: "bg-white/10 text-muted-foreground",
};

function ProductsAdminPage() {
  const { isAdmin } = useAuth();
  const upsertFn = useServerFn(upsertProduct);
  const deleteFn = useServerFn(deleteProduct);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("id,slug,title,category,status,price,currency,is_featured,images,views_count,likes_count,created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    setRows(((data ?? []) as unknown) as Row[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onToggleStatus = async (r: Row, status: Row["status"]) => {
    const { error } = await supabase.from("products").update({ status }).eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`);
    load();
  };

  const onToggleFeatured = async (r: Row) => {
    if (!isAdmin) return toast.error("Admin only");
    await supabase.from("products").update({ is_featured: !r.is_featured }).eq("id", r.id);
    load();
  };

  const onDelete = async (r: Row) => {
    if (!confirm(`Delete "${r.title}"?`)) return;
    const res = await deleteFn({ data: { id: r.id } });
    if (res.ok) {
      toast.success("Deleted");
      load();
    } else toast.error(res.error ?? "Failed");
  };

  const filtered = filter ? rows.filter((r) => r.category === filter) : rows;

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-2">
            Catalog
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="h-7 w-7 text-[var(--color-gold)]" /> Products
          </h1>
          <p className="text-muted-foreground mt-2">
            Create, edit and publish marketplace listings.
          </p>
        </div>
        <Link
          to="/dashboard/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[oklch(0.65_0.12_70)] text-[var(--color-gold-foreground)] font-semibold shadow-gold hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("")}
          className={`px-3 py-1.5 rounded-full text-xs border ${
            !filter ? "border-[var(--color-gold)] text-[var(--color-gold)]" : "border-white/10 text-muted-foreground"
          }`}
        >
          All ({rows.length})
        </button>
        {CATEGORIES.map((c) => {
          const count = rows.filter((r) => r.category === c.slug).length;
          if (count === 0) return null;
          return (
            <button
              key={c.slug}
              onClick={() => setFilter(c.slug)}
              className={`px-3 py-1.5 rounded-full text-xs border ${
                filter === c.slug
                  ? "border-[var(--color-gold)] text-[var(--color-gold)]"
                  : "border-white/10 text-muted-foreground"
              }`}
            >
              {c.slug} ({count})
            </button>
          );
        })}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No products yet</p>
            <Link
              to="/dashboard/products/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-gold)]/30 text-[var(--color-gold)] text-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Add your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/5">
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Stats</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-white/5 shrink-0">
                          {r.images?.[0] ? (
                            <img src={cldOptimized(r.images[0].url, 100)} alt="" className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium line-clamp-1 flex items-center gap-1.5">
                            {r.is_featured && <Star className="h-3 w-3 text-[var(--color-gold)] fill-current" />}
                            {r.title}
                          </div>
                          <Link
                            to="/products/$slug"
                            params={{ slug: r.slug }}
                            target="_blank"
                            className="text-[11px] text-muted-foreground hover:text-[var(--color-gold)]"
                          >
                            /{r.slug}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground capitalize">{r.category.replace("-", " ")}</td>
                    <td className="p-4">
                      {r.price
                        ? new Intl.NumberFormat().format(r.price) + " " + r.currency
                        : "—"}
                    </td>
                    <td className="p-4">
                      <select
                        value={r.status}
                        onChange={(e) => onToggleStatus(r, e.target.value as Row["status"])}
                        className={`text-xs px-2 py-1 rounded-md border-0 outline-none ${statusStyles[r.status]}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                      </select>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{r.views_count}</span>
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{r.likes_count}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        {isAdmin && (
                          <button
                            onClick={() => onToggleFeatured(r)}
                            className={`h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-white/5 ${
                              r.is_featured ? "text-[var(--color-gold)]" : "text-muted-foreground"
                            }`}
                            title="Feature"
                          >
                            <Star className={`h-3.5 w-3.5 ${r.is_featured ? "fill-current" : ""}`} />
                          </button>
                        )}
                        <Link
                          to="/dashboard/products/edit/$id"
                          params={{ id: r.id }}
                          className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                        {isAdmin && (
                          <button
                            onClick={() => onDelete(r)}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// keep upsertFn imported so bundler doesn't tree-shake the type ref
void upsertProduct;
