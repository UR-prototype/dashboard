"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { jobs, workers, PIPELINE_STEPS, type PipelineStatus } from "@/data/mock";
import { formatDuration } from "@/lib/status";

export default function JobsPage() {
  const [rows, setRows] = useState(jobs);

  function cycleStatus(id: string) {
    setRows((prev) =>
      prev.map((j) => {
        if (j.id !== id) return j;
        if (j.status === "failed") {
          return { ...j, status: "uploaded" as PipelineStatus, progress: 0 };
        }
        const idx = PIPELINE_STEPS.indexOf(j.status);
        const next =
          idx < 0 || idx >= PIPELINE_STEPS.length - 1
            ? ("failed" as PipelineStatus)
            : PIPELINE_STEPS[idx + 1];
        const progress =
          next === "completed"
            ? 100
            : next === "failed"
              ? j.progress
              : Math.round(
                  ((PIPELINE_STEPS.indexOf(next) + 1) / PIPELINE_STEPS.length) *
                    100,
                );
        return { ...j, status: next, progress };
      }),
    );
  }

  return (
    <AppShell
      title="작업 영상"
      subtitle="등록 · 진행 · 결과"
      actions={
        <button
          type="button"
          className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white"
          onClick={() => alert("영상 업로드 창을 엽니다.")}
        >
          영상 업로드
        </button>
      }
    >
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">작업자</th>
              <th className="px-4 py-3 font-medium">영상</th>
              <th className="px-4 py-3 font-medium">날짜</th>
              <th className="px-4 py-3 font-medium">길이</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">진행</th>
              <th className="px-4 py-3 font-medium">점수</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((j) => {
              const worker = workers.find((w) => w.id === j.workerId);
              return (
                <tr key={j.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <p className="font-medium">{worker?.name}</p>
                    <p className="text-xs text-muted">{j.jobType}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="max-w-[12rem] truncate text-xs">{j.videoName}</p>
                    <p className="font-mono text-[11px] text-muted">{j.videoId}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{j.workDate}</td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {formatDuration(j.durationSec)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => cycleStatus(j.id)}
                      title="상태 변경"
                    >
                      <StatusBadge status={j.status} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex min-w-[7rem] items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg">
                        <div
                          className={`h-full rounded-full ${
                            j.status === "failed" ? "bg-danger" : "bg-brand"
                          }`}
                          style={{ width: `${j.progress}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-mono text-[11px] text-muted">
                        {j.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {j.skillScore != null ? (
                      <span className="font-semibold text-brand">
                        {j.skillScore}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/analysis/${j.videoId}`}
                      className="text-xs font-medium text-brand hover:underline"
                    >
                      결과
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
