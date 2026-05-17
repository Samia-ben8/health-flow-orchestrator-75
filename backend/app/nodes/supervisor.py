from app.state import MedicalState


def supervisor_node(
    state: MedicalState
):

    # Si workflow en attente médecin
    if state.get("status") == "waiting_physician":

        return {
            "next": "FINISH"
        }

    # Diagnostic pas encore généré
    if not state.get(
        "diagnostic_summary"
    ):

        next_step = (
            "diagnostic_agent"
        )

    # Attente revue médecin
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