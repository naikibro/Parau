import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  StatusBar,
  Pressable,
  Animated,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";

// Firebase imports
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, addDoc, collection, doc } from "firebase/firestore";

const SignUpScreen = ({ navigation }) => {
  // State hooks for user input and user data
  const [username, setUsername] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // Form validation state
  const [isFormValid, setIsFormValid] = useState(false);

  // Input focus state
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Animated background color based on input focus
  const inputFocusAnimatedValue = new Animated.Value(0);

  // Effect hook for form validation
  useEffect(() => {
    setIsFormValid(
      username.trim() !== "" && mail.trim() !== "" && password.trim() !== ""
    );
  }, [username, mail, password]);

  // Authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe; // Cleanup on component unmount
  }, []);

  // Event handlers for input fields
  const handleMailInput = (value) => setMail(value);
  const handleUsernameInput = (value) => setUsername(value);
  const handleUserLastNameInput = (value) => setUserLastName(value);
  const handlePasswordInput = (value) => setPassword(value);

  // Create user function
  const createUser = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        mail,
        password
      );
      setUser(userCredential.user);
      console.log("User created", userCredential);
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      try {
        await addDoc(collection(db, "users"), {
          mail: mail,
          uid: userCredential.user.uid,
          name: username,
          lastName: userLastName,
          signUpMethod: "emailAndPassword",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error("Error sending message: ", error);
      }

      console.log("Profile updated");
    } catch (error) {
      Alert.alert("Signup Error", error.message);
    }
  };

  // Animated background color based on input focus
  const animatedBackgroundColor = inputFocusAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"], // Background color values
  });

  // Focus and Blur handlers for inputs using Animated API
  const handleFocus = () => {
    setIsInputFocused(!isInputFocused);
    Animated.timing(inputFocusAnimatedValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false, // backgroundColor does not support native animation
    }).start();
  };

  const handleBlur = () => {
    setIsInputFocused(!isInputFocused);

    Animated.timing(inputFocusAnimatedValue, {
      toValue: 0,
      duration: 900,
      useNativeDriver: false, // backgroundColor does not support native animation
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/stars.jpg")}
            resizeMode="cover"
            style={styles.backgroundImage}
          />
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
              <Animated.View
                style={[
                  styles.loginForm,
                  { backgroundColor: animatedBackgroundColor }, // Apply animated background color here
                ]}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 30,
                    textAlign: "center",
                    marginBottom: 15,
                  }}
                >
                  Create an account
                </Text>
                <TextInput
                  value={username}
                  onChangeText={handleUsernameInput}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="First name"
                  style={styles.input}
                />
                <TextInput
                  value={userLastName}
                  onChangeText={handleUserLastNameInput}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Last name"
                  style={(styles.input, { marginBottom: 10 })}
                />
                <TextInput
                  value={mail}
                  onChangeText={handleMailInput}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Email"
                  style={styles.input}
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <TextInput
                  value={password}
                  onChangeText={handlePasswordInput}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Password"
                  secureTextEntry
                  style={styles.input}
                  autoCapitalize="none"
                />
                <Pressable
                  onPress={createUser}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "blue" : "navy",
                    },
                    styles.button,
                  ]}
                  disabled={!isFormValid}
                >
                  <Text style={styles.buttonText}>Sign up</Text>
                </Pressable>
                <Pressable
                  style={styles.link}
                  onPress={() => navigation.navigate("Home")}
                >
                  <Text style={styles.linkText}>
                    Already have an account ? Log in here
                  </Text>
                </Pressable>
              </Animated.View>
            </>
          )}

          <StatusBar style="auto" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// StyleSheet for styling the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  loginForm: {
    width: 250,
    marginVertical: 40,
    padding: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    color: "white",
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

export default SignUpScreen;
