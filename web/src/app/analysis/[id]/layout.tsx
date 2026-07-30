import { jobs } from "@/data/mock";

export function generateStaticParams() {
  return jobs.map((j) => ({ id: j.videoId }));
}

export default function AnalysisIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
