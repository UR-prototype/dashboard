import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AnalysisTabs } from "@/components/AnalysisTabs";
import { EvidenceGallery } from "@/components/EvidenceGallery";
import { MetricCard } from "@/components/MetricCard";
import { TimeTimeline } from "@/components/TimeTimeline";
import { getAnalysis, getJob } from "@/data/mock";

export default async function TimePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();
  const analysis = getAnalysis(id);

  return (
    <AppShell
      title="작업 시간 분석"
      subtitle="작업·정지 구간 및 가동률"
    >
      <AnalysisTabs videoId={id} />

      {analysis ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard label="작업 시간" value={`${analysis.metrics.workSeconds}s`} />
            <MetricCard label="정지 시간" value={`${analysis.metrics.idleSeconds}s`} />
            <MetricCard
              label="가동률"
              value={`${Math.round(
                (analysis.metrics.workSeconds /
                  (analysis.metrics.workSeconds + analysis.metrics.idleSeconds)) *
                  100,
              )}%`}
            />
          </div>
          <section className="mt-6 rounded-xl border border-line bg-surface p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold">구간 분석</h2>
            <TimeTimeline segments={analysis.timeSegments} />
          </section>
          <div className="mt-6">
            <EvidenceGallery
              frames={analysis.evidenceFrames.filter(
                (f) => f.tag === "idle" || f.tag === "work" || f.tag === "anomaly",
              )}
            />
          </div>
        </>
      ) : (
        <Empty />
      )}
    </AppShell>
  );
}

function Empty() {
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
      작업 시간 분석 데이터가 없습니다.
    </div>
  );
}
