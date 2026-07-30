import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { DemoFlowNav } from "@/components/DemoFlowNav";

export default function JourneyPage() {
  return (
    <AppShell title="업무 프로세스" subtitle="시연 · 운영">
      <DemoFlowNav />

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="mb-2 text-sm font-semibold">시연 순서</h2>
        <p className="mb-4 text-sm text-muted">
          현황 → 작업자 → AI 분석 → Pose → 평가서. 상단·사이드 메뉴와 동일합니다.
        </p>
        <Link
          href="/workers/W-001"
          className="inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white"
        >
          시연 시작 · 작업자
        </Link>
      </section>
    </AppShell>
  );
}
