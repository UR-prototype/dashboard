"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Users,
  FileBarChart2,
  ListChecks,
  Route,
  AlertOctagon,
  Home,
  Layers,
  GitCompare,
  Scan,
} from "lucide-react";

const navGroups = [
  {
    title: "시연 흐름",
    items: [
      { href: "/workers/W-001", label: "1. 작업자", icon: Users },
      { href: "/analysis/V-101", label: "2. AI 분석", icon: Activity },
      { href: "/analysis/V-101/pose", label: "3. Pose", icon: Scan },
      { href: "/reports/V-101", label: "4. 평가서", icon: FileBarChart2 },
    ],
  },
  {
    title: "홈",
    items: [
      { href: "/", label: "현황", icon: Home },
      { href: "/journey", label: "업무 프로세스", icon: Route },
      { href: "/compare", label: "인력 비교", icon: GitCompare },
    ],
  },
  {
    title: "운영",
    items: [
      { href: "/ops", label: "운영 현황", icon: LayoutDashboard },
      { href: "/ops/failures", label: "실패 건 관리", icon: AlertOctagon },
      { href: "/workers", label: "기술자 목록", icon: Users },
      { href: "/jobs", label: "작업 영상", icon: ClipboardList },
      { href: "/analysis/status", label: "분석 상태", icon: ListChecks },
      { href: "/job-types", label: "직종별 분석", icon: Layers },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/analysis/V-101") {
    return (
      pathname === "/analysis/V-101" ||
      (pathname.startsWith("/analysis/V-101/") &&
        !pathname.startsWith("/analysis/V-101/pose"))
    );
  }
  if (href === "/ops") return pathname === "/ops";
  return pathname === href || pathname.startsWith(`${href}/`);
}
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-line bg-surface">
      <div className="border-b border-line px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-sm font-bold text-white">
            UR
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">UR Connection</p>
            <p className="text-[11px] text-muted">Skill Verification</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-brand-soft font-medium text-brand"
                        : "text-ink hover:bg-bg"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <Link
          href="/login"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-danger px-3 py-2.5 text-sm font-medium text-white"
        >
          <LogOut size={16} />
          로그아웃
        </Link>
      </div>
    </aside>
  );
}
