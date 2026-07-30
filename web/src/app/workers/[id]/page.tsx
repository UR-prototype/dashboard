import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import { ScoreTrendChart } from "@/components/DashboardCharts";
import { StatusBadge } from "@/components/StatusBadge";
import { getJobsByWorker, getWorker } from "@/data/mock";
import { formatDuration } from "@/lib/status";

export default async function WorkerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const worker = getWorker(id);
  if (!worker) notFound();
  const workerJobs = [...getJobsByWorker(id)].sort((a, b) =>
    b.workDate.localeCompare(a.workDate),
  );
  const latestCompleted = workerJobs.find((j) => j.status === "completed");

  return (
    <AppShell
      title={worker.name}
      subtitle={`${worker.id} · 작업자 선택 · 분석 이력 확인`}
      actions={
        latestCompleted ? (
          <Link
            href={`/analysis/${latestCompleted.videoId}`}
            className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white"
          >
            이 작업자 AI 분석 보기
          </Link>
        ) : (
          <Link
            href="/workers"
            className="rounded-lg border border-line px-3 py-2 text-sm"
          >
            목록
          </Link>
        )
      }
    >
      {id === "W-001" ? <DemoFlowNav current="worker" /> : null}

      <section className="mb-5 rounded-xl border border-line bg-surface p-4 text-sm shadow-sm">
        <p className="font-medium">이 화면에서 볼 것</p>
        <p className="mt-1 text-muted">
          작업자 프로필과 영상별 점수·상태·날짜(Analysis History). 완료된 영상을
          고르면 AI 분석 결과로 이어집니다.
        </p>
      </section>
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-line bg-surface p-5 shadow-sm lg:col-span-1">
          <h2 className="text-sm font-semibold">기본 정보</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row k="국적" v={worker.nationality} />
            <Row k="나이" v={String(worker.age)} />
            <Row k="작업유형" v={worker.skill} />
            <Row k="에이전시" v={worker.agency} />
            <Row k="회사" v={worker.company} />
            <Row k="등록일" v={worker.registeredAt} />
            <div className="flex justify-between gap-4">
              <dt className="text-muted">분석상태</dt>
              <dd>
                <StatusBadge status={worker.analysisStatus} />
              </dd>
            </div>
            <Row
              k="최근 숙련도"
              v={
                worker.latestScore != null
                  ? `${worker.latestScore} · ${worker.latestLevel}`
                  : "미분석"
              }
            />
            {worker.highRisk ? (
              <p className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-danger">
                고위험
              </p>
            ) : null}
          </dl>
        </section>

        <section className="rounded-xl border border-line bg-surface p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold">숙련도 추이</h2>
          <p className="mb-2 text-xs text-muted">월별 숙련도 점수</p>
          {worker.scoreHistory.length ? (
            <ScoreTrendChart data={worker.scoreHistory} />
          ) : (
            <p className="py-10 text-center text-sm text-muted">이력 없음</p>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-line bg-surface p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Analysis History</h2>
            <p className="mt-1 text-xs text-muted">
              영상 · 점수 · 상태 · 날짜
            </p>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg text-xs text-muted">
              <tr>
                <th className="px-3 py-2">날짜</th>
                <th className="px-3 py-2">영상</th>
                <th className="px-3 py-2">점수</th>
                <th className="px-3 py-2">상태</th>
                <th className="px-3 py-2">길이</th>
                <th className="px-3 py-2">결과</th>
              </tr>
            </thead>
            <tbody>
              {workerJobs.map((j) => (
                <tr key={j.id} className="border-t border-line">
                  <td className="px-3 py-2 font-mono text-xs">{j.workDate}</td>
                  <td className="px-3 py-2">
                    <p className="font-medium">{j.videoName}</p>
                    <p className="text-xs text-muted">{j.videoId}</p>
                  </td>
                  <td className="px-3 py-2">
                    {j.skillScore != null ? (
                      <span className="font-semibold text-brand">
                        {j.skillScore}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={j.status} />
                  </td>
                  <td className="px-3 py-2 text-xs text-muted">
                    {formatDuration(j.durationSec)}
                  </td>
                  <td className="px-3 py-2">
                    {j.status === "completed" ? (
                      <div className="flex flex-col gap-1">
                        <Link
                          href={`/analysis/${j.videoId}`}
                          className="font-medium text-brand hover:underline"
                        >
                          AI 분석 보기 →
                        </Link>
                        <Link
                          href={`/reports/${j.videoId}`}
                          className="text-xs text-muted hover:underline"
                        >
                          평가서
                        </Link>
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
