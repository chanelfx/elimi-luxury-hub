import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/PublicShell";
import { useLanguage } from "@/i18n/LanguageContext";
import { BRAND, buildWhatsAppLink } from "@/lib/contact";
import { Phone, Mail, MessageCircle, Instagram, Facebook } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Elimi Trust Ltd" },
      { name: "description", content: "Get in touch with Elimi Trust Ltd via WhatsApp, phone, or email." },
    ],
  }),
});

function ContactPage() {
  const { t } = useLanguage();
  return (
    <PublicShell>
      <section className="container-luxe py-16 md:py-24">
        <div className="text-xs uppercase tracking-widest text-[var(--color-gold)] mb-2">Contact</div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{t.contact.title}</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-lg">{t.contact.subtitle}</p>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <a
            href={buildWhatsAppLink("Hello Elimi Trust Ltd, I'd like to enquire.")}
            target="_blank"
            rel="noreferrer noopener"
            className="glass rounded-2xl p-8 hover-lift hover:border-[oklch(0.55_0.18_145)]/40 group"
          >
            <MessageCircle className="h-8 w-8 text-[oklch(0.75_0.18_145)] mb-4" />
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              {t.contact.whatsapp}
            </div>
            <div className="text-lg font-semibold">{BRAND.whatsapp.join(" · ")}</div>
            <div className="mt-3 text-sm text-muted-foreground group-hover:text-foreground">
              Chat now →
            </div>
          </a>

          <a
            href={`tel:${BRAND.phones[0]}`}
            className="glass rounded-2xl p-8 hover-lift hover:border-[var(--color-gold)]/40"
          >
            <Phone className="h-8 w-8 text-[var(--color-gold)] mb-4" />
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              {t.contact.phone}
            </div>
            <div className="text-lg font-semibold">{BRAND.phones.join(" · ")}</div>
          </a>

          <a
            href={`mailto:${BRAND.email}`}
            className="glass rounded-2xl p-8 hover-lift hover:border-[var(--color-gold)]/40"
          >
            <Mail className="h-8 w-8 text-[var(--color-gold)] mb-4" />
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              {t.contact.email}
            </div>
            <div className="text-base font-semibold break-all">{BRAND.email}</div>
          </a>

          <div className="glass rounded-2xl p-8">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              {t.contact.followUs}
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={BRAND.social.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 hover:text-[var(--color-gold)]"
              >
                <Instagram className="h-5 w-5" />
                <span>@{BRAND.social.instagram}</span>
              </a>
              <a
                href={BRAND.social.facebookUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 hover:text-[var(--color-gold)]"
              >
                <Facebook className="h-5 w-5" />
                <span>{BRAND.social.facebook}</span>
              </a>
              <a
                href={BRAND.social.tiktokUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-3 hover:text-[var(--color-gold)]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.84a8.16 8.16 0 0 0 4.77 1.52V6.91a4.85 4.85 0 0 1-1.84-.22z" />
                </svg>
                <span>{BRAND.social.tiktok}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
