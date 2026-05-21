import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <div className="max-w-5xl">
      <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-2">
        Analytics
      </div>
      <h1 className="text-3xl font-bold mb-2">Marketplace Analytics</h1>
      <p className="text-muted-foreground mb-8">
        Track views, likes, and listing performance.
      </p>
      <div className="glass rounded-2xl p-12 text-center">
        <BarChart3 className="h-10 w-10 text-[var(--color-gold)] mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Coming in Phase 4</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Charts for products per category, employee performance, and trending listings.
        </p>
      </div>
    </div>
  );
}
