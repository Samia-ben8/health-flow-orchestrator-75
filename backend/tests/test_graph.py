from app.graph import graph


initial_state = {

    "question_count": 0,

    "patient_answers": []
}


config = {

    "configurable": {

        "thread_id":
            "medical-session-1"
    }
}


result = graph.invoke(

    initial_state,

    config=config
)


print("\nFINAL RESULT:\n")

print(result)