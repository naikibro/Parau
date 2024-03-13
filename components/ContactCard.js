import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper";
import useHeaderStore from "../store/HeaderStore";
import { useTheme } from "react-native-paper";

const ContactCard = ({ navigation, contact }) => {
  const initials = contact.name.substring(0, 2);
  const activateChat = useHeaderStore((state) => state.activateChat);
  const setLastContact = useHeaderStore((state) => state.setLastContact);
  const lastContact = useHeaderStore((state) => state.lastContact);
  const theme = useTheme();
  console.log("theme: ", theme);
  const handlePress = async () => {
    setLastContact(contact);
    await activateChat();
    navigation.navigate("Chat");
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={{
          width: 300,
          height: 50,
          padding: 15,
          marginVertical: 10,
          borderRadius: 10,
          backgroundColor: "white",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Avatar.Text
          size={30}
          label={initials}
          style={{
            marginRight: 20,
            backgroundColor: theme.colors.avatarBackground,
          }}
          color={theme.colors.avatarText}
          theme={theme}
        />
        <Text
          style={{
            textAlign: "center",
            marginRight: 20,
            color: theme.colors.secondary,
          }}
        >
          {contact.name + " " + contact.lastName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ContactCard;
