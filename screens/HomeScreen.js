import {
  Text,
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Avatar, Button } from "react-native-paper";
import LoginForm from "../components/LoginForm";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import starsBackground from "../assets/stars.jpg";

import useHeaderStore from "../store/HeaderStore";

const ContactCard = ({ navigation, contact }) => {
  const initials = contact.name.substring(0, 2);
  const isChatting = useHeaderStore((state) => state.isChatting);
  const toggle = useHeaderStore((state) => state.toggleChat);

  const handlePress = () => {
    toggle();

    navigation.navigate("Chat", { contact: { contact } });
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

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const isChatting = useHeaderStore((state) => state.isChatting);
  const toggle = useHeaderStore((state) => state.toggleChat);

  // Authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe; // Cleanup on component unmount
  }, []);

  // Fetch all users
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    });

    return () => unsubscribe(); // Unsubscribe from snapshot listener when component unmounts
  }, []);

  /* console.log(users); */

  {
    isChatting ?? toggle();
  }
  return (
    <View style={[styles.container]}>
      <SafeAreaView style={[styles.container]}>
        <ImageBackground
          source={starsBackground}
          style={styles.backgroundImage}
        />

        {user ? (
          <>
            <Text style={{ color: "white", fontSize: 40, marginTop: 20 }}>
              Let's chat with{" "}
            </Text>
            {users.length > 1 ? (
              users
                .filter((u) => u.mail !== user.email)
                .map((u) => (
                  <ContactCard
                    key={u.id}
                    contact={u}
                    navigation={navigation}
                  ></ContactCard>
                ))
            ) : (
              <Text style={{ marginTop: 40, color: "white" }}>
                Loading available contacts...
              </Text>
            )}
          </>
        ) : (
          <>
            {console.log("Hello")}
            <LoginForm navigation={navigation} />
          </>
        )}

        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  backgroundImage: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
});

export default HomeScreen;
