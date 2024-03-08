import React, { useState, useEffect, useLayoutEffect } from "react";
import { Button } from "react-native-paper";
import { View, ScrollView, Animated } from "react-native";

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
import ReceivedMessage from "../components/ReceivedMessage";
import SentMessage from "../components/SentMessage";
import MessageInput from "../components/MessageInput";
import SkeletonReceivedMessage from "../components/skeletons/SkeletonReceivedMessage";
import SkeletonSentMessage from "../components/skeletons/SkeletonSentMessage";

// Import icons
import { Ionicons } from "@expo/vector-icons";

// Import stores
import useHeaderStore from "../store/HeaderStore";

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const MessengerScreen = ({ navigation }) => {
  const contact = useHeaderStore((state) => state.lastContact);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state
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
    setLoading(true); // Set loading state when fetching data
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
            setLoading(false); // Set loading state to false when data is fetched
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
    navigation.setOptions({
      title: pageName,
      headerLeft: () => (
        <Button
          style={{
            borderRadius: 20,
            marginHorizontal: 10,
          }}
          mode="contained"
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={22} color="white" />
        </Button>
      ),
    });
  }, [contact, navigation, pageName]);

  const onSwipeRight = () => {
    console.log("swiped right");
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
            {loading ? ( // Render skeleton when loading
              <ScrollView style={{ flex: 1, marginTop: 20 }}>
                {[...Array(getRandomInt(4, 12))].map((_, index) => {
                  const randomWidth = getRandomInt(40, 85);
                  const fadeAnim = new Animated.Value(1); // Initial opacity value
                  const delay = index * 200; // Delay each skeleton by 200ms

                  // Start the fade out animation after a delay
                  Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    delay: delay,
                    useNativeDriver: true,
                  }).start();

                  return (
                    <Animated.View key={index} style={{ opacity: fadeAnim }}>
                      {index % 2 === 0 ? (
                        <SkeletonReceivedMessage
                          maxWidth={randomWidth}
                          key={index}
                        />
                      ) : (
                        <SkeletonSentMessage
                          maxWidth={randomWidth}
                          key={index}
                        />
                      )}
                    </Animated.View>
                  );
                })}
              </ScrollView>
            ) : (
              <ScrollView style={{ flex: 1, marginTop: 20 }}>
                {messages.map((message, index) => {
                  const fadeInAnim = new Animated.Value(0);

                  // Start the fade in animation
                  Animated.timing(fadeInAnim, {
                    toValue: 1, // Fade in to fully opaque
                    duration: 500,
                    delay: index * 200,
                    useNativeDriver: true,
                  }).start();

                  return (
                    <Animated.View
                      key={message.id}
                      style={{ opacity: fadeInAnim }}
                    >
                      {message.sender === user?.uid ? (
                        <SentMessage key={message.id} message={message} />
                      ) : (
                        <ReceivedMessage key={message.id} message={message} />
                      )}
                    </Animated.View>
                  );
                })}
              </ScrollView>
            )}
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
