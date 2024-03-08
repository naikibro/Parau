import React from "react";
import { View } from "react-native";

const SkeletonReceivedMessage = ({ maxWidth }) => {
  const width = maxWidth + "%";

  return (
    <View
      style={{
        backgroundColor: "#bbb",
        maxWidth: width,
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
      }}
    />
  );
};

export default SkeletonReceivedMessage;
