import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Loader2, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useConsultation } from "@/context/ConsultationContext";
import { StatusBadge } from "@/components/StatusBadge";
import { api } from "@/lib/api";

const TOTAL_QUESTIONS = 5;

export default function PatientQuestions() {
  const navigate = useNavigate();
  const { threadId, setReviewData, setStage } = useConsultation();
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load first question on mount
  useEffect(() => {
    if (!threadId) {
      navigate("/");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await api.startConsultation(threadId);
        if (cancelled) return;
        setQuestionNumber(res.question_number);
        setQuestion(res.question);
      } catch (err) {
        console.error(err);
        toast.error(err instanceof Error ? err.message : "Failed to load question");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  const handleSubmit = async () => {
    if (!threadId) return;
    if (!answer.trim()) {
      toast.error("Please enter an answer");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.answerQuestion(threadId, answer.trim());
      if ("completed_questions" in res && res.completed_questions) {
        // All 5 questions answered → graph ran
        setReviewData({
          diagnosticSummary: (res.data.diagnostic_summary as string) ?? "",
          interimCare: (res.data.interim_care as string) ?? "",
          workflowStatus: (res.data.status as string) ?? "waiting_physician",
        });
        setStage("physician_review");
        toast.success("Analysis complete — ready for physician review");
        navigate("/review");
        return;
      }
      setQuestionNumber(res.question_number);
      setQuestion(res.question);
      setAnswer("");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((questionNumber - 1) / TOTAL_QUESTIONS) * 100;
  const busy = loading || submitting;

  return (
    <div className="min-h-screen gradient-subtle px-6 py-10 lg:py-14">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">Step 2 of 4</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Patient Intake</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Answer a short series of clinical questions. Your responses are sent to the diagnostic agent
              for preliminary analysis.
            </p>
          </div>
          <StatusBadge variant="running" label="Collecting Answers" />
        </div>

        <Card className="p-6 lg:p-8 gradient-card border-border shadow-elegant">
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-2">
              <span>
                Question {questionNumber} of {TOTAL_QUESTIONS}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="h-11 w-11 rounded-xl gradient-hero flex items-center justify-center shadow-soft shrink-0">
              <MessageCircleQuestion className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                Clinical Question
              </p>
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </div>
              ) : (
                <h2 className="font-display text-xl md:text-2xl font-bold leading-snug">{question}</h2>
              )}
            </div>
          </div>

          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here…"
            className="min-h-32 resize-y text-sm leading-relaxed"
            disabled={busy}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
          />

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {threadId && (
                <>
                  Session: <span className="font-mono text-foreground">{threadId.slice(0, 24)}…</span>
                </>
              )}
            </p>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={busy || !answer.trim()}
              className="gradient-hero border-0 shadow-elegant hover:opacity-90"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {questionNumber >= TOTAL_QUESTIONS ? "Running agents…" : "Submitting…"}
                </>
              ) : (
                <>
                  {questionNumber >= TOTAL_QUESTIONS ? "Submit & Analyze" : "Next Question"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
