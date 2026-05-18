from typing import Annotated
from typing_extensions import TypedDict, Literal

from langgraph.graph.message import add_messages


class MedicalState(TypedDict, total=False):

    # Historique des messages
    messages: Annotated[list, add_messages]

    # Prochaine étape du workflow
    next: Literal[
        "diagnostic_agent",
        "physician_review",
        "report_agent",
        "FINISH"
    ]
    initial_case: str

    generated_questions: list
    
    status: str

    # Nombre de questions posées
    question_count: int

    # Réponses du patient
    patient_answers: list

    # Recommandation intermédiaire
    interim_care: str

    # Synthèse clinique
    diagnostic_summary: str

    # Intervention du médecin
    physician_treatment: str

    # Rapport final
    final_report: str

    