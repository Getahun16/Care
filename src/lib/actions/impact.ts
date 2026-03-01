"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "./guard";

export type ImpactFormState = { error?: string; success?: boolean };

export async function createImpactMetric(
  _prev: ImpactFormState,
  form: FormData
): Promise<ImpactFormState> {
  await requireAdmin();
  try {
    if (!form.get("label") || !form.get("value")) {
      return { error: "Label and value are required." };
    }
    const year = parseInt(form.get("year") as string, 10) || new Date().getFullYear();
    await prisma.impactMetric.create({
      data: {
        label: form.get("label") as string,
        value: form.get("value") as string,
        pillar: (form.get("pillar") as any) || undefined,
        year,
        notes: (form.get("notes") as string) || undefined,
      },
    });
    revalidatePath("/admin/impact");
    revalidatePath("/impact");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to create metric." };
  }
}

export async function updateImpactMetric(
  id: string,
  _prev: ImpactFormState,
  form: FormData
): Promise<ImpactFormState> {
  await requireAdmin();
  try {
    const year = parseInt(form.get("year") as string, 10) || new Date().getFullYear();
    await prisma.impactMetric.update({
      where: { id },
      data: {
        label: form.get("label") as string,
        value: form.get("value") as string,
        pillar: (form.get("pillar") as any) || undefined,
        year,
        notes: (form.get("notes") as string) || undefined,
      },
    });
    revalidatePath("/admin/impact");
    revalidatePath("/impact");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update metric." };
  }
}

export async function deleteImpactMetric(id: string): Promise<void> {
  await requireAdmin();
  await prisma.impactMetric.delete({ where: { id } });
  revalidatePath("/admin/impact");
  revalidatePath("/impact");
}
