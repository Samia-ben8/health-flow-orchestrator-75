import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Brain, ShieldCheck, Stethoscope, Workflow, Sparkles, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useConsultation } from "@/context/ConsultationContext";

const features = [
  { icon: Brain, title: "Diagnostic Agent", desc: "AI-powered preliminary diagnostic synthesis from clinical inputs." },
  { icon: Stethoscope, title: "Interim Care", desc: "Immediate care recommendations generated before physician review." },
  { icon: ShieldCheck, title: "Human-in-the-loop", desc: "Physician validation gate ensures clinical safety and accountability." },
  { icon: Workflow, title: "LangGraph Orchestration", desc: "Stateful multi-agent workflow with checkpointing & resumability." },
];

export default function Index() {
  const navigate = useNavigate();
  const { setThreadId, setStage, reset } = useConsultation();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    reset();
    try {
      const session = await api.startSession();
      setThreadId(session.thread_id);
      setStage("running");
      navigate("/questions");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to start consultation");
      setStage("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-40 right-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-soft mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">LangGraph × FastAPI · Multi-Agent</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.05]">
            Medical Multi-Agent <br />
            <span className="text-gradient">Clinical Workflow</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            AI-orchestrated clinical reasoning with autonomous diagnostic agents and a human-in-the-loop
            physician review gate — designed for safe, auditable healthcare decision support.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              onClick={handleStart}
              disabled={loading}
              className="h-14 px-8 text-base font-semibold gradient-hero hover:opacity-90 shadow-elegant transition-smooth border-0"
            >
              {loading ? (
                <>
                  <Activity className="h-5 w-5 animate-pulse-soft" />
                  Initializing...
                </>
              ) : (
                <>
                  Start Consultation
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-6 text-base border-border bg-card hover:bg-secondary"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            >
              Learn how it works
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            {[
              ["4", "AI Agents"],
              ["1", "Physician Gate"],
              ["100%", "Auditable"],
              ["Real-time", "Orchestration"],
            ].map(([v, l]) => (
              <div key={l} className="px-4 py-3 rounded-xl bg-card/60 backdrop-blur border border-border">
                <p className="font-display text-2xl font-bold text-foreground">{v}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Architecture</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Built for clinical-grade AI orchestration
          </h2>
          <p className="mt-3 text-muted-foreground">
            Each step in the workflow is handled by a specialized agent, coordinated by LangGraph and gated
            by physician validation for clinical safety.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Card
                key={f.title}
                className="p-6 gradient-card border-border shadow-soft hover:shadow-elegant transition-smooth group"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:gradient-hero transition-smooth">
                  <Icon className="h-5 w-5 text-primary group-hover:text-white transition-smooth" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            );
          })}
        </div>

        {/* Workflow diagram */}
        <Card className="mt-12 p-8 lg:p-10 gradient-card border-border shadow-soft">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Workflow</p>
          <h3 className="font-display text-2xl font-bold mb-8">Consultation lifecycle</h3>
          <div className="grid md:grid-cols-5 gap-4 items-center">
            {["Session", "Diagnostic Agent", "Interim Care", "Physician Gate", "Final Report"].map((step, i) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full gradient-hero flex items-center justify-center text-white font-display font-bold shadow-soft">
                  {i + 1}
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
