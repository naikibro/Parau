import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Image,
  Pressable,
  Animated,
  Platform,
  Keyboard,
  ActivityIndicator,
} from "react-native";

// Import assets
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Firebase imports
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { Button } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

const LoginForm = ({ navigation }) => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [isFormValid, setIsFormValid] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMailInput = (value) => setMail(value);
  const handlePasswordInput = (value) => setPassword(value);
  const inputFocusAnimatedValue = new Animated.Value(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "Mitr-Bold": require("../assets/fonts/Mitr-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    setIsFormValid(mail.trim() !== "" && password.trim() !== "");
  }, [mail, password]);

  // Authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe; // Cleanup on component unmount
  }, []);

  const loginUser = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        mail,
        password
      );
      setUser(userCredential.user);
      console.log("User connected", userCredential);
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }

    setIsLoading(false);
  };

  const animatedBackgroundColor = inputFocusAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.9)"],
  });

  const handleFocus = () => {
    setIsInputFocused(!isInputFocused);
    Animated.timing(inputFocusAnimatedValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsInputFocused(!isInputFocused);

    Animated.timing(inputFocusAnimatedValue, {
      toValue: 0,
      duration: 900,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    // Cleanup function
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

      {user ? (
        <View>
          <Text>Welcome {user.displayName || "User"}!</Text>
          <Pressable
            onPress={() => signOut(auth).then(() => setUser(null))}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "blue" : "navy",
              },
              styles.button,
            ]}
          >
            <Text style={styles.buttonText}>Log out</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {!isKeyboardVisible && (
            <Image
              source={require("./../assets/PARAU-alpha.png")}
              style={{ width: 150, height: 150, borderRadius: 40 }}
            />
          )}
          <Animated.View
            style={[
              styles.loginForm,
              { backgroundColor: animatedBackgroundColor },
            ]}
          >
            <Text
              style={{
                fontFamily: "Mitr-Bold",
                fontSize: 30,
                textAlign: "center",
                marginBottom: 15,
              }}
            >
              LOGIN
            </Text>
            <TextInput
              value={mail}
              onChangeText={handleMailInput}
              onFocus={handleFocus}
              onEndEditing={handleBlur}
              placeholder="Email"
              style={styles.input}
              autoCapitalize="none"
            />
            <TextInput
              value={password}
              onChangeText={handlePasswordInput}
              onFocus={handleFocus}
              onEndEditing={handleBlur}
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              autoCapitalize="none"
            />
            <Button
              onPress={loginUser}
              mode="contained"
              disabled={!isFormValid}
              style={{ marginVertical: 10 }}
            >
              Login
            </Button>
            <Pressable
              style={styles.link}
              onPress={() => navigation.navigate("Signup")}
            >
              <Text style={styles.linkText}>
                No account yet ? Create an account here
              </Text>
            </Pressable>
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    // Android shadow property
    elevation: 5,
  },
  loginForm: {
    width: 250,
    marginVertical: 40,
    padding: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 1)",
    color: "white",
  },
  loginFormFocused: {
    backgroundColor: "rgba(150, 0, 0, 1)",
  },
  input: {
    color: "black",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    padding: 2,
    marginVertical: 1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "navy",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
  },
  linkText: {
    color: "#000",
    textAlign: "center",
  },
});

export default LoginForm;
