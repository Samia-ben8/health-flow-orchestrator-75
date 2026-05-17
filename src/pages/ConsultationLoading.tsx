import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Stethoscope, Workflow, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useConsultation } from "@/context/ConsultationContext";
import { StatusBadge } from "@/components/StatusBadge";

const steps = [
  { icon: Workflow, label: "Initializing LangGraph workflow" },
  { icon: Brain, label: "Diagnostic agent analyzing clinical inputs" },
  { icon: Stethoscope, label: "Generating interim care recommendations" },
];

export default function ConsultationLoading() {
  const { stage, threadId } = useConsultation();
  const navigate = useNavigate();

  useEffect(() => {
    if (stage === "physician_review") navigate("/review");
    if (stage === "complete") navigate("/report");
    if (stage === "idle" && !threadId) navigate("/");
  }, [stage, threadId, navigate]);

  return (
    <div className="min-h-screen gradient-subtle px-6 py-16">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">Consultation</p>
            <h1 className="font-display text-3xl font-bold mt-1">Multi-agent workflow in progress</h1>
          </div>
          <StatusBadge variant="running" />
        </div>

        <Card className="p-8 gradient-card border-border shadow-elegant">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl gradient-hero flex items-center justify-center shadow-glow">
              <Loader2 className="h-7 w-7 text-white animate-spin" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">Agents are collaborating</h2>
              <p className="text-sm text-muted-foreground">
                This usually takes a few seconds. Please don't close this tab.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/60 border border-border"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary animate-pulse-soft" />
                  </div>
                  <p className="text-sm font-medium text-foreground flex-1">{s.label}</p>
                  <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                </div>
              );
            })}
          </div>

          {threadId && (
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Session ID: <span className="font-mono text-foreground">{threadId}</span>
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
