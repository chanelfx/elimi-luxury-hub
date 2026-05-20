import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { PublicShell } from "@/components/PublicShell";
import { useLanguage } from "@/i18n/LanguageContext";
import { CATEGORIES } from "@/lib/categories";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({
    meta: [
      { title: "Categories — Elimi Trust Ltd" },
      { name: "description", content: "Browse all categories on Elimi Trust Ltd marketplace." },
    ],
  }),
});

function CategoriesPage() {
  const { t } = useLanguage();
  return (
    <PublicShell>
      <section className="container-luxe py-16 md:py-24">
        <div className="text-xs uppercase tracking-widest text-[var(--color-gold)] mb-2">
          Explore
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{t.home.categoriesTitle}</h1>
        <p className="text-muted-foreground mt-3">{t.home.categoriesSub}</p>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {CATEGORIES.map((cat, i) => {
            const Icon =
              (Icons[cat.icon as keyof typeof Icons] as React.ComponentType<{
                className?: string;
              }>) ?? Icons.Package;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to="/products"
                  search={{ category: cat.slug }}
                  className="block glass rounded-2xl p-6 hover-lift hover:border-[var(--color-gold)]/30"
                >
                  <Icon className="h-7 w-7 text-[var(--color-gold)] mb-3" />
                  <div className="font-medium">{t.categories[cat.tKey]}</div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </PublicShell>
  );
}
