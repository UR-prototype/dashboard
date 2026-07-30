"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DeductionList } from "@/components/DeductionList";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import { EvidenceGallery } from "@/components/EvidenceGallery";
import { ExplainCard } from "@/components/ExplainCard";
import { MatchingCard } from "@/components/MatchingCard";
import { ProductJudgmentPanel } from "@/components/ProductJudgmentPanel";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { SkillRadar } from "@/components/DashboardCharts";
import { StatusBadge } from "@/components/StatusBadge";
import { TimeTimeline } from "@/components/TimeTimeline";
import { getAnalysis, getJob, getWorker } from "@/data/mock";

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const job = getJob(id);
  const analysis = getAnalysis(id);
  const worker = job ? getWorker(job.workerId) : undefined;

  if (!job) {
    return (
      <AppShell title="숙련도 평가서">
        <p className="text-sm text-muted">영상을 찾을 수 없습니다.</p>
      </AppShell>
    );
  }

  function downloadJson() {
    if (!analysis) return;
    const blob = new Blob([JSON.stringify(analysis, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}-skill-report.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadCsv() {
    if (!analysis) return;
    const lines = [
      "worker_id,video_id,job_type,skill_score,skill_level,speed,stability,repetition,accuracy,ai_confidence,pose_quality,manual_score,review_status",
      [
        analysis.workerId,
        analysis.videoId,
        analysis.jobType,
        analysis.skillScore,
        analysis.skillLevel,
        analysis.metrics.speed,
        analysis.metrics.stability,
        analysis.metrics.repetition,
        analysis.metrics.accuracy,
        analysis.confidence.aiConfidence,
        analysis.confidence.poseTrackingQuality,
        analysis.manualScore,
        analysis.reviewStatus,
      ].join(","),
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}-skill-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell
      title="숙련도 평가서"
      subtitle={`${worker?.name ?? job.workerId} · 결과 확정 · 내보내기`}
      actions={
        <div className="flex gap-2">
          <Link
            href={`/analysis/${id}/pose`}
            className="rounded-lg border border-line px-3 py-2 text-sm"
          >
            Pose
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-line px-3 py-2 text-sm"
          >
            인쇄
          </button>
          <button
            type="button"
            onClick={downloadJson}
            disabled={!analysis}
            className="rounded-lg border border-line px-3 py-2 text-sm disabled:opacity-40"
          >
            JSON
          </button>
          <button
            type="button"
            onClick={downloadCsv}
            disabled={!analysis}
            className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            CSV 내보내기
          </button>
        </div>
      }
    >
      {!analysis ? (
        <div className="rounded-xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
          분석 완료 후 평가서를 생성할 수 있습니다.{" "}
          <StatusBadge status={job.status} />
        </div>
      ) : (
        <>
          {analysis ? <DemoFlowNav current="report" /> : null}
        <article className="report-sheet mx-auto max-w-3xl space-y-6 rounded-xl border border-line bg-surface p-8 shadow-sm print:border-0 print:shadow-none">
          <header className="border-b border-line pb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              UR Connection · 숙련도 평가서
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{worker?.name}</h2>
            <p className="mt-1 text-sm text-muted">
              {analysis.workerId} · {analysis.jobType} · {job.videoName}
            </p>
            <p className="mt-1 text-xs text-muted">처리시각 {analysis.processedAt}</p>
          </header>

          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            <div className="rounded-lg bg-brand-soft p-3">
              <p className="text-xs text-muted">시스템</p>
              <p className="text-3xl font-semibold text-brand">{analysis.skillScore}</p>
            </div>
            <div className="rounded-lg bg-bg p-3">
              <p className="text-xs text-muted">등급</p>
              <p className="text-2xl font-semibold">{analysis.skillLevel}</p>
            </div>
            <div className="rounded-lg bg-bg p-3">
              <p className="text-xs text-muted">신뢰도</p>
              <p className="text-2xl font-semibold">
                {analysis.confidence.aiConfidence}%
              </p>
            </div>
            <div className="rounded-lg bg-bg p-3">
              <p className="text-xs text-muted">평가자</p>
              <p className="text-2xl font-semibold">{analysis.manualScore}</p>
            </div>
          </div>

          <ExplainCard result={analysis} />

          <section>
            <h3 className="mb-2 text-sm font-semibold">세부 점수 · 가중치</h3>
            <ScoreBreakdown result={analysis} />
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold">레이더</h3>
            <SkillRadar metrics={analysis.metrics} />
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold">이상행동 · 감점</h3>
            <DeductionList
              deductions={analysis.deductions}
              frames={analysis.evidenceFrames}
            />
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold">장면별 분석 근거</h3>
            <EvidenceGallery
              frames={analysis.evidenceFrames}
              highlightOnly
            />
          </section>

          <section>
            <ProductJudgmentPanel judgment={analysis.productJudgment} />
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold">작업 구간</h3>
            <TimeTimeline segments={analysis.timeSegments} />
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold">매칭 추천</h3>
            <MatchingCard matching={analysis.matching} />
          </section>

          <section className="rounded-lg bg-bg p-4 text-sm leading-relaxed">
            <p className="font-medium">분석 요약</p>
            <p className="mt-2 text-muted">{analysis.summary}</p>
            <p className="mt-4 font-medium">개선 권고</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
              {analysis.improvements.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <p className="mt-4 font-medium">평가자 의견</p>
            <p className="mt-2 text-muted">{analysis.manualComment}</p>
          </section>
        </article>
        </>
      )}
    </AppShell>
  );
}
