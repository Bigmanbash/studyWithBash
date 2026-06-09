import { NextResponse } from "next/server";
import { getAdminCount } from "../queries";
import { auth } from "@/lib/auth";
import { db } from "@/lib/neon";
import { user as userSchema } from "@/lib/neon/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const adminCount = await getAdminCount();

    if (adminCount > 0) {
      return NextResponse.json(
        { error: "Admin already exists. Installation disabled." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Since Better Auth exposes its internal API on the auth object
    // Or we can register a user, then update them to admin
    // Or directly use signUp.email through the auth context if possible, 
    // but better auth might not let us set 'role' to 'admin' securely from client.
    // However, on the server, we can create the user using BetterAuth API.
    // We can also insert into the database directly if we prefer, but better-auth handles passwords.
    
    // Instead of raw DB insert, we can use auth.api.signUpEmail on server side
    // Actually, `auth.api.signUpEmail` requires headers to create a session.
    // Let's create the user directly via auth.api... or wait, Better Auth's `signUpEmail` works.
    
    // As per better-auth, server-side registration:
    const signUpResult = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      asResponse: false
    });

    // Update the role directly in the DB since input: false prevents setting it via the API
    await db.update(userSchema)
      .set({ role: "admin" })
      .where(eq(userSchema.id, signUpResult.user.id));

    return NextResponse.json({ user: { ...signUpResult.user, role: "admin" } });
  } catch (error: any) {
    console.error("Install admin error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create admin" },
      { status: 500 }
    );
  }
}
