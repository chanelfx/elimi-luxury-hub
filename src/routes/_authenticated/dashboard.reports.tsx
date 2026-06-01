import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { FileText, Loader2, Send, CheckCircle2, Users as UsersIcon, Package } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { submitDailyReport } from "@/lib/reports.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/reports")({
  component: ReportsPage,
});

interface ReportRow {
  id: string;
  user_id: string;
  report_date: string;
  summary: string;
  products_added: number;
  customers_contacted: number;
  notes: string | null;
  created_at: string;
}

function ReportsPage() {
  const { user, isAdmin } = useAuth();
  const submit = useServerFn(submitDailyReport);
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState("");
  const [productsAdded, setProductsAdded] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const todayMine = rows.find((r) => r.user_id === user?.id && r.report_date === today);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("daily_reports")
      .select("*")
      .order("report_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(200);
    const reports = ((data ?? []) as unknown) as ReportRow[];
    setRows(reports);
    if (isAdmin) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, display_name, email");
      const map: Record<string, string> = {};
      (profs ?? []).forEach((p) => {
        map[p.user_id] = p.display_name ?? p.email ?? "—";
      });
      setProfiles(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (todayMine) {
      setSummary(todayMine.summary);
      setProductsAdded(todayMine.products_added);
      setCustomers(todayMine.customers_contacted);
      setNotes(todayMine.notes ?? "");
    }
  }, [todayMine?.id]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (summary.trim().length < 5) return toast.error("Please write a summary");
    setSubmitting(true);
    const res = await submit({
      data: {
        summary: summary.trim(),
        products_added: productsAdded,
        customers_contacted: customers,
        notes: notes.trim() || null,
      },
    });
    setSubmitting(false);
    if (res.ok) {
      toast.success(todayMine ? "Report updated" : "Report submitted");
      load();
    } else toast.error(res.error ?? "Failed");
  };

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-2">
          Reports
        </div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FileText className="h-7 w-7 text-[var(--color-gold)]" /> Daily Reports
        </h1>
        <p className="text-muted-foreground mt-2">
          Submit a short summary of your day. Required before signing out.
        </p>
      </div>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          {todayMine ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <FileText className="h-5 w-5 text-[var(--color-gold)]" />
          )}
          <h2 className="font-semibold">
            {todayMine ? "Today's report (you can update it)" : "Submit today's report"}
          </h2>
          <span className="ml-auto text-xs text-muted-foreground">{today}</span>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
            Summary
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            maxLength={4000}
            placeholder="What did you work on today?"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-gold)]/50 focus:outline-none text-sm"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
              <Package className="h-3 w-3 inline mr-1" /> Products added
            </label>
            <input
              type="number"
              min={0}
              value={productsAdded}
              onChange={(e) => setProductsAdded(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-gold)]/50 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
              <UsersIcon className="h-3 w-3 inline mr-1" /> Customers contacted
            </label>
            <input
              type="number"
              min={0}
              value={customers}
              onChange={(e) => setCustomers(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-gold)]/50 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            maxLength={2000}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-gold)]/50 focus:outline-none text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[oklch(0.65_0.12_70)] text-[var(--color-gold-foreground)] font-semibold shadow-gold disabled:opacity-50"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {todayMine ? "Update report" : "Submit"}
        </button>
      </motion.form>

      <div>
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
          {isAdmin ? "All recent reports" : "Your recent reports"}
        </h2>
        <div className="glass rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            </div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No reports yet</div>
          ) : (
            <div className="divide-y divide-white/5">
              {rows.map((r) => (
                <div key={r.id} className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="text-xs text-[var(--color-gold)] uppercase tracking-wider">
                        {r.report_date}
                      </div>
                      {isAdmin && (
                        <div className="text-sm font-medium mt-0.5">
                          {profiles[r.user_id] ?? r.user_id.slice(0, 8)}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex gap-4">
                      <span>📦 {r.products_added}</span>
                      <span>👥 {r.customers_contacted}</span>
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{r.summary}</p>
                  {r.notes && (
                    <p className="mt-2 text-xs text-muted-foreground border-l-2 border-white/10 pl-3">
                      {r.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
