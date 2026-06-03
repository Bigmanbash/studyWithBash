"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Mail, Phone, Lock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const signupSchema = z.object({
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
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SignupFormValues) => {
    console.log(data);
    // Handle signup logic here
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-[#485066] uppercase tracking-wide">
            How you found us
          </label>
          <div className="relative">
            <select
              className={`w-full appearance-none rounded-lg border bg-white px-3 py-2 text-base transition-colors focus-visible:outline-none focus-visible:ring-1 h-[44px] cursor-pointer ${
                errors.howDidYouFindUs
                  ? "border-[#EF4444] text-[#EF4444] focus-visible:border-[#EF4444] focus-visible:ring-[#EF4444]"
                  : "border-[#D1D5DB] text-[#070D17] focus-visible:border-[#3B82F6] focus-visible:ring-[#3B82F6]"
              }`}
              {...register("howDidYouFindUs")}
            >
              <option value="" disabled>Select an option</option>
              <option value="social-media">Social Media (Facebook, Instagram, Twitter)</option>
              <option value="friend">Referred by a friend</option>
              <option value="search-engine">Search Engine (Google)</option>
              <option value="other">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-neutral-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          {errors.howDidYouFindUs && (
            <p className="text-xs mt-1 text-[#EF4444]">
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
        className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-xl h-12 font-bold shadow-lg shadow-[#17A546]/20 disabled:opacity-70"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
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
        className="w-full h-12 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-[#0A1B39] hover:bg-neutral-50 transition-colors flex items-center justify-center gap-3"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      <p className="text-xs text-center text-[#98A2B3]">
        By signing up, you agree to our{" "}
        <a href="#" className="text-brand-green hover:underline">Terms</a> and{" "}
        <a href="#" className="text-brand-green hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
