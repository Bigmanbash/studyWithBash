"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginWithEmail } from "@/app/api/auth/mutations";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // If already authenticated, redirect away from login
  if (session?.user) {
    const role = (session.user as { role?: string }).role;
    router.replace(role === "admin" ? "/admin/dashboard" : "/dashboard");
    return null;
  }

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);

    const result = await loginWithEmail(data);

    if (!result.ok) {
      setServerError(result.error);
      return;
    }

    const role = result.data.role;
    router.push(role === "admin" ? "/admin/dashboard" : "/dashboard");
  };

  return (
    <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {/* Server-level error banner */}
      {serverError && (
        <div className="flex items-start gap-3 rounded-lg border border-semantic-error-main/20 bg-semantic-error-support p-3">
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
        <Link href="#" className="font-semibold text-brand-green hover:text-brand-green/80 transition-colors">
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-xl h-11 sm:h-12 font-bold text-[14px] sm:text-[15px] shadow-lg shadow-[#17A546]/20 disabled:opacity-70 transition-all"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-[#98A2B3]">or continue with</span>
        </div>
      </div>

      {/* Social login */}
      <button
        type="button"
        className="w-full h-11 sm:h-12 rounded-xl border border-neutral-200 bg-white text-[13px] sm:text-sm font-medium text-[#0A1B39] hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2.5"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>
    </form>
  );
}
