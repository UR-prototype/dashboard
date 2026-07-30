import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/MetricCard";
import { StatusBadge } from "@/components/StatusBadge";
import {
  AiManualCompareChart,
  LevelBarChart,
} from "@/components/DashboardCharts";
import {
  dashboardStats,
  getFailedJobs,
  opsSummary,
  workers,
} from "@/data/mock";
import { RecentJobs } from "@/components/RecentJobs";

export default function OpsPage() {
  const failed = getFailedJobs();

  return (
    <AppShell
      title="운영 현황"
      subtitle="금일 분석 처리 현황 및 인력 숙련도 요약"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="오늘 분석 완료"
          value={opsSummary.todayCompleted}
          hint={`처리 중 ${opsSummary.inPipeline}건`}
          icon={<CheckCircle2 size={18} />}
        />
        <MetricCard
          label="평균 숙련도"
          value={opsSummary.avgScore}
          icon={<BarChart3 size={18} />}
        />
        <MetricCard
          label="주의 인력"
          value={opsSummary.highRiskWorkers}
          icon={<AlertTriangle size={18} />}
        />
        <Link href="/ops/failures" className="block">
          <MetricCard
            label="분석 실패"
            value={opsSummary.failedJobs}
            hint="재실행 · 담당자 배정"
            icon={<XCircle size={18} />}
          />
        </Link>
      </div>

      {failed.length > 0 ? (
        <section className="mt-4 rounded-xl border border-red-200 bg-red-50/50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-danger">실패 건</h2>
            <Link href="/ops/failures" className="text-sm text-brand hover:underline">
              처리하기
            </Link>
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {failed.map((j) => (
              <li key={j.id}>
                <span className="font-mono text-xs">{j.videoId}</span>{" "}
                {j.errorMessage}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="text-sm font-semibold">숙련도 등급 분포</h2>
          <LevelBarChart data={dashboardStats.levelDist} />
        </section>
        <RecentJobs limit={5} title="Recent Jobs" />
      </div>

      <div className="mt-6">
        <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="text-sm font-semibold">시스템 점수 · 평가자 점수</h2>
          <AiManualCompareChart data={dashboardStats.scoreTrend} />
        </section>
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">기술자 현황</h2>
          <Link href="/workers" className="text-sm text-brand hover:underline">
            전체 목록
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workers.map((w) => (
            <Link
              key={w.id}
              href={`/workers/${w.id}`}
              className="rounded-xl border border-line bg-surface p-4 shadow-sm hover:border-brand"
            >
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-semibold">{w.name}</p>
                  <p className="text-xs text-muted">
                    {w.skill} · {w.nationality}
                  </p>
                </div>
                <StatusBadge status={w.analysisStatus} />
              </div>
              <p className="mt-3 text-2xl font-semibold text-brand">
                {w.latestScore ?? "—"}
                <span className="ml-2 text-sm font-normal text-muted">
                  {w.latestLevel}
                </span>
              </p>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
