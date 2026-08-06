import { AuthLayout, ResetPasswordForm } from "@/components/auth";

export default function ResetPassword() {
  return (
    <AuthLayout
      title="Create new password"
      subtitle="Your new password must be different from previous used passwords."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
