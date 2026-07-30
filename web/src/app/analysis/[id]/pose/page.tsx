import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AnalysisTabs } from "@/components/AnalysisTabs";
import { DemoFlowNav } from "@/components/DemoFlowNav";
import { PoseTracker } from "@/components/PoseTracker";
import { getAnalysis, getJob, getWorker } from "@/data/mock";

export default async function PosePage({
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
      title="Pose 분석"
      subtitle={`${worker?.name ?? job.workerId} · MediaPipe 관절 추적 근거`}
      actions={
        <div className="flex gap-2">
          <Link
            href={`/analysis/${id}`}
            className="rounded-lg border border-line px-3 py-2 text-sm"
          >
            AI 분석으로
          </Link>
          <Link
            href={`/reports/${id}`}
            className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white"
          >
            평가서로
          </Link>
        </div>
      }
    >
      {id === "V-101" ? <DemoFlowNav current="pose" /> : null}
      <AnalysisTabs videoId={id} />

      <section className="mb-5 rounded-xl border border-line bg-surface p-4 text-sm shadow-sm">
        <p className="font-medium">이 화면에서 볼 것</p>
        <p className="mt-1 text-muted">
          점수·감점이 나온 이유를 관절 추적으로 확인합니다. Original / Pose
          Overlay / Skeleton을 전환해 보세요.
        </p>
      </section>

      {!analysis ? (
        <div className="rounded-xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
          자세 분석 데이터가 없습니다.
        </div>
      ) : (
        <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">자세 오버레이 · 관절 추적</h2>
            <p className="mt-1 text-xs text-muted">
              장면 시각을 선택하면 해당 프레임의 스켈레톤과 관절 좌표가
              갱신됩니다.
            </p>
          </div>
          <PoseTracker videoId={id} videoName={job.videoName} />
        </section>
      )}
    </AppShell>
  );
}
