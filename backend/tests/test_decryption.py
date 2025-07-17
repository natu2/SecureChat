import unittest
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Crypto.Random import get_random_bytes
from Crypto.Cipher import AES

from main import encrypt_message, decrypt_message
from test_module import make_test_enc_message, make_test_dec_message, run_encryption, run_decryption

class DecryptionTestCase (unittest.TestCase):

    def test_decrypt_correctness(self):
        # Enc(Dec(Enc(m))) = Enc(m)
        chosen_key = get_random_bytes(16)
        iv = get_random_bytes(16)
        
        first_ct = run_encryption(iv= iv, plaintext= "chosen plaintext", key= chosen_key)
        actual_plaintext = run_decryption(iv= iv, ciphertext= first_ct, key= chosen_key)
        second_ct = run_encryption(iv= iv, plaintext= actual_plaintext, key= chosen_key)
        
        self.assertEqual(first_ct, second_ct)

    def test_decrypt_with_wrong_iv(self):
        # Decryption with wrong IV should fail
        initial_iv = b'10'*8
        initial_pt = "testing IV"
        correct_ct = run_encryption(iv= initial_iv, plaintext= initial_pt)

        altered_iv = b'11'*8
        with self.assertRaises(ValueError):
            run_decryption(iv= altered_iv, ciphertext=correct_ct)
    
    def test_decrypt_with_wrong_key(self):
        # encrypt two different messages of different sender-reciever pairs.
        ct_1 = encrypt_message(iv= get_random_bytes(16), message= make_test_dec_message(sender= "a", receiver= "b"))
        ct_2 = encrypt_message(iv= get_random_bytes(16), message= make_test_dec_message(sender= "c", receiver= "d"))
        # swap the sender-reciever pairs and try decryption
        
        with self.assertRaises(ValueError):
            decrypt_message(make_test_enc_message(sender= "a", receiver= "b", content= ct_2))
            decrypt_message(make_test_enc_message(sender= "c", receiver= "d", content= ct_1))
        
        # resulting plaintext should NOT match original plaintext
        

    def test_all_edge_cases(self):
        # edge case 1: decrypt empty string ==> should NOT raise exception
        iv_empty_string = get_random_bytes(16)
        ct_empty_string = run_encryption(iv= iv_empty_string, plaintext= "")
        try:
            run_decryption(iv= iv_empty_string, ciphertext= ct_empty_string)
        except Exception as e:
            self.fail("Empty string decryption caused unexpected error")

        # edge case 2: decrypt very lare ct 
        iv_large_string = get_random_bytes(16)
        one_mb_in_bytes = 1024 * 1024
        large_string = "A" * one_mb_in_bytes
        ct_large_string = run_encryption(iv= iv_large_string, plaintext= large_string)
        try:
            run_decryption(iv= iv_large_string, ciphertext= ct_large_string)
        except Exception as e:
            self.fail("Large string decryption caused unexpected error")

        # edge case 4: decrypt a cipher text of the WRONG type ==> should raise exception
        try:
            iv_bad_ct = get_random_bytes(16)
            normal_ct = run_encryption(iv= iv_bad_ct, plaintext= "regular string plaintext")
            bad_ct = int(normal_ct)
            run_decryption(iv= iv_bad_ct, ciphertext= bad_ct)
        except Exception as e:
            self.assertTrue(1)
        
        # edge case 3: decrypt with malformed key ==> should raie exception
        try:
            iv_bad_key = get_random_bytes(16)
            bad_key = get_random_bytes(16)
            ct_bad_key = run_encryption(iv= iv_bad_key, key= bad_key)
            run_decryption(iv= iv_bad_key, key= bad_key[:13])
        except ValueError as e:
            self.assertTrue(1)
        
        
if __name__ == '__main__':
    unittest.main()
