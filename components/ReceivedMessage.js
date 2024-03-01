import { View, Text } from "react-native";

const ReceivedMessage = ({ message }) => {
  return (
    <View
      style={{
        backgroundColor: "navy",
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        maxWidth: "80%",
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: "white" }}>{message.text}</Text>
    </View>
  );
};

export default ReceivedMessage;
