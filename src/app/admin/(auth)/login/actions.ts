"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function login(
  _prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return "Please enter your email and password.";
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
    return null;
  } catch (error) {
    // NEXT_REDIRECT is a successful redirect — re-throw it so Next.js can handle it
    if ((error as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    if (error instanceof AuthError) {
      // v5 sometimes wraps CredentialsSignin inside CallbackRouteError
      const type =
        error.type === "CallbackRouteError"
          ? ((error as { cause?: { err?: { type?: string } } }).cause?.err
              ?.type ?? error.type)
          : error.type;
      if (type === "CredentialsSignin") {
        return "Invalid email or password.";
      }
      console.error("[login] AuthError:", error.type, error.message);
      return "An unexpected error occurred. Please try again.";
    }
    console.error("[login] unknown error:", error);
    return "Something went wrong. Please try again.";
  }
}
