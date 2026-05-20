import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/PublicShell";
import { useLanguage } from "@/i18n/LanguageContext";
import { BRAND } from "@/lib/contact";
import { ShieldCheck, Sparkles, MessageCircle, Globe } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Elimi Trust Ltd" },
      {
        name: "description",
        content: "Elimi Trust Ltd is Rwanda's premium classified marketplace, trusted since 1996.",
      },
    ],
  }),
});

const VALUE_ICONS = [ShieldCheck, Sparkles, MessageCircle, Globe];

function AboutPage() {
  const { t } = useLanguage();
  return (
    <PublicShell>
      <section className="container-luxe py-16 md:py-24">
        <div className="text-xs uppercase tracking-widest text-[var(--color-gold)] mb-2">
          About Us
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">{t.about.title}</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-lg">{t.about.subtitle}</p>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <div className="glass rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-3 text-[var(--color-gold)]">{t.about.missionTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">{t.about.mission}</p>
          </div>
          <div className="glass rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-3 text-[var(--color-gold)]">{t.about.visionTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">{t.about.vision}</p>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mt-20 mb-8">{t.about.valuesTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.about.values.map((v, i) => {
            const Icon = VALUE_ICONS[i] ?? Sparkles;
            return (
              <div key={i} className="glass rounded-2xl p-6">
                <Icon className="h-6 w-6 text-[var(--color-gold)] mb-3" />
                <div className="font-semibold mb-1">{v.title}</div>
                <div className="text-sm text-muted-foreground">{v.desc}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 glass rounded-3xl p-8 md:p-12">
          <h2 className="text-xl font-semibold mb-6">Contact</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Phone</div>
              {BRAND.phones.map((p) => (
                <a key={p} href={`tel:${p}`} className="block hover:text-[var(--color-gold)]">
                  {p}
                </a>
              ))}
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</div>
              <a href={`mailto:${BRAND.email}`} className="hover:text-[var(--color-gold)] break-all">
                {BRAND.email}
              </a>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Instagram</div>
              <a
                href={BRAND.social.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-[var(--color-gold)]"
              >
                @{BRAND.social.instagram}
              </a>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Facebook / TikTok</div>
              <div>{BRAND.social.facebook}</div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
