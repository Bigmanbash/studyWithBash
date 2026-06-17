"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shield, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginWithEmail, logout } from "@/app/api/auth";

const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: AdminLoginValues) => {
    setServerError(null);

    const result = await loginWithEmail(data);

    if (!result.ok) {
      setServerError(result.error);
      return;
    }

    if (result.data.role !== "admin") {
      // A non-admin signed in through the admin portal — destroy their session
      // immediately to prevent auth state leaking into the student flow.
      await logout();
      setServerError("Unauthorized access. This portal is for administrators only.");
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {serverError && (
        <div className="flex items-start gap-3 rounded-lg border border-semantic-error-main/20 bg-semantic-error-support p-3">
          <AlertCircle className="h-4 w-4 text-semantic-error-main mt-0.5 shrink-0" />
          <p className="text-sm text-semantic-error-dark">{serverError}</p>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Admin Email"
          id="admin-email"
          type="email"
          autoComplete="email"
          placeholder="admin@bashacademy.com"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          id="admin-password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          iconType="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <input
            id="remember-admin"
            type="checkbox"
            className="h-4 w-4 rounded border-neutral-300 text-brand-green focus:ring-brand-green accent-[#17A546]"
            {...register("rememberMe")}
          />
          <label htmlFor="remember-admin" className="ml-2 block text-[#0A1B39]">
            Keep me signed in
          </label>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#17A546] hover:bg-[#17A546]/90 text-white shadow-lg shadow-[#17A546]/20 transition-all font-bold"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Authenticating...
          </span>
        ) : (
          <>
            <Shield className="h-4 w-4 mr-2" />
            Sign in to Admin
          </>
        )}
      </Button>

      {/* Security notice */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-[#F7F9FC] border border-neutral-100">
        <div className="h-8 w-8 rounded-lg bg-[#17A546]/10 flex items-center justify-center shrink-0">
          <Shield className="h-4 w-4 text-[#17A546]" />
        </div>
        <p className="text-xs text-[#676E85] leading-relaxed">
          This portal is restricted to authorized administrators only. All access is monitored and logged.
        </p>
      </div>
    </form>
  );
}
