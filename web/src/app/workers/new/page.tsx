import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function NewWorkerPage() {
  return (
    <AppShell
      title="기술자 등록"
      subtitle="기술자 ID, 작업 유형 및 기본 정보 등록"
      actions={
        <Link href="/workers" className="text-sm text-muted hover:text-ink">
          ← 목록
        </Link>
      }
    >
      <form className="max-w-2xl space-y-4 rounded-xl border border-line bg-surface p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="기술자 ID" defaultValue="W-006" />
          <Field label="성명" defaultValue="" placeholder="FULL NAME" />
          <Field label="국적" defaultValue="Vietnam" />
          <Field label="나이" defaultValue="27" type="number" />
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block text-muted">작업유형</span>
            <select className="w-full rounded-lg border border-line px-3 py-2">
              <option>금형조립</option>
              <option>기계가공</option>
              <option>사출</option>
              <option>프레스</option>
              <option>용접</option>
            </select>
          </label>
          <Field label="에이전시" defaultValue="URCONNECTION" />
          <Field label="배정 회사" defaultValue="미배정" />
        </div>
        <div className="flex gap-2 pt-2">
          <Link
            href="/workers"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white"
          >
            등록
          </Link>
          <Link
            href="/workers"
            className="rounded-lg border border-line px-4 py-2 text-sm text-muted"
          >
            취소
          </Link>
        </div>
      </form>
    </AppShell>
  );
}

function Field({
  label,
  defaultValue,
  placeholder,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"
      />
    </label>
  );
}
