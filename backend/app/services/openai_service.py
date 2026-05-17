from langchain_openai import ChatOpenAI
from app.config.settings import OPENAI_API_KEY, OPENAI_MODEL

llm = ChatOpenAI(
    api_key=OPENAI_API_KEY,
    model=OPENAI_MODEL,
    temperature=0.3
)