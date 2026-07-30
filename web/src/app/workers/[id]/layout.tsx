import { workers } from "@/data/mock";

export function generateStaticParams() {
  return workers.map((w) => ({ id: w.id }));
}

export default function WorkerIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
