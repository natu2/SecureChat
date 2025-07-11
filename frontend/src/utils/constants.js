// Application constants
export const APP_NAME = 'SecureChat';
export const APP_DESCRIPTION = 'End-to-end encrypted messaging';

// UI constants
export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_NAME_LENGTH = 100;
export const NOTIFICATION_TIMEOUT = 4000;
export const NOTIFICATION_ANIMATION_DELAY = 10;

// API constants
export const API_ENDPOINTS = {
  MESSAGES: '/get-messages',
  SEND_MESSAGE: '/send', // Backend expects /send/{message_id}
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  MESSAGE_SENT: 'Message sent successfully!',
  MESSAGES_REFRESHED: 'Messages refreshed successfully!',
};

export default {
  APP_NAME,
  APP_DESCRIPTION,
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  NOTIFICATION_TIMEOUT,
  NOTIFICATION_ANIMATION_DELAY,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
}; 