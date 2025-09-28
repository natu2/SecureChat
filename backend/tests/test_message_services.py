from unittest import TestCase
from unittest.mock import ANY, Mock, patch
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.message_service import add_message
from Crypto.Random import get_random_bytes

from cryptography.message_models import Message
from cryptography.symmetric_crypto import encrypt_message, decrypt_message

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
    

class TestMessageServices(CustomMessageMatchers):
    """Tests for adding and retrieving messages."""
    
    def setUp(self):
        # data to be tested
        self.encrypted_messages = []
        self.user_pairs = [("Shayne", "Angela")]

        # mocking symmetric_crypto functions
        self.mock = Mock()
        #decrypt_message = self.mock.decrypt_message
        #self.mock.decrypt_message.return_value = "Decrypted message content"
    
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
    
    def tearDown(self):
        return super().tearDown()

