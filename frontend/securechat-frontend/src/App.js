import "./App.css";
import React, { useState } from "react";
import SendMessage from "./components/SendMessage";
import { View, Text } from "react-native";
//import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <View style={{ height: 100, margin: 10 }}>
      <SendMessage />
    </View>
  );
}
