// App.js
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Button,
  TextInput,
  DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import useThemeStore from "./store/ThemeStore";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Import icons
import { Ionicons } from "@expo/vector-icons";

// Components
import SentMessage from "./components/SentMessage";
import LoginForm from "./components/LoginForm";

// Screens
import HomeScreen from "./screens/HomeScreen";
import SignUpScreen from "./screens/SignUpScreen";
import MessengerScreen from "./screens/MessengerScreen";

// Stores
import useAuthStore from "./store/AuthStore";
import useHeaderStore from "./store/HeaderStore";

const Tab = createBottomTabNavigator();

export default function App() {
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: "#3498db",
      accent: "#f1c40f",
    },
  };

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  const isDisplayChat = useHeaderStore((state) => state.isChatting);

  // Authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      useAuthStore.setState({ setCurrentUser: currentUser });
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

  const LogOutButton = () => <Button title="Logout" onPress={signOut(auth)} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === "Home") {
                  iconName = focused ? "home" : "home-outline";
                } else if (route.name === "Chat") {
                  iconName = focused ? "chatbubble" : "chatbubble-outline";
                } else if (route.name === "Signup") {
                  iconName = focused ? "person" : "person-outline";
                } else if (route.name === "Logout") {
                  iconName = focused ? "log-out" : "log-out-outline";
                }

                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
          >
            {user ? (
              <>
                <Tab.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />
                {isDisplayChat ? (
                  <Tab.Screen name="Chat" component={MessengerScreen} />
                ) : (
                  <></>
                )}
                <Tab.Screen name="Logout" component={LogOutButton} />
              </>
            ) : (
              <>
                <Tab.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />
                <Tab.Screen
                  name="Signup"
                  component={SignUpScreen}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
