import Link from "next/link";
import { ArrowRight, PlayCircle, FileText, Users, Scan } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import { MetricCard } from "@/components/MetricCard";
import { RecentJobs } from "@/components/RecentJobs";
import { opsSummary, workers } from "@/data/mock";

const flowCards = [
  {
    n: "01",
    title: "작업자",
    desc: "누구의 영상인지 확인 · 분석 이력(점수·상태·날짜)",
    href: "/workers/W-001",
    icon: Users,
  },
  {
    n: "02",
    title: "AI 분석",
    desc: "숙련도 점수 · 타임라인 · Feature · 결과물 · 매칭",
    href: "/analysis/V-101",
    icon: PlayCircle,
  },
  {
    n: "03",
    title: "Pose",
    desc: "관절 추적으로 점수 근거 확인 (Original / Overlay / Skeleton)",
    href: "/analysis/V-101/pose",
    icon: Scan,
  },
  {
    n: "04",
    title: "평가서",
    desc: "결과 확정 · JSON/CSV · 인쇄",
    href: "/reports/V-101",
    icon: FileText,
  },
];

export default function HomePage() {
  const sample = workers.find((w) => w.id === "W-001")!;

  return (
    <AppShell
      title="숙련도 분석"
      subtitle="해외 기술자 작업 영상 기반 숙련도 검증 · 매칭 지원"
    >
      <DemoFlowNav current="home" />

      <section className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand-soft to-surface p-6 shadow-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          UR Connection · AI Skill Verification
        </p>
        <h2 className="mt-2 max-w-2xl text-xl font-semibold leading-snug text-ink md:text-2xl">
          작업자를 고르고, AI 분석 결과와 Pose 근거를 확인한 뒤
          <br className="hidden sm:block" />
          평가서로 배치 의사결정까지 이어갑니다.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          샘플: {sample.name} ({sample.skill}) · 최근 {sample.latestScore}점 (
          {sample.latestLevel})
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/workers/W-001"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white"
          >
            <Users size={18} />
            시연 시작 · 작업자 선택
          </Link>
          <Link
            href="/analysis/V-101"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium"
          >
            AI 분석 결과로 바로가기
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-ink">화면으로 따라가기</h3>
            <p className="mt-1 text-xs text-muted">
              각 카드의 설명이 그 화면에서 확인할 내용입니다.
            </p>
          </div>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {flowCards.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.n}>
                <Link
                  href={s.href}
                  className="flex h-full flex-col rounded-xl border border-line bg-surface p-5 shadow-sm transition hover:border-brand"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand">{s.n}</span>
                    <Icon size={16} className="text-brand" />
                  </div>
                  <span className="mt-2 font-semibold">{s.title}</span>
                  <span className="mt-1 flex-1 text-sm leading-relaxed text-muted">
                    {s.desc}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm text-brand">
                    이동 <ArrowRight size={14} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">오늘 운영 현황</h3>
          <Link href="/ops" className="text-sm text-brand hover:underline">
            운영 상세
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="오늘 분석 완료" value={opsSummary.todayCompleted} />
          <MetricCard label="평균 숙련도" value={opsSummary.avgScore} />
          <MetricCard label="주의 인력" value={opsSummary.highRiskWorkers} />
          <MetricCard label="분석 실패" value={opsSummary.failedJobs} />
        </div>
      </section>

      <div className="mt-8">
        <RecentJobs />
      </div>
    </AppShell>
  );
}
