import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { workers } from "@/data/mock";

export default function WorkersPage() {
  return (
    <AppShell
      title="기술자"
      subtitle="기술자 정보 등록 · 조회 · 수정"
      actions={
        <Link
          href="/workers/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white"
        >
          <Plus size={16} />
          기술자 등록
        </Link>
      }
    >
      <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">성명</th>
              <th className="px-4 py-3 font-medium">국적</th>
              <th className="px-4 py-3 font-medium">작업유형</th>
              <th className="px-4 py-3 font-medium">숙련도</th>
              <th className="px-4 py-3 font-medium">분석상태</th>
              <th className="px-4 py-3 font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr key={w.id} className="border-t border-line">
                <td className="px-4 py-3 font-mono text-xs">{w.id}</td>
                <td className="px-4 py-3 font-medium">{w.name}</td>
                <td className="px-4 py-3 text-muted">{w.nationality}</td>
                <td className="px-4 py-3">{w.skill}</td>
                <td className="px-4 py-3">
                  {w.latestScore != null ? (
                    <span>
                      <span className="font-semibold text-brand">{w.latestScore}</span>
                      <span className="ml-1 text-xs text-muted">{w.latestLevel}</span>
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={w.analysisStatus} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/workers/${w.id}`} className="text-brand hover:underline">
                      상세
                    </Link>
                    <Link
                      href={`/workers/${w.id}/edit`}
                      className="text-muted hover:underline"
                    >
                      수정
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
