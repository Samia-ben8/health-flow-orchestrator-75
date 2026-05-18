def get_mcp_medical_advice(
    question: str,
    answer: str
):

    q = question.lower()
    a = answer.lower()

    positive = any(

        word in a

        for word in [

            "yes",
            "y",
            "fever",
            "cough",
            "pain",
            "difficulty",
            "fatigue"
        ]
    )

    if not positive:

        return (
            "General monitoring recommended."
        )

    # Fever
    if "fever" in q:

        return (
            "Stay hydrated and monitor temperature."
        )

    # Cough
    if "cough" in q:

        return (
            "Monitor respiratory symptoms and rest."
        )

    # Fatigue
    if "fatigue" in q:

        return (
            "Ensure adequate rest and hydration."
        )

    # Breathing
    if "breathing" in q:

        return (
            "Urgent medical evaluation recommended."
        )

    return (
        "Consult healthcare professional."
    )