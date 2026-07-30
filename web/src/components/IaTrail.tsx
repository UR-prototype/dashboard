import Link from "next/link";
import { iaBreadcrumb } from "@/data/mock";

export function IaTrail({ current }: { current?: string }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted">
      {iaBreadcrumb.map((item, i) => (
        <span key={item.href} className="flex items-center gap-1">
          {i > 0 ? <span>/</span> : null}
          <Link
            href={item.href}
            className={
              current === item.label
                ? "font-semibold text-brand"
                : "hover:text-brand"
            }
          >
            {item.label === "Dashboard"
              ? "홈"
              : item.label === "Worker"
                ? "기술자"
                : item.label === "Video/Jobs"
                  ? "작업 영상"
                  : item.label === "Analysis"
                    ? "분석 결과"
                    : item.label === "Report"
                      ? "평가서"
                      : item.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
