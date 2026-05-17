from app.nodes.supervisor import supervisor_node
from app.nodes.diagnostic_agent import diagnostic_agent_node
from app.nodes.report_agent import report_agent_node


state = {
    "patient_answers": [
        "I have fever",
        "I cough frequently"
    ]
}

# Supervisor
supervisor_result = supervisor_node(state)

print("\nSupervisor Result:")
print(supervisor_result)

# Diagnostic Agent
diagnostic_result = diagnostic_agent_node(state)

print("\nDiagnostic Result:")
print(diagnostic_result)

# Update state
state.update(diagnostic_result)

state["physician_treatment"] = (
    "Recommend hydration and medical follow-up."
)

# Report Agent
report_result = report_agent_node(state)

print("\nReport Result:")
print(report_result)