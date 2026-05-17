from mcp.server.fastmcp import FastMCP


mcp = FastMCP(
    "MedicalMCPServer"
)


# =========================
# TOOL
# =========================

@mcp.tool()
def get_symptom_advice(
    symptom: str
):

    symptom = symptom.lower()

    if "fever" in symptom:

        return (
            "Stay hydrated and monitor temperature."
        )

    elif "cough" in symptom:

        return (
            "Rest and monitor respiratory symptoms."
        )

    elif "breathing" in symptom:

        return (
            "Seek urgent medical evaluation."
        )

    return (
        "Consult healthcare professional."
    )


# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":

    mcp.run()