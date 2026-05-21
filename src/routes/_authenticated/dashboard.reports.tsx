import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="max-w-5xl">
      <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-2">
        Reports
      </div>
      <h1 className="text-3xl font-bold mb-2">Daily Reports</h1>
      <p className="text-muted-foreground mb-8">
        Employees submit a daily summary of their activities.
      </p>
      <div className="glass rounded-2xl p-12 text-center">
        <FileText className="h-10 w-10 text-[var(--color-gold)] mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Coming in Phase 4</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Logout gate that requires submitting today's report, plus admin review of all reports.
        </p>
      </div>
    </div>
  );
}
