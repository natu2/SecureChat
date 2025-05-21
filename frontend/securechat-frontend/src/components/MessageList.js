import Accordion from "react-bootstrap/Accordion";
import MessageDisplay from "./MessageDisplay";
import { useEffect, useState } from "react";

const MessageList = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/get-messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  // change index later to timestamp
  const displayMessages = messages.map((message, index) => {
    return (
      <MessageDisplay
        key={index}
        sender={message.sender}
        receiver={message.reciever}
        body={message.body}
        index={index}
      />
    );
  });

  return <Accordion>{displayMessages}</Accordion>;
};

export default MessageList;
