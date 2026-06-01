import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const submitDailyReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        summary: z.string().min(5).max(4000),
        products_added: z.number().int().min(0).max(1000).default(0),
        customers_contacted: z.number().int().min(0).max(1000).default(0),
        notes: z.string().max(2000).optional().nullable(),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await supabase.from("daily_reports").upsert(
      {
        user_id: userId,
        report_date: today,
        summary: data.summary,
        products_added: data.products_added,
        customers_contacted: data.customers_contacted,
        notes: data.notes ?? null,
      },
      { onConflict: "user_id,report_date" }
    );
    return { ok: !error, error: error?.message };
  });

export const hasTodayReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from("daily_reports")
      .select("id")
      .eq("user_id", userId)
      .eq("report_date", today)
      .maybeSingle();
    return { hasReport: !!data };
  });
