import type { MatchingRecommendation } from "@/data/mock";

export function MatchingCard({ matching }: { matching: MatchingRecommendation }) {
  return (
    <section className="rounded-xl border border-brand/30 bg-brand-soft/40 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            현장 매칭 추천
          </p>
          <h2 className="mt-1 text-base font-semibold text-ink">
            {matching.recommendedJob}
          </h2>
        </div>
        <span
          className={`rounded-md px-2 py-1 text-xs font-semibold ${
            matching.eligible
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {matching.eligible ? "매칭 가능" : "교육 후 재평가"}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted">{matching.reason}</p>
      <div className="mt-4">
        <p className="text-xs font-medium text-muted">추천 현장</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {matching.recommendedSites.map((site) => (
            <li
              key={site}
              className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm"
            >
              {site}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
