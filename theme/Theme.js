import { MD3LightTheme } from "react-native-paper";

const Theme = {
  ...MD3LightTheme,
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,

    background: "rgb(255, 251, 254)",
    backdrop: "rgb(255, 251, 254)",
    primary: "#2ec4b6",
    secondary: "black",
    tertiary: "lightgray",

    accent: "#2ec4b6",
    error: "#e71d36",

    avatarText: "white",
    avatarBackground: "black",
  },
};

export default Theme;
