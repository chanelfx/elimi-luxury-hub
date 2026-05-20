import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { LANGUAGES, type Language } from "@/i18n/translations";
import { Sparkles } from "lucide-react";

export function LanguageGate({ onComplete }: { onComplete?: () => void }) {
  const { setLanguage, t } = useLanguage();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    onComplete?.();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-noir overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-[var(--color-gold)]/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-[var(--color-gold)]/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl px-6"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 text-xs uppercase tracking-[0.2em] text-[var(--color-gold)]"
          >
            <Sparkles className="h-3 w-3" />
            <span>{t.brand}</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            {t.chooseLanguage}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">{t.chooseLanguageSub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {LANGUAGES.map((lang, i) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(lang.code)}
              className="group relative glass rounded-2xl p-8 text-left hover:border-[var(--color-gold)]/40 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{lang.flag}</div>
              <div className="text-xl font-semibold mb-1">{lang.native}</div>
              <div className="text-sm text-muted-foreground">{lang.label}</div>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
