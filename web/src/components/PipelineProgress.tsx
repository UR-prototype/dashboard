import type { PipelineStatus } from "@/data/mock";
import { PIPELINE_STEPS } from "@/data/mock";
import { pipelineIndex, statusLabel } from "@/lib/status";

const STEP_SHORT: Record<Exclude<PipelineStatus, "failed">, string> = {
  uploaded: "Upload",
  queued: "Queue",
  preprocessing: "Preprocess",
  pose_extraction: "Pose",
  analyzing: "Feature",
  scoring: "Score",
  completed: "Done",
};

export function PipelineProgress({
  status,
  progress,
}: {
  status: PipelineStatus;
  progress: number;
  /** @deprecated 레이아웃 통일 — 무시됨 */
  detailed?: boolean;
}) {
  const idx = pipelineIndex(status);
  const failed = status === "failed";
  const allDone = status === "completed";
  const currentStep =
    !failed && idx >= 0 ? PIPELINE_STEPS[Math.min(idx, PIPELINE_STEPS.length - 1)] : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-medium text-ink">분석 진행</span>
        <span className="text-muted">
          {failed ? (
            <span className="font-medium text-danger">실패</span>
          ) : (
            <>
              <span className="font-medium text-ink">{statusLabel(status)}</span>
              <span className="mx-1.5 opacity-40">·</span>
              <span className="font-mono">{progress}%</span>
            </>
          )}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-bg">
        <div
          className={`h-full rounded-full transition-all ${
            failed ? "bg-danger" : "bg-brand"
          }`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      <ol className="flex items-start justify-between">
        {PIPELINE_STEPS.map((step, i) => {
          const done = allDone || (!failed && idx > i);
          const current = !allDone && !failed && idx === i;
          const isFailHere = failed && i === Math.max(idx, 0);
          const lineFilled = allDone || (!failed && idx > i);

          return (
            <li
              key={step}
              className="relative flex min-w-0 flex-1 flex-col items-center"
            >
              {i < PIPELINE_STEPS.length - 1 ? (
                <span
                  className={`absolute left-[calc(50%+7px)] top-[7px] h-px w-[calc(100%-14px)] ${
                    lineFilled ? "bg-brand/70" : "bg-line"
                  }`}
                  aria-hidden
                />
              ) : null}

              <span
                className={`relative z-[1] flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 ${
                  isFailHere
                    ? "border-danger bg-danger"
                    : done
                      ? "border-brand bg-brand"
                      : current
                        ? "border-brand bg-surface"
                        : "border-line bg-surface"
                }`}
              >
                {done ? (
                  <span className="h-1 w-1 rounded-full bg-white" />
                ) : current ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                ) : null}
              </span>

              <span
                className={`mt-1.5 max-w-[4.5rem] truncate text-center text-[10px] leading-tight ${
                  current || isFailHere
                    ? "font-semibold text-brand"
                    : done
                      ? "text-ink/80"
                      : "text-muted"
                }`}
                title={`${STEP_SHORT[step as keyof typeof STEP_SHORT]} · ${statusLabel(step)}`}
              >
                {STEP_SHORT[step as keyof typeof STEP_SHORT]}
              </span>
            </li>
          );
        })}
      </ol>

      {currentStep && !allDone ? (
        <p className="text-[11px] text-muted">
          현재:{" "}
          <span className="font-medium text-ink">
            {STEP_SHORT[currentStep as keyof typeof STEP_SHORT]} ({statusLabel(currentStep)})
          </span>
        </p>
      ) : null}
    </div>
  );
}
