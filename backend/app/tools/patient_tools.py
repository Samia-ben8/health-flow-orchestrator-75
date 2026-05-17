from app.state import MedicalState


QUESTIONS = [

    "Do you have fever?",

    "Do you have cough?",

    "Do you feel fatigue?",

    "Do you have breathing difficulty?",

    "How long have symptoms lasted?"
]


def get_next_question(
    question_count: int
):

    if question_count >= len(QUESTIONS):

        return None

    return QUESTIONS[question_count]