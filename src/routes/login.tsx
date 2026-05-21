import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { LogIn, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { seedSuperAdmin } from "@/lib/auth.functions";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Staff Login — Elimi Trust Ltd" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, loading } = useAuth();
  const seed = useServerFn(seedSuperAdmin);

  const [email, setEmail] = useState("admin@elimitrust.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [seeded, setSeeded] = useState(false);

  // Idempotent first-run setup
  useEffect(() => {
    seed().then(() => setSeeded(true)).catch(() => setSeeded(true));
  }, [seed]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [loading, isAuthenticated, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-noir px-6 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[var(--color-gold)]/10 blur-[120px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link to="/" className="block text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[var(--color-gold)] to-[oklch(0.65_0.12_70)] flex items-center justify-center font-bold text-[var(--color-gold-foreground)] shadow-gold">
              ET
            </div>
            <div className="text-left">
              <div className="font-bold">Elimi Trust</div>
              <div className="text-[10px] text-muted-foreground tracking-widest uppercase">
                Ltd
              </div>
            </div>
          </div>
        </Link>

        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-6">
            <ShieldCheck className="h-10 w-10 text-[var(--color-gold)] mx-auto mb-3" />
            <h1 className="text-2xl font-bold">Staff Login</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to access the marketplace dashboard
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-gold)]/50 focus:outline-none transition-colors"
                placeholder="you@elimitrust.com"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-gold)]/50 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !seeded}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[oklch(0.65_0.12_70)] text-[var(--color-gold-foreground)] font-semibold shadow-gold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-[11px] text-muted-foreground">
              Default super admin: <code className="text-[var(--color-gold)]">admin@elimitrust.com</code> ·{" "}
              <code className="text-[var(--color-gold)]">Admin@2026</code>
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-xs text-muted-foreground hover:text-foreground"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
