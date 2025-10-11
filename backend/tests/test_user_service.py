import unittest
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.user_service import add_user, check_login_credentials, get_receivers
from cryptography.message_models import User

class CustomUserMatchers(unittest.TestCase):
    """Custom Matcher for User objects and users dictionary"""

    def userAddedCorrectly(self, user, users_dict, response, status_code):
        if status_code != 201:
            self.fail(f"Expected status code 201, but got {status_code}")
        if user.username not in users_dict:
            self.fail(f"Username {user.username} not found in users dictionary")
        if users_dict[user.username] != user:
            self.fail(f"User {user.username} not correctly added to users dictionary")
        if response != {"msg": "User created successfully"}:
            self.fail(f"Unexpected response message: {response}")
        self.assertTrue(True)
    
    def userLoggedInCorrectly(self, user, users_dict, response, status_code):
        if status_code != 200:
            self.fail(f"Expected status code 200, but got {status_code}")
        if not ((user.isLoggedIn) and (users_dict[user.username].isLoggedIn)):
            self.fail(f"User {user.username} logged in status is not True")
        if response != {"msg": "Login succeeded"}:
            self.fail(f"Unexpected response message: {response}")
    

class TestUserService(CustomUserMatchers):
    """Tests for user service functions: add_username and check_login_credentials."""

    def setUp(self):
        self.users_dict = {
            "user1": User(username="user1", password="password123", isLoggedIn=False),
            "user2": User(username="user2", password="password456", isLoggedIn=False)
        }
        self.existing_user = self.users_dict["user1"]
        self.user_pairs = [("user1", "user2"), ("user1", "user3")]
    
    def test_add_new_user(self):
        """Tests adding a new user successfully"""
        new_user = User(username="user3", password="password789", isLoggedIn=True)
        response, status_code = add_user(new_user, self.users_dict)
        self.userAddedCorrectly(new_user, self.users_dict, response, status_code)

    def test_add_existing_user(self):
        """Tests adding a user that already exists"""
        response, status_code = add_user(self.existing_user, self.users_dict)
        with self.assertRaises(AssertionError):
            self.userAddedCorrectly(self.existing_user, self.users_dict, response, status_code)

    def test_login_successful(self):
        """Tests logging in with correct credentials"""
        response, status_code = check_login_credentials(self.existing_user, self.users_dict)
        self.userLoggedInCorrectly(self.existing_user, self.users_dict, response, status_code)
    
    def test_login_nonexistent_user(self):
        """Tests logging in with a username that does not exist"""
        non_existent_user = User(username="userX", password="somepassword", isLoggedIn=False)
        response, status_code = check_login_credentials(non_existent_user, self.users_dict)
        with self.assertRaises(AssertionError):
            self.userLoggedInCorrectly(non_existent_user, self.users_dict, response, status_code)

    def test_login_incorrect_password(self):
        """Tests logging in with an incorrect password"""
        wrong_password_user = User(username="user1", password="wrongpassword", isLoggedIn=False)
        response, status_code = check_login_credentials(wrong_password_user, self.users_dict)
        with self.assertRaises(AssertionError):
            self.userLoggedInCorrectly(wrong_password_user, self.users_dict, response, status_code)
    
    def test_get_receivers_for_new_sender(self):
        """Tests getting receivers for a sender with no existing recievers"""
        new_user = User(username="user3", password="password789", isLoggedIn=True)
        actual_receivers, status_code = get_receivers(new_user.username, self.user_pairs)
        self.assertEqual(actual_receivers, [])
        self.assertEqual(status_code, 200)

    def test_get_receivers_for_existing_sender(self):
        """Tests getting receivers for a sender with existing recievers"""
        actual_receivers, status_code = get_receivers("user1", self.user_pairs)
        expected_receivers = ["user2", "user3"]
        self.assertEqual(actual_receivers, expected_receivers)
        self.assertEqual(status_code, 200)

if __name__ == '__main__':
    unittest.main()