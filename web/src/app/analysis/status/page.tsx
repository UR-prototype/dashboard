"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PipelineProgress } from "@/components/PipelineProgress";
import { StatusBadge } from "@/components/StatusBadge";
import {
  analyses,
  jobs,
  workers,
  type PipelineStatus,
  type ReviewStatus,
} from "@/data/mock";

type Row = {
  videoId: string;
  workerName: string;
  jobType: string;
  status: PipelineStatus;
  progress: number;
  reviewStatus: ReviewStatus | "미검토";
  score: number | null;
  confidence: number | null;
};

const initial: Row[] = jobs.map((j) => {
  const a = analyses[j.videoId];
  const w = workers.find((x) => x.id === j.workerId);
  return {
    videoId: j.videoId,
    workerName: w?.name ?? j.workerId,
    jobType: j.jobType,
    status: j.status,
    progress: j.progress,
    reviewStatus: a?.reviewStatus ?? "미검토",
    score: a?.skillScore ?? null,
    confidence: a?.confidence.aiConfidence ?? null,
  };
});

const reviewOptions: ReviewStatus[] = ["미검토", "검토중", "승인", "반려"];

export default function AnalysisStatusPage() {
  const [rows, setRows] = useState(initial);

  return (
    <AppShell
      title="분석 상태"
      subtitle="분석 진행 상태 및 검토 현황"
    >
      <div className="space-y-4">
        {rows.map((r, idx) => (
          <div
            key={r.videoId}
            className="rounded-xl border border-line bg-surface p-4 shadow-sm"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">
                  {r.workerName}{" "}
                  <span className="font-mono text-xs text-muted">{r.videoId}</span>
                </p>
                <p className="text-xs text-muted">{r.jobType}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <StatusBadge status={r.status} />
                <span className="text-muted">
                  점수 {r.score ?? "—"}
                  {r.confidence != null ? ` · 신뢰도 ${r.confidence}%` : ""}
                </span>
                <select
                  className="rounded-lg border border-line px-2 py-1 text-sm"
                  value={r.reviewStatus}
                  onChange={(e) => {
                    const value = e.target.value as ReviewStatus;
                    setRows((prev) =>
                      prev.map((row, i) =>
                        i === idx ? { ...row, reviewStatus: value } : row,
                      ),
                    );
                  }}
                >
                  {reviewOptions.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <Link href={`/analysis/${r.videoId}`} className="text-brand hover:underline">
                  결과
                </Link>
              </div>
            </div>
            <PipelineProgress status={r.status} progress={r.progress} />
          </div>
        ))}
      </div>
    </AppShell>
  );
}
