import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AnalysisTabs } from "@/components/AnalysisTabs";
import { ProductJudgmentPanel } from "@/components/ProductJudgmentPanel";
import { getAnalysis, getJob, getWorker } from "@/data/mock";

export default async function ProductPage({
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
      title="결과물 판정"
      subtitle={`${worker?.name ?? job.workerId} · 완성품 사진 품질 대조`}
    >
      <AnalysisTabs videoId={id} />

      {!analysis ? (
        <div className="rounded-xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
          결과물 판정 데이터가 없습니다.
        </div>
      ) : (
        <ProductJudgmentPanel judgment={analysis.productJudgment} />
      )}
    </AppShell>
  );
}
