import { create } from "zustand";

const useAuthStore = create((set) => ({
  currentUser: undefined,
  setCurrentUser: (user) => set({ currentUser: user }),
}));

export default useAuthStore;
