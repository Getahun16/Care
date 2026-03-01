import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export const metadata = { title: "Account Settings" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const defaultName = session.user.name ?? "";
  const defaultEmail = session.user.email ?? "";

  return (
    <ProfileForm
      defaultName={defaultName}
      defaultEmail={defaultEmail}
    />
  );
}
