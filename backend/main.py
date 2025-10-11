# engine imports
from fastapi import FastAPI, status, Response
from fastapi.middleware.cors import CORSMiddleware

# cryptography utils imports
from cryptography.message_models import Message, User

# services imports
from services.user_service import add_user, check_login_credentials, get_receivers as get_message_receivers
from services.message_service import add_message, get_messages as get_stored_messages

app = FastAPI()

encrypted_messages = []

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
def send_message(message: Message):
    message, status_code = add_message(message, user_pairs, encrypted_messages)
    return message, status_code

@app.get("/get-receivers")
def get_receivers(sender: str, response: Response):
    message, status_code = get_message_receivers(sender, user_pairs)
    response.status_code = status_code
    return message

@app.get("/get-messages")
def get_messages(sender: str, receiver: str):
    return get_stored_messages(sender, receiver, encrypted_messages)

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