// App.js
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import React, { useState, useEffect, StrictMode } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Import icons
import { Ionicons } from "@expo/vector-icons";

// Screens
import HomeScreen from "./screens/HomeScreen";
import SignUpScreen from "./screens/SignUpScreen";
import MessengerScreen from "./screens/MessengerScreen";
import LogOutButton from "./components/utils/LogOutButton";

// Stores
import useAuthStore from "./store/AuthStore";
import useHeaderStore from "./store/HeaderStore";

// Theme
import Theme from "./theme/Theme";

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const isChatting = useHeaderStore((state) => state.isChatting);

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={Theme}>
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
                {isChatting ? (
                  <Tab.Screen name="Chat" component={MessengerScreen} />
                ) : null}
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
