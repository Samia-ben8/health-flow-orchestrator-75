import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react";

type Variant = "running" | "waiting" | "complete" | "error" | "idle";

const variants: Record<Variant, { label: string; classes: string; Icon: typeof CheckCircle2 }> = {
  running: { label: "Workflow Running", classes: "bg-primary/10 text-primary border-primary/20", Icon: Loader2 },
  waiting: { label: "Awaiting Physician", classes: "bg-warning/10 text-warning border-warning/20", Icon: Clock },
  complete: { label: "Complete", classes: "bg-success/10 text-success border-success/20", Icon: CheckCircle2 },
  error: { label: "Error", classes: "bg-destructive/10 text-destructive border-destructive/20", Icon: AlertCircle },
  idle: { label: "Idle", classes: "bg-muted text-muted-foreground border-border", Icon: Clock },
};

export function StatusBadge({ variant, label }: { variant: Variant; label?: string }) {
  const v = variants[variant];
  const Icon = v.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold",
        v.classes,
      )}
    >
      <Icon className={cn("h-3.5 w-3.5", variant === "running" && "animate-spin")} />
      {label ?? v.label}
    </span>
  );
}
