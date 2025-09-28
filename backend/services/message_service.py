from Crypto.Random import get_random_bytes
from cryptography.symmetric_crypto import encrypt_message
from cryptography.message_models import EncryptedMessage

def add_message(message, user_pairs, encrypted_messages):
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

    return{"msg": "encrypted message stored"}, 201
