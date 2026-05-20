import { createFileRoute, Link } from "@tanstack/react-router";
import { LogIn, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Staff Login — Elimi Trust Ltd" }] }),
});

function LoginPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center bg-noir px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[var(--color-gold)]/10 blur-[120px]" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="block text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[var(--color-gold)] to-[oklch(0.65_0.12_70)] flex items-center justify-center font-bold text-[var(--color-gold-foreground)] shadow-gold">
              ET
            </div>
            <div className="text-left">
              <div className="font-bold">Elimi Trust</div>
              <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Ltd</div>
            </div>
          </div>
        </Link>

        <div className="glass rounded-2xl p-8 text-center">
          <ShieldCheck className="h-10 w-10 text-[var(--color-gold)] mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t.nav.login}</h1>
          <p className="text-sm text-muted-foreground">
            Authentication, super-admin dashboard and employee management arrive in the next phase.
          </p>
          <button
            disabled
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium opacity-50 cursor-not-allowed"
          >
            <LogIn className="h-4 w-4" />
            Sign in (coming next)
          </button>
          <Link
            to="/"
            className="mt-4 inline-block text-xs text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
