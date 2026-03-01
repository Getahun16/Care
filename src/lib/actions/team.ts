"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "./guard";

export type TeamFormState = { error?: string; success?: boolean };

export async function createTeamMember(
  _prev: TeamFormState,
  form: FormData
): Promise<TeamFormState> {
  await requireAdmin();
  try {
    if (!form.get("name") || !form.get("role") || !form.get("institution")) {
      return { error: "Name, role and institution are required." };
    }
    await prisma.teamMember.create({
      data: {
        name: form.get("name") as string,
        role: form.get("role") as string,
        institution: form.get("institution") as string,
        country: (form.get("country") as string) || "",
        pillar: (form.get("pillar") as any) || undefined,
        bio: (form.get("bio") as string) || undefined,
        email: (form.get("email") as string) || undefined,
        imageUrl: (form.get("imageUrl") as string) || undefined,
        active: form.get("active") === "true",
      },
    });
    revalidatePath("/admin/team");
    revalidatePath("/team");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to create team member." };
  }
}

export async function updateTeamMember(
  id: string,
  _prev: TeamFormState,
  form: FormData
): Promise<TeamFormState> {
  await requireAdmin();
  try {
    await prisma.teamMember.update({
      where: { id },
      data: {
        name: form.get("name") as string,
        role: form.get("role") as string,
        institution: form.get("institution") as string,
        country: (form.get("country") as string) || "",
        pillar: (form.get("pillar") as any) || undefined,
        bio: (form.get("bio") as string) || undefined,
        email: (form.get("email") as string) || undefined,
        imageUrl: (form.get("imageUrl") as string) || undefined,
        active: form.get("active") === "true",
      },
    });
    revalidatePath("/admin/team");
    revalidatePath("/team");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update team member." };
  }
}

export async function deleteTeamMember(id: string): Promise<void> {
  await requireAdmin();
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath("/admin/team");
  revalidatePath("/team");
}
