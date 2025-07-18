import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Send, Loader2, AlertCircle } from "lucide-react";

const SendMessage = ({ onMessageSent, onSendMessage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    sender: "",
    receiver: "",
    content: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await onSendMessage(formData);
      
      if (result.success) {
        // Clear form on success
        setFormData({
          sender: "",
          receiver: "",
          content: ""
        });
        
        // Trigger success notification
        if (onMessageSent) {
          onMessageSent("Message sent successfully!", "success");
        }
      } else {
        setError(result.error || "Failed to send message");
      }
    } catch (err) {
      setError(err.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Compose Message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sender">From</Label>
              <Input
                id="sender"
                name="sender"
                type="text"
                value={formData.sender}
                onChange={handleInputChange}
                placeholder="Your name"
                required
                maxLength={100}
                aria-describedby="sender-error"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiver">To</Label>
              <Input
                id="receiver"
                name="receiver"
                type="text"
                value={formData.receiver}
                onChange={handleInputChange}
                placeholder="Recipient's name"
                required
                maxLength={100}
                aria-describedby="receiver-error"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Message</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              rows={4}
              required
              maxLength={1000}
              aria-describedby="content-error content-counter"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center">
              <span id="content-counter" className="text-xs text-gray-500">
                {formData.content.length}/1000 characters
              </span>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || !formData.sender || !formData.receiver || !formData.content}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SendMessage;
