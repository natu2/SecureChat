import unittest
from unittest import TestCase
from unittest.mock import ANY, Mock, patch
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.message_service import add_message, get_messages
from Crypto.Random import get_random_bytes

from cryptography.message_models import EncryptedMessage, Message

class CustomMessageMatchers(TestCase):
    """Custom Matcher for Message objects and encrypted_messages list"""

    def messageAddedCorrectly(self, message, user_pairs, encrypted_messages, response, status_code):
        if status_code != 201:
            self.fail(f"Expected status code 201, but got {status_code}")
        if len(encrypted_messages) == 0:
            self.fail("No messages found in encrypted_messages list")
        last_message = encrypted_messages[-1]
        if last_message.sender != message.sender or last_message.receiver != message.receiver:
            self.fail("Sender or receiver does not match the added message")
        if (message.sender, message.receiver) not in user_pairs:
            self.fail("User pair not found in user_pairs list")
        if response != {"msg": "encrypted message stored"}:
            self.fail(f"Unexpected response message: {response}")
        self.assertTrue(True)
    
    def messagesReturnedCorrectly(self, sender, receiver, mock_decrypt_message, response, status_code):
        if status_code != 200:
            self.fail(f"Expected status code 200, but got {status_code}")
        retrieved_messages = response['data']
        for message in retrieved_messages:
            prev_time = message.time
            if (message.sender != sender) or (message.receiver != receiver):
                self.fail(f"Message with wrong sender/receiver was found in response")
            if (message.time < prev_time):
                self.fail(f"Messages not returned in ascending order")
            if (message.content != "plaintext"):
                self.fail(f"Message content was not decrypted correctly")
        self.assertTrue(mock_decrypt_message.call_count == len(retrieved_messages))

class TestMessageServices(CustomMessageMatchers):
    """Tests for adding and retrieving messages."""
    
    def setUp(self):
        # data to be tested
        self.encrypted_messages = []
        self.user_pairs = [("Shayne", "Angela")]

        # mocking symmetric_crypto functions
        self.mock = Mock()
        
    
    @patch('services.message_service.encrypt_message')
    def test_add_encrypted_message_with_existing_receiver(self, mock_encrypt_message):
        """Tests adding an encrypted message with an existing receiver."""
        
        #GIVEN:
        mock_encrypt_message.return_value = b'encrypted_content'
        new_message = Message(sender="Shayne", receiver="Angela", content="Hello, Angela!", time=30)
        
        #WHEN:
        message, status_code = add_message(new_message, self.user_pairs, self.encrypted_messages)
        
        #THEN:
        mock_encrypt_message.assert_called_once_with(iv=ANY, message=new_message)
        self.messageAddedCorrectly(new_message, self.user_pairs, self.encrypted_messages, message, status_code)
    
    @patch('services.message_service.encrypt_message')
    def test_add_encrypted_message_with_new_receiver(self, mock_encrypt_message):
        """Tests adding an encrypted message with a new receiver."""

        #GIVEN:
        mock_encrypt_message.return_value = b'encrypted_content'
        new_message = Message(sender="Shayne", receiver="Arasha", content="Werewolf!", time=30)
        
        #WHEN:
        message, status_code = add_message(new_message, self.user_pairs, self.encrypted_messages)
        
        #THEN:
        mock_encrypt_message.assert_called_once_with(iv=ANY, message=new_message)
        self.messageAddedCorrectly(new_message, self.user_pairs, self.encrypted_messages, message, status_code)
    
    def test_get_messages_no_messages(self):
        """Tests retrieving messages when there are no messages."""
        
        #GIVEN:
        sender = "Shayne"
        receiver = "Angela"
        
        #WHEN:
        response, status_code = get_messages(sender, receiver, self.encrypted_messages)
        
        #THEN:
        if status_code != 200:
            self.fail(f"Expected status code 200, but got {status_code}")
        if response != {"msg": "messages retreived", "data": []}:
            self.fail(f"Unexpected response message: {response}")
        self.assertTrue(True)
    
    @patch('services.message_service.decrypt_message')
    def test_get_messages_with_messages(self, mock_decrypt_message):
        """Tests retrieving messages when there are existing messages."""

        #GIVEN:
        sender = "Shayne"
        receiver = "Angela"
        mock_decrypt_message.return_value = "plaintext"
        self.encrypted_messages = [EncryptedMessage("Shayne", "Angela", b'encrypted_content', 30, b'iv'), 
                                   EncryptedMessage("Shayne", "Angela", b'encrypted_content2', 20, b'iv2'),
                                   EncryptedMessage("Shayne", "Arasha", b'encrypted_content3', 25, b'iv3')]  # One message with different receiver

        #WHEN:
        response, status_code = get_messages(sender, receiver, self.encrypted_messages)

        #THEN:
        self.messagesReturnedCorrectly(sender, receiver, mock_decrypt_message, response, status_code)
        self.assertTrue((len(response['data']) == 2))
    
    def tearDown(self):
        return super().tearDown()

if __name__ == '__main__':
    unittest.main()