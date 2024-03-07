import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const SentMessage = ({ message }) => {
  const [messageData, setMessageData] = useState(message);
  const lastTapRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "messages", message.id), (doc) => {
      setMessageData(doc.data());
    });
    return () => unsubscribe();
  }, [message.id]);

  const handlePress = async () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300; // Adjust as needed
    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      console.log("Double tapped! ", messageData);

      try {
        // Update the message in Firestore
        const messageRef = doc(db, "messages", message.id);
        await updateDoc(messageRef, {
          heart: !messageData.heart,
        });
      } catch (error) {
        console.error("Error updating message: ", error);
      }
    }
    lastTapRef.current = now;
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Text style={styles.text}>{messageData.text}</Text>

        {messageData.heart && (
          <Icon
            name="heart"
            size={20}
            color="pink"
            style={{ position: "absolute", bottom: -8, left: -8 }}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
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
