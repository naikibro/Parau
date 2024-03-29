import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  SafeAreaView,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
  StatusBar,
} from "react-native";
import {
  FlingGestureHandler,
  Directions,
  State,
} from "react-native-gesture-handler";

// Import firestore SDK
import { collection, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";

// Import components
import LoginForm from "../components/LoginForm";
import ContactCard from "../components/ContactCard";
import SkeletonContactCard from "../components/skeletons/SkeletonContactCard";

// Import assets
import background from "../assets/bg-orange.png";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Import stores
import useHeaderStore from "../store/HeaderStore";

SplashScreen.preventAutoHideAsync();

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isChatting = useHeaderStore((state) => state.isChatting);
  const lastContact = useHeaderStore((state) => state.lastContact);

  const [fontsLoaded, fontError] = useFonts({
    "Mitr-Bold": require("../assets/fonts/Mitr-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const onSwipeLeft = () => {
    console.log("swiped left");
    console.log(lastContact);
    if (isChatting) {
      if (lastContact !== undefined) {
        navigation.navigate("Chat");
      } else {
        console.log("Contact undefined");
      }
    } else {
      console.log("Select a contact to discuss first");
    }
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <FlingGestureHandler
      direction={Directions.LEFT}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          onSwipeLeft();
        }
      }}
    >
      <ScrollView
        onLayout={onLayoutRootView}
        contentContainerStyle={styles.container}
      >
        <SafeAreaView style={styles.container}>
          {user ? (
            <>
              <Text
                style={{
                  color: "white",
                  fontFamily: "Mitr-Bold",
                  fontSize: 40,
                  marginTop: 20,
                }}
              >
                Let's chat with
              </Text>
              {loading ? (
                Array.from({
                  length: Math.floor(Math.random() * (8 - 3 + 1) + 3),
                }).map((_, index) => (
                  <SkeletonContactCard key={index} maxWidth={70} />
                ))
              ) : users.length > 1 ? (
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
                  No contacts available
                </Text>
              )}
            </>
          ) : (
            <>
              <ImageBackground
                source={background}
                style={styles.backgroundImage}
              />

              <LoginForm navigation={navigation} />
            </>
          )}
          <StatusBar style="auto" />
        </SafeAreaView>
      </ScrollView>
    </FlingGestureHandler>
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
