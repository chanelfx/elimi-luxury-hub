import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Save, X, Star } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader, type UploadedImage } from "@/components/ImageUploader";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import { CATEGORY_FIELDS, CONDITIONS } from "@/lib/categoryFields";
import { upsertProduct } from "@/lib/products.functions";

export interface ProductFormValues {
  id?: string;
  title: string;
  description: string | null;
  category: string;
  status: "draft" | "available" | "reserved" | "sold";
  price: number | null;
  currency: string;
  location: string | null;
  brand: string | null;
  condition: string | null;
  is_featured: boolean;
  images: UploadedImage[];
  attributes: Record<string, string | number | boolean | null>;
}

const empty: ProductFormValues = {
  title: "",
  description: "",
  category: "real-estate",
  status: "available",
  price: null,
  currency: "RWF",
  location: "",
  brand: "",
  condition: "",
  is_featured: false,
  images: [],
  attributes: {},
};

export function ProductForm({
  mode,
  initial,
  onDone,
  onCancel,
}: {
  mode: "create" | "edit";
  initial?: ProductFormValues & { id?: string };
  onDone: () => void;
  onCancel: () => void;
}) {
  const upsertFn = useServerFn(upsertProduct);
  const [v, setV] = useState<ProductFormValues>({ ...empty, ...(initial ?? {}) });
  const [saving, setSaving] = useState(false);

  const fields = CATEGORY_FIELDS[v.category as CategorySlug] ?? [];

  const set = <K extends keyof ProductFormValues>(k: K, val: ProductFormValues[K]) =>
    setV((prev) => ({ ...prev, [k]: val }));

  const setAttr = (k: string, val: string | number | null) =>
    setV((prev) => ({ ...prev, attributes: { ...prev.attributes, [k]: val } }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!v.title.trim()) return toast.error("Title is required");
    if (v.images.length === 0) {
      if (!confirm("No images uploaded. Save anyway?")) return;
    }
    setSaving(true);
    const res = await upsertFn({
      data: {
        id: v.id,
        title: v.title.trim(),
        description: v.description || null,
        category: v.category,
        status: v.status,
        price: v.price ?? null,
        currency: v.currency,
        location: v.location || null,
        brand: v.brand || null,
        condition: v.condition || null,
        is_featured: v.is_featured,
        images: v.images,
        attributes: v.attributes,
      },
    });
    setSaving(false);
    if (res.ok) {
      toast.success(mode === "create" ? "Product created" : "Saved");
      onDone();
    } else toast.error(res.error ?? "Failed");
  };

  return (
    <form onSubmit={onSubmit} className="max-w-4xl space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-2">
            {mode === "create" ? "New Product" : "Edit Product"}
          </div>
          <h1 className="text-3xl font-bold">{v.title || "Untitled listing"}</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-sm"
          >
            <X className="h-4 w-4 inline mr-1" /> Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[oklch(0.65_0.12_70)] text-[var(--color-gold-foreground)] font-semibold shadow-gold disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Basics</h2>
        <Field label="Title" required>
          <input
            value={v.title}
            onChange={(e) => set("title", e.target.value)}
            required
            maxLength={180}
            className={inputCls}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={v.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            rows={5}
            maxLength={8000}
            className={inputCls}
          />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Category" required>
            <select
              value={v.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.slug.replace("-", " ")}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select
              value={v.status}
              onChange={(e) => set("status", e.target.value as ProductFormValues["status"])}
              className={inputCls}
            >
              <option value="draft">Draft (hidden)</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </Field>
          <Field label="Price">
            <input
              type="number"
              step="any"
              value={v.price ?? ""}
              onChange={(e) => set("price", e.target.value === "" ? null : Number(e.target.value))}
              className={inputCls}
              placeholder="Leave empty for 'contact for price'"
            />
          </Field>
          <Field label="Currency">
            <select value={v.currency} onChange={(e) => set("currency", e.target.value)} className={inputCls}>
              <option value="RWF">RWF</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </Field>
          <Field label="Location">
            <input
              value={v.location ?? ""}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Kigali, Kicukiro…"
              className={inputCls}
            />
          </Field>
          <Field label="Condition">
            <select value={v.condition ?? ""} onChange={(e) => set("condition", e.target.value)} className={inputCls}>
              <option value="">—</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={v.is_featured}
            onChange={(e) => set("is_featured", e.target.checked)}
          />
          <Star className="h-3.5 w-3.5 text-[var(--color-gold)]" />
          Featured listing (highlighted on home & catalog)
        </label>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Images</h2>
        <ImageUploader images={v.images} onChange={(imgs) => set("images", imgs)} />
      </div>

      {fields.length > 0 && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            {v.category.replace("-", " ")} details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <Field key={f.key} label={f.label}>
                {f.type === "select" ? (
                  <select
                    value={(v.attributes[f.key] as string) ?? ""}
                    onChange={(e) => setAttr(f.key, e.target.value || null)}
                    className={inputCls}
                  >
                    <option value="">—</option>
                    {f.options?.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea
                    value={(v.attributes[f.key] as string) ?? ""}
                    onChange={(e) => setAttr(f.key, e.target.value || null)}
                    rows={3}
                    className={inputCls}
                  />
                ) : (
                  <input
                    type={f.type}
                    value={(v.attributes[f.key] as string | number) ?? ""}
                    onChange={(e) =>
                      setAttr(
                        f.key,
                        e.target.value === ""
                          ? null
                          : f.type === "number"
                            ? Number(e.target.value)
                            : e.target.value
                      )
                    }
                    placeholder={f.placeholder}
                    className={inputCls}
                  />
                )}
              </Field>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-gold)]/50 focus:outline-none text-sm";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
        {label} {required && <span className="text-[var(--color-gold)]">*</span>}
      </label>
      {children}
    </div>
  );
}
