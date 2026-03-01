import { Suspense } from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import MessageCrud from "@/components/admin/MessageCrud";
import PaginationNav from "@/components/ui/PaginationNav";

export const metadata: Metadata = { title: "Messages | Circular Coffee Admin" };

const PAGE_SIZE = 10;

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const filter = { where: { archived: false } };
  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      ...filter,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.contactMessage.count(filter),
  ]);
  const pageCount = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Messages
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Inbox from the public contact form and direct inquiries.{" "}
          <span className="text-muted-foreground/60 font-normal">
            {total} unarchived
          </span>
        </p>
      </div>
      <MessageCrud items={messages} />
      <Suspense>
        <PaginationNav page={page} pageCount={pageCount} />
      </Suspense>
    </div>
  );
}
