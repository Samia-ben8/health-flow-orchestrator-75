import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type ConsultationStage = "idle" | "running" | "physician_review" | "finalizing" | "complete";

interface ConsultationState {
  threadId: string | null;
  stage: ConsultationStage;
  diagnosticSummary: string | null;
  interimCare: string | null;
  finalReport: string | null;
  workflowStatus: string | null;
}

interface ConsultationContextValue extends ConsultationState {
  setThreadId: (id: string | null) => void;
  setStage: (s: ConsultationStage) => void;
  setReviewData: (d: { diagnosticSummary?: string; interimCare?: string; workflowStatus?: string }) => void;
  setFinalReport: (r: string) => void;
  reset: () => void;
}

const STORAGE_KEY = "mediflow:consultation";

const initialState: ConsultationState = {
  threadId: null,
  stage: "idle",
  diagnosticSummary: null,
  interimCare: null,
  finalReport: null,
  workflowStatus: null,
};

const ConsultationContext = createContext<ConsultationContextValue | undefined>(undefined);

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConsultationState>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const value: ConsultationContextValue = {
    ...state,
    setThreadId: (threadId) => setState((s) => ({ ...s, threadId })),
    setStage: (stage) => setState((s) => ({ ...s, stage })),
    setReviewData: (d) =>
      setState((s) => ({
        ...s,
        diagnosticSummary: d.diagnosticSummary ?? s.diagnosticSummary,
        interimCare: d.interimCare ?? s.interimCare,
        workflowStatus: d.workflowStatus ?? s.workflowStatus,
      })),
    setFinalReport: (finalReport) => setState((s) => ({ ...s, finalReport, stage: "complete" })),
    reset: () => {
      sessionStorage.removeItem(STORAGE_KEY);
      setState(initialState);
    },
  };

  return <ConsultationContext.Provider value={value}>{children}</ConsultationContext.Provider>;
}

export function useConsultation() {
  const ctx = useContext(ConsultationContext);
  if (!ctx) throw new Error("useConsultation must be used within ConsultationProvider");
  return ctx;
}
