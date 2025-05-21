import { View, Text } from "react-native";
import Accordion from "react-bootstrap/Accordion";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

const MessageDisplay = ({ sender, receiver, body, index }) => {
  return (
    <Accordion.Item eventKey={index} style={{ margin: 10 }}>
      <Accordion.Header as={Row}>
        <Col>{`From: ${sender}`}</Col>
        <Col>{`To: ${receiver}`}</Col>
        <Col xs="auto"> insert time </Col>
      </Accordion.Header>
      <Accordion.Body>{body}</Accordion.Body>
    </Accordion.Item>
  );
};

export default MessageDisplay;
