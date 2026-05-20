import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, Phone, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { BRAND, buildWhatsAppLink } from "@/lib/contact";

export function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { to: "/", label: t.nav.home },
    { to: "/products", label: t.nav.products },
    { to: "/categories", label: t.nav.categories },
    { to: "/about", label: t.nav.about },
    { to: "/contact", label: t.nav.contact },
  ] as const;

  return (
    <footer className="relative mt-32 border-t border-white/5 bg-[var(--color-surface)]">
      <div className="container-luxe py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[var(--color-gold)] to-[oklch(0.65_0.12_70)] flex items-center justify-center font-bold text-[var(--color-gold-foreground)] shadow-gold">
                ET
              </div>
              <div>
                <div className="font-bold">Elimi Trust</div>
                <div className="text-xs text-muted-foreground tracking-widest uppercase">Ltd</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.footer.tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--color-gold)] mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--color-gold)] mb-4">
              {t.footer.contact}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  {BRAND.phones.map((p) => (
                    <a key={p} href={`tel:${p}`} className="block hover:text-foreground">
                      {p}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a
                  href={`mailto:${BRAND.email}`}
                  className="hover:text-foreground break-all text-xs"
                >
                  {BRAND.email}
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppLink("Hello, I would like to inquire about your services.")}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-[oklch(0.55_0.18_145)]/15 text-[oklch(0.75_0.18_145)] hover:bg-[oklch(0.55_0.18_145)]/25 transition-colors text-xs font-medium"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--color-gold)] mb-4">
              Follow
            </h4>
            <div className="flex gap-3">
              <a
                href={BRAND.social.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="h-10 w-10 rounded-lg border border-white/10 flex items-center justify-center hover:border-[var(--color-gold)]/40 hover:bg-white/5 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={BRAND.social.facebookUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="h-10 w-10 rounded-lg border border-white/10 flex items-center justify-center hover:border-[var(--color-gold)]/40 hover:bg-white/5 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={BRAND.social.tiktokUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="h-10 w-10 rounded-lg border border-white/10 flex items-center justify-center hover:border-[var(--color-gold)]/40 hover:bg-white/5 transition-all"
                aria-label="TikTok"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.84a8.16 8.16 0 0 0 4.77 1.52V6.91a4.85 4.85 0 0 1-1.84-.22z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Elimi Trust Ltd. {t.footer.rights}</div>
          <div className="tracking-widest uppercase">Premium Marketplace</div>
        </div>
      </div>
    </footer>
  );
}
