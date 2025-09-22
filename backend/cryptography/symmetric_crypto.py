from collections import defaultdict
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

symmetric_keys = defaultdict(str)  # (sender, receiver) ==> key

def encrypt_message(iv: bytes, message, key=None):
    sender = message.sender
    receiver = message.receiver
    pair = (sender, receiver)

    if key is not None:
        if not (len(key) == 16):
            raise ValueError
        key = key
    elif (pair in symmetric_keys):
        key = symmetric_keys[pair]
    else:
        key = get_random_bytes(16)
        symmetric_keys[pair] = key

    cipher = AES.new(key, AES.MODE_CBC, iv)

    try:
        plaintext = message.content.encode('utf-8')
    except Exception as e:
        raise TypeError("invalid data type for message plaintext")
    cipher_text = cipher.encrypt(pad(plaintext, AES.block_size))
    return cipher_text

def decrypt_message(message, key=None):
    sender = message.sender
    receiver = message.receiver
    pair = (sender, receiver)

    if key is not None:
        key = key
        symmetric_keys[pair] = key
    elif pair not in symmetric_keys:
        raise ValueError("no symmetric key found for this sender-receiver pair")
    else:
        key = symmetric_keys[pair]

    cipher = AES.new(key, AES.MODE_CBC, message.iv)
    plain_text = unpad(cipher.decrypt(message.content), AES.block_size).decode('utf-8')
    return plain_text

