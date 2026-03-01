"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { User, KeyRound, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { updateProfile, changePassword, type ProfileState } from "@/lib/actions/profile";

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-leaf/50 focus:border-leaf-bright transition-colors";

function Alert({ state }: { state: ProfileState }) {
  if (!state.error && !state.success) return <div aria-hidden="true" />;
  return (
    <div
      role="alert"
      className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg border ${
        state.error
          ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
          : "bg-leaf/10 border-leaf/30 text-leaf-bright"
      }`}
    >
      {state.error ? (
        <AlertCircle className="w-4 h-4 shrink-0" />
      ) : (
        <CheckCircle className="w-4 h-4 shrink-0" />
      )}
      {state.error ?? state.success}
    </div>
  );
}

interface Props {
  defaultName: string;
  defaultEmail: string;
}

export default function ProfileForm({ defaultName, defaultEmail }: Props) {
  const [profileState, profileAction, profilePending] = useActionState<ProfileState, FormData>(
    updateProfile,
    {}
  );
  const [pwState, pwAction, pwPending] = useActionState<ProfileState, FormData>(
    changePassword,
    {}
  );

  // Controlled inputs — update immediately when server action returns updated values
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);

  useEffect(() => {
    if (profileState.updatedName) setName(profileState.updatedName);
    if (profileState.updatedEmail) setEmail(profileState.updatedEmail);
  }, [profileState.updatedName, profileState.updatedEmail]);

  // Reset password form on success
  const pwFormRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (pwState.success) pwFormRef.current?.reset();
  }, [pwState.success]);

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold mb-1">Account Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your profile information and password.
        </p>
      </div>

      {/* ── Profile Info ─────────────────────────────────────────────── */}
      <section className="glass-card rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full gradient-green flex items-center justify-center shadow-glow">
            <User className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <h2 className="font-serif font-semibold text-base">Profile Information</h2>
            <p className="text-xs text-muted-foreground">Update your display name and email address.</p>
          </div>
        </div>

        <Alert state={profileState} />

        <form action={profileAction} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Display Name <span className="text-rose-400">*</span>
            </label>
            <input
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={profilePending}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-colors text-sm font-semibold disabled:opacity-50"
          >
            {profilePending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {profilePending ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </section>

      {/* ── Change Password ──────────────────────────────────────────── */}
      <section className="glass-card rounded-2xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full gradient-coffee flex items-center justify-center shadow-glow">
            <KeyRound className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <h2 className="font-serif font-semibold text-base">Change Password</h2>
            <p className="text-xs text-muted-foreground">
              Choose a strong password of at least 8 characters.
            </p>
          </div>
        </div>

        <Alert state={pwState} />

        <form ref={pwFormRef} action={pwAction} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Current Password <span className="text-rose-400">*</span>
            </label>
            <input
              name="currentPassword"
              type="password"
              required
              placeholder="Enter current password"
              className={inputCls}
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              New Password <span className="text-rose-400">*</span>
            </label>
            <input
              name="newPassword"
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              className={inputCls}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Confirm New Password <span className="text-rose-400">*</span>
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              placeholder="Repeat new password"
              className={inputCls}
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            disabled={pwPending}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-colors text-sm font-semibold disabled:opacity-50"
          >
            {pwPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {pwPending ? "Updating…" : "Update Password"}
          </button>
        </form>
      </section>
    </div>
  );
}
