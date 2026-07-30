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

/** 시연 흐름 = 현황 → 작업자 → AI 분석 → Pose → 평가서 */
const navGroups = [
  {
    title: "시연 흐름",
    items: [
      { href: "/", label: "1. 현황", icon: Home },
      { href: "/workers/W-001", label: "2. 작업자", icon: Users },
      { href: "/analysis/V-101", label: "3. AI 분석", icon: Activity },
      { href: "/analysis/V-101/pose", label: "4. Pose", icon: Scan },
      { href: "/reports/V-101", label: "5. 평가서", icon: FileBarChart2 },
    ],
  },
  {
    title: "운영",
    items: [
      { href: "/ops", label: "운영 현황", icon: LayoutDashboard },
      { href: "/jobs", label: "작업 영상", icon: ClipboardList },
      { href: "/analysis/status", label: "분석 상태", icon: ListChecks },
      { href: "/workers", label: "기술자 목록", icon: Users },
      { href: "/ops/failures", label: "실패 건", icon: AlertOctagon },
      { href: "/job-types", label: "직종별 분석", icon: Layers },
      { href: "/compare", label: "인력 비교", icon: GitCompare },
      { href: "/journey", label: "업무 프로세스", icon: Route },
    ],
  },
];

function normalizePath(path: string) {
  if (!path) return "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

function isActive(pathname: string, href: string) {
  const path = normalizePath(pathname);
  const target = normalizePath(href);

  if (target === "/") return path === "/";
  if (target === "/analysis/V-101") {
    return (
      path === "/analysis/V-101" ||
      (path.startsWith("/analysis/V-101/") &&
        !path.startsWith("/analysis/V-101/pose"))
    );
  }
  if (target === "/ops") return path === "/ops";
  if (target === "/workers") {
    return path === "/workers" || path.startsWith("/workers/new");
  }
  return path === target || path.startsWith(`${target}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-line bg-surface">
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-line px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-xs font-bold text-white">
          UR
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">
            UR Connection
          </p>
          <p className="truncate text-[10px] text-muted">Skill Verification</p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-2.5 py-3">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-2.5 pb-1 text-[10px] font-medium text-muted">
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
                    className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition ${
                      active
                        ? "bg-brand-soft font-medium text-brand"
                        : "text-ink hover:bg-bg"
                    }`}
                  >
                    <Icon size={15} className="shrink-0 opacity-80" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-line p-2.5">
        <Link
          href="/login"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-danger px-3 py-2 text-sm font-medium text-white"
        >
          <LogOut size={15} />
          로그아웃
        </Link>
      </div>
    </aside>
  );
}
