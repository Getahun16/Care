"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendNewsletterWelcome, sendNewsletterBlast } from "@/lib/email";
import { requireAdmin } from "./guard";

// ─── Mailchimp sync ───────────────────────────────────────────────────────────
async function syncToMailchimp(email: string, name?: string) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const server = process.env.MAILCHIMP_SERVER; // e.g. "us21"

  if (!apiKey || !listId || !server) return; // skip if not configured

  const firstName = name?.split(" ")[0] ?? "";
  const lastName = name?.split(" ").slice(1).join(" ") ?? "";

  try {
    const res = await fetch(
      `https://${server}.api.mailchimp.com/3.0/lists/${listId}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          merge_fields: { FNAME: firstName, LNAME: lastName },
        }),
      }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      // 400 with title "Member Exists" is fine — already on list
      if (body?.title !== "Member Exists") {
        console.error("[syncToMailchimp] error:", body);
      }
    }
  } catch (err) {
    console.error("[syncToMailchimp] fetch failed:", err);
  }
}

// ─── Public: subscribe to newsletter ─────────────────────────────────────────
export async function subscribeNewsletter(
  fd: FormData
): Promise<{ error?: string; success?: boolean; alreadySubscribed?: boolean }> {
  const email = ((fd.get("email") as string) ?? "").trim().toLowerCase();
  const name = ((fd.get("name") as string) ?? "").trim() || undefined;
  const source = ((fd.get("source") as string) ?? "sidebar_widget").trim();

  if (!email || !/\S+@\S+\.\S+/.test(email))
    return { error: "Please enter a valid email address." };

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });

  if (existing) {
    if (existing.active) return { alreadySubscribed: true };
    // Re-activate
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { active: true, name: name ?? existing.name ?? undefined },
    });
  } else {
    await prisma.newsletterSubscriber.create({
      data: { email, name, source },
    });
  }

  // Fire-and-forget: welcome email + Mailchimp sync
  void sendNewsletterWelcome({ to: email, name }).catch(console.error);
  void syncToMailchimp(email, name).catch(console.error);
  revalidatePath("/admin/newsletter");
  return { success: true };
}

// ─── Admin: unsubscribe a subscriber ─────────────────────────────────────────
export async function unsubscribeEmail(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  try {
    await prisma.newsletterSubscriber.update({
      where: { id },
      data: { active: false },
    });
    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch {
    return { error: "Subscriber not found." };
  }
}

// ─── Admin: delete a subscriber ──────────────────────────────────────────────
export async function deleteSubscriber(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  try {
    await prisma.newsletterSubscriber.delete({ where: { id } });
    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch {
    return { error: "Subscriber not found." };
  }
}

// ─── Admin: send quarterly newsletter blast ───────────────────────────────────
export async function sendQuarterlyNewsletter(
  fd: FormData
): Promise<{ error?: string; sent?: number; errors?: number }> {
  await requireAdmin();
  const subject = ((fd.get("subject") as string) ?? "").trim();
  const headline = ((fd.get("headline") as string) ?? "").trim();
  const intro = ((fd.get("intro") as string) ?? "").trim();

  if (!subject) return { error: "Email subject is required." };
  if (!headline) return { error: "Headline is required." };
  if (!intro) return { error: "Intro paragraph is required." };

  const sections: { title: string; content: string; link?: string }[] = [];
  let i = 0;
  while (fd.get(`section_title_${i}`)) {
    sections.push({
      title: (fd.get(`section_title_${i}`) as string).trim(),
      content: (fd.get(`section_content_${i}`) as string).trim(),
      link: ((fd.get(`section_link_${i}`) as string) ?? "").trim() || undefined,
    });
    i++;
  }

  const activeSubscribers = await prisma.newsletterSubscriber.findMany({
    where: { active: true },
    select: { email: true },
  });

  if (activeSubscribers.length === 0) {
    return { error: "No active subscribers to send to." };
  }

  const emails = activeSubscribers.map((s) => s.email);
  const result = await sendNewsletterBlast({ subscribers: emails, subject, headline, intro, sections });
  return result;
}
