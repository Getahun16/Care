import type { Metadata } from "next";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';
import Team from "@/views/Team";

export const metadata: Metadata = {
  title: "Our Team | Circular Coffee",
  description: "A multidisciplinary research team spanning soil science, environmental engineering, economics, and gender studies.",
};

export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
  return <Team members={members} />;
}
