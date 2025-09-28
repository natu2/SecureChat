from cryptography.message_models import User

def add_user(user: User, users_dict: dict[str, User]):
    if user.username in users_dict:
        return {"msg": "This username already exists"}, 409
    users_dict[user.username] = user
    return {"msg": "User created successfully"}, 201

def check_login_credentials(user: User, users_dict: dict[str, User]):
    if user.username not in users_dict:
        return {"msg": "This user does not exist"}, 400
    if user.password != users_dict[user.username].password:
        return {"msg": "Incorrect password"}, 400
    user.isLoggedIn = True
    return {"msg": "Login succeeded"}, 200

def get_receivers(sender: str, user_pairs: list[tuple[str,str]]):
    receivers = []
    try:
        for val_1, val_2 in user_pairs:
            if val_1 == sender:
                receivers.append(val_2)
        return receivers, 200
    except Exception as e:
        return {"msg": str(e)}, 500
    