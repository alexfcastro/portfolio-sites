import { CalendarClock, Clock3, FlaskConical, Hammer, MonitorPlay, PauseCircle } from "lucide-react";
import { demoStatusLabels, type PublicDemoState } from "@/lib/demo";

const statusIcons = {
  planned: Clock3,
  in_progress: Hammer,
  available: MonitorPlay,
  unpublished: CalendarClock,
  unavailable: PauseCircle,
} as const;

const badgeBase =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none whitespace-nowrap";

export function DemoStatusBadge({ status }: { status: PublicDemoState }) {
  const Icon = statusIcons[status];
  const tone =
    status === "available"
      ? "border-success/30 bg-success/10 text-success"
      : status === "unpublished"
        ? "border-ink/20 bg-paper text-ink"
        : "border-line bg-paper text-muted";

  return (
    <span className={`${badgeBase} ${tone}`}>
      <Icon aria-hidden className="size-3.5" />
      <span>
        <span className="sr-only">Demonstração: </span>
        {demoStatusLabels[status]}
      </span>
    </span>
  );
}

export function ConceptBadge() {
  return (
    <span className={`${badgeBase} border-accent/25 bg-accent-soft text-accent-strong`}>
      <FlaskConical aria-hidden className="size-3.5" />
      Projeto conceitual
    </span>
  );
}
