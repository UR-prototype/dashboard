import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg">
      <p className="text-lg font-semibold">페이지를 찾을 수 없습니다</p>
      <Link href="/" className="text-sm text-brand hover:underline">
        대시보드로 이동
      </Link>
    </div>
  );
}
