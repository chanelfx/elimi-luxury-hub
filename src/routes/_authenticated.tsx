import { createFileRoute, Outlet, redirect, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  FileText,
  LogOut,
  Menu,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, profile, roles, loading, signOut, isSuperAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading dashboard…</div>
      </div>
    );
  }

  const handleSignOut = async () => {
    // Logout gate: employees must submit today's report first (admins exempt)
    if (!isAdmin) {
      const today = new Date().toISOString().slice(0, 10);
      const { data: report } = await supabase
        .from("daily_reports")
        .select("id")
        .eq("user_id", user.id)
        .eq("report_date", today)
        .maybeSingle();
      if (!report) {
        alert("Please submit today's report before signing out.");
        navigate({ to: "/dashboard/reports" });
        return;
      }
    }
    await signOut();
    navigate({ to: "/login" });
  };

  const nav = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard, show: true },
    { to: "/dashboard/products", label: "Products", icon: Package, show: true },
    { to: "/dashboard/staff", label: "Staff", icon: Users, show: isSuperAdmin },
    { to: "/dashboard/reports", label: "Reports", icon: FileText, show: true },
    { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3, show: isAdmin },
    { to: "/dashboard/settings", label: "Settings", icon: Settings, show: true },
  ];

  const roleLabel = isSuperAdmin
    ? "Super Admin"
    : isAdmin
      ? "Admin"
      : roles.includes("employee")
        ? "Employee"
        : "Staff";

  return (
    <div className="min-h-screen bg-noir flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 glass border-r border-white/5 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[var(--color-gold)] to-[oklch(0.65_0.12_70)] flex items-center justify-center font-bold text-[var(--color-gold-foreground)] text-sm shadow-gold">
              ET
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold">Elimi Trust</span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
                Dashboard
              </span>
            </div>
          </Link>
        </div>

        <nav className="p-3 space-y-1">
          {nav
            .filter((n) => n.show)
            .map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to ||
                (item.to !== "/dashboard" && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    active
                      ? "bg-white/5 text-[var(--color-gold)] border border-white/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--color-gold)]/30 to-[var(--color-gold)]/10 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-[var(--color-gold)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">
                {profile?.display_name ?? user.email}
              </div>
              <div className="text-[10px] text-[var(--color-gold)] uppercase tracking-wider">
                {roleLabel}
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 glass">
          <button onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold">Dashboard</span>
          <div className="w-9" />
        </header>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 p-6 lg:p-10"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
