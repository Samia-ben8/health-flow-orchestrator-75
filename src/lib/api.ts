export const API_BASE = "http://127.0.0.1:8000";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
  }
  return res.json() as Promise<T>;
}

export interface SessionStartResponse {
  thread_id: string;
}

export interface ConsultationStartResponse {
  diagnostic_summary?: string;
  interim_care?: string;
  status?: string;
  [k: string]: unknown;
}

export interface ConsultationResumeResponse {
  final_report?: string;
  [k: string]: unknown;
}

export const api = {
  startSession: () =>
    fetch(`${API_BASE}/sessions/start`, { method: "POST" }).then(handle<SessionStartResponse>),

  startConsultation: (thread_id: string) =>
    fetch(`${API_BASE}/consultation/start?thread_id=${encodeURIComponent(thread_id)}`, {
      method: "POST",
    }).then(handle<ConsultationStartResponse>),

  resumeConsultation: (thread_id: string, physician_treatment: string) =>
    fetch(
      `${API_BASE}/consultation/resume?thread_id=${encodeURIComponent(
        thread_id,
      )}&physician_treatment=${encodeURIComponent(physician_treatment)}`,
      { method: "POST" },
    ).then(handle<ConsultationResumeResponse>),

  getConsultation: (thread_id: string) =>
    fetch(`${API_BASE}/consultation/${encodeURIComponent(thread_id)}`).then(handle<Record<string, unknown>>),

  getReport: (thread_id: string) =>
    fetch(`${API_BASE}/consultation/${encodeURIComponent(thread_id)}/report`).then(
      handle<Record<string, unknown>>,
    ),
};
