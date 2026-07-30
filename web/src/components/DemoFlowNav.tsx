"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

function normalizePath(path: string) {
  if (!path) return "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

function demoIds(pathname: string) {
  const path = normalizePath(pathname);
  const analysis = path.match(/^\/analysis\/([^/]+)/);
  const report = path.match(/^\/reports\/([^/]+)/);
  const worker = path.match(/^\/workers\/([^/]+)/);
  return {
    workerId: worker?.[1] ?? "W-001",
    videoId: analysis?.[1] ?? report?.[1] ?? "V-101",
  };
}

export type DemoStepId =
  | "home"
  | "worker"
  | "analysis"
  | "pose"
  | "report";

export function DemoFlowNav({
  current,
}: {
  current?: DemoStepId;
  compact?: boolean;
}) {
  const pathname = normalizePath(usePathname());
  const { workerId, videoId } = demoIds(pathname);

  const steps = [
    {
      id: "home" as const,
      href: "/",
      label: "현황",
      match: () => pathname === "/",
    },
    {
      id: "worker" as const,
      href: `/workers/${workerId}`,
      label: "작업자",
      match: () => pathname.startsWith("/workers/"),
    },
    {
      id: "analysis" as const,
      href: `/analysis/${videoId}`,
      label: "AI 분석",
      match: () =>
        pathname.startsWith(`/analysis/${videoId}`) &&
        !pathname.startsWith(`/analysis/${videoId}/pose`),
    },
    {
      id: "pose" as const,
      href: `/analysis/${videoId}/pose`,
      label: "Pose",
      match: () => pathname.startsWith(`/analysis/${videoId}/pose`),
    },
    {
      id: "report" as const,
      href: `/reports/${videoId}`,
      label: "평가서",
      match: () => pathname.startsWith(`/reports/${videoId}`),
    },
  ];

  const idx = Math.max(
    0,
    steps.findIndex((s) => (current ? s.id === current : s.match())),
  );
  const next = steps[idx + 1];
  const isLast = idx === steps.length - 1;

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3 text-sm">
      <nav className="flex flex-wrap items-center gap-1" aria-label="시연 흐름">
        {steps.map((s, i) => {
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
          className="inline-flex items-center gap-1 rounded-md bg-brand px-2.5 py-1 text-xs font-medium text-white"
        >
          다음 · {next.label}
          <ArrowRight size={12} />
        </Link>
      ) : isLast ? (
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-ink"
        >
          시연 완료 · 현황으로
        </Link>
      ) : null}
    </div>
  );
}

/** @deprecated use DemoFlowNav pathname matching */
export const DEMO_STEPS = [
  { id: "home", href: "/", label: "현황" },
  { id: "worker", href: "/workers/W-001", label: "작업자" },
  { id: "analysis", href: "/analysis/V-101", label: "AI 분석" },
  { id: "pose", href: "/analysis/V-101/pose", label: "Pose" },
  { id: "report", href: "/reports/V-101", label: "평가서" },
] as const;
