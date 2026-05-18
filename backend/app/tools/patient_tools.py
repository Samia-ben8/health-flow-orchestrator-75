from app.state import MedicalState


QUESTIONS = [

    "Do you have fever?",

    "Do you have cough?",

    "Do you feel fatigue?",

    "Do you have breathing difficulty?",

    "How long have symptoms lasted?"
]


def get_next_question(

    questions: list,

    question_count: int
):

    if question_count >= len(questions):

        return None

    return questions[question_count]