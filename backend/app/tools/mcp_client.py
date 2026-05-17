def get_mcp_medical_advice(
    symptom: str
):

    symptom = symptom.lower()

    if "fever" in symptom:

        return (
            "Stay hydrated and monitor temperature."
        )

    elif "breathing" in symptom:

        return (
            "Urgent medical evaluation recommended."
        )

    return (
        "General monitoring recommended."
    )