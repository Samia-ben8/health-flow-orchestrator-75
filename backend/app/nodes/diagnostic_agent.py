from app.state import MedicalState

from app.services.openai_service import llm

from app.tools.care_tools import (
    recommend_interim_care
)


from app.state import MedicalState

from app.services.openai_service import llm

from app.tools.care_tools import (
    recommend_interim_care
)


def diagnostic_agent_node(
    state: MedicalState
):

    patient_answers = state.get(
        "patient_answers",
        []
    )

    # Tant que moins de 5 réponses
    if len(patient_answers) < 5:

        return {

            "status":
                "collecting_answers",

            "next":
                "FINISH"
        }

    # Génération analyse
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
            ],

        "status":
            "waiting_physician"
    }