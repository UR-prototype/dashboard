import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";

const demoSteps = [
  {
    n: "01",
    title: "현황",
    purpose: "운영 현황 · Recent Jobs",
    href: "/",
  },
  {
    n: "02",
    title: "작업자",
    purpose: "누구의 영상인지 · 분석 이력",
    href: "/workers/W-001",
  },
  {
    n: "03",
    title: "AI 분석",
    purpose: "숙련도 · 감점 · 결과물 · 매칭",
    href: "/analysis/V-101",
  },
  {
    n: "04",
    title: "Pose",
    purpose: "관절 추적으로 점수 근거 확인",
    href: "/analysis/V-101/pose",
  },
  {
    n: "05",
    title: "평가서",
    purpose: "결과 확정 · 내보내기",
    href: "/reports/V-101",
  },
];

const opsSteps = [
  { n: "A", title: "기술자 등록", href: "/workers/new" },
  { n: "B", title: "영상 등록", href: "/jobs" },
  { n: "C", title: "자동 분석", href: "/analysis/status" },
  { n: "D", title: "평가 승인", href: "/analysis/V-101/skill" },
  { n: "E", title: "실패 재실행", href: "/ops/failures" },
];

export default function JourneyPage() {
  return (
    <AppShell
      title="업무 프로세스"
      subtitle="시연은 AI 분석 흐름 · 운영은 등록~재실행까지"
    >
      <DemoFlowNav current="home" />

      <section className="mb-6 rounded-xl border border-brand/20 bg-brand-soft/30 p-5 shadow-sm">
        <h2 className="text-sm font-semibold">시연 흐름 (권장)</h2>
        <p className="mt-2 text-sm text-muted">
          화면만 따라가면 AI 숙련도 분석 플랫폼을 설명할 수 있습니다.
        </p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {demoSteps.map((s) => (
            <li key={s.n}>
              <Link
                href={s.href}
                className="block h-full rounded-xl border border-line bg-surface p-4 shadow-sm transition hover:border-brand"
              >
                <p className="text-xs font-semibold text-brand">{s.n}</p>
                <p className="mt-1 font-semibold">{s.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {s.purpose}
                </p>
              </Link>
            </li>
          ))}
        </ol>
        <Link
          href="/workers/W-001"
          className="mt-4 inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white"
        >
          시연 시작 · 작업자부터
        </Link>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">
        <h2 className="text-sm font-semibold">운영 절차 (백그라운드)</h2>
        <p className="mt-2 text-sm text-muted">
          등록 · 업로드 · 파이프라인 · 승인 · 실패 처리 — 운영팀이 쓰는 화면입니다.
        </p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {opsSteps.map((s) => (
            <li key={s.n}>
              <Link
                href={s.href}
                className="block rounded-lg border border-line px-3 py-3 text-sm hover:border-brand"
              >
                <span className="text-xs text-muted">{s.n}</span>
                <p className="font-medium">{s.title}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </AppShell>
  );
}
