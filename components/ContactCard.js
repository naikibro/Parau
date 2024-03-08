import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper";
import useHeaderStore from "../store/HeaderStore";

const ContactCard = ({ navigation, contact }) => {
  const initials = contact.name.substring(0, 2);
  const activateChat = useHeaderStore((state) => state.activateChat);
  const setLastContact = useHeaderStore((state) => state.setLastContact);
  const lastContact = useHeaderStore((state) => state.lastContact);

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
        <Avatar.Text size={30} label={initials} style={{ marginRight: 20 }} />
        <Text style={{ textAlign: "center", marginRight: 20 }}>
          {contact.name + " " + contact.lastName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ContactCard;
