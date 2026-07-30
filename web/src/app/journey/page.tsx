import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";

const demoSteps = [
  { title: "현황", href: "/" },
  { title: "작업자", href: "/workers/W-001" },
  { title: "AI 분석", href: "/analysis/V-101" },
  { title: "Pose", href: "/analysis/V-101/pose" },
  { title: "평가서", href: "/reports/V-101" },
];

const opsSteps = [
  { title: "기술자 등록", href: "/workers/new" },
  { title: "영상 등록", href: "/jobs" },
  { title: "자동 분석", href: "/analysis/status" },
  { title: "평가 승인", href: "/analysis/V-101/skill" },
  { title: "실패 재실행", href: "/ops/failures" },
];

export default function JourneyPage() {
  return (
    <AppShell title="업무 프로세스" subtitle="시연 · 운영">
      <DemoFlowNav current="home" />

      <section className="mb-6 rounded-xl border border-line bg-surface p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">시연</h2>
          <Link
            href="/workers/W-001"
            className="text-xs font-medium text-brand hover:underline"
          >
            시작 →
          </Link>
        </div>
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {demoSteps.map((s, i) => (
            <li key={s.href} className="flex items-center gap-2">
              {i > 0 ? <span className="text-muted/40">/</span> : null}
              <Link href={s.href} className="text-ink hover:text-brand">
                {s.title}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="mb-3 text-sm font-semibold">운영</h2>
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {opsSteps.map((s, i) => (
            <li key={s.href} className="flex items-center gap-2">
              {i > 0 ? <span className="text-muted/40">/</span> : null}
              <Link href={s.href} className="text-muted hover:text-brand">
                {s.title}
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </AppShell>
  );
}
