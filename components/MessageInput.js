import { ScrollView, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import {
  onSnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  query,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

// Stores
import useAuthStore from "../store/AuthStore";

const MessageInput = (receiver) => {
  const [message, setMessage] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      useAuthStore.setState({ setCurrentUser: currentUser });
    });
    return unsubscribe; // Cleanup on component unmount
  }, []);

  // Send the message
  const handleSubmit = async () => {
    console.log(user);
    setMessage("");
    try {
      await addDoc(collection(db, "messages"), {
        text: message,
        sender: user.uid,
        receiver: receiver.receiver,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <SafeAreaView
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
        marginBottom: 15,
        height: 40,
        width: "100%",
      }}
    >
      <TextInput
        editable
        multiline
        mode="outlined"
        value={message}
        onChangeText={(value) => setMessage(value)}
        label="Type a message..."
        style={{
          backgroundColor: "white",
          height: 40,
          width: "75%",
          alignSelf: "center",
        }}
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={{
          marginHorizontal: 2,
          borderRadius: 0,
        }}
      >
        Send
      </Button>
    </SafeAreaView>
  );
};

export default MessageInput;
