import Link from "next/link";
import { AuthLayout, LoginForm } from "@/components/auth";

export default function Login() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-brand-green hover:text-brand-green/80 transition-colors">
            Sign up for free
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
