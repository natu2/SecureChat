from Crypto.Random import get_random_bytes
from cryptography.symmetric_crypto import encrypt_message, decrypt_message
from cryptography.message_models import EncryptedMessage, DecryptedMessage

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

def get_messages(sender, receiver, encrypted_messages):
    try:
        decrypted_messages = []
        for encrypted_message in encrypted_messages:
            if (encrypted_message.sender == sender) and (encrypted_message.receiver == receiver):
                plaintext = decrypt_message(encrypted_message)
                decrypted_messages.append(DecryptedMessage(encrypted_message.id, encrypted_message.sender, encrypted_message.receiver, plaintext, encrypted_message.time))
                decrypted_messages.sort(key=lambda msg: msg.time, reverse=True)
        return {"msg": "messages retreived", "data": decrypted_messages}, 200
    except Exception as e:
        return e
