import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import { MetricCard } from "@/components/MetricCard";
import { RecentJobs } from "@/components/RecentJobs";
import { opsSummary, workers } from "@/data/mock";

export default function HomePage() {
  const sample = workers.find((w) => w.id === "W-001")!;

  return (
    <AppShell
      title="숙련도 분석"
      subtitle="작업 영상 기반 숙련도 검증 · 매칭"
    >
      <DemoFlowNav current="home" />

      <section className="rounded-xl border border-line bg-surface p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink md:text-xl">
              {sample.name} · {sample.latestScore}점 ({sample.latestLevel})
            </h2>
            <p className="mt-1 text-sm text-muted">
              작업자 → AI 분석 → Pose → 평가서 순으로 확인합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/workers/W-001"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white"
            >
              <Users size={16} />
              시연 시작
            </Link>
            <Link
              href="/analysis/V-101"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2 text-sm"
            >
              AI 분석
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">운영 현황</h3>
          <Link href="/ops" className="text-xs text-brand hover:underline">
            상세
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="오늘 분석 완료" value={opsSummary.todayCompleted} />
          <MetricCard label="평균 숙련도" value={opsSummary.avgScore} />
          <MetricCard label="주의 인력" value={opsSummary.highRiskWorkers} />
          <MetricCard label="분석 실패" value={opsSummary.failedJobs} />
        </div>
      </section>

      <div className="mt-6">
        <RecentJobs title="최근 분석" />
      </div>
    </AppShell>
  );
}
