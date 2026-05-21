import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SUPER_ADMIN_EMAIL = "admin@elimitrust.com";
const SUPER_ADMIN_PASSWORD = "Admin@2026";

/**
 * Idempotently seed the super admin account. Safe to call repeatedly.
 * - Creates the user if missing
 * - Ensures a profile row exists with must_change_password=true
 * - Ensures super_admin role is assigned
 */
export const seedSuperAdmin = createServerFn({ method: "POST" }).handler(async () => {
  // 1. Find or create user
  const { data: listed } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  let user = listed?.users.find((u) => u.email?.toLowerCase() === SUPER_ADMIN_EMAIL);

  if (!user) {
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: "Super Admin" },
    });
    if (createErr) {
      // Likely already exists from a race; re-fetch
      const { data: refetch } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      user = refetch?.users.find((u) => u.email?.toLowerCase() === SUPER_ADMIN_EMAIL);
      if (!user) {
        return { ok: false, error: createErr.message };
      }
    } else {
      user = created.user!;
    }
  }

  // 2. Ensure profile (handle_new_user trigger creates it; mark must_change_password)
  await supabaseAdmin
    .from("profiles")
    .upsert(
      {
        user_id: user.id,
        email: SUPER_ADMIN_EMAIL,
        display_name: "Super Admin",
        must_change_password: true,
        is_active: true,
      },
      { onConflict: "user_id" }
    );

  // 3. Ensure super_admin role
  await supabaseAdmin
    .from("user_roles")
    .upsert({ user_id: user.id, role: "super_admin" }, { onConflict: "user_id,role" });

  return { ok: true, email: SUPER_ADMIN_EMAIL };
});

/**
 * Create an employee/admin user (super_admin only). Returns generated password.
 */
export const createStaffUser = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        email: z.string().email(),
        display_name: z.string().min(1).max(120),
        phone: z.string().max(40).optional(),
        role: z.enum(["admin", "employee"]),
        password: z.string().min(8).max(72),
      })
      .parse(input)
  )
  .handler(async ({ data }) => {
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { display_name: data.display_name },
    });
    if (error || !created.user) {
      return { ok: false, error: error?.message ?? "Failed to create user" };
    }
    const userId = created.user.id;
    await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          user_id: userId,
          email: data.email,
          display_name: data.display_name,
          phone: data.phone ?? null,
          must_change_password: true,
          is_active: true,
        },
        { onConflict: "user_id" }
      );
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: data.role }, { onConflict: "user_id,role" });
    return { ok: true, user_id: userId };
  });

/**
 * Deactivate / reactivate a staff user (super_admin only enforced at call site via RLS on profiles).
 */
export const setStaffActive = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ user_id: z.string().uuid(), is_active: z.boolean() }).parse(input)
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ is_active: data.is_active })
      .eq("user_id", data.user_id);
    return { ok: !error, error: error?.message };
  });
