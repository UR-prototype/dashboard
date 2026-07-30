"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

export const DEMO_STEPS = [
  {
    id: "home",
    href: "/",
    label: "현황",
    purpose: "운영 현황 · Recent Jobs",
    match: (p: string) => p === "/",
  },
  {
    id: "worker",
    href: "/workers/W-001",
    label: "작업자",
    purpose: "누구의 영상인지 · 분석 이력",
    match: (p: string) => p.startsWith("/workers/W-001"),
  },
  {
    id: "analysis",
    href: "/analysis/V-101",
    label: "AI 분석",
    purpose: "숙련도 점수 · 감점 · 결과물 · 매칭",
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
    purpose: "왜 이 점수인지 · 관절 추적",
    match: (p: string) => p.startsWith("/analysis/V-101/pose"),
  },
  {
    id: "report",
    href: "/reports/V-101",
    label: "평가서",
    purpose: "결과 확정 · 내보내기",
    match: (p: string) => p.startsWith("/reports/V-101"),
  },
] as const;

export type DemoStepId = (typeof DEMO_STEPS)[number]["id"];

export function DemoFlowNav({
  current,
  compact = false,
}: {
  /** 강제 현재 단계 (없으면 pathname으로 판별) */
  current?: DemoStepId;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const idx = Math.max(
    0,
    DEMO_STEPS.findIndex((s) =>
      current ? s.id === current : s.match(pathname),
    ),
  );
  const step = DEMO_STEPS[idx];
  const next = DEMO_STEPS[idx + 1];

  return (
    <section
      className={`mb-5 rounded-xl border border-brand/20 bg-brand-soft/40 ${
        compact ? "px-4 py-3" : "p-4"
      }`}
    >
      {!compact ? (
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-brand">
              시연 흐름
            </p>
            <p className="mt-0.5 text-sm text-muted">
              작업자 선택 → AI 분석 → Pose 근거 → 평가서
            </p>
          </div>
          {next ? (
            <Link
              href={next.href}
              className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white"
            >
              다음 · {next.label}
              <ArrowRight size={14} />
            </Link>
          ) : (
            <Link
              href="/"
              className="text-xs font-medium text-brand hover:underline"
            >
              처음으로
            </Link>
          )}
        </div>
      ) : null}

      <ol className="flex flex-wrap items-stretch gap-1.5 sm:flex-nowrap sm:gap-0">
        {DEMO_STEPS.map((s, i) => {
          const active = i === idx;
          const done = i < idx;
          return (
            <li key={s.id} className="flex min-w-0 flex-1 items-center">
              <Link
                href={s.href}
                className={`flex w-full min-w-0 flex-col rounded-lg border px-2.5 py-2 transition ${
                  active
                    ? "border-brand bg-surface shadow-sm"
                    : done
                      ? "border-transparent bg-surface/60 hover:border-brand/30"
                      : "border-transparent hover:border-line hover:bg-surface/80"
                }`}
              >
                <span
                  className={`text-[10px] font-semibold ${
                    active ? "text-brand" : "text-muted"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`truncate text-sm ${
                    active ? "font-semibold text-ink" : "text-ink/80"
                  }`}
                >
                  {s.label}
                </span>
                {!compact ? (
                  <span className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted">
                    {s.purpose}
                  </span>
                ) : null}
              </Link>
              {i < DEMO_STEPS.length - 1 ? (
                <span
                  className="mx-0.5 hidden shrink-0 text-muted sm:inline"
                  aria-hidden
                >
                  →
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>

      {compact && next ? (
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-[11px] text-muted">{step.purpose}</p>
          <Link
            href={next.href}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand hover:underline"
          >
            다음 · {next.label}
            <ArrowRight size={12} />
          </Link>
        </div>
      ) : null}

      {!compact ? (
        <p className="mt-3 rounded-lg bg-surface/80 px-3 py-2 text-xs text-muted">
          <span className="font-medium text-ink">지금: {step.label}</span>
          <span className="mx-1.5 opacity-40">·</span>
          {step.purpose}
        </p>
      ) : null}
    </section>
  );
}
