import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { RefreshCw, MessageCircle, Clock, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

const MessageList = ({ messages, isLoading, isRefreshing, lastUpdated, error, onRefresh }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
  }, [messages]);

  return (
    <Card>
      <CardHeader className="py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleExpanded}
            className="flex items-center gap-2 text-xl font-semibold hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md p-1"
            aria-expanded={isExpanded}
            aria-controls="messages-content"
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
            {error && (
              <div className="flex items-center gap-1 text-red-600" title={error}>
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">Error</span>
              </div>
            )}
            {lastUpdated && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="hidden sm:inline">
                  {lastUpdated.toLocaleTimeString()}
                </span>
              </span>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh messages"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <div 
        id="messages-content"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2 text-gray-500 py-8">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Loading messages...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2 text-red-700">Error Loading Messages</h3>
              <p className="text-sm mb-4">{error}</p>
              <Button onClick={onRefresh} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2 text-gray-700">No messages yet</h3>
              <p>Send your first secure message above!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sortedMessages.map((message, index) => (
                <div 
                  key={message.id || index} 
                  className="border border-gray-200 rounded-md px-3 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      <span className="font-semibold">{message.sender}</span> → <span className="font-semibold">{message.receiver}</span>
                    </span>
                    <span className="text-xs text-gray-400">
                      {message.timestamp ? formatTime(message.timestamp) : 'Just now'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
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
