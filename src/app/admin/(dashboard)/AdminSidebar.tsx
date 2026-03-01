"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Coffee,
  LayoutDashboard,
  Users,
  Newspaper,
  BookOpen,
  Beaker,
  TrendingUp,
  Mail,
  Bell,
  LogOut,
  ChevronLeft,
  Menu,
  Handshake,
  UserCog,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Research", href: "/admin/research", icon: Beaker },
  { label: "Team", href: "/admin/team", icon: Users },
  { label: "News & Events", href: "/admin/news", icon: Newspaper },
  { label: "Publications", href: "/admin/publications", icon: BookOpen },
  { label: "Impact", href: "/admin/impact", icon: TrendingUp },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Newsletter", href: "/admin/newsletter", icon: Bell },
  { label: "Partners", href: "/admin/partners", icon: Handshake },
];

export function AdminSidebar({
  user,
}: {
  user?: { name?: string | null; email?: string | null } | null;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay – hidden on desktop */}
      <aside
        className={`flex flex-col bg-card border-r border-border transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
          <Image
            src="/assets/CARES LOGO.png"
            alt="CARES Logo"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover shadow-glow shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-serif font-bold text-sm leading-none block text-foreground truncate">
                CARES
              </span>
              <span className="text-xs text-leaf-bright tracking-widest uppercase">
                Admin
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="ml-auto p-1 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <Menu className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                  isActive
                    ? "bg-accent text-leaf-bright"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon
                  className={`w-4 h-4 shrink-0 ${isActive ? "text-leaf-bright" : "text-muted-foreground group-hover:text-foreground"}`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-border p-3">
          {!collapsed && user && (
            <div className="px-2 py-2 mb-2">
              <p className="text-xs font-medium text-foreground truncate">
                {user.name ?? "Admin"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          )}
          <Link
            href="/admin/profile"
            title={collapsed ? "Profile & Settings" : undefined}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <UserCog className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Profile &amp; Settings</span>}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            title={collapsed ? "Sign out" : undefined}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>

          {/* Back to site */}
          <Link
            href="/"
            title={collapsed ? "Back to site" : undefined}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mt-0.5"
          >
            <Coffee className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Back to site</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
