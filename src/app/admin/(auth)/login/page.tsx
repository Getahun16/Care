import { LoginForm } from "./LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Circular Coffee",
};

export default function AdminLoginPage() {
  return <LoginForm />;
}
