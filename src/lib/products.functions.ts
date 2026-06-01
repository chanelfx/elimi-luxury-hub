import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- helpers ----------
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

const productInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2).max(180),
  description: z.string().max(8000).optional().nullable(),
  category: z.string().min(1).max(60),
  status: z.enum(["draft", "available", "reserved", "sold"]).default("available"),
  price: z.number().nullable().optional(),
  currency: z.string().min(3).max(3).default("RWF"),
  location: z.string().max(160).optional().nullable(),
  brand: z.string().max(80).optional().nullable(),
  condition: z.string().max(40).optional().nullable(),
  is_featured: z.boolean().default(false),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string(),
        width: z.number().optional(),
        height: z.number().optional(),
      })
    )
    .max(20)
    .default([]),
  attributes: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).default({}),
});

// ---------- create / update ----------
export const upsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => productInput.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    if (data.id) {
      const { error } = await supabaseAdmin
        .from("products")
        .update({
          title: data.title,
          description: data.description ?? null,
          category: data.category,
          status: data.status,
          price: data.price ?? null,
          currency: data.currency,
          location: data.location ?? null,
          brand: data.brand ?? null,
          condition: data.condition ?? null,
          is_featured: data.is_featured,
          images: data.images,
          attributes: data.attributes,
        })
        .eq("id", data.id);
      if (error) return { ok: false as const, error: error.message };
      return { ok: true as const, id: data.id };
    }

    // unique slug
    let slug = slugify(data.title) || "item";
    const { data: existing } = await supabaseAdmin
      .from("products")
      .select("slug")
      .like("slug", `${slug}%`);
    if (existing && existing.some((r) => r.slug === slug)) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }

    const { data: created, error } = await supabaseAdmin
      .from("products")
      .insert({
        title: data.title,
        slug,
        description: data.description ?? null,
        category: data.category,
        status: data.status,
        price: data.price ?? null,
        currency: data.currency,
        location: data.location ?? null,
        brand: data.brand ?? null,
        condition: data.condition ?? null,
        is_featured: data.is_featured,
        images: data.images,
        attributes: data.attributes,
        created_by: userId,
      })
      .select("id, slug")
      .single();

    if (error || !created) return { ok: false as const, error: error?.message ?? "Failed" };
    return { ok: true as const, id: created.id, slug: created.slug };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.from("products").delete().eq("id", data.id);
    return { ok: !error, error: error?.message };
  });

// ---------- like toggle (anonymous) ----------
export const toggleLike = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ product_id: z.string().uuid(), device_id: z.string().min(4).max(120) }).parse(input)
  )
  .handler(async ({ data }) => {
    const { data: existing } = await supabaseAdmin
      .from("product_likes")
      .select("id")
      .eq("product_id", data.product_id)
      .eq("device_id", data.device_id)
      .maybeSingle();

    if (existing) {
      await supabaseAdmin.from("product_likes").delete().eq("id", existing.id);
    } else {
      await supabaseAdmin
        .from("product_likes")
        .insert({ product_id: data.product_id, device_id: data.device_id });
    }

    const { count } = await supabaseAdmin
      .from("product_likes")
      .select("*", { count: "exact", head: true })
      .eq("product_id", data.product_id);

    await supabaseAdmin
      .from("products")
      .update({ likes_count: count ?? 0 })
      .eq("id", data.product_id);

    return { ok: true, liked: !existing, count: count ?? 0 };
  });

export const incrementView = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: row } = await supabaseAdmin
      .from("products")
      .select("views_count")
      .eq("id", data.id)
      .maybeSingle();
    if (!row) return { ok: false };
    await supabaseAdmin
      .from("products")
      .update({ views_count: (row.views_count ?? 0) + 1 })
      .eq("id", data.id);
    return { ok: true };
  });
