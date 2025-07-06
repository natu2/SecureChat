import unittest
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Crypto.Random import get_random_bytes
from main import encrypt_message, decrypt_message
from test_module import make_test_enc_message, make_test_dec_message, run_encryption, run_decryption

class DecryptionTestCase (unittest.TestCase):

    def test_decrypt_correctness(self):
        # with a chosen ciphertext: Enc(Dec(c)) = c
        pass

    def test_decrypt_with_wrong_iv(self):
        # should return the wrong plaintext
        pass
    
    def test_decrypt_with_wrong_key(self):
        # encrypt two different messages of different sender-reciever pairs.
        # swap the sender-reciever pairs and try decryption
        # resulting plaintext should NOT match original plaintext
        pass

    def test_all_edge_cases(self):
        # edge case 1: decrypt empty string ==> should NOT raise exception
        # edge case 2: decrypt very lare ct ^^^^^^^ 
        # edge case 3: decrypt a cipher text of the WRONG type ==> should raise exception
        # edge case 4: decrypt with malformed key ==> should raie exception
        



if __name__ == '__main__':
    unittest.main()
