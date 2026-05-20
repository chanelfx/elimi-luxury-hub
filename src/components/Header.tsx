import { Link } from "@tanstack/react-router";
import { Menu, X, Globe, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { LANGUAGES } from "@/i18n/translations";

export function Header() {
  const { t, language, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/products", label: t.nav.products },
    { to: "/categories", label: t.nav.categories },
    { to: "/about", label: t.nav.about },
    { to: "/contact", label: t.nav.contact },
  ] as const;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "glass border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="container-luxe flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-[var(--color-gold)] to-[oklch(0.65_0.12_70)] flex items-center justify-center font-bold text-[var(--color-gold-foreground)] text-sm shadow-gold">
            ET
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm md:text-base font-bold tracking-tight">Elimi Trust</span>
            <span className="text-[10px] md:text-xs text-muted-foreground tracking-widest uppercase">
              Ltd
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              activeProps={{ className: "text-foreground" }}
            >
              {link.label}
              <span className="absolute inset-x-4 -bottom-0.5 h-px bg-[var(--color-gold)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              aria-label={t.common.changeLanguage}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{language?.toUpperCase()}</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-full mt-2 w-44 glass rounded-xl overflow-hidden shadow-luxe"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors ${
                        language === lang.code ? "text-[var(--color-gold)]" : ""
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.native}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border border-white/10 hover:border-[var(--color-gold)]/40 hover:bg-white/5 transition-all"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>{t.nav.login}</span>
          </Link>

          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-xl"
          >
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileOpen(false)} className="p-2">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col items-center gap-2 px-6 pt-12">
              {links.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-medium py-3 px-6 block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--color-gold)]/30 text-[var(--color-gold)]"
              >
                <LogIn className="h-4 w-4" />
                {t.nav.login}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
