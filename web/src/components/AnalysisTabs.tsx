"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { slug: "", label: "종합" },
  { slug: "pose", label: "자세" },
  { slug: "time", label: "작업 시간" },
  { slug: "repetition", label: "반복 패턴" },
  { slug: "product", label: "결과물" },
  { slug: "skill", label: "평가 승인" },
];

export function AnalysisTabs({ videoId }: { videoId: string }) {
  const pathname = usePathname();
  const base = `/analysis/${videoId}`;

  return (
    <div className="mb-5 flex flex-wrap gap-2 border-b border-line pb-3">
      {tabs.map((t) => {
        const href = t.slug ? `${base}/${t.slug}` : base;
        const active = pathname === href;
        return (
          <Link
            key={t.label}
            href={href}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              active ? "bg-brand-soft font-medium text-brand" : "text-muted hover:bg-bg"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
