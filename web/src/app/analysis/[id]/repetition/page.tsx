import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AnalysisTabs } from "@/components/AnalysisTabs";
import { MetricCard } from "@/components/MetricCard";
import { getAnalysis, getJob } from "@/data/mock";

export default async function RepetitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();
  const analysis = getAnalysis(id);

  const patterns = analysis
    ? [
        { name: "부품 정렬 사이클", count: Math.max(3, analysis.metrics.repeatCount - 4), avgSec: 18 },
        { name: "체결/조립 반복", count: analysis.metrics.repeatCount, avgSec: 12 },
        { name: "검사 동작", count: Math.max(2, Math.floor(analysis.metrics.repeatCount / 3)), avgSec: 9 },
      ]
    : [];

  return (
    <AppShell
      title="반복 동작 분석"
      subtitle="반복 횟수 및 작업 패턴"
    >
      <AnalysisTabs videoId={id} />

      {analysis ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard label="총 반복 횟수" value={analysis.metrics.repeatCount} />
            <MetricCard label="반복성 점수" value={analysis.metrics.repetition} />
            <MetricCard label="안정성 점수" value={analysis.metrics.stability} />
          </div>
          <section className="mt-6 overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg text-xs text-muted">
                <tr>
                  <th className="px-4 py-3">패턴</th>
                  <th className="px-4 py-3">횟수</th>
                  <th className="px-4 py-3">평균 주기</th>
                </tr>
              </thead>
              <tbody>
                {patterns.map((p) => (
                  <tr key={p.name} className="border-t border-line">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3">{p.count}</td>
                    <td className="px-4 py-3 text-muted">{p.avgSec}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
          반복 동작 분석 데이터가 없습니다.
        </div>
      )}
    </AppShell>
  );
}
