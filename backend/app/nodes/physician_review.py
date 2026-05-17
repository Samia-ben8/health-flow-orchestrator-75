from app.state import MedicalState


def physician_review_node(
    state: MedicalState
):

    # Si pas encore validation médecin
    if not state.get(
        "physician_treatment"
    ):

        return {

            "status":
                "waiting_physician",

            "next":
                "FINISH"
        }

    # Sinon continuer workflow
    return {

        "status":
            "physician_completed",

        "physician_treatment":
            state["physician_treatment"]
    }