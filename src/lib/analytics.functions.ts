import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getAnalytics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { data: products } = await supabaseAdmin
      .from("products")
      .select("id, category, status, created_at, views_count, likes_count, created_by, title");

    const all = products ?? [];

    // Counts
    const total = all.length;
    const available = all.filter((p) => p.status === "available").length;
    const reserved = all.filter((p) => p.status === "reserved").length;
    const sold = all.filter((p) => p.status === "sold").length;

    // By category
    const byCategory = Object.entries(
      all.reduce<Record<string, number>>((acc, p) => {
        acc[p.category] = (acc[p.category] ?? 0) + 1;
        return acc;
      }, {})
    )
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // Per-day for last 14 days
    const days: { date: string; products: number }[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        date: key.slice(5),
        products: all.filter((p) => p.created_at.slice(0, 10) === key).length,
      });
    }

    // Top products by views + likes
    const top = [...all]
      .sort((a, b) => (b.views_count ?? 0) + (b.likes_count ?? 0) - ((a.views_count ?? 0) + (a.likes_count ?? 0)))
      .slice(0, 8)
      .map((p) => ({
        id: p.id,
        title: p.title,
        views: p.views_count,
        likes: p.likes_count,
      }));

    // Employee performance
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("user_id, display_name, email");
    const byEmployee = Object.entries(
      all.reduce<Record<string, number>>((acc, p) => {
        acc[p.created_by] = (acc[p.created_by] ?? 0) + 1;
        return acc;
      }, {})
    )
      .map(([user_id, count]) => {
        const prof = (profiles ?? []).find((x) => x.user_id === user_id);
        return { name: prof?.display_name ?? prof?.email ?? "Unknown", count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      counts: { total, available, reserved, sold },
      byCategory,
      perDay: days,
      top,
      byEmployee,
    };
  });
