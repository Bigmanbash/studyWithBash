"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/auth-client";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setServerError(null);
    setSuccess(false);

    try {
      const { error } = await requestPasswordReset({
        email: data.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        setServerError(error.message || "Failed to send reset email");
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred");
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto w-16 h-16 bg-[#E7F6EC] rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-[#17A546]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#0A1B39]">Check your email</h3>
          <p className="text-[#676E85] text-sm">
            We sent a password reset link to your email. Click the link inside to set a new password.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/login" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#0A1B39] hover:text-[#17A546] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

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
          label="Email address"
          id="email-address"
          type="email"
          autoComplete="email"
          placeholder="Enter the email associated with your account"
          icon={<Mail size={18} />}
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-xl h-11 sm:h-12 font-bold text-[14px] sm:text-[15px] shadow-lg shadow-[#17A546]/20 disabled:opacity-70 transition-all mt-6"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending link...
          </span>
        ) : (
          "Send reset link"
        )}
      </Button>

      <div className="pt-4 text-center">
        <Link href="/login" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#0A1B39] hover:text-[#17A546] transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>
    </form>
  );
}
