from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from collections import defaultdict
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

app = FastAPI()
#messages = []
encrypted_messages = []
decrypted_messages = []
keys = defaultdict(str) #(sender, receiver) ==> key
ivs = [] 

class Message(BaseModel):
    sender: str
    receiver: str
    content: str

    # def __init__(self, sender, receiver, content):
    #     self.sender = sender
    #     self.receiver = receiver
    #     self.content = content

class EncryptedMessage():
    sender: str
    receiver: str
    content: bytes

    def __init__(self, sender, receiver, content):
        self.sender = sender
        self.receiver = receiver
        self.content = content


class DecryptedMessage():
    sender: str
    receiver: str
    content: str

    def __init__(self, sender, receiver, content):
        self.sender = sender
        self.receiver = receiver
        self.content = content

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def encrypt_message(iv: bytes, message: DecryptedMessage):
    sender = message.sender
    receiver = message.receiver
    pair = (sender, receiver)

    if (pair in keys):
        key = keys[pair]
    else:
        # Generate a key and initialization vector (IV)
        key = get_random_bytes(16)
        keys[pair] = key

    cipher = AES.new(key, AES.MODE_CBC, iv)
    plaintext = message.content.encode('utf-8')
    cipher_text = cipher.encrypt(pad(plaintext, AES.block_size))
    return cipher_text

def decrypt_message(iv: bytes, message: EncryptedMessage):
    #TODO
    print(message)
    sender = message.sender
    receiver = message.receiver
    pair = (sender, receiver)

    if pair not in keys:
        raise ValueError
    key = keys[pair]

    cipher = AES.new(key, AES.MODE_CBC, iv)
    plain_text = unpad(cipher.decrypt(message.content), AES.block_size)
    return plain_text



@app.get("/")
def read_root():
    return {"msg": "SecureChat backend is running!"}

@app.post("/send/{message_id}")
def add_message(message_id: int, message: Message):
    iv = get_random_bytes(16)
    ivs.insert(message_id, iv)
    cipher_text = encrypt_message(iv= iv, message=  message)
    encrypted_message = EncryptedMessage(message.sender, message.receiver, cipher_text)
    encrypted_messages.insert(message_id, encrypted_message)
    #  maintaining messages only until decryption is not still implemented
    #messages.insert(message_id, message)
    return{"msg": "encrypted message stored"}

@app.get("/get-messages")
def get_messages():
    #TODO: Decryption
    for i in range(len(encrypted_messages)):
        encrypted_message =  encrypted_messages[i]
        plaintext = decrypt_message(ivs[i], encrypted_message)
        decrypted_messages.insert(i, DecryptedMessage(encrypted_message.sender, encrypted_message.receiver, plaintext))
    
    return decrypted_messages
