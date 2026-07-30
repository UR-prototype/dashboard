import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ScoreTrendChart } from "@/components/DashboardCharts";
import { getAnalysis, workers } from "@/data/mock";

export default function ComparePage() {
  const a = workers.find((w) => w.id === "W-001")!;
  const b = workers.find((w) => w.id === "W-002")!;
  const ra = getAnalysis("V-101");
  const rb = getAnalysis("V-201");

  return (
    <AppShell
      title="인력 비교"
      subtitle="숙련도·지표 기준 후보자 비교"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {[
          { w: a, r: ra, video: "V-101" },
          { w: b, r: rb, video: "V-201" },
        ].map(({ w, r, video }) => (
          <section
            key={w.id}
            className="rounded-xl border border-line bg-surface p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{w.name}</h2>
                <p className="text-xs text-muted">
                  {w.id} · {w.skill}
                </p>
              </div>
              <p className="text-3xl font-semibold text-brand">
                {w.latestScore ?? "—"}
              </p>
            </div>
            <p className="mt-1 text-sm text-muted">{w.latestLevel}</p>
            {r ? (
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <li className="rounded-lg bg-bg px-3 py-2">
                  속도 {r.metrics.speed}
                </li>
                <li className="rounded-lg bg-bg px-3 py-2">
                  안정성 {r.metrics.stability}
                </li>
                <li className="rounded-lg bg-bg px-3 py-2">
                  반복성 {r.metrics.repetition}
                </li>
                <li className="rounded-lg bg-bg px-3 py-2">
                  정확도 {r.metrics.accuracy}
                </li>
                <li className="col-span-2 rounded-lg bg-brand-soft px-3 py-2 text-brand">
                  신뢰도 {r.confidence.aiConfidence}%
                </li>
              </ul>
            ) : null}
            <div className="mt-4">
              <p className="mb-1 text-xs text-muted">숙련도 추이</p>
              {w.scoreHistory.length ? (
                <ScoreTrendChart data={w.scoreHistory} />
              ) : null}
            </div>
            <Link
              href={`/analysis/${video}`}
              className="mt-3 inline-block text-sm text-brand hover:underline"
            >
              분석 상세
            </Link>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
