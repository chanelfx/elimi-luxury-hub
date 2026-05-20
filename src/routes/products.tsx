import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/PublicShell";
import { useLanguage } from "@/i18n/LanguageContext";
import { z } from "zod";
import { Search } from "lucide-react";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: searchSchema,
  component: ProductsPage,
});

function ProductsPage() {
  const { t } = useLanguage();
  return (
    <PublicShell>
      <section className="container-luxe py-16 md:py-24">
        <div className="text-xs uppercase tracking-widest text-[var(--color-gold)] mb-2">
          Catalog
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{t.products.title}</h1>
        <p className="text-muted-foreground mt-3">{t.products.subtitle}</p>

        <div className="mt-10 glass rounded-2xl p-4 flex items-center gap-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            placeholder={t.products.search}
            className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-16 glass rounded-3xl p-16 text-center">
          <div className="text-3xl mb-3">✨</div>
          <h2 className="text-xl font-semibold">{t.products.noResults}</h2>
          <p className="mt-2 text-muted-foreground text-sm">
            Product catalog launches in the next phase. The admin dashboard for uploading listings is coming next.
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
