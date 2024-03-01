import { create } from "zustand";

const useThemeStore = create((set) => ({
  // text colors
  textColor: "pink",
  textColorPrimary: "pink",
  textColorSecondary: "orange",

  // font sizes
  fontSize: {
    small: 20,
    medium: 30,
    large: 40,
  },
}));

export default useThemeStore;
