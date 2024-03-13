import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

const SentMessage = ({ message }) => {
  const [messageData, setMessageData] = useState(message);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "messages", message.id), (doc) => {
      setMessageData(doc.data());
    });
    return () => unsubscribe();
  }, [message.id]);

  const handleDoubleTap = async () => {
    console.log("Double tapped! ", messageData);
    try {
      const messageRef = doc(db, "messages", message.id);
      await updateDoc(messageRef, {
        heart: !messageData.heart,
      });
    } catch (error) {
      console.error("Error updating message: ", error);
    }
  };

  // Define the double tap gesture using RNGH
  const doubleTapGesture = Gesture.Tap().numberOfTaps(2).onEnd(handleDoubleTap);

  return (
    <GestureDetector gesture={doubleTapGesture}>
      <TouchableOpacity>
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
      </TouchableOpacity>
    </GestureDetector>
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
