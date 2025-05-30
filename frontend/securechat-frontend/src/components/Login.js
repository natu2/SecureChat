import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Text } from "react-native";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { useContext } from "react";

import UserContext from "./UserContext";

const Login = () => {
  const navigate = useNavigate();
  const [user, updateUser] = useContext(UserContext);

  function handleSubmit(e) {
    e.preventDefault();

    //TODO: Data validation + checking
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const inputUsername = formJson.username;
    const inputPassword = formJson.password;

    updateUser(inputUsername, inputPassword, true);
    navigate("/");
  }
  return (
    <div
      style={{
        padding: 10,
        margin: 10,
        justifyItems: "center",
      }}
    >
      <h1> Login </h1>
      <Form
        onSubmit={handleSubmit}
        style={{
          justifyItems: "center",
        }}
      >
        <Form.Group>
          <Row>
            <Col md="auto">
              <Form.Control
                type="text"
                name="username"
                placeholder="Username"
                required
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col md="auto">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col md="auto">
              <Button variant="secondary" type="submit">
                Login
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md="auto">
              <Link to="/sign-up"> Don't have an account </Link>
              <Outlet />
            </Col>
          </Row>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Login;
