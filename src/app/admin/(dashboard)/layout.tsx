import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | CARES",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar user={session?.user} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
