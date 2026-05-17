export const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "http://127.0.0.1:8000";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
  }
  return res.json() as Promise<T>;
}

export interface SessionStartResponse {
  thread_id: string;
  status?: string;
}

export interface MedicalStateData {
  status?: string;
  question_count?: number;
  patient_answers?: string[];
  diagnostic_summary?: string;
  interim_care?: string;
  physician_treatment?: string;
  final_report?: string;
  next?: string;
  [k: string]: unknown;
}

interface BackendEnvelope {
  success?: boolean;
  thread_id?: string;
  data?: MedicalStateData;
  error?: string;
}

async function unwrap(res: Response): Promise<MedicalStateData> {
  const json = await handle<BackendEnvelope | MedicalStateData>(res);
  if (json && typeof json === "object" && "error" in json && json.error) {
    throw new Error(String(json.error));
  }
  // Envelope from /consultation/start and /consultation/resume
  if (json && typeof json === "object" && "data" in json && json.data) {
    return json.data as MedicalStateData;
  }
  return json as MedicalStateData;
}

export const api = {
  startSession: () =>
    fetch(`${API_BASE}/sessions/start`, { method: "POST" }).then(handle<SessionStartResponse>),

  startConsultation: (thread_id: string) =>
    fetch(`${API_BASE}/consultation/start?thread_id=${encodeURIComponent(thread_id)}`, {
      method: "POST",
    }).then(unwrap),

  resumeConsultation: (thread_id: string, physician_treatment: string) =>
    fetch(
      `${API_BASE}/consultation/resume?thread_id=${encodeURIComponent(
        thread_id,
      )}&physician_treatment=${encodeURIComponent(physician_treatment)}`,
      { method: "POST" },
    ).then(unwrap),

  getConsultation: (thread_id: string) =>
    fetch(`${API_BASE}/consultation/${encodeURIComponent(thread_id)}`).then(
      handle<MedicalStateData>,
    ),

  getReport: (thread_id: string) =>
    fetch(`${API_BASE}/consultation/${encodeURIComponent(thread_id)}/report`).then(
      handle<{ final_report?: string; error?: string }>,
    ),
};
