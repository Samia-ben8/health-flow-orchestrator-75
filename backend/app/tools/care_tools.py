from app.state import MedicalState
from app.tools.mcp_client import (
    get_mcp_medical_advice
)


def recommend_interim_care(
    state: MedicalState
):

    answers = state.get(
        "patient_answers",
        []
    )

    recommendation = ""

    for answer in answers:

        recommendation += (
            "\n- " +
            get_mcp_medical_advice(answer)
        )

    if any(
        "breathing" in answer.lower()
        for answer in answers
    ):

        recommendation += """

        - Seek urgent medical evaluation
        """

    return {
        "interim_care": recommendation
    }