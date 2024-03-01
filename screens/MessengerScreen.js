import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, ScrollView } from "react-native";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  and,
  or,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

// import components
import SentMessage from "../components/SentMessage";
import ReceivedMessage from "../components/ReceivedMessage";
import MessageInput from "../components/MessageInput";

const MessengerScreen = ({ route, navigation }) => {
  const { contact } = route.params.contact;
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const receiver = contact.uid;
  const [pageName, setPageName] = useState("Chat");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe; // Cleanup on component unmount
  }, []);

  useEffect(() => {
    setMessages([]);
    let unsubscribe = () => {}; // Initialize unsubscribe function

    const fetchData = async () => {
      try {
        if (user && user.uid && receiver) {
          console.log("User UID:", user.uid);
          console.log("Receiver UID:", receiver);

          const q = query(
            collection(db, "messages"),
            or(
              and(
                where("receiver", "==", user.uid),
                where("sender", "==", receiver)
              ),
              and(
                where("receiver", "==", receiver),
                where("sender", "==", user.uid)
              )
            )
          );

          console.log("Query:", q);

          unsubscribe = onSnapshot(q, (snapshot) => {
            const sortedMessages = snapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }))
              .sort((a, b) => a.timestamp - b.timestamp);
            setMessages(sortedMessages);
            console.log("SORTED MESSAGES : ", sortedMessages);
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchData();

    return () => unsubscribe(); // Unsubscribe from snapshot listener when component unmounts
  }, [receiver, user]);

  // Use useLayoutEffect to set options for navigation
  useLayoutEffect(() => {
    setPageName("Chat with " + contact.name);
    navigation.setOptions({ title: pageName });
  }, [contact, navigation, pageName]);

  console.log("MESSAGES : ", messages);
  return (
    <View style={{ flex: 1 }}>
      {contact ? (
        <>
          <ScrollView style={{ flex: 1, marginTop: 20 }}>
            {messages.map((message) =>
              message.sender === user?.uid ? (
                <SentMessage key={message.id} message={message} />
              ) : (
                <ReceivedMessage key={message.id} message={message} />
              )
            )}
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MessageInput receiver={receiver} />
          </View>
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

export default MessengerScreen;
