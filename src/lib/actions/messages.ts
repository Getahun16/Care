"use server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "./guard";

export async function markMessageRead(id: string, read: boolean): Promise<void> {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
}

export async function archiveMessage(id: string): Promise<void> {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { archived: true } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string): Promise<void> {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
}
