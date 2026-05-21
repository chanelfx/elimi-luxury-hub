import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, UserPlus, Users, ShieldCheck, X, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { createStaffUser, setStaffActive } from "@/lib/auth.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/staff")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const isSuper = (roles ?? []).some((r) => r.role === "super_admin");
    if (!isSuper) throw redirect({ to: "/dashboard" });
  },
  component: StaffPage,
});

interface StaffRow {
  user_id: string;
  email: string | null;
  display_name: string | null;
  phone: string | null;
  is_active: boolean;
  must_change_password: boolean;
  role: string;
}

function StaffPage() {
  const { user: me } = useAuth();
  const createFn = useServerFn(createStaffUser);
  const toggleFn = useServerFn(setStaffActive);

  const [rows, setRows] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id,email,display_name,phone,is_active,must_change_password")
      .order("created_at", { ascending: false });
    const { data: roles } = await supabase.from("user_roles").select("user_id,role");
    const roleMap = new Map<string, string[]>();
    (roles ?? []).forEach((r) => {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push(r.role);
      roleMap.set(r.user_id, arr);
    });
    const merged: StaffRow[] = (profiles ?? []).map((p) => {
      const userRoles = roleMap.get(p.user_id) ?? [];
      const display = userRoles.includes("super_admin")
        ? "super_admin"
        : userRoles.includes("admin")
          ? "admin"
          : userRoles.includes("employee")
            ? "employee"
            : "—";
      return { ...p, role: display } as StaffRow;
    });
    setRows(merged.filter((r) => r.role !== "—" || r.user_id === me?.id));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-2">
            Staff
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-7 w-7 text-[var(--color-gold)]" /> Team Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create admins and employees. They'll be required to change their password on first login.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[oklch(0.65_0.12_70)] text-[var(--color-gold-foreground)] font-semibold shadow-gold hover:opacity-90"
        >
          <UserPlus className="h-4 w-4" /> Add staff
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" /> Loading staff…
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No staff yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/5">
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.user_id} className="border-b border-white/5 last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
                          <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                        </div>
                        <div>
                          <div className="font-medium">{row.display_name ?? "—"}</div>
                          {row.phone && (
                            <div className="text-xs text-muted-foreground">{row.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{row.email}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-md text-[10px] uppercase tracking-wider bg-white/5 border border-white/10">
                        {row.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      {row.is_active ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-red-400">
                          <XCircle className="h-3.5 w-3.5" /> Disabled
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {row.role !== "super_admin" && (
                        <button
                          onClick={async () => {
                            const res = await toggleFn({
                              data: { user_id: row.user_id, is_active: !row.is_active },
                            });
                            if (res.ok) {
                              toast.success(row.is_active ? "Disabled" : "Activated");
                              load();
                            } else {
                              toast.error(res.error ?? "Failed");
                            }
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5"
                        >
                          {row.is_active ? "Disable" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateStaffModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            load();
          }}
          createFn={createFn}
        />
      )}
    </div>
  );
}

function CreateStaffModal({
  onClose,
  onCreated,
  createFn,
}: {
  onClose: () => void;
  onCreated: () => void;
  createFn: ReturnType<typeof useServerFn<typeof createStaffUser>>;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"admin" | "employee">("employee");
  const [password, setPassword] = useState(genPassword());
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await createFn({
      data: { email, display_name: name, phone, role, password },
    });
    setSubmitting(false);
    if (res.ok) {
      toast.success(`Staff created. Temp password: ${password}`);
      onCreated();
    } else {
      toast.error(res.error ?? "Failed to create");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass rounded-2xl p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-white/5"
        >
          <X className="h-4 w-4" />
        </button>
        <h2 className="text-xl font-bold mb-1">Add staff member</h2>
        <p className="text-xs text-muted-foreground mb-6">
          They'll receive this temporary password and must change it on first login.
        </p>
        <form onSubmit={onSubmit} className="space-y-3">
          <Field label="Display name" value={name} onChange={setName} required />
          <Field label="Email" type="email" value={email} onChange={setEmail} required />
          <Field label="Phone (optional)" value={phone} onChange={setPhone} />
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "employee")}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-gold)]/50 focus:outline-none"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
              Temporary password
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-gold)]/50 focus:outline-none font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setPassword(genPassword())}
                className="px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs"
              >
                Regen
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[oklch(0.65_0.12_70)] text-[var(--color-gold-foreground)] font-semibold shadow-gold disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Create staff
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-gold)]/50 focus:outline-none"
      />
    </div>
  );
}

function genPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$";
  let out = "";
  const arr = new Uint32Array(14);
  crypto.getRandomValues(arr);
  for (let i = 0; i < 14; i++) out += chars[arr[i] % chars.length];
  return out;
}
