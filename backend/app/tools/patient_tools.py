from app.state import MedicalState


QUESTIONS = [

    "Do you have fever?",

    "Do you have cough?",

    "Do you feel fatigue?",

    "Do you have breathing difficulty?",

    "How long have symptoms lasted?"
]


def ask_patient(state: MedicalState):

    question_count = state.get(
        "question_count",
        0
    )

    if question_count >= 5:

        return {
            "current_question": None
        }

    question = QUESTIONS[question_count]

    return {
        "current_question": question
    }