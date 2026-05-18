from app.state import MedicalState

from app.services.openai_service import llm


def recommend_interim_care(
    state: MedicalState
):

    initial_case = state.get(
        "initial_case",
        ""
    )

    questions = state.get(
        "generated_questions",
        []
    )

    answers = state.get(
        "patient_answers",
        []
    )

    clinical_context = ""

    for q, a in zip(
        questions,
        answers
    ):

        clinical_context += (
            f"\nQuestion: {q}"
            f"\nAnswer: {a}\n"
        )

    prompt = f"""
    You are a medical care assistant.

    Initial patient case:
    {initial_case}

    Clinical interview:
    {clinical_context}

    Generate concise and medically
    cautious interim recommendations.

    IMPORTANT:
    - No definitive diagnosis
    - Focus on monitoring/safety
    - Recommendations must match symptoms
    """

    response = llm.invoke(prompt)

    return {

        "interim_care":
            response.content
    }