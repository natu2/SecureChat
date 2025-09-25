import uuid
from pydantic import BaseModel

class Message(BaseModel): #only exists for declaring api endpoints
    sender: str
    receiver: str
    content: str
    time: int

class User(BaseModel):
    username: str
    password: str
    isLoggedIn: bool

class EncryptedMessage():
    id: str
    sender: str
    receiver: str
    content: bytes
    time: int
    iv: bytes
    
    def __init__(self, sender, receiver, content, time, iv):
        self.sender = sender
        self.receiver = receiver
        self.content = content
        self.time = time
        self.iv = iv
        ts = int(time)
        rand = uuid.uuid4().hex[:6]
        self.id = f"{ts}-{rand}"


class DecryptedMessage():
    id: str
    sender: str
    receiver: str
    content: str
    time: int

    def __init__(self, id, sender, receiver, content, time):
        self.sender = sender
        self.receiver = receiver
        self.content = content
        self.time = time
        self.id = id
