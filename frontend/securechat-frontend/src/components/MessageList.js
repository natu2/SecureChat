import Accordion from "react-bootstrap/Accordion";
import MessageDisplay from "./MessageDisplay";
import { useEffect, useState } from "react";
import { useContext } from "react";

import UserContext from "./UserContext";

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [user, updateUser] = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:8000/get-messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  // change index later to timestamp
  const displayMessages = messages
    .filter((message) => message.sender === user.username)
    .slice(messages.length - 20, messages.length)
    .map((message, index) => {
      return (
        <MessageDisplay
          key={index}
          sender={message.sender}
          receiver={message.receiver}
          body={message.content}
          index={index}
        />
      );
    });

  return (
    <div>
      <h1> Message History </h1>
      <Accordion>{displayMessages}</Accordion>
    </div>
  );
};

export default MessageList;
