import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
            UR
          </div>
          <div>
            <h1 className="text-lg font-semibold">UR Connection</h1>
            <p className="text-sm text-muted">숙련도 분석 콘솔</p>
          </div>
        </div>

        <form className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-muted">이메일</span>
            <input
              className="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"
              defaultValue="admin@urconnection.co.kr"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">비밀번호</span>
            <input
              type="password"
              className="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"
              defaultValue="********"
            />
          </label>
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white"
          >
            로그인
          </Link>
        </form>
      </div>
    </div>
  );
}
