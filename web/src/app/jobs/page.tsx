"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PipelineProgress } from "@/components/PipelineProgress";
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
      subtitle="작업 영상 등록 현황 및 분석 진행 관리"
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
      <div className="space-y-4">
        {rows.map((j) => {
          const worker = workers.find((w) => w.id === j.workerId);
          return (
            <div
              key={j.id}
              className="rounded-xl border border-line bg-surface p-4 shadow-sm"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {worker?.name} · {j.jobType}
                  </p>
                  <p className="text-xs text-muted">
                    {j.workDate} · {j.videoName} · {formatDuration(j.durationSec)} ·{" "}
                    {j.fps}fps
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => cycleStatus(j.id)} title="상태 변경">
                    <StatusBadge status={j.status} />
                  </button>
                  <Link
                    href={`/analysis/${j.videoId}`}
                    className="text-sm text-brand hover:underline"
                  >
                    결과
                  </Link>
                </div>
              </div>
              <PipelineProgress status={j.status} progress={j.progress} detailed />
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
