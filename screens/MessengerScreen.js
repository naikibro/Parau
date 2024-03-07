import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, ScrollView } from "react-native";

// Import Gesture Handling
import {
  FlingGestureHandler,
  Directions,
  State,
} from "react-native-gesture-handler";

// Import firebase SDK
import {
  collection,
  onSnapshot,
  query,
  where,
  and,
  or,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

// import components
import SentMessage from "../components/SentMessage";
import ReceivedMessage from "../components/ReceivedMessage";
import MessageInput from "../components/MessageInput";

// Import stores
import useHeaderStore from "../store/HeaderStore";

const MessengerScreen = ({ navigation }) => {
  const contact = useHeaderStore((state) => state.lastContact);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const receiver = contact.uid;
  const [pageName, setPageName] = useState("Chat");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setMessages([]);
    let unsubscribe = () => {};

    // Fetch all the messages between Me and contact
    const fetchData = async () => {
      try {
        if (user && user.uid && receiver) {
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

          unsubscribe = onSnapshot(q, (snapshot) => {
            const sortedMessages = snapshot.docs
              .map((doc) => ({ id: doc.id, ...doc.data() }))
              .sort((a, b) => a.timestamp - b.timestamp);
            setMessages(sortedMessages);
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchData();

    return () => unsubscribe();
  }, [receiver, user]);

  // Use useLayoutEffect to update Title of screen based on contact name
  useLayoutEffect(() => {
    setPageName("Chat with " + contact.name);
    navigation.setOptions({ title: pageName });
  }, [contact, navigation, pageName]);

  const onSwipeRight = () => {
    console.log("swipped right");
  };

  return (
    <FlingGestureHandler
      direction={Directions.RIGHT}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          onSwipeRight();
          navigation.navigate("Home");
        }
      }}
    >
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
    </FlingGestureHandler>
  );
};

export default MessengerScreen;
