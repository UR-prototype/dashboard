import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AnalysisTabs } from "@/components/AnalysisTabs";
import { DeductionList } from "@/components/DeductionList";
import { EvidenceGallery } from "@/components/EvidenceGallery";
import { MetricCard } from "@/components/MetricCard";
import { ProductJudgmentPanel } from "@/components/ProductJudgmentPanel";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { SkillRadar } from "@/components/DashboardCharts";
import { getAnalysis, getJob, getWorker } from "@/data/mock";

export default async function SkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();
  const analysis = getAnalysis(id);
  const worker = getWorker(job.workerId);

  return (
    <AppShell
      title="숙련도 평가"
      subtitle="시스템 점수 · 감점 근거 · 평가자 점수 비교"
    >
      <AnalysisTabs videoId={id} />

      {!analysis ? (
        <div className="rounded-xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
          숙련도 점수가 아직 등록되지 않았습니다.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="시스템 점수"
              value={analysis.skillScore}
              hint={analysis.skillLevel}
            />
            <MetricCard label="평가자 점수" value={analysis.manualScore} />
            <MetricCard
              label="편차"
              value={analysis.skillScore - analysis.manualScore}
              hint="시스템 − 평가자"
            />
            <MetricCard
              label="분석 신뢰도"
              value={`${analysis.confidence.aiConfidence}%`}
              hint={worker?.name}
            />
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold">점수 산정</h2>
              <ScoreBreakdown result={analysis} />
              <div className="mt-4">
                <SkillRadar metrics={analysis.metrics} />
              </div>
            </section>
            <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold">감점 근거 · 해당 장면</h2>
              <DeductionList
                deductions={analysis.deductions}
                frames={analysis.evidenceFrames}
              />
              <div className="mt-6 space-y-3">
                <CompareBar label="시스템" value={analysis.skillScore} color="bg-brand" />
                <CompareBar
                  label="평가자"
                  value={analysis.manualScore}
                  color="bg-slate-400"
                />
              </div>
              <div className="mt-4 rounded-lg border border-line bg-bg p-4 text-sm">
                <p className="font-medium">분석 요약</p>
                <p className="mt-2 text-muted">{analysis.summary}</p>
                <p className="mt-3 font-medium">평가자 의견</p>
                <p className="mt-2 text-muted">{analysis.manualComment}</p>
              </div>
            </section>
          </div>

          <div className="mt-6">
            <EvidenceGallery frames={analysis.evidenceFrames} highlightOnly />
          </div>

          <div className="mt-6">
            <ProductJudgmentPanel judgment={analysis.productJudgment} />
          </div>
        </>
      )}
    </AppShell>
  );
}

function CompareBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-bg">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
