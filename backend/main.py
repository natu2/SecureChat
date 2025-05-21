from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
messages = []

class Message(BaseModel):
    sender: str
    receiver: str
    content: str


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"msg": "SecureChat backend is running!"}

@app.post("/send/{message_id}")
def add_message(message_id: int, message: Message):
    messages.insert(message_id, message)
    return{"msg": "unencrypted message stored"}

@app.get("/get-messages")
def get_messages():
    return messages
