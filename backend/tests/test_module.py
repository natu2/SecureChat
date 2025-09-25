### Module contains helper functions for testing encryption and decryption functions ###

from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from cryptography.symmetric_crypto import encrypt_message, decrypt_message
from cryptography.message_models import EncryptedMessage, DecryptedMessage


def make_test_enc_message(**overrides):
        return EncryptedMessage(
        sender=overrides.get("sender", "alice"),
        receiver=overrides.get("receiver", "bob"),
        content=overrides.get("content", pad(b"fake_ct", AES.block_size)),
        iv=overrides.get("iv", get_random_bytes(16)),
        time=overrides.get("time", 0)
    )

def make_test_dec_message(**overrides):
    return DecryptedMessage(
    id=overrides.get("id", "fake_id"),
    sender=overrides.get("sender", "alice"),
    receiver=overrides.get("receiver", "bob"),
    content=overrides.get("content", "fake_pt"),
    time=overrides.get("time", 0)
)

def run_encryption(iv= None, plaintext= None, key= None):
    if iv == None:
        iv = get_random_bytes(16)
    
    if plaintext == None:
        decrypt_msg = make_test_dec_message()
        if key == None: 
            return encrypt_message(iv=iv, message= decrypt_msg)
        return encrypt_message(iv=iv, message= decrypt_msg, key= key)
    else:
        decrypt_msg = make_test_dec_message(content= plaintext)
        if key == None: 
            return encrypt_message(iv=iv, message= decrypt_msg)
        return encrypt_message(iv=iv, message= decrypt_msg, key= key)

def run_decryption(iv= None, ciphertext= None, key= None):
    if iv == None:
        iv = get_random_bytes(16)
    
    if ciphertext == None:
        ciphertext = get_random_bytes(16)
    
    if key == None: 
        return decrypt_message(make_test_enc_message(iv= iv, content= ciphertext))
    return decrypt_message(make_test_enc_message(iv= iv, content= ciphertext), key= key)


