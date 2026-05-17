from app.state import MedicalState


sample_state: MedicalState = {
    "question_count": 0,
    "patient_answers": [],
    "interim_care": "",
    "diagnostic_summary": "",
    "physician_treatment": "",
    "final_report": "",
    "next": "diagnostic_agent"
}

print(sample_state)