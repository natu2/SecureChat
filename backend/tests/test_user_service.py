import unittest
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.user_service import add_username, check_login_credentials
from cryptography.message_models import User

class CustomerUserTestCase(unittest.TestCase):
    """ Custom Matcher for User objects and usernames dictionary"""

    def userAddedCorrectly(self, user, usernames_dict, response, status_code):
        if status_code != 201:
            self.fail(f"Expected status code 201, but got {status_code}")
        if user.username not in usernames_dict:
            self.fail(f"Username {user.username} not found in usernames dictionary")
        if usernames_dict[user.username] != user.password:
            self.fail(f"Password for username {user.username} does not match")
        if response != {"msg": "User created successfully"}:
            self.fail(f"Unexpected response message: {response}")
        self.assertTrue(True)
    
    def userLoggedInCorrectly(self, user, usernames_dict, response, status_code):
        if status_code != 200:
            self.fail(f"Expected status code 200, but got {status_code}")
        if not user.isLoggedIn:
            self.fail(f"User {user.username} logged in status is not True")


class TestUserService(CustomerUserTestCase):
    """Tests for user service functions: add_username and check_login_credentials."""

    def setUp(self):
        self.usernames_dict = {"user1": "password123", "user2": "password456"}
        self.existing_user = User(username="user1", password="password123", isLoggedIn=True)
    
    def test_add_new_user(self):
        """Tests adding a new user successfully"""
        new_user = User(username="user3", password="password789", isLoggedIn=True)
        response, status_code = add_username(new_user, self.usernames_dict)
        self.userAddedCorrectly(new_user, self.usernames_dict, response, status_code)

    def test_add_existing_user(self):
        """Tests adding a user that already exists"""
        response, status_code = add_username(self.existing_user, self.usernames_dict)
        with self.assertRaises(AssertionError):
            self.userAddedCorrectly(self.existing_user, self.usernames_dict, response, status_code)
    
    def test_login_successful(self):
        """Tests logging in with correct credentials"""
        response, status_code = check_login_credentials(self.existing_user, self.usernames_dict)
        self.userLoggedInCorrectly(self.existing_user, self.usernames_dict, response, status_code)
    
    def test_login_nonexistent_user(self):
        """Tests logging in with a username that does not exist"""
        non_existent_user = User(username="userX", password="somepassword", isLoggedIn=False)
        response, status_code = check_login_credentials(non_existent_user, self.usernames_dict)
        with self.assertRaises(AssertionError):
            self.userLoggedInCorrectly(non_existent_user, self.usernames_dict, response, status_code)
    
    def test_login_incorrect_password(self):
        """Tests logging in with an incorrect password"""
        wrong_password_user = User(username="user1", password="wrongpassword", isLoggedIn=False)
        response, status_code = check_login_credentials(wrong_password_user, self.usernames_dict)
        with self.assertRaises(AssertionError):
            self.userLoggedInCorrectly(wrong_password_user, self.usernames_dict, response, status_code)

if __name__ == '__main__':
    unittest.main()