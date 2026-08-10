"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, AlertCircle, Loader2, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginWithEmail, logout } from "@/app/api/auth/mutations";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type LoginMode = "student" | "agent";

export function LoginForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [serverError, setServerError] = useState<string | null>(null);
  const [mode, setMode] = useState<LoginMode>("student");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (session?.user) {
      const role = (session.user as { role?: string }).role;
      if (role === "agent") {
        router.replace("/agent/dashboard");
      } else if (role !== "admin" && role !== "pending_agent") {
        router.replace("/dashboard");
      }
    }
  }, [session, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);

    const result = await loginWithEmail(data);

    if (!result.ok) {
      setServerError(result.error);
      return;
    }

    // This is the student login page — admin accounts must not authenticate here.
    // Destroy the session immediately and reject the attempt.
    if (result.data.role === "admin") {
      await logout();
      setServerError("Admin accounts cannot sign in here. Please use the admin portal.");
      return;
    }

    // Pending agents haven't been approved yet — sign them out and show a message.
    if (result.data.role === "pending_agent") {
      await logout();
      setServerError("Your agent profile is still under review. You'll be able to log in once an admin approves your account.");
      return;
    }

    // Agent logging in via the "Student" tab? Still route them correctly.
    if (result.data.role === "agent") {
      router.push("/agent/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {/* ── Role Tab Selector ────────────────────────────────────────── */}
      <div className="flex rounded-md border border-neutral-200 bg-neutral-50/80 p-1 gap-1">
        <button
          type="button"
          onClick={() => { setMode("student"); setServerError(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${mode === "student"
              ? "bg-white text-[#0A1B39] shadow-sm border border-neutral-200/60"
              : "text-[#98A2B3] hover:text-[#676E85]"
            }`}
        >
          <GraduationCap className="w-4 h-4" />
          Student
        </button>
        <button
          type="button"
          onClick={() => { setMode("agent"); setServerError(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${mode === "agent"
              ? "bg-white text-[#0A1B39] shadow-sm border border-neutral-200/60"
              : "text-[#98A2B3] hover:text-[#676E85]"
            }`}
        >
          <Briefcase className="w-4 h-4" />
          Agent
        </button>
      </div>

      {/* Context hint */}
      <p className="text-[11px] text-[#98A2B3] text-center -mt-1">
        {mode === "student"
          ? "Sign in to access your courses and materials."
          : "Sign in to manage your referrals and commissions."}
      </p>

      {/* Server-level error banner */}
      {serverError && (
        <div className="flex items-start gap-3 rounded-md border border-semantic-error-main/20 bg-semantic-error-support p-3">
          <AlertCircle className="h-4 w-4 text-semantic-error-main mt-0.5 shrink-0" />
          <p className="text-sm text-semantic-error-dark">{serverError}</p>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Email address"
          id="email-address"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          icon={<Mail size={18} />}
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          iconType="password"
          icon={<Lock size={18} />}
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
        />
      </div>

      <div className="flex items-center justify-between text-[13px] sm:text-sm">
        <div className="flex items-center gap-2">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-neutral-300 text-brand-green focus:ring-brand-green accent-[#17A546]"
            {...register("rememberMe")}
          />
          <label htmlFor="remember-me" className="text-[#0A1B39] select-none">
            Remember me
          </label>
        </div>
        <Link href="/forgot-password" className="font-semibold text-brand-green hover:text-brand-green/80 transition-colors">
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-md h-11 sm:h-12 font-bold text-[14px] sm:text-[15px] shadow-lg shadow-[#17A546]/20 disabled:opacity-70 transition-all"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </span>
        ) : mode === "agent" ? (
          "Sign in as Agent"
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="text-[11px] sm:text-xs text-center text-[#98A2B3] leading-relaxed">
        By signing in, you agree to our{" "}
        <a href="#" className="text-brand-green hover:underline">Terms</a> and{" "}
        <a href="#" className="text-brand-green hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
