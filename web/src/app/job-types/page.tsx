import { AppShell } from "@/components/AppShell";
import { jobTypes } from "@/data/mock";

export default function JobTypesPage() {
  return (
    <AppShell
      title="직종별 분석"
      subtitle="직종별 분석 지원 범위 및 적용 지표"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {jobTypes.map((j) => (
          <div
            key={j.id}
            className="rounded-xl border border-line bg-surface p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold">{j.id}</h2>
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                  j.supported === true
                    ? "bg-emerald-50 text-emerald-700"
                    : j.supported === "demo"
                      ? "bg-sky-50 text-sky-700"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {j.supported === true
                  ? "지원"
                  : j.supported === "demo"
                    ? "시범 적용"
                    : "준비 중"}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">
              {j.supported === true
                ? "숙련도 지표 및 가중치가 적용되어 있습니다."
                : j.supported === "demo"
                  ? "시범 데이터로 결과 확인이 가능합니다."
                  : "해당 직종 분석 모델 준비 중입니다."}
            </p>
            {j.features.length ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {j.features.map((f) => (
                  <li
                    key={f}
                    className="rounded-md border border-line bg-bg px-2 py-1 text-[11px]"
                  >
                    {f === "hand_travel"
                      ? "손 이동량"
                      : f === "cycle_count"
                        ? "반복 사이클"
                        : f === "idle_time"
                          ? "정지 시간"
                          : f === "tool_switch"
                            ? "공구 교체"
                            : f === "work_speed"
                              ? "작업 속도"
                              : f === "stability"
                                ? "안정성"
                                : f}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
