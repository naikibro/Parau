import React from "react";
import { View } from "react-native";

const SkeletonSentMessage = ({ maxWidth }) => {
  const width = maxWidth + "%";
  return (
    <View
      style={{
        backgroundColor: "#ccc",
        width: width,
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 10,
        alignSelf: "flex-end",
        marginBottom: 10,
      }}
    />
  );
};

export default SkeletonSentMessage;
