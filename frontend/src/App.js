import React, { useState, useEffect } from "react";
import SendMessage from "./components/SendMessage";
import MessageList from "./components/MessageList";
import { Toast, ToastTitle, ToastDescription } from "./components/ui/toast";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function App() {
  const [notification, setNotification] = useState(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation on app load
    setTimeout(() => {
      setIsAppLoaded(true);
    }, 100);
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setIsNotificationVisible(true);
    
    // Auto-hide notification after 4 seconds
    setTimeout(() => {
      setIsNotificationVisible(false);
      // Remove notification from state after animation completes
      setTimeout(() => {
        setNotification(null);
      }, 300);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
      <div className={`container mx-auto px-4 py-8 max-w-4xl transform transition-all duration-500 ease-in-out ${
        isAppLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 w-80 transform transition-all duration-300 ease-in-out ${
            isNotificationVisible 
              ? 'translate-y-0 opacity-100 scale-100' 
              : '-translate-y-2 opacity-0 scale-95'
          }`}>
            <Toast variant={notification.type} className="shadow-lg">
              <div className="flex items-center space-x-2">
                {notification.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <ToastTitle>
                    {notification.type === "success" ? "Success!" : "Error!"}
                  </ToastTitle>
                  <ToastDescription>{notification.message}</ToastDescription>
                </div>
              </div>
            </Toast>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-black">
            SecureChat
          </h1>
          <p className="text-gray-600">
            Secure messaging for private conversations
          </p>
        </div>
        
        <div className="space-y-6">
          <SendMessage onMessageSent={showNotification} />
          <MessageList />
        </div>
      </div>
    </div>
  );
}
