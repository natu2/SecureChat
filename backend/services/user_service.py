def add_username(user, usernames_dict):
    if user.username in usernames_dict:
        return {"msg": "This username already exists"}, 409
    usernames_dict[user.username] = user.password
    return {"msg": "User created successfully"}, 201

def check_login_credentials(user, usernames_dict):
    if user.username not in usernames_dict:
        return {"msg": "This user does not exist"}, 400
    if user.password != usernames_dict[user.username]:
        return {"msg": "Incorrect password"}, 400
    user.isLoggedIn = True
    return {"msg": "Login succeeded"}, 200

# user pairs stuff here maybe???