from app.services.openai_service import llm


def generate_dynamic_questions(
    initial_case: str
):

    prompt = f"""
    You are an advanced clinical assistant.

    Patient initial symptoms:
    {initial_case}

    Generate EXACTLY 5 highly relevant
    clinical follow-up questions.

    IMPORTANT:
    - Questions must improve clinical reasoning
    - Questions must be concise
    - Questions must help generate useful interim recommendations
    - Avoid generic questions

    Return ONLY the 5 questions.
    One per line.
    """

    response = llm.invoke(prompt)

    questions = [

        q.strip("- ").strip()

        for q in response.content.split("\n")

        if q.strip()
    ]

    return questions[:5]