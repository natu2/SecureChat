import Accordion from "react-bootstrap/Accordion";
import MessageDisplay from "./MessageDisplay";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { useContext } from "react";

import UserContext from "./UserContext";

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [user, updateUser] = useContext(UserContext);
  const [receivers, setReceivers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] =
    useState("Select a recepient");
  const [displayMessages, setDisplayMessages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/get-receivers?sender=${user.username}`)
      .then((res) => res.json())
      .then((data) => {
        setReceivers(data);
      });
  }, [user]);

  useEffect(() => {
    console.log(selectedReceiver);
    fetch(
      `http://localhost:8000/get-messages?sender=${user.username}&receiver=${selectedReceiver}`
    )
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, [selectedReceiver]);

  const handleSelect = (e) => {
    e.preventDefault();
    setSelectedReceiver(e.target.value);
  };

  return (
    <div>
      <h1> Message History </h1>
      <Form>
        <Form.Group style={{ padding: 10, margin: 10 }}>
          <Form.Label>View Messages From ... </Form.Label>
          <Form.Select onChange={handleSelect}>
            <option> Select a recepient </option>
            {receivers.map((receiver) => (
              <option value={receiver} key={receiver}>{`${receiver}`}</option>
            ))}
          </Form.Select>
        </Form.Group>
      </Form>
      <Accordion>
        {messages
          .slice(messages.length - 20, messages.length)
          .map((message, index) => {
            return (
              <MessageDisplay
                key={index}
                sender={message.sender}
                receiver={message.receiver}
                body={message.content}
                index={index}
                time={message.time}
              />
            );
          })}
      </Accordion>
    </div>
  );
};

export default MessageList;
