import { AuthLayout, ForgotPasswordForm } from "@/components/auth";

export default function ForgotPassword() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a link to reset your password."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
