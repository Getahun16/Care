"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "./guard";

export type PublicationFormState = { error?: string; success?: boolean };

export async function createPublication(
  _prev: PublicationFormState,
  form: FormData,
): Promise<PublicationFormState> {
  await requireAdmin();
  try {
    const year = parseInt(form.get("year") as string, 10);
    if (!form.get("title") || !form.get("authors") || isNaN(year)) {
      return { error: "Title, authors and year are required." };
    }
    await prisma.publication.create({
      data: {
        title: form.get("title") as string,
        authors: form.get("authors") as string,
        year,
        type: form.get("type") as any,
        pillar: (form.get("pillar") as any) || undefined,
        status: (form.get("status") as any) ?? "DRAFT",
        abstract: (form.get("abstract") as string) || undefined,
        url: (form.get("url") as string) || undefined,
        doi: (form.get("doi") as string) || undefined,
        pdfUrl: (form.get("pdfUrl") as string) || undefined,
      },
    });
    revalidatePath("/admin/publications");
    revalidatePath("/library");
    return { success: true };
  } catch (e: any) {
    console.error("[createPublication]", e);
    return { error: "Failed to create publication." };
  }
}

export async function updatePublication(
  id: string,
  _prev: PublicationFormState,
  form: FormData,
): Promise<PublicationFormState> {
  await requireAdmin();
  try {
    const year = parseInt(form.get("year") as string, 10);
    await prisma.publication.update({
      where: { id },
      data: {
        title: form.get("title") as string,
        authors: form.get("authors") as string,
        year,
        type: form.get("type") as any,
        pillar: (form.get("pillar") as any) || undefined,
        status: form.get("status") as any,
        abstract: (form.get("abstract") as string) || undefined,
        url: (form.get("url") as string) || undefined,
        doi: (form.get("doi") as string) || undefined,
        pdfUrl: (form.get("pdfUrl") as string) || null,
      },
    });
    revalidatePath("/admin/publications");
    revalidatePath("/library");
    return { success: true };
  } catch (e: any) {
    console.error("[updatePublication]", e);
    return { error: "Failed to update publication." };
  }
}

export async function deletePublication(id: string): Promise<void> {
  await requireAdmin();
  await prisma.publication.delete({ where: { id } });
  revalidatePath("/admin/publications");
  revalidatePath("/library");
}
