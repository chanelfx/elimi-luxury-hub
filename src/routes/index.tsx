import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Truck, MessageCircle } from "lucide-react";
import * as Icons from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { useLanguage } from "@/i18n/LanguageContext";
import { CATEGORIES } from "@/lib/categories";
import { buildWhatsAppLink } from "@/lib/contact";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <PublicShell>
      <Hero />
      <ValueProps />
      <CategoriesGrid />
      <EmptyShowcase />
    </PublicShell>
  );
}

function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-[var(--color-gold)]/10 blur-[140px]" />
      </div>
      <div className="container-luxe relative pt-24 pb-32 md:pt-32 md:pb-48 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]"
        >
          <Sparkles className="h-3 w-3" />
          {t.home.heroEyebrow}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl mx-auto leading-[1.05]"
        >
          {t.home.heroTitle.split(" ").map((word, i, arr) => (
            <span key={i}>
              {i === arr.length - 2 || i === arr.length - 1 ? (
                <span className="text-gradient-gold">{word} </span>
              ) : (
                word + " "
              )}
            </span>
          ))}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          {t.home.heroSubtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/products"
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:shadow-luxe transition-all"
          >
            {t.home.browseProducts}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={buildWhatsAppLink("Hello Elimi Trust Ltd, I'd like to enquire.")}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 text-foreground hover:border-[var(--color-gold)]/40 hover:bg-white/5 transition-all"
          >
            <MessageCircle className="h-4 w-4" />
            {t.home.contactUs}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ValueProps() {
  const items = [
    { icon: ShieldCheck, title: "Verified", desc: "Every listing curated by our team" },
    { icon: Truck, title: "Across Rwanda", desc: "All districts and sectors covered" },
    { icon: MessageCircle, title: "Direct WhatsApp", desc: "Instant contact with sellers" },
    { icon: Sparkles, title: "Premium Quality", desc: "Hand-picked premium products" },
  ];
  return (
    <section className="container-luxe py-16 border-y border-white/5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center"
          >
            <item.icon className="h-7 w-7 mx-auto text-[var(--color-gold)] mb-3" />
            <div className="font-semibold text-sm md:text-base">{item.title}</div>
            <div className="text-xs md:text-sm text-muted-foreground mt-1">{item.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CategoriesGrid() {
  const { t } = useLanguage();
  const featured = CATEGORIES.slice(0, 12);
  return (
    <section className="container-luxe py-24">
      <div className="flex items-end justify-between mb-12 gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[var(--color-gold)] mb-2">
            Explore
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            {t.home.categoriesTitle}
          </h2>
          <p className="text-muted-foreground mt-2">{t.home.categoriesSub}</p>
        </div>
        <Link
          to="/categories"
          className="hidden md:inline-flex items-center gap-1 text-sm text-[var(--color-gold)] hover:underline"
        >
          {t.home.viewAll} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {featured.map((cat, i) => {
          const Icon = (Icons[cat.icon as keyof typeof Icons] as React.ComponentType<{
            className?: string;
          }>) ?? Icons.Package;
          return (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
            >
              <Link
                to="/products"
                search={{ category: cat.slug }}
                className="group block glass rounded-2xl p-5 md:p-6 hover-lift hover:border-[var(--color-gold)]/30"
              >
                <Icon className="h-6 w-6 md:h-7 md:w-7 text-[var(--color-gold)] mb-3" />
                <div className="font-medium text-sm md:text-base">
                  {t.categories[cat.tKey]}
                </div>
                <div className="mt-2 text-xs text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
                  Explore <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function EmptyShowcase() {
  const { t } = useLanguage();
  return (
    <section className="container-luxe pb-24">
      <div className="glass rounded-3xl p-12 md:p-20 text-center">
        <h3 className="text-2xl md:text-4xl font-bold mb-3">{t.home.featuredTitle}</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          New listings are coming soon. Check back shortly or contact us directly via WhatsApp.
        </p>
        <a
          href={buildWhatsAppLink("Hello Elimi Trust Ltd, I'd like to enquire about your products.")}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-gold-foreground)] font-medium shadow-gold hover:opacity-90 transition"
        >
          <MessageCircle className="h-4 w-4" />
          {t.home.contactUs}
        </a>
      </div>
    </section>
  );
}
