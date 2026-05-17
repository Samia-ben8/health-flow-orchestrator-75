from langgraph.graph import (
    StateGraph,
    START,
    END
)

from app.state import MedicalState

from app.nodes.supervisor import (
    supervisor_node
)

from app.nodes.diagnostic_agent import (
    diagnostic_agent_node
)

from app.nodes.physician_review import (
    physician_review_node
)

from app.nodes.report_agent import (
    report_agent_node
)


# Builder
builder = StateGraph(MedicalState)


# Nodes
builder.add_node(
    "supervisor",
    supervisor_node
)

builder.add_node(
    "diagnostic_agent",
    diagnostic_agent_node
)

builder.add_node(
    "physician_review",
    physician_review_node
)

builder.add_node(
    "report_agent",
    report_agent_node
)


# Start edge
builder.add_edge(
    START,
    "supervisor"
)


# Routing
def route_supervisor(
    state: MedicalState
):

    return state.get(
        "next",
        "FINISH"
    )


builder.add_conditional_edges(

    "supervisor",

    route_supervisor,

    {

        "diagnostic_agent":
            "diagnostic_agent",

        "physician_review":
            "physician_review",

        "report_agent":
            "report_agent",

        "FINISH":
            END
    }
)


# Return edges
builder.add_edge(
    "diagnostic_agent",
    "supervisor"
)

builder.add_edge(
    "physician_review",
    "supervisor"
)

builder.add_edge(
    "report_agent",
    "supervisor"
)





# Compile
graph = builder.compile()