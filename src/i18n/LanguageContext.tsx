import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Language, type TranslationKey } from "./translations";

interface LanguageContextValue {
  language: Language | null;
  setLanguage: (lang: Language) => void;
  t: TranslationKey;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "elimi-trust-language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored && stored in translations) {
        setLanguageState(stored);
      }
    } catch {
      // ignore
    }
    setIsReady(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const t = translations[language ?? "en"];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
