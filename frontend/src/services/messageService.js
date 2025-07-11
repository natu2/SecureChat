import API_CONFIG from '../config/api';
import { API_ENDPOINTS, ERROR_MESSAGES, MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH } from '../utils/constants';

// Input validation utility
const validateInput = (input, type) => {
  if (!input || typeof input !== 'string') {
    throw new Error(`Invalid ${type}: must be a non-empty string`);
  }
  
  const maxLength = type === 'content' ? MAX_MESSAGE_LENGTH : MAX_NAME_LENGTH;
  if (input.length > maxLength) {
    throw new Error(`${type} too long: maximum ${maxLength} characters`);
  }
  return input.trim();
};

// Sanitize HTML content to prevent XSS
const sanitizeContent = (content) => {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
    }
    if (!navigator.onLine) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
  }
};

// Message service functions
export const messageService = {
  async fetchMessages() {
    try {
      const messages = await apiRequest(API_ENDPOINTS.MESSAGES);
      return Array.isArray(messages) ? messages : [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error(error.message || ERROR_MESSAGES.GENERIC_ERROR);
    }
  },

    async sendMessage(messageData) {
    try {
      // Validate input
      const sender = validateInput(messageData.sender, 'sender');
      const receiver = validateInput(messageData.receiver, 'receiver');
      const content = validateInput(messageData.content, 'content');
      
      // Sanitize content
      const sanitizedMessage = {
        sender: sanitizeContent(sender),
        receiver: sanitizeContent(receiver),
        content: sanitizeContent(content),
      };
      
      // Generate message ID (using timestamp for uniqueness)
      const messageId = Date.now();
      
      const response = await apiRequest(`${API_ENDPOINTS.SEND_MESSAGE}/${messageId}`, {
        method: 'POST',
        body: JSON.stringify(sanitizedMessage),
      });
      
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};

export default messageService; 