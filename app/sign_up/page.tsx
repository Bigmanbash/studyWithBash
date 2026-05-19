import Link from "next/link";
import { AuthLayout, SignupForm } from "@/components/auth";

export default function SignUp() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-green hover:text-brand-green/80 transition-colors">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthLayout>
  );
}
