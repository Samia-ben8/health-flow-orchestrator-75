from app.state import MedicalState
from app.services.openai_service import llm


def report_agent_node(state: MedicalState):

    summary = state.get("diagnostic_summary", "")
    physician_notes = state.get("physician_treatment", "")
    interim_care = state.get("interim_care", "")

    prompt = f"""
    Create a structured medical report.

    Preliminary clinical summary:
    {summary}

    Interim care recommendation:
    {interim_care}

    Physician notes:
    {physician_notes}

    Add this disclaimer at the end:

    'This system does not replace a medical consultation.'
    """

    response = llm.invoke(prompt)

    return {
        "final_report": response.content
    }