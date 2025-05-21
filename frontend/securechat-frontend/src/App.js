import "./App.css";
import React, { useState } from "react";
import SendMessage from "./components/SendMessage";
import MessageList from "./components/MessageList";
import { View, Text } from "react-native";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

//import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <Container
      fluid
      data-bs-theme="dark"
      style={{ backgroundColor: "#b2b5c2" }}
    >
      <SendMessage />
      <MessageList />
    </Container>
  );
}
