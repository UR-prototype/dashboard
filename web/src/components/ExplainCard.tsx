import type { AnalysisResult } from "@/data/mock";

export function ExplainCard({ result }: { result: AnalysisResult }) {
  const strengths = [
    result.metrics.repetition >= 75 ? "반복 작업 안정" : null,
    result.metrics.accuracy >= 75 ? "정확도 양호" : null,
    result.metrics.stability >= 75 ? "자세·동선 안정" : null,
    result.productJudgment.overall === "합격" ? "결과물 품질 합격" : null,
  ].filter(Boolean) as string[];

  return (
    <section className="rounded-xl border border-brand/25 bg-gradient-to-br from-brand-soft/80 to-surface p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            AI Summary
          </p>
          <h2 className="mt-1 text-lg font-semibold">분석 결과 요약</h2>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold text-brand">{result.skillScore}</p>
          <p className="text-sm font-medium">{result.skillLevel}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold text-muted">강점</p>
          <ul className="mt-2 space-y-1 text-sm">
            {(strengths.length ? strengths : ["기본 작업 수행 가능"]).map((s) => (
              <li key={s} className="flex gap-1.5">
                <span className="text-emerald-600">✔</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted">개선</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
            {result.improvements.slice(0, 3).map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted">추천</p>
          <p className="mt-2 text-sm font-medium">{result.matching.recommendedJob}</p>
          <p className="mt-1 text-xs text-muted">{result.matching.reason}</p>
          <p className="mt-2 text-xs">
            결과물:{" "}
            <span className="font-semibold">{result.productJudgment.overall}</span>
            {" · "}
            {result.productJudgment.score}점
          </p>
        </div>
      </div>
    </section>
  );
}
