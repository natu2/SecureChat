import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useContext } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";

import UserContext from "./UserContext";

const SignUp = () => {
  const [user, updateUser] = useContext(UserContext);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const inputUsername = formJson.username;
    const inputPassword = formJson.password;
    const confirmPassword = formJson.confirm;

    if (confirmPassword === inputPassword) {
      fetch(`http://localhost:8000/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: inputUsername,
          password: inputPassword,
          isLoggedIn: true,
        }),
      }).then((res) => {
        if (res.status === 201) {
          updateUser(inputUsername, inputPassword, true);
          alert("Signup Successful!");
          navigate("/");
        } else {
          alert(`${res.statusText}`);
        }
      });
    } else {
      alert("Passwords dont match");
    }
  }

  return (
    <div>
      <h1>SignUp</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group
          style={{
            padding: 10,
            margin: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Row>
            <Col md="auto">
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                required
              />
            </Col>
          </Row>

          <br />
          <Row>
            <Col md="auto">
              <Form.Control
                type="password"
                placeholder="Create Password"
                name="password"
                required
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col md="auto">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirm"
                required
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col md="auto">
              <Button variant="secondary" type="submit">
                Sign Up
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md="auto">
              <Link to="/login"> Already have an account </Link>
              <Outlet />
            </Col>
          </Row>
        </Form.Group>
      </Form>
    </div>
  );
};

export default SignUp;
