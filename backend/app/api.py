from uuid import uuid4

from fastapi import APIRouter

from app.graph import graph
from app.tools.patient_tools import (
    get_next_question
)
from app.tools.question_generator import (
    generate_dynamic_questions
)


router = APIRouter()

sessions = {}


# =========================
# START SESSION
# =========================

@router.post("/sessions/start")
def start_session():

    thread_id = str(uuid4())

    sessions[thread_id] = {
        "status": "created"
    }

    return {

        "thread_id": thread_id,

        "status": "session_created"
    }


# =========================
# START CONSULTATION
# =========================

@router.post("/consultation/start")
def start_consultation(

    thread_id: str,

    initial_case: str
):

    generated_questions = (
        generate_dynamic_questions(
            initial_case
        )
    )

    initial_state = {

        "initial_case":
            initial_case,

        "generated_questions":
            generated_questions,

        "question_count": 0,

        "patient_answers": [],

        "status":
            "collecting_answers"
    }

    sessions[thread_id] = initial_state

    first_question = (

        generated_questions[0]
    )

    return {

        "success": True,

        "thread_id": thread_id,

        "question_number": 1,

        "question": first_question
    }
# =========================
# ANSWER QUESTION
# =========================

@router.post(
    "/consultation/answer"
)
def answer_question(

    thread_id: str,

    answer: str
):

    session = sessions.get(thread_id)

    if not session:

        return {

            "error":
                "Session not found"
        }

    # Ajouter réponse
    session[
        "patient_answers"
    ].append(answer)

    session[
        "question_count"
    ] += 1

    question_count = session[
        "question_count"
    ]

    # Questions restantes
    if question_count < 5:

        next_question = get_next_question(

            session[
                "generated_questions"
            ],

            question_count
)

        sessions[thread_id] = session

        return {

            "success": True,

            "question_number":
                question_count + 1,

            "question":
                next_question
        }

    # Après 5 réponses
    config = {

        "configurable": {

            "thread_id": thread_id
        }
    }

    session["status"] = "running"

    result = graph.invoke(

        session,

        config=config
    )

    sessions[thread_id] = result

    return {

        "success": True,

        "completed_questions": True,

        "data": result
    }
# =========================
# RESUME CONSULTATION
# =========================

@router.post(
    "/consultation/resume"
)
def resume_consultation(

    thread_id: str,

    physician_treatment: str
):

    session = sessions.get(thread_id)

    if not session:

        return {

            "error":
                "Session not found"
        }

    session[
        "physician_treatment"
    ] = physician_treatment

    # IMPORTANT
    session[
        "status"
    ] = "running"

    config = {

        "configurable": {

            "thread_id": thread_id
        }
    }

    result = graph.invoke(

        session,

        config=config
    )

    sessions[thread_id] = result

    return {

    "success": True,

    "thread_id": thread_id,

    "data": result
    }


# =========================
# GET CONSULTATION
# =========================

@router.get(
    "/consultation/{thread_id}"
)
def get_consultation(
    thread_id: str
):

    return sessions.get(

        thread_id,

        {
            "error":
                "Session not found"
        }
    )


# =========================
# GET REPORT
# =========================

@router.get(
    "/consultation/{thread_id}/report"
)
def get_report(
    thread_id: str
):

    session = sessions.get(thread_id)

    if not session:

        return {

            "error":
                "Session not found"
        }

    return {

        "final_report":
            session.get(
                "final_report"
            )
    }