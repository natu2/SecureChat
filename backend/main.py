from fastapi import FastAPI, status, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from collections import defaultdict
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad
import uuid

app = FastAPI()

encrypted_messages = []
keys = defaultdict(str) #(sender, receiver) ==> key

usernames = {"trial": "trying"} #username => password
user_pairs = [('trial', 'You')] # list of (sender, receiver) pairs


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


class DecryptedMessage(): #only exists for get-messages endpoint
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def encrypt_message(iv: bytes, message: DecryptedMessage, key= None):
    sender = message.sender
    receiver = message.receiver
    pair = (sender, receiver)

    
    if key is not None:
        if not (len(key) == 16):
            raise ValueError
        key = key
    elif (pair in keys):
        key = keys[pair]
    else:
        key = get_random_bytes(16)
        keys[pair] = key
    
    cipher = AES.new(key, AES.MODE_CBC, iv)
    #print(90, key, iv)

    try: 
        plaintext = message.content.encode('utf-8')
    except Exception as e:
        raise TypeError("invalid data type for message plaintext")
    cipher_text = cipher.encrypt(pad(plaintext, AES.block_size))
    return cipher_text

def decrypt_message(message: EncryptedMessage, key= None):
    sender = message.sender
    receiver = message.receiver
    pair = (sender, receiver)

    if key is not None:
        key = key
        keys[pair] = key
    elif pair not in keys:
        raise ValueError
    else:
        key = keys[pair]

    #print(112, key, message.iv)
    
    cipher = AES.new(key, AES.MODE_CBC, message.iv)
    plain_text = unpad(cipher.decrypt(message.content), AES.block_size).decode('utf-8')
    return plain_text



@app.get("/")
def read_root():
    return {"msg": "SecureChat backend is running!"}

@app.post("/send", status_code= status.HTTP_201_CREATED)
def add_message(message: Message):
    # generating initialization vector
    iv = get_random_bytes(16)
    
    # generating cipher text
    cipher_text = encrypt_message(iv= iv, message=  message)
    encrypted_message = EncryptedMessage(message.sender, message.receiver, cipher_text, message.time, iv)
    encrypted_messages.append(encrypted_message)
    
    # updating user pairs
    pair = (message.sender, message.receiver)
    if pair not in user_pairs:
        user_pairs.append(pair)

    return{"msg": "encrypted message stored"}

@app.get("/get-receivers")
def get_receivers(sender: str):
    receivers = []
    for (val_1, val_2) in user_pairs:
        if val_1 == sender:
            receivers.append(val_2)
    return receivers

@app.get("/get-messages")
def get_messages(sender: str, receiver: str):
    decrypted_messages = []
    for i in range(len(encrypted_messages)):
        encrypted_message =  encrypted_messages[i]
        if (encrypted_message.sender == sender) and (encrypted_message.receiver == receiver):
            plaintext = decrypt_message(encrypted_message)
            decrypted_messages.append(DecryptedMessage(encrypted_message.id, encrypted_message.sender, encrypted_message.receiver, plaintext, encrypted_message.time))
        decrypted_messages.sort(key= lambda message: message.time, reverse= True)

    return decrypted_messages

@app.put("/login")
def check_username(user: User, response: Response):
    if user.username not in usernames:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return{"msg": "This user does not exists"}
    if user.password != usernames[user.username]:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return{"msg": "Incorrect password"}
    else:
        return{"msg": "Login succedeed"}

@app.post("/signup", status_code= status.HTTP_201_CREATED)
def add_username(user: User, response: Response):
    if user.username in usernames:
        response.status_code = status.HTTP_409_CONFLICT
        return{"msg": "This message already exists"}
    else:
        usernames[user.username] = user.password
        return{"msg": "Signup succedeed"}