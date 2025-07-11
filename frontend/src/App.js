import React, { useState, useEffect } from "react";
import MessageList from "./components/MessageList";
import SendMessage from "./components/SendMessage";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Toast } from "./components/ui/toast";

const App = () => {
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setIsAppLoaded(true);
  }, []);

  const showNotification = (message, type = "success") => {
    const newNotification = {
      id: Date.now() + Math.random(), // Unique ID
      message,
      type,
      isVisible: false
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Show animation after a brief delay
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === newNotification.id 
            ? { ...notif, isVisible: true }
            : notif
        )
      );
    }, 10);
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === newNotification.id 
            ? { ...notif, isVisible: false }
            : notif
        )
      );
      
      // Remove from array after animation completes
      setTimeout(() => {
        setNotifications(prev => 
          prev.filter(notif => notif.id !== newNotification.id)
        );
      }, 300);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
      {/* Notifications - stacked */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`w-64 transform transition-all duration-300 ease-out ${
              notification.isVisible 
                ? 'translate-y-0 opacity-100 scale-100' 
                : '-translate-y-2 opacity-0 scale-95'
            }`}
          >
            <Toast variant={notification.type} className="shadow-sm border-0 py-2 px-3">
              <div className="flex items-center space-x-2">
                {notification.type === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {notification.message}
                  </p>
                </div>
              </div>
            </Toast>
          </div>
        ))}
      </div>

      <div className={`container mx-auto px-4 py-8 max-w-4xl transform transition-all duration-500 ease-in-out ${
        isAppLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              SecureChat
            </h1>
            <p className="text-gray-600">
              End-to-end encrypted messaging
            </p>
          </div>

          
          <SendMessage onMessageSent={showNotification} />
          <MessageList/>
        </div>
      </div>
    </div>
  );
};

export default App;
