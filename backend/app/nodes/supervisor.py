from app.state import MedicalState


def supervisor_node(
    state: MedicalState
):

    status = state.get("status")

    # Collecte réponses patient
    if status == "collecting_answers":

        return {
            "next": "FINISH"
        }

    # Pause médecin
    if status == "waiting_physician":

        return {
            "next": "FINISH"
        }

    # Pas encore diagnostic
    if not state.get(
        "diagnostic_summary"
    ):

        next_step = (
            "diagnostic_agent"
        )

    # Attente médecin
    elif not state.get(
        "physician_treatment"
    ):

        next_step = (
            "physician_review"
        )

    # Rapport final
    elif not state.get(
        "final_report"
    ):

        next_step = (
            "report_agent"
        )

    else:

        next_step = "FINISH"

    return {
        "next": next_step
    }