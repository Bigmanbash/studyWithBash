"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Phone, Lock, ChevronDown, AlertCircle, Loader2, CheckCircle2, School, Users, Tag, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerStudent, registerAsAgent } from "@/app/api/auth/mutations";
import { useState } from "react";

const baseSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  whatsappNumber: z.string().min(10, "Please enter a valid WhatsApp number"),
  howDidYouFindUs: z.string().min(1, "Please select an option"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  isAgent: z.boolean(),
  schoolName: z.string().optional(),
  estimatedStudents: z.coerce.number().optional(),
  referralCode: z.string().optional(),
});

const signupSchema = baseSchema
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.isAgent && (!data.schoolName || data.schoolName.trim().length < 2)) {
        return false;
      }
      return true;
    },
    {
      message: "Please enter your school name",
      path: ["schoolName"],
    }
  );

type SignupFormValues = z.infer<typeof baseSchema>;

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    // @ts-expect-error Zod refined schemas produce a minor type mismatch with react-hook-form resolver
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      isAgent: false,
    },
  });

  const isAgent = watch("isAgent");

  const onSubmit = async (data: SignupFormValues) => {
    setServerError(null);

    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      whatsappNumber: data.whatsappNumber,
      howDidYouFindUs: data.howDidYouFindUs,
      password: data.password,
    };

    let result;

    if (data.isAgent) {
      result = await registerAsAgent({
        ...payload,
        isAgent: true,
        schoolName: data.schoolName,
        estimatedStudents: data.estimatedStudents,
      });
    } else {
      result = await registerStudent({
        ...payload,
        referralCode: data.referralCode,
      });
    }

    if (!result.ok) {
      setServerError(result.error);
      return;
    }

    setIsSuccess(true);

    if (data.isAgent) {
      // Agent signup creates a session automatically via Better Auth,
      // but agents shouldn't be logged in until approved by admin.
      // Sign them out immediately and show "pending approval" message.
      const { signOut } = await import("@/lib/auth-client");
      await signOut();
      // Don't redirect — the success state shows "pending approval" message
    } else {
      // Student signup — redirect to dashboard after brief success animation
      setTimeout(() => router.push("/dashboard"), 1200);
    }
  };

  // ── Success state ─────────────────────────────────────────────────────────
  if (isSuccess) {
    if (isAgent) {
      // Agent: pending approval — no auto-login, show status message
      return (
        <div className="flex flex-col items-center justify-center gap-5 py-8 text-center">
          <div className="h-16 w-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
            <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-[#0A1B39]">
              Application Submitted!
            </p>
            <p className="text-sm text-[#676E85] mt-2 mx-auto leading-relaxed">
              Your teacher/agent profile is currently under review. You&apos;ll be able to log in once an admin approves your account.
            </p>
            {/* TODO: Send confirmation email to agent via Resend when approved */}
          </div>
          <a
            href="/login"
            className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-md bg-[#17A546] text-white text-sm font-bold hover:bg-[#128a39] transition-colors"
          >
            Go to Login
          </a>
        </div>
      );
    }

    // Student: account created successfully — redirecting
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <div className="h-14 w-14 rounded-full bg-semantic-success-support flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-semantic-success-dark" />
        </div>
        <div>
          <p className="text-base font-bold text-[#0A1B39]">Account created!</p>
          <p className="text-sm text-[#676E85] mt-1">Taking you to your dashboard...</p>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-brand-green animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit as any)}>
      {/* Server-level error banner */}
      {serverError && (
        <div className="flex items-start gap-3 rounded-md border border-semantic-error-main/20 bg-semantic-error-support p-3">
          <AlertCircle className="h-4 w-4 text-semantic-error-main mt-0.5 shrink-0" />
          <p className="text-sm text-semantic-error-dark">{serverError}</p>
        </div>
      )}

      {/* ── Role Tab Selector ──────────────────────────────────────── */}
      <div className="flex rounded-md border border-neutral-200 bg-neutral-50/80 p-1 gap-1">
        <button
          type="button"
          onClick={() => setValue("isAgent", false, { shouldValidate: true })}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${!isAgent
              ? "bg-white text-[#0A1B39] shadow-sm border border-neutral-200/60"
              : "text-[#98A2B3] hover:text-[#676E85]"
            }`}
        >
          <GraduationCap className="w-4 h-4" />
          Student
        </button>
        <button
          type="button"
          onClick={() => setValue("isAgent", true, { shouldValidate: true })}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${isAgent
              ? "bg-white text-[#0A1B39] shadow-sm border border-neutral-200/60"
              : "text-[#98A2B3] hover:text-[#676E85]"
            }`}
        >
          <Briefcase className="w-4 h-4" />
          Teacher / Agent
        </button>
      </div>

      {/* Context hint */}
      <p className="text-[11px] text-[#98A2B3] text-center -mt-1 pb-2">
        {!isAgent
          ? "Sign up to access your courses and materials."
          : "Sign up to earn commissions by referring students."}
      </p>

      <div className="space-y-3.5 sm:space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Input
            label="First Name"
            id="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="John"
            icon={<User size={18} />}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last Name"
            id="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Doe"
            icon={<User size={18} />}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <Input
          label="Email address"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="john@example.com"
          icon={<Mail size={18} />}
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="WhatsApp Number"
          id="whatsappNumber"
          type="tel"
          placeholder="e.g. 08012345678"
          icon={<Phone size={18} />}
          error={!!errors.whatsappNumber}
          helperText={errors.whatsappNumber?.message}
          {...register("whatsappNumber")}
        />

        {/* ── Agent-specific fields ──────────────────────────────────── */}
        {isAgent && (
          <>
            <Input
              label="School Name"
              id="schoolName"
              type="text"
              placeholder="e.g. Federal Government College Lagos"
              icon={<School size={18} />}
              error={!!errors.schoolName}
              helperText={errors.schoolName?.message}
              {...register("schoolName")}
            />
            <Input
              label="Approximate Number of Students"
              id="estimatedStudents"
              type="number"
              placeholder="e.g. 50"
              icon={<Users size={18} />}
              error={!!errors.estimatedStudents}
              helperText={errors.estimatedStudents?.message}
              {...register("estimatedStudents")}
            />
          </>
        )}

        {/* ── Referral code (students only) ──────────────────────────── */}
        {!isAgent && (
          <Input
            label="Referral Code (Optional)"
            id="referralCode"
            type="text"
            placeholder="e.g. BSH-K3P1M7"
            icon={<Tag size={18} />}
            error={!!errors.referralCode}
            helperText={errors.referralCode?.message}
            {...register("referralCode")}
          />
        )}

        {/* How did you find us — custom select */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[13px] sm:text-sm font-medium text-[#485066] uppercase tracking-wide">
            How you found us
          </label>
          <div className="relative">
            <select
              className={`w-full appearance-none rounded-md border bg-white px-3 py-2 text-[15px] sm:text-base transition-colors focus-visible:outline-none focus-visible:ring-1 h-[42px] sm:h-[44px] cursor-pointer ${errors.howDidYouFindUs
                  ? "border-semantic-error-main text-semantic-error-main focus-visible:ring-semantic-error-main"
                  : "border-[#D1D5DB] text-[#070D17] focus-visible:border-[#17A546] focus-visible:ring-[#17A546]"
                }`}
              {...register("howDidYouFindUs")}
            >
              <option value="" disabled>Select an option</option>
              <option value="social-media">Social Media (Facebook, Instagram, Twitter)</option>
              <option value="friend">Referred by a friend</option>
              <option value="teacher">Referred by a teacher</option>
              <option value="search-engine">Search Engine (Google)</option>
              <option value="other">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-neutral-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          {errors.howDidYouFindUs && (
            <p className="text-xs mt-0.5 text-semantic-error-main">
              {errors.howDidYouFindUs.message}
            </p>
          )}
        </div>

        <Input
          label="Password"
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          iconType="password"
          icon={<Lock size={18} />}
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
        />

        <Input
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          iconType="password"
          icon={<Lock size={18} />}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          {...register("confirmPassword")}
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
            {isAgent ? "Submitting application..." : "Creating account..."}
          </span>
        ) : isAgent ? (
          "Apply as Teacher / Agent"
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-[11px] sm:text-xs text-center text-[#98A2B3] leading-relaxed">
        By signing up, you agree to our{" "}
        <a href="#" className="text-brand-green hover:underline">Terms</a> and{" "}
        <a href="#" className="text-brand-green hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
