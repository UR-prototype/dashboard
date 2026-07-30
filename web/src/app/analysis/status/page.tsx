"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
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
  };
});

const reviewOptions: ReviewStatus[] = ["미검토", "검토중", "승인", "반려"];

export default function AnalysisStatusPage() {
  const [rows, setRows] = useState(initial);

  return (
    <AppShell title="분석 상태" subtitle="진행 · 점수 · 검토">
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">작업자</th>
              <th className="px-4 py-3 font-medium">영상</th>
              <th className="px-4 py-3 font-medium">직종</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">진행</th>
              <th className="px-4 py-3 font-medium">점수</th>
              <th className="px-4 py-3 font-medium">검토</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.videoId} className="border-t border-line">
                <td className="px-4 py-3 font-medium">{r.workerName}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">
                  {r.videoId}
                </td>
                <td className="px-4 py-3 text-muted">{r.jobType}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex min-w-[7rem] items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg">
                      <div
                        className={`h-full rounded-full ${
                          r.status === "failed" ? "bg-danger" : "bg-brand"
                        }`}
                        style={{ width: `${r.progress}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-[11px] text-muted">
                      {r.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {r.score != null ? (
                    <span className="font-semibold text-brand">{r.score}</span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <select
                    className="rounded-md border border-line bg-surface px-2 py-1 text-xs"
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
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/analysis/${r.videoId}`}
                    className="text-xs font-medium text-brand hover:underline"
                  >
                    결과
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
