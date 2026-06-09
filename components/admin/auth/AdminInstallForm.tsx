"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { installFirstAdmin } from "@/app/api/adminUser";
import { loginWithEmail } from "@/app/api/auth";

const installSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type InstallFormValues = z.infer<typeof installSchema>;

export function AdminInstallForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InstallFormValues>({
    resolver: zodResolver(installSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: InstallFormValues) => {
    setServerError(null);

    // 1. Create the admin user
    const installResult = await installFirstAdmin(data);

    if (!installResult.ok) {
      setServerError(installResult.error);
      return;
    }

    // 2. Log them in directly
    const loginResult = await loginWithEmail({
      email: data.email,
      password: data.password,
    });

    if (!loginResult.ok) {
      setServerError("Admin created, but auto-login failed. Please sign in manually.");
      setTimeout(() => router.push("/admin/login"), 2000);
      return;
    }

    // 3. Redirect to dashboard
    router.push("/admin/dashboard");
  };

  return (
    <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {serverError && (
        <div className="flex items-start gap-3 rounded-lg border border-semantic-error-main/20 bg-semantic-error-support p-3">
          <AlertCircle className="h-4 w-4 text-semantic-error-main mt-0.5 shrink-0" />
          <p className="text-sm text-semantic-error-dark">{serverError}</p>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Full Name"
          id="name"
          type="text"
          autoComplete="name"
          placeholder="e.g. System Admin"
          icon={<User size={18} />}
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Admin Email"
          id="email-address"
          type="email"
          autoComplete="email"
          placeholder="admin@bashacademy.com"
          icon={<Mail size={18} />}
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Admin Password"
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Choose a strong password"
          iconType="password"
          icon={<Lock size={18} />}
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-md h-11 sm:h-12 font-bold text-[14px] sm:text-[15px] shadow-lg shadow-[#17A546]/20 disabled:opacity-70 transition-all"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Initializing System...
          </span>
        ) : (
          "Initialize Platform"
        )}
      </Button>

      <div className="flex items-center gap-2 p-3 rounded-md bg-[#F7F9FC] border border-neutral-100">
        <div className="h-8 w-8 rounded-lg bg-[#17A546]/10 flex items-center justify-center shrink-0">
          <Lock className="h-4 w-4 text-[#17A546]" />
        </div>
        <p className="text-xs text-[#676E85] leading-relaxed">
          This route will be permanently disabled after the first administrator is created.
        </p>
      </div>
    </form>
  );
}
