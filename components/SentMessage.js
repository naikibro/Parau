// SentMessage.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SentMessage = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    maxWidth: "80%",
    alignSelf: "flex-end",
  },
  text: {
    color: "white",
  },
});

export default SentMessage;
