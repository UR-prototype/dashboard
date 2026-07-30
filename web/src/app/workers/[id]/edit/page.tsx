import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { getWorker } from "@/data/mock";

export default async function EditWorkerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const worker = getWorker(id);
  if (!worker) notFound();

  return (
    <AppShell
      title="기술자 정보 수정"
      subtitle={`${worker.id} · ${worker.name}`}
      actions={
        <Link href={`/workers/${worker.id}`} className="text-sm text-muted hover:text-ink">
          ← 상세
        </Link>
      }
    >
      <form className="max-w-2xl space-y-4 rounded-xl border border-line bg-surface p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-muted">성명</span>
            <input
              defaultValue={worker.name}
              className="w-full rounded-lg border border-line px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">국적</span>
            <input
              defaultValue={worker.nationality}
              className="w-full rounded-lg border border-line px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">작업유형</span>
            <select
              defaultValue={worker.skill}
              className="w-full rounded-lg border border-line px-3 py-2"
            >
              {["금형조립", "기계가공", "사출", "프레스", "용접"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">배정 회사</span>
            <input
              defaultValue={worker.company}
              className="w-full rounded-lg border border-line px-3 py-2"
            />
          </label>
        </div>
        <Link
          href={`/workers/${worker.id}`}
          className="inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white"
        >
          저장
        </Link>
      </form>
    </AppShell>
  );
}
