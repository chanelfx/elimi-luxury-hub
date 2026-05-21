import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, Users, FileText, TrendingUp, ArrowUpRight, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const location = useLocation();
  // If a child route is matched, render only the child via Outlet
  if (location.pathname !== "/dashboard") {
    return <Outlet />;
  }
  return <DashboardOverview />;
}

function DashboardOverview() {
  const { profile, user, isSuperAdmin, isAdmin } = useAuth();
  const [stats, setStats] = useState({ staff: 0, products: 0, reports: 0 });
  const [showPwBanner, setShowPwBanner] = useState(false);

  useEffect(() => {
    setShowPwBanner(profile?.must_change_password ?? false);
  }, [profile]);

  useEffect(() => {
    (async () => {
      const [{ count: staffCount }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);
      setStats({ staff: staffCount ?? 0, products: 0, reports: 0 });
    })();
  }, []);

  const cards = [
    { label: "Staff Members", value: stats.staff, icon: Users, to: "/dashboard/staff", show: isSuperAdmin },
    { label: "Products", value: stats.products, icon: Package, to: "/dashboard/products", show: true },
    { label: "Reports", value: stats.reports, icon: FileText, to: "/dashboard/reports", show: true },
    { label: "Trending", value: "—", icon: TrendingUp, to: "/dashboard/analytics", show: isAdmin },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-2">
          Dashboard
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome back, {profile?.display_name ?? user?.email?.split("@")[0]}
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your marketplace listings, team, and reports.
        </p>
      </div>

      {showPwBanner && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-2xl border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5"
        >
          <KeyRound className="h-5 w-5 text-[var(--color-gold)] mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-sm">Change your password</div>
            <p className="text-xs text-muted-foreground mt-1">
              You're still using the default password. Please update it from{" "}
              <Link to="/dashboard/settings" className="text-[var(--color-gold)] underline">
                Settings
              </Link>
              .
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards
          .filter((c) => c.show)
          .map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={card.to}
                  className="block glass rounded-2xl p-5 hover:border-[var(--color-gold)]/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-[var(--color-gold)]" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-[var(--color-gold)] transition-colors" />
                  </div>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {card.label}
                  </div>
                </Link>
              </motion.div>
            );
          })}
      </div>

      <div className="glass rounded-2xl p-8">
        <h2 className="text-lg font-semibold mb-2">Roadmap</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Phase 2 (Auth + Dashboard shell) is live. Coming in Phase 3:
        </p>
        <ul className="space-y-3 text-sm">
          {[
            "Full Product CRUD with category-specific fields (Real Estate, Vehicles, Electronics…)",
            "Cloudinary multi-image uploads with reordering",
            "Status workflow: Available · Reserved · Sold",
            "Likes, search, filters, and featured listings",
            "Phase 4: Daily reports + analytics charts + WhatsApp templates",
          ].map((line) => (
            <li key={line} className="flex items-start gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)] mt-2 shrink-0" />
              <span className="text-muted-foreground">{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
