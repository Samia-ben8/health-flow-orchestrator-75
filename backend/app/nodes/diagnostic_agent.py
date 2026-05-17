from app.state import MedicalState

from app.services.openai_service import llm

from app.tools.patient_tools import ask_patient
from app.tools.care_tools import (
    recommend_interim_care
)


def diagnostic_agent_node(
    state: MedicalState
):

    question_count = state.get(
        "question_count",
        0
    )

    patient_answers = state.get(
        "patient_answers",
        []
    )

    # Tant que moins de 5 questions
    if question_count < 5:

        question_data = ask_patient(state)

        question = question_data[
            "current_question"
        ]

        # Simulation réponse patient
        simulated_answer = (
            f"Simulated answer to: {question}"
        )

        patient_answers.append(
            simulated_answer
        )

        return {

            "question_count":
                question_count + 1,

            "patient_answers":
                patient_answers
        }

    # Après 5 questions
    prompt = f"""
    You are a clinical assistant.

    Patient answers:
    {patient_answers}

    Create a short preliminary
    clinical summary.

    IMPORTANT:
    - Do not provide definitive diagnosis
    - Stay medically cautious
    """

    response = llm.invoke(prompt)

    interim_care = (
        recommend_interim_care(state)
    )

    return {

        "diagnostic_summary":
            response.content,

        "interim_care":
            interim_care[
                "interim_care"
            ]
    }