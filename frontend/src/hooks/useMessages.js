import { useState, useEffect, useCallback, useRef } from 'react';
import { messageService } from '../services/messageService';
import API_CONFIG from '../config/api';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);

  const fetchMessages = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    }
    
    try {
      setError(null);
      const fetchedMessages = await messageService.fetchMessages();
      
      if (mountedRef.current) {
        setMessages(fetchedMessages);
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
        console.error('Error fetching messages:', err);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  const sendMessage = useCallback(async (messageData) => {
    try {
      setError(null);
      await messageService.sendMessage(messageData);
      // Refresh messages after sending
      await fetchMessages();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [fetchMessages]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Initial fetch
    fetchMessages();
    
    // Set up polling
    intervalRef.current = setInterval(() => {
      fetchMessages();
    }, API_CONFIG.pollingInterval);
    
    // Cleanup
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchMessages]);

  const refreshMessages = useCallback(() => {
    fetchMessages(true);
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    isRefreshing,
    lastUpdated,
    error,
    sendMessage,
    refreshMessages
  };
}; 