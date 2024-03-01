import { create } from "zustand";

const useHeaderStore = create((set) => ({
  isChatting: false,
  toggleChat: (isChatting) => set({ isChatting: !isChatting }),
}));

export default useHeaderStore;
