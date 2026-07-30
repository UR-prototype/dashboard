import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { getWorker, jobs, type WorkJob } from "@/data/mock";
import { getAnalysis } from "@/data/mock";

function relativeLabel(workDate: string) {
  // demo-friendly fixed relative labels for latest few
  if (workDate >= "2026-06-14") return "방금 전";
  if (workDate >= "2026-06-12") return "2시간 전";
  if (workDate >= "2026-06-10") return "1일 전";
  return workDate;
}

export function RecentJobs({
  limit = 6,
  title = "Recent Jobs",
}: {
  limit?: number;
  title?: string;
}) {
  const recent = [...jobs]
    .sort((a, b) => b.workDate.localeCompare(a.workDate))
    .slice(0, limit);

  return (
    <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Link href="/jobs" className="text-xs text-brand hover:underline">
          전체 보기
        </Link>
      </div>
      <ul className="divide-y divide-line">
        {recent.map((j) => (
          <JobRow key={j.id} job={j} />
        ))}
      </ul>
    </section>
  );
}

function JobRow({ job }: { job: WorkJob }) {
  const worker = getWorker(job.workerId);
  const analysis = getAnalysis(job.videoId);
  const score = job.skillScore ?? analysis?.skillScore ?? null;

  return (
    <li className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {worker?.name ?? job.workerId}{" "}
          <span className="font-mono text-xs text-muted">{job.workerId}</span>
        </p>
        <p className="truncate text-xs text-muted">
          {job.videoId} · {job.jobType}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {score != null ? (
          <span className="text-sm font-semibold text-brand">{score}</span>
        ) : (
          <span className="text-xs text-muted">—</span>
        )}
        <StatusBadge status={job.status} />
        <span className="w-16 text-right text-[11px] text-muted">
          {relativeLabel(job.workDate)}
        </span>
        {job.status === "completed" ? (
          <Link
            href={`/analysis/${job.videoId}`}
            className="text-xs text-brand hover:underline"
          >
            결과
          </Link>
        ) : (
          <Link
            href="/analysis/status"
            className="text-xs text-muted hover:underline"
          >
            상태
          </Link>
        )}
      </div>
    </li>
  );
}
