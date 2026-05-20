import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageGate } from "./LanguageGate";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { ReactNode } from "react";

export function PublicShell({ children }: { children: ReactNode }) {
  const { language, isReady } = useLanguage();

  // Wait for localStorage read before deciding gate vs content (avoids flash).
  if (!isReady) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!language) {
    return <LanguageGate />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
    </div>
  );
}
