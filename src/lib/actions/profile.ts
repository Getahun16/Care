"use server";
import { revalidatePath } from "next/cache";
import * as bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export type ProfileState = { error?: string; success?: string; updatedName?: string; updatedEmail?: string };

// Update name / email
export async function updateProfile(
  _prev: ProfileState,
  form: FormData
): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const userId = session.user.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "User not found." };

  const name = (form.get("name") as string | null)?.trim() ?? "";
  const email = (form.get("email") as string | null)?.trim().toLowerCase() ?? "";

  if (!name || !email) return { error: "Name and email are required." };

  try {
    const conflict = await prisma.user.findUnique({ where: { email } });
    if (conflict && conflict.id !== user.id) {
      return { error: "That email is already in use by another account." };
    }
    await prisma.user.update({ where: { id: user.id }, data: { name, email } });
    revalidatePath("/admin");
    return { success: "Profile updated successfully.", updatedName: name, updatedEmail: email };
  } catch (e) {
    console.error("[updateProfile]", e);
    return { error: "Failed to update profile." };
  }
}

// Change password
export async function changePassword(
  _prev: ProfileState,
  form: FormData
): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "User not found." };

  const current = form.get("currentPassword") as string | null;
  const next = form.get("newPassword") as string | null;
  const confirm = form.get("confirmPassword") as string | null;

  if (!current || !next || !confirm)
    return { error: "All password fields are required." };
  if (next.length < 8)
    return { error: "New password must be at least 8 characters." };
  if (next !== confirm)
    return { error: "New password and confirmation do not match." };

  try {
    const valid = await bcrypt.compare(current, user.passwordHash);
    if (!valid) return { error: "Current password is incorrect." };

    const hash = await bcrypt.hash(next, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });
    return { success: "Password changed successfully." };
  } catch (e) {
    console.error("[changePassword]", e);
    return { error: "Failed to change password." };
  }
}
