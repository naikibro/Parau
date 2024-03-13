import React, { useState, useEffect, useCallback } from "react";
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

// import assets
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Import firestore SDK
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { Button } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: "",
    userLastName: "",
    mail: "",
    password: "",
  });
  const [user, setUser] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputFocusAnimatedValue = new Animated.Value(0);

  const [fontsLoaded, fontError] = useFonts({
    "Mitr-Bold": require("../assets/fonts/Mitr-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    setIsFormValid(
      formData.username.trim() &&
        formData.mail.trim() &&
        formData.password.trim()
    );
  }, [formData]);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const createUserAccount = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.mail,
        formData.password
      );
      await updateProfile(user, { displayName: formData.username });
      await addDoc(collection(db, "users"), {
        mail: formData.mail,
        uid: user.uid,
        name: formData.username,
        lastName: formData.userLastName,
        signUpMethod: "emailAndPassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      Alert.alert("Signup Error", error.message);
    }
  };

  const animatedBackgroundColor = inputFocusAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"],
  });

  const toggleInputFocus = (isFocused) => {
    setIsInputFocused(isFocused);
    Animated.timing(inputFocusAnimatedValue, {
      toValue: isFocused ? 1 : 0,
      duration: isFocused ? 600 : 900,
      useNativeDriver: false,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/bg-parau.png")}
            resizeMode="cover"
            style={styles.backgroundImage}
          />
          {user ? (
            <UserGreeting
              user={user}
              onSignOut={() => signOut(auth).then(() => setUser(null))}
            />
          ) : (
            <SignUpForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={createUserAccount}
              animatedBackgroundColor={animatedBackgroundColor}
              toggleInputFocus={toggleInputFocus}
              sInputFocused={isInputFocused}
              navigation={navigation}
            />
          )}
          <StatusBar style="auto" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const UserGreeting = ({ user, onSignOut }) => (
  <View>
    <Text>Welcome {user.displayName || "User"}!</Text>
    <Pressable
      onPress={onSignOut}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? "blue" : "navy" },
      ]}
    >
      <Text style={styles.buttonText}>Log out</Text>
    </Pressable>
  </View>
);

const SignUpForm = ({
  formData,
  onInputChange,
  onSubmit,
  animatedBackgroundColor,
  toggleInputFocus,
  isInputFocused,
  navigation,
}) => (
  <Animated.View
    style={[styles.loginForm, { backgroundColor: animatedBackgroundColor }]}
  >
    <Text style={styles.title}>Create an account</Text>
    {["username", "last name", "mail", "password"].map((field) => (
      <TextInput
        key={field}
        value={formData[field]}
        onChangeText={(value) => onInputChange(field, value)}
        onFocus={() => toggleInputFocus(true)}
        onBlur={() => toggleInputFocus(false)}
        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
        style={[
          styles.input,
          isInputFocused && field === "password" && styles.inputFocused,
        ]}
        secureTextEntry={field === "password"}
        autoCapitalize="none"
      />
    ))}
    <Button onPress={onSubmit} mode="contained" style={{ marginVertical: 10 }}>
      Sign up
    </Button>
    <Pressable onPress={() => navigation.navigate("Home")}>
      <Text style={styles.linkText}>Already have an account? Log in here</Text>
    </Pressable>
  </Animated.View>
);

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
  },
  input: {
    color: "black",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    padding: 10,
    marginVertical: 5,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
  },
  linkText: {
    color: "#000",
    textAlign: "center",
  },
  title: {
    fontFamily: "Mitr-Bold",
    fontSize: 30,
    textAlign: "center",
    marginBottom: 15,
  },
  backgroundImage: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
  },
});

export default SignUpScreen;
