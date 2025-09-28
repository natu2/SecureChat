# engine imports
from fastapi import FastAPI, status, Response
from fastapi.middleware.cors import CORSMiddleware

# cryptography imports
from Crypto.Random import get_random_bytes

# cryptography utils imports
from cryptography.symmetric_crypto import encrypt_message, decrypt_message
from cryptography.message_models import Message, EncryptedMessage, DecryptedMessage, User

# services imports
from services.user_service import add_user, check_login_credentials, get_receivers as get_message_receivers

app = FastAPI()

encrypted_messages = []

usernames = {"trial": "trying"} #username => password, will be replaced by users dict eventually
users = {"trial": User(username="trial", password="trying", isLoggedIn=False)} # username => User object
user_pairs = [('trial', 'You')] # list of (sender, receiver) pairs

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
def get_receivers(sender: str, response: Response):
    message, status_code = get_message_receivers(sender, user_pairs)
    response.status_code = status_code
    return message

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
    message, status_code = check_login_credentials(user, users)
    response.status_code = status_code
    return message

@app.post("/signup", status_code= status.HTTP_201_CREATED)
def add_username(user: User, response: Response):
    message, status_code = add_user(user, users)
    response.status_code = status_code
    return message