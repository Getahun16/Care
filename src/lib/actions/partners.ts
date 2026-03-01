"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "./guard";

export type PartnerFormState = { error?: string; success?: boolean };

export async function createPartner(
  _prev: PartnerFormState,
  form: FormData,
): Promise<PartnerFormState> {
  await requireAdmin();
  try {
    const name = form.get("name") as string;
    if (!name?.trim()) return { error: "Partner name is required." };
    await prisma.partner.create({
      data: {
        name: name.trim(),
        logoUrl: (form.get("logoUrl") as string) || undefined,
        website: (form.get("website") as string) || undefined,
        order: parseInt((form.get("order") as string) || "0", 10),
        active: form.get("active") !== "false",
      },
    });
    revalidatePath("/admin/partners");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to create partner." };
  }
}

export async function updatePartner(
  id: string,
  _prev: PartnerFormState,
  form: FormData,
): Promise<PartnerFormState> {
  await requireAdmin();
  try {
    const name = form.get("name") as string;
    if (!name?.trim()) return { error: "Partner name is required." };
    await prisma.partner.update({
      where: { id },
      data: {
        name: name.trim(),
        logoUrl: (form.get("logoUrl") as string) || null,
        website: (form.get("website") as string) || null,
        order: parseInt((form.get("order") as string) || "0", 10),
        active: form.get("active") !== "false",
      },
    });
    revalidatePath("/admin/partners");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update partner." };
  }
}

export async function deletePartner(id: string): Promise<void> {
  await requireAdmin();
  await prisma.partner.delete({ where: { id } });
  revalidatePath("/admin/partners");
  revalidatePath("/");
}
