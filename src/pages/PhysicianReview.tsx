import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Brain, ClipboardCheck, Loader2, Send, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useConsultation } from "@/context/ConsultationContext";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";

export default function PhysicianReview() {
  const navigate = useNavigate();
  const { threadId, diagnosticSummary, interimCare, workflowStatus, setFinalReport, setStage, setPhysicianTreatment } =
    useConsultation();
  const [treatment, setTreatment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!threadId) navigate("/");
  }, [threadId, navigate]);

  const handleSubmit = async () => {
    if (!threadId) return;
    if (!treatment.trim()) {
      toast.error("Please enter your treatment recommendation");
      return;
    }
    setSubmitting(true);
    setStage("finalizing");
    try {
      const result = await api.resumeConsultation(threadId, treatment.trim());
      const report =
        (result.final_report as string) ?? JSON.stringify(result, null, 2);
      setFinalReport(report);
      toast.success("Final report generated");
      navigate("/report");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to submit recommendation");
      setStage("physician_review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-subtle px-6 py-10 lg:py-14">
      <div className="max-w-5xl mx-auto animate-fade-in">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">Step 3 of 4</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Physician Review</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              The AI agents have completed their analysis. Review the diagnostic summary and interim care,
              then provide your clinical recommendation to finalize the workflow.
            </p>
          </div>
          <StatusBadge variant="waiting" label={workflowStatus ?? "Awaiting Physician"} />
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mb-6">
          <Card className="p-6 gradient-card border-border shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Diagnostic Agent
                </p>
                <h2 className="font-display font-bold text-lg">Clinical Summary</h2>
              </div>
            </div>
            <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
              {diagnosticSummary || (
                <span className="text-muted-foreground italic">No diagnostic summary available.</span>
              )}
            </div>
          </Card>

          <Card className="p-6 gradient-card border-border shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Care Agent
                </p>
                <h2 className="font-display font-bold text-lg">Interim Recommendations</h2>
              </div>
            </div>
            <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
              {interimCare || (
                <span className="text-muted-foreground italic">No interim care recommendations.</span>
              )}
            </div>
          </Card>
        </div>

        <Card className="p-6 lg:p-8 border-border shadow-elegant bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg gradient-hero flex items-center justify-center shadow-soft">
              <ClipboardCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">Your Treatment Recommendation</h2>
              <p className="text-sm text-muted-foreground">
                Provide your final clinical recommendation. This will be incorporated into the final report.
              </p>
            </div>
          </div>

          <Textarea
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="Enter prescribed treatment, dosage, follow-up plan, and any additional clinical notes…"
            className="min-h-44 resize-y text-sm leading-relaxed border-border focus-visible:ring-primary"
            disabled={submitting}
          />

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Session: <span className="font-mono text-foreground">{threadId?.slice(0, 24)}…</span>
            </p>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={submitting || !treatment.trim()}
              className="gradient-hero border-0 shadow-elegant hover:opacity-90"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Finalizing report…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Submit Recommendation
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
