"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import {
  assignees,
  getFailedJobs,
  workers,
  type WorkJob,
} from "@/data/mock";

export default function OpsFailuresPage() {
  const [rows, setRows] = useState<WorkJob[]>(() =>
    getFailedJobs().map((j) => ({ ...j })),
  );
  const [toast, setToast] = useState<string | null>(null);

  function retry(id: string) {
    setRows((prev) =>
      prev.map((j) =>
        j.id === id
          ? {
              ...j,
              status: "queued",
              progress: 5,
              errorCode: null,
              errorMessage: null,
            }
          : j,
      ),
    );
    setToast("재실행이 요청되었습니다. 대기열에 등록되었습니다.");
  }

  function assign(id: string, name: string) {
    setRows((prev) =>
      prev.map((j) => (j.id === id ? { ...j, assignee: name } : j)),
    );
    setToast(`담당자가 ${name}(으)로 지정되었습니다.`);
  }

  return (
    <AppShell
      title="실패 건 관리"
      subtitle="분석 실패 건 재실행 및 담당자 배정"
    >
      {toast ? (
        <div className="mb-4 rounded-lg border border-brand/30 bg-brand-soft px-3 py-2 text-sm text-brand">
          {toast}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center text-sm text-muted">
          처리할 실패 건이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((j) => {
            const w = workers.find((x) => x.id === j.workerId);
            return (
              <div
                key={j.id}
                className="rounded-xl border border-red-200 bg-surface p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {w?.name} · {j.jobType}
                    </p>
                    <p className="text-xs text-muted">
                      {j.videoId} · {j.videoName}
                    </p>
                    <p className="mt-2 text-sm text-danger">
                      [{j.errorCode}] {j.errorMessage}
                    </p>
                  </div>
                  <StatusBadge status={j.status} />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => retry(j.id)}
                    disabled={j.status !== "failed"}
                    className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
                  >
                    재실행
                  </button>
                  <select
                    className="rounded-lg border border-line px-2 py-2 text-sm"
                    value={j.assignee ?? ""}
                    onChange={(e) => assign(j.id, e.target.value)}
                  >
                    <option value="">담당자 선택</option>
                    {assignees.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                  <Link
                    href={`/workers/${j.workerId}`}
                    className="text-sm text-brand hover:underline"
                  >
                    기술자
                  </Link>
                  <Link
                    href={`/analysis/${j.videoId}`}
                    className="text-sm text-muted hover:underline"
                  >
                    분석 화면
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
