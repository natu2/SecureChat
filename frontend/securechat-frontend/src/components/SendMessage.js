import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import UserContext from "./UserContext";

let index = 0;

const SendMessage = () => {
  const navigate = useNavigate();
  const [user, updateUser] = useContext(UserContext);

  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    //console.log(formData);

    const formJson = Object.fromEntries(formData.entries());

    fetch(`http://localhost:8000/send/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formJson, time: Date.now() }),
    }).then((res) => {
      if (res.status === 201) {
        alert("Message Sent!");
        navigate("/recent-messages");
      } else {
        alert("Invalid input. Try again");
      }
    });
    index = index + 1;
  }

  return (
    <div>
      <h1> Compose a Message </h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group style={{ padding: 10, margin: 10 }}>
          <Row style={{ margin: 50 }}>
            <Col xs="auto">
              <Form.Label>From</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Enter your name or nickname"
                defaultValue={user.username}
                name="sender"
              />
            </Col>
            <Col xs="auto">
              <Form.Label>To</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Enter Recepient"
                defaultValue={"You"}
                name="receiver"
              />
            </Col>
          </Row>
          <Row>
            <Col xs="auto">
              <Form.Label>Message</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="text"
                placeholder="Compose your message"
                defaultValue={"Something important"}
                name="content"
                as="textarea"
                rows={3}
              />
            </Col>
          </Row>
          <Row>
            <Col md="auto">
              <Button
                variant="secondary"
                type="submit"
                className="send-message"
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form.Group>
      </Form>
    </div>
  );
};

export default SendMessage;
