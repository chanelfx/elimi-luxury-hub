import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, KeyRound, User as UserIcon, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, phone })
      .eq("user_id", user.id);
    setSavingProfile(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile updated");
    refreshProfile();
  };

  const changePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) {
      await supabase
        .from("profiles")
        .update({ must_change_password: false })
        .eq("user_id", user.id);
      await refreshProfile();
    }
    setSavingPw(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-2">
          Settings
        </div>
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-muted-foreground mt-2">Manage your profile and security.</p>
      </div>

      <form onSubmit={saveProfile} className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <UserIcon className="h-4 w-4 text-[var(--color-gold)]" />
          <h2 className="font-semibold">Profile</h2>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
            Email
          </label>
          <input
            type="email"
            disabled
            value={user?.email ?? ""}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 opacity-60"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
            Display name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-gold)]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-gold)]/50 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={savingProfile}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50"
        >
          {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save profile
        </button>
      </form>

      <form onSubmit={changePassword} className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <KeyRound className="h-4 w-4 text-[var(--color-gold)]" />
          <h2 className="font-semibold">Change password</h2>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
            New password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-gold)]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
            Confirm new password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--color-gold)]/50 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={savingPw}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[oklch(0.65_0.12_70)] text-[var(--color-gold-foreground)] font-semibold shadow-gold hover:opacity-90 disabled:opacity-50"
        >
          {savingPw ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          Update password
        </button>
      </form>
    </div>
  );
}
