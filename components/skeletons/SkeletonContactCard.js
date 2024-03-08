import React from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";

const SkeletonContactCard = ({ maxWidth }) => {
  const width = maxWidth + "%";

  return (
    <View style={styles.container}>
      <View style={[styles.skeletonCard, { maxWidth: width }]}>
        <ActivityIndicator size="small" color="#0000ff" />
        <View style={styles.textContainer}>
          <Text style={styles.placeholderText}></Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  skeletonCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#ccc",
    height: 50,
  },
  textContainer: {
    marginLeft: 20,
    flex: 1,
  },
  placeholderText: {
    color: "#000000",
    fontSize: 16,
  },
});

export default SkeletonContactCard;
