import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import Library from "@/views/Library";

export const metadata: Metadata = {
  title: "Research Library | Circular Coffee",
  description: "Browse, filter, and download all research outputs from the Circular Coffee project.",
};

export default async function LibraryPage() {
  const publications = await prisma.publication.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });
  return <Library publications={publications} />;
}
