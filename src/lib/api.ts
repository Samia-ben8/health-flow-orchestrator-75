export const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "http://127.0.0.1:8000";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
  }
  return res.json() as Promise<T>;
}

function throwIfError<T extends { error?: string }>(json: T): T {
  if (json && json.error) throw new Error(String(json.error));
  return json;
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

export interface QuestionResponse {
  success: true;
  thread_id?: string;
  question_number: number;
  question: string;
  completed_questions?: false;
}

export interface ConsultationCompletedResponse {
  success: true;
  completed_questions: true;
  data: MedicalStateData;
}

export type AnswerResponse = QuestionResponse | ConsultationCompletedResponse;

export const api = {
  startSession: () =>
    fetch(`${API_BASE}/sessions/start`, { method: "POST" })
      .then(handle<SessionStartResponse & { error?: string }>)
      .then(throwIfError),

  startConsultation: (thread_id: string, initial_case: string) =>
    fetch(
      `${API_BASE}/consultation/start?thread_id=${encodeURIComponent(
        thread_id,
      )}&initial_case=${encodeURIComponent(initial_case)}`,
      { method: "POST" },
    )
      .then(handle<QuestionResponse & { error?: string }>)
      .then(throwIfError),

  answerQuestion: (thread_id: string, answer: string) =>
    fetch(
      `${API_BASE}/consultation/answer?thread_id=${encodeURIComponent(
        thread_id,
      )}&answer=${encodeURIComponent(answer)}`,
      { method: "POST" },
    )
      .then(handle<AnswerResponse & { error?: string }>)
      .then(throwIfError),

  resumeConsultation: (thread_id: string, physician_treatment: string) =>
    fetch(
      `${API_BASE}/consultation/resume?thread_id=${encodeURIComponent(
        thread_id,
      )}&physician_treatment=${encodeURIComponent(physician_treatment)}`,
      { method: "POST" },
    )
      .then(handle<{ success: boolean; thread_id: string; data: MedicalStateData; error?: string }>)
      .then(throwIfError)
      .then((j) => j.data),

  getConsultation: (thread_id: string) =>
    fetch(`${API_BASE}/consultation/${encodeURIComponent(thread_id)}`).then(
      handle<MedicalStateData>,
    ),

  getReport: (thread_id: string) =>
    fetch(`${API_BASE}/consultation/${encodeURIComponent(thread_id)}/report`).then(
      handle<{ final_report?: string; error?: string }>,
    ),
};
