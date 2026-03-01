"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "./actions";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm bg-secondary text-secondary-foreground hover:bg-leaf-bright disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-glow mt-2"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const [error, formAction] = useActionState(login, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-leaf/5 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-coffee/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/assets/CARES LOGO.png"
            alt="CARES Logo"
            width={72}
            height={72}
            className="w-18 h-18 rounded-full object-cover shadow-glow mb-4"
            priority
          />
          <h1 className="font-serif text-xl font-bold text-foreground text-center leading-snug">
            CARES
          </h1>
          <span className="text-leaf-bright text-xs font-medium mt-2 tracking-wide uppercase">Admin Portal</span>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl border border-border p-8 shadow-elevated">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-1">
            Sign in
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Enter your credentials to access the admin dashboard.
          </p>

          <form action={formAction} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-leaf-bright/50 focus:border-leaf-bright transition-colors text-sm"
                  placeholder="admin@circularcoffee.org"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-leaf-bright/50 focus:border-leaf-bright transition-colors text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                <span>⚠</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <SubmitButton />
          </form>


        </div>
      </div>
    </div>
  );
}
