import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { RefreshCw, MessageCircle, User, Clock, ChevronDown, ChevronUp } from "lucide-react";

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchMessages = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    }
    
    try {
      const response = await fetch(`http://localhost:8000/get-messages`);
      const data = await response.json();
      setMessages(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Refresh messages every 5 seconds
    const interval = setInterval(() => fetchMessages(), 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchMessages(true);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card>
      <CardHeader className="py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleExpanded}
            className="flex items-center gap-2 text-xl font-semibold hover:text-gray-600 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Messages ({messages.length})
            <div className="transition-transform duration-200">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </div>
          </button>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2 text-gray-500 py-8">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2 text-gray-700">No messages yet</h3>
              <p>Send your first secure message above!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-md px-3 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {message.sender} → {message.receiver}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(Date.now() - (messages.length - index) * 1000)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default MessageList;
