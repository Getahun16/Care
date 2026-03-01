"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "./guard";

export type ResearchFormState = { error?: string; success?: boolean };

export async function createResearchProject(
  _prev: ResearchFormState,
  form: FormData
): Promise<ResearchFormState> {
  await requireAdmin();
  try {
    if (!form.get("title") || !form.get("pillar")) {
      return { error: "Title and pillar are required." };
    }
    await prisma.researchProject.create({
      data: {
        title: form.get("title") as string,
        pillar: form.get("pillar") as any,
        status: (form.get("status") as any) ?? "ACTIVE",
        lead: (form.get("lead") as string) || undefined,
        description: (form.get("description") as string) || undefined,
        startDate: form.get("startDate") ? new Date(form.get("startDate") as string) : undefined,
        endDate: form.get("endDate") ? new Date(form.get("endDate") as string) : undefined,
      },
    });
    revalidatePath("/admin/research");
    revalidatePath("/research");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to create research project." };
  }
}

export async function updateResearchProject(
  id: string,
  _prev: ResearchFormState,
  form: FormData
): Promise<ResearchFormState> {
  await requireAdmin();
  try {
    await prisma.researchProject.update({
      where: { id },
      data: {
        title: form.get("title") as string,
        pillar: form.get("pillar") as any,
        status: form.get("status") as any,
        lead: (form.get("lead") as string) || undefined,
        description: (form.get("description") as string) || undefined,
        startDate: form.get("startDate") ? new Date(form.get("startDate") as string) : undefined,
        endDate: form.get("endDate") ? new Date(form.get("endDate") as string) : undefined,
      },
    });
    revalidatePath("/admin/research");
    revalidatePath("/research");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update research project." };
  }
}

export async function deleteResearchProject(id: string): Promise<void> {
  await requireAdmin();
  await prisma.researchProject.delete({ where: { id } });
  revalidatePath("/admin/research");
  revalidatePath("/research");
}
