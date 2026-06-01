import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { BarChart3, Package, CheckCircle, Clock, ShoppingBag, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { getAnalytics } from "@/lib/analytics.functions";

export const Route = createFileRoute("/_authenticated/dashboard/analytics")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin" || r.role === "super_admin");
    if (!isAdmin) throw redirect({ to: "/dashboard" });
  },
  component: AnalyticsPage,
});

interface Data {
  counts: { total: number; available: number; reserved: number; sold: number };
  byCategory: { category: string; count: number }[];
  perDay: { date: string; products: number }[];
  top: { id: string; title: string; views: number; likes: number }[];
  byEmployee: { name: string; count: number }[];
}

const COLORS = ["oklch(0.82 0.14 85)", "oklch(0.70 0 0)", "oklch(0.50 0 0)", "oklch(0.35 0 0)", "oklch(0.90 0 0)"];

function AnalyticsPage() {
  const fn = useServerFn(getAnalytics);
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fn().then((d) => setData(d as Data));
  }, [fn]);

  if (!data) return <div className="text-sm text-muted-foreground">Loading analytics…</div>;

  const statusData = [
    { name: "Available", value: data.counts.available, color: "oklch(0.75 0.18 145)" },
    { name: "Reserved", value: data.counts.reserved, color: "oklch(0.80 0.15 75)" },
    { name: "Sold", value: data.counts.sold, color: "oklch(0.65 0.20 25)" },
  ];

  const cards = [
    { label: "Total Listings", value: data.counts.total, icon: Package },
    { label: "Available", value: data.counts.available, icon: CheckCircle },
    { label: "Reserved", value: data.counts.reserved, icon: Clock },
    { label: "Sold", value: data.counts.sold, icon: ShoppingBag },
  ];

  return (
    <div className="max-w-7xl space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-2">
          Analytics
        </div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="h-7 w-7 text-[var(--color-gold)]" /> Marketplace Analytics
        </h1>
        <p className="text-muted-foreground mt-2">Performance, categories, employees and trending items.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-[var(--color-gold)]" />
                </div>
              </div>
              <div className="text-2xl font-bold">{c.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Listings added (last 14 days)">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.perDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
              <XAxis dataKey="date" stroke="oklch(0.62 0 0)" fontSize={11} />
              <YAxis stroke="oklch(0.62 0 0)" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="products" stroke="oklch(0.82 0.14 85)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Status breakdown">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                {statusData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Products per category">
          <ResponsiveContainer width="100%" height={Math.max(260, data.byCategory.length * 28)}>
            <BarChart data={data.byCategory.slice(0, 12)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
              <XAxis type="number" stroke="oklch(0.62 0 0)" fontSize={11} allowDecimals={false} />
              <YAxis dataKey="category" type="category" stroke="oklch(0.62 0 0)" fontSize={11} width={110} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {data.byCategory.slice(0, 12).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top employees">
          {data.byEmployee.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.byEmployee}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="name" stroke="oklch(0.62 0 0)" fontSize={11} />
                <YAxis stroke="oklch(0.62 0 0)" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="oklch(0.82 0.14 85)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[var(--color-gold)]" /> Trending listings
        </h3>
        {data.top.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data</p>
        ) : (
          <ul className="space-y-2">
            {data.top.map((p, i) => (
              <li key={p.id} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
                <span className="flex items-center gap-3">
                  <span className="text-xs text-[var(--color-gold)] font-bold w-5">#{i + 1}</span>
                  <span>{p.title}</span>
                </span>
                <span className="text-xs text-muted-foreground flex gap-4">
                  <span>👁 {p.views}</span>
                  <span>❤ {p.likes}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const tooltipStyle = {
  background: "oklch(0.10 0 0)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: "8px",
  fontSize: "12px",
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
