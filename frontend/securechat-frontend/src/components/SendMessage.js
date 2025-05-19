import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

let index = 0;

const SendMessage = () => {
  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    console.log(formData);

    const formJson = Object.fromEntries(formData.entries());
    console.log(JSON.stringify(formJson));

    fetch(`http://localhost:8000/send/${index}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formJson),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));

    index = index + 1;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group style={{ padding: 10 }}>
        <Row>
          <Col xs="auto">
            <Form.Label>From</Form.Label>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Enter your name or nickname"
              defaultValue={"Me"}
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
            />
          </Col>
        </Row>
      </Form.Group>

      <Button variant="primary" type="submit" className="send-message">
        Submit
      </Button>
    </Form>
  );
};

export default SendMessage;
