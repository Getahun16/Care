"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  sendContactConfirmation,
  sendAdminContactNotification,
} from "@/lib/email";

export async function submitContactForm(
  fd: FormData
): Promise<{ error?: string; success?: boolean }> {
  const name = ((fd.get("name") as string) ?? "").trim() || "Anonymous";
  const email = ((fd.get("email") as string) ?? "").trim();
  const organisation = ((fd.get("org") as string) ?? "").trim() || undefined;
  const subject =
    ((fd.get("subject") as string) ?? "").trim() || "General Enquiry";
  const body = ((fd.get("message") as string) ?? "").trim();
  const subscribeNewsletter = fd.get("newsletter") === "on";

  if (!email || !/\S+@\S+\.\S+/.test(email))
    return { error: "A valid email address is required." };
  if (!body) return { error: "Please enter a message." };

  // Save contact message to DB
  await prisma.contactMessage.create({
    data: { name, email, organisation, subject, body },
  });

  // Handle newsletter opt-in from contact form
  if (subscribeNewsletter) {
    try {
      await prisma.newsletterSubscriber.upsert({
        where: { email },
        update: { active: true, name: name !== "Anonymous" ? name : undefined },
        create: {
          email,
          name: name !== "Anonymous" ? name : undefined,
          source: "contact_form",
        },
      });
    } catch {
      // duplicate email – subscriber already exists, no problem
    }
  }

  // Fire-and-forget emails (don't block response on email errors)
  void sendContactConfirmation({ to: email, name, subject }).catch(
    console.error
  );
  void sendAdminContactNotification({
    name,
    email,
    organisation,
    subject,
    body,
  }).catch(console.error);

  revalidatePath("/admin/messages");
  if (subscribeNewsletter) revalidatePath("/admin/newsletter");

  return { success: true };
}
