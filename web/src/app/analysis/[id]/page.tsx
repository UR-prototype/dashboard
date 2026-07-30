import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AnalysisTabs } from "@/components/AnalysisTabs";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import { EvidenceGallery } from "@/components/EvidenceGallery";
import { ExplainCard } from "@/components/ExplainCard";
import { MatchingCard } from "@/components/MatchingCard";
import { MetricCard } from "@/components/MetricCard";
import { PipelineProgress } from "@/components/PipelineProgress";
import { ProductJudgmentPanel } from "@/components/ProductJudgmentPanel";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { SkillRadar } from "@/components/DashboardCharts";
import { StatusBadge } from "@/components/StatusBadge";
import { TimelineScrubber } from "@/components/TimelineScrubber";
import { getAnalysis, getJob, getWorker } from "@/data/mock";

export default async function AnalysisOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJob(id);
  const analysis = getAnalysis(id);
  if (!job) notFound();

  const worker = getWorker(job.workerId);

  return (
    <AppShell
      title="AI 숙련도 분석"
      subtitle={`${worker?.name ?? job.workerId} · ${job.videoId} · ${job.jobType}`}
      actions={
        <div className="flex gap-2">
          <Link
            href={`/workers/${job.workerId}`}
            className="rounded-lg border border-line px-3 py-2 text-sm"
          >
            작업자
          </Link>
          <Link
            href={`/analysis/${id}/pose`}
            className="rounded-lg border border-line px-3 py-2 text-sm"
          >
            Pose 근거
          </Link>
          <Link
            href={`/reports/${id}`}
            className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white"
          >
            평가서
          </Link>
        </div>
      }
    >
      {id === "V-101" ? <DemoFlowNav current="analysis" /> : null}
      <AnalysisTabs videoId={id} />

      <section className="mb-5 rounded-xl border border-line bg-surface p-4 text-sm shadow-sm">
        <p className="font-medium">이 화면에서 볼 것</p>
        <p className="mt-1 text-muted">
          AI가 산출한 숙련도·감점 타임라인·Feature·결과물 판정·현장 매칭. 점수
          근거가 궁금하면 Pose로 이동하세요.
        </p>
      </section>

      <section className="mb-6 rounded-xl border border-line bg-surface p-5 shadow-sm">
        <PipelineProgress
          status={job.status}
          progress={job.progress}
          detailed
        />
      </section>

      {!analysis ? (
        <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
          <p className="font-medium">분석 결과가 아직 없습니다</p>
          <p className="mt-2 text-sm text-muted">
            현재 상태: <StatusBadge status={job.status} />
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <ExplainCard result={analysis} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="숙련도 점수"
              value={analysis.skillScore}
              hint={analysis.skillLevel}
            />
            <MetricCard
              label="분석 신뢰도"
              value={`${analysis.confidence.aiConfidence}%`}
              hint={
                analysis.confidence.aiConfidence < 80
                  ? "신뢰도 주의"
                  : "신뢰도 양호"
              }
            />
            <MetricCard
              label="자세 추적 품질"
              value={`${analysis.confidence.poseTrackingQuality}%`}
              hint={`검출 커버리지 ${analysis.confidence.detectionCoverage}%`}
            />
            <MetricCard
              label="처리 프레임"
              value={analysis.framesExtracted}
              hint={`관절 포인트 ${analysis.posePoints.toLocaleString()}`}
            />
          </div>

          <div className="mt-6">
            <TimelineScrubber result={analysis} />
          </div>

          <div className="mt-6">
            <EvidenceGallery frames={analysis.evidenceFrames} />
          </div>

          <div className="mt-6">
            <ProductJudgmentPanel judgment={analysis.productJudgment} />
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold">
                점수 구성 · Feature
              </h2>
              <ScoreBreakdown result={analysis} />
            </section>
            <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold">숙련도 레이더</h2>
              <SkillRadar metrics={analysis.metrics} />
              <div className="mt-4">
                <MatchingCard matching={analysis.matching} />
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-xl border border-line bg-surface p-5 shadow-sm">
            <h2 className="text-sm font-semibold">분석 요약 · 개선 권고</h2>
            <p className="mt-2 text-sm leading-relaxed">{analysis.summary}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
              {analysis.improvements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    </AppShell>
  );
}
