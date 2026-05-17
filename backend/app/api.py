from uuid import uuid4

from fastapi import APIRouter

from app.graph import graph


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
    thread_id: str
):

    initial_state = {

        "question_count": 0,

        "patient_answers": [],

        "status": "running"
    }

    config = {

        "configurable": {

            "thread_id": thread_id
        }
    }

    result = graph.invoke(

        initial_state,

        config=config
    )

    sessions[thread_id] = result

    return {

    "success": True,

    "thread_id": thread_id,

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