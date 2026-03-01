"use server";
import { auth } from "@/auth";

/**
 * Call at the top of any admin Server Action.
 * Returns the session so callers can access session.user if needed.
 * Throws a plain Error if there is no authenticated session — Next.js will
 * surface this as an internal error and the client component's transition will
 * stay in the "pending" / "error" state without exposing details.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  return session;
}
