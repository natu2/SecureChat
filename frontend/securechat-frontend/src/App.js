import "./App.css";
import React, { useState, useContext } from "react";
import SendMessage from "./components/SendMessage";
import MessageList from "./components/MessageList";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Container from "react-bootstrap/Container";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import Welcome from "./Pages/Welcome";
import WelcomeBack from "./Pages/WelcomeBack";
import NoPage from "./Pages/NoPage";
import UserContext from "./components/UserContext";

export default function App() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    isLoggedIn: false,
  });
  const updateUser = (currUsername, currPassword, currLoggedIn) => {
    setUser({
      username: currUsername,
      password: currPassword,
      isLoggedIn: currLoggedIn,
    });
  };

  const loggedIn = () => {
    return (
      <UserContext.Provider value={[user, updateUser]}>
        <Router>
          <Routes>
            <Route path="/">
              <Route index element={<WelcomeBack />} />
              <Route path="recent-messages" element={<MessageList />} />
              <Route
                path="send-message"
                element={<SendMessage user={user} updateUser={updateUser} />}
              />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </Router>
      </UserContext.Provider>
    );
  };

  const loggedOut = () => {
    return (
      <UserContext.Provider value={[user, updateUser]}>
        <Router>
          <Routes>
            <Route path="/">
              <Route index element={<Welcome />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path="login" element={<Login />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </Router>
      </UserContext.Provider>
    );
  };

  return (
    <Container
      fluid
      data-bs-theme="dark"
      style={{ backgroundColor: "#b2b5c2", justifyItems: "center" }}
    >
      {user.isLoggedIn ? loggedIn() : loggedOut()}
    </Container>
  );
}
