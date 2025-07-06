import unittest
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Crypto.Random import get_random_bytes
from main import encrypt_message, decrypt_message
from test_module import make_test_enc_message, make_test_dec_message, run_encryption, run_decryption

class EncryptionTestCase (unittest.TestCase):

    def test_encrypt_correctness(self):
        # step 1: encrypt plaintext
        iv = get_random_bytes(16)
        cipher_text = run_encryption(iv= iv, plaintext= "encryption then decryption should result in original plaintext")
        
        # step 2: decrypt message
        actual_plaintext = run_decryption(iv= iv, ciphertext= cipher_text)
        expected_plaintext = "encryption then decryption should result in original plaintext"
        
        # step 3: compare final plaintext to expected
        self.assertEqual(actual_plaintext, expected_plaintext)
    
    def test_encrypt_with_different_IVs(self):
        # the same message encrypted with different IVs should yield different message
        iv_1 = get_random_bytes(16)
        ct_1 = run_encryption(iv=iv_1)

        iv_2 = get_random_bytes(16)
        while (iv_2 == iv_1):
            iv_2 = get_random_bytes(16)
        ct_2 = run_encryption(iv_2)
        
        self.assertNotEqual(ct_1, ct_2)

        # encryption should be deterministic: the same key and same IV should always encrypt into the same ciphertext
        key = get_random_bytes(16)
        self.assertEqual(run_encryption(iv=iv_1, plaintext= "deterministic", key= key), run_encryption(iv=iv_1, plaintext= "deterministic", key= key))

        
    
    def test_all_edge_cases(self):
        
        try:
            # edge case 1: empyt string
            run_encryption(plaintext="")
            
            # edge case 2: very large message
            one_mb_in_bytes = 1024 * 1024
            large_string = "A" * one_mb_in_bytes
            run_encryption(plaintext= large_string)
        
        except Exception as e:
            self.fail("Encrypting empty message caused unexpected error or exception")
        
        try:
            # edge case 3: invalid key
            bad_key = get_random_bytes(13)
            run_encryption(key= bad_key)
        except ValueError as e:
            self.assertTrue(1)
        
        try:
            # edge case 4: invalid message plaintext
            run_encryption(plaintext= ["not", "a", "string"])
        except TypeError as e:
            self.assertTrue(1)
    
if __name__ == '__main__':
    unittest.main()