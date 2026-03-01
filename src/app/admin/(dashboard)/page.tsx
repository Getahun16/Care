import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  Users,
  Newspaper,
  BookOpen,
  TrendingUp,
  Coffee,
  ArrowUpRight,
  FileText,
  Calendar,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Circular Coffee Admin",
};

const recentActivity = [
  {
    type: "publication",
    title: "Biochar yield optimization study published",
    time: "2 hours ago",
    status: "success",
    icon: FileText,
  },
  {
    type: "event",
    title: "AAU Symposium scheduled for March 15",
    time: "Yesterday",
    status: "pending",
    icon: Calendar,
  },
  {
    type: "message",
    title: "New inquiry from Yirgacheffe Cooperative",
    time: "2 days ago",
    status: "warning",
    icon: Mail,
  },
  {
    type: "team",
    title: "Dr. Sara Tesfaye profile updated",
    time: "3 days ago",
    status: "success",
    icon: Users,
  },
  {
    type: "publication",
    title: "Policy brief draft submitted for review",
    time: "4 days ago",
    status: "pending",
    icon: FileText,
  },
];

const quickActions = [
  { label: "Add Publication", href: "/admin/publications/new", icon: BookOpen },
  { label: "Create News Post", href: "/admin/news/new", icon: Newspaper },
  { label: "Add Team Member", href: "/admin/team/new", icon: Users },
  { label: "View Messages", href: "/admin/messages", icon: Mail },
];

const pillarProgress = [
  { name: "Soil Health", progress: 72, publications: 10, color: "bg-leaf-bright" },
  { name: "Waste Valorization", progress: 58, publications: 8, color: "bg-amber-400" },
  { name: "Socio-Economic", progress: 45, publications: 6, color: "bg-blue-400" },
];

const statusIcon = {
  success: <CheckCircle className="w-4 h-4 text-leaf-bright" />,
  pending: <Clock className="w-4 h-4 text-amber-400" />,
  warning: <AlertCircle className="w-4 h-4 text-rose-400" />,
};

export default async function AdminDashboardPage() {
  const session = await auth();

  const [pubCount, teamCount, newsCount, msgCount] = await Promise.all([
    prisma.publication.count(),
    prisma.teamMember.count({ where: { active: true } }),
    prisma.newsEvent.count(),
    prisma.contactMessage.count({ where: { read: false, archived: false } }),
  ]);

  const stats = [
    {
      label: "Publications",
      value: String(pubCount),
      change: "All time",
      trend: "up" as const,
      icon: BookOpen,
      color: "text-leaf-bright",
      bg: "bg-leaf/10",
      href: "/admin/publications",
    },
    {
      label: "Team Members",
      value: String(teamCount),
      change: "Active",
      trend: "up" as const,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      href: "/admin/team",
    },
    {
      label: "News & Events",
      value: String(newsCount),
      change: "All time",
      trend: "up" as const,
      icon: Newspaper,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      href: "/admin/news",
    },
    {
      label: "Unread Messages",
      value: String(msgCount),
      change: msgCount > 0 ? `${msgCount} need attention` : "All caught up",
      trend: "neutral" as const,
      icon: Mail,
      color: "text-rose-400",
      bg: "bg-rose-400/10",
      href: "/admin/messages",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back,{" "}
            <span className="text-foreground font-medium">
              {session?.user?.name ?? "Admin"}
            </span>
            . Here&apos;s what&apos;s happening with the Circular Coffee project.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="tag-pill">
            <Coffee className="w-3 h-3 inline mr-1" />
            Admin
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="glass-card rounded-xl border border-border p-5 hover:border-leaf-bright/30 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-leaf-bright transition-colors" />
            </div>
            <div className="text-2xl font-bold text-foreground font-serif mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground font-sans">{stat.label}</div>
            <div className={`text-xs mt-1 ${stat.trend === "up" ? "text-leaf-bright" : "text-muted-foreground"}`}>
              {stat.change}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif font-semibold text-foreground">
              Recent Activity
            </h2>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.time}
                  </p>
                </div>
                <div className="shrink-0 mt-1">
                  {statusIcon[item.status as keyof typeof statusIcon]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="glass-card rounded-xl border border-border p-5">
            <h2 className="font-serif font-semibold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors group"
                >
                  <action.icon className="w-4 h-4 shrink-0 group-hover:text-leaf-bright transition-colors" />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Research Pillars Progress */}
          <div className="glass-card rounded-xl border border-border p-5">
            <h2 className="font-serif font-semibold text-foreground mb-4">
              Research Pillars
            </h2>
            <div className="space-y-4">
              {pillarProgress.map((pillar) => (
                <div key={pillar.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-foreground">{pillar.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {pillar.publications} papers
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${pillar.color} rounded-full`}
                      style={{ width: `${pillar.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pillar.progress}% milestones complete
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="glass-card rounded-xl border border-border p-6">
        <h2 className="font-serif font-semibold text-foreground mb-5">
          Project Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Farmers Reached", value: "1,200+", icon: Users },
            { label: "Soil Fertility Gain", value: "34%", icon: TrendingUp },
            { label: "PhD Candidates", value: "8", icon: BookOpen },
            { label: "Waste Reduction", value: "42%", icon: Coffee },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <m.icon className="w-5 h-5 text-leaf-bright mx-auto mb-2" />
              <div className="font-serif text-2xl font-bold text-foreground">
                {m.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
