"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

export const DEMO_STEPS = [
  {
    id: "home",
    href: "/",
    label: "현황",
    purpose: "운영 현황",
    match: (p: string) => p === "/",
  },
  {
    id: "worker",
    href: "/workers/W-001",
    label: "작업자",
    purpose: "이력 · 영상 선택",
    match: (p: string) => p.startsWith("/workers/W-001"),
  },
  {
    id: "analysis",
    href: "/analysis/V-101",
    label: "AI 분석",
    purpose: "점수 · 근거 · 매칭",
    match: (p: string) =>
      p === "/analysis/V-101" ||
      (p.startsWith("/analysis/V-101/") &&
        !p.includes("/pose") &&
        !p.includes("/skill")),
  },
  {
    id: "pose",
    href: "/analysis/V-101/pose",
    label: "Pose",
    purpose: "관절 추적 근거",
    match: (p: string) => p.startsWith("/analysis/V-101/pose"),
  },
  {
    id: "report",
    href: "/reports/V-101",
    label: "평가서",
    purpose: "결과 확정",
    match: (p: string) => p.startsWith("/reports/V-101"),
  },
] as const;

export type DemoStepId = (typeof DEMO_STEPS)[number]["id"];

function normalizePath(path: string) {
  if (!path) return "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function DemoFlowNav({
  current,
}: {
  current?: DemoStepId;
  compact?: boolean;
}) {
  const pathname = normalizePath(usePathname());
  const idx = Math.max(
    0,
    DEMO_STEPS.findIndex((s) =>
      current ? s.id === current : s.match(pathname),
    ),
  );
  const next = DEMO_STEPS[idx + 1];

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
      <nav className="flex flex-wrap items-center gap-1">
        {DEMO_STEPS.map((s, i) => {
          const active = i === idx;
          return (
            <span key={s.id} className="flex items-center gap-1">
              {i > 0 ? (
                <span className="text-muted/40" aria-hidden>
                  /
                </span>
              ) : null}
              <Link
                href={s.href}
                className={
                  active
                    ? "font-medium text-brand"
                    : "text-muted hover:text-ink"
                }
              >
                {s.label}
              </Link>
            </span>
          );
        })}
      </nav>
      {next ? (
        <Link
          href={next.href}
          className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
        >
          다음 · {next.label}
          <ArrowRight size={12} />
        </Link>
      ) : null}
    </div>
  );
}
