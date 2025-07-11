import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Send, Loader2 } from "lucide-react";

let index = 0;

const SendMessage = ({ onMessageSent }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    sender: "Me",
    receiver: "You",
    content: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/send/${index}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          sender: "Me",
          receiver: "You",
          content: ""
        });
        index = index + 1;
        
        // Trigger notification
        if (onMessageSent) {
          onMessageSent("Message sent successfully!", "success");
        }
      } else {
        if (onMessageSent) {
          onMessageSent("Failed to send message. Please try again.", "error");
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (onMessageSent) {
        onMessageSent("Failed to send message. Please try again.", "error");
      }
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sender">From</Label>
              <Input
                id="sender"
                name="sender"
                value={formData.sender}
                onChange={handleInputChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiver">To</Label>
              <Input
                id="receiver"
                name="receiver"
                value={formData.receiver}
                onChange={handleInputChange}
                placeholder="Recipient's name"
                required
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
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
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
