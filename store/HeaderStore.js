import { create } from "zustand";

const useHeaderStore = create((set) => ({
  isChatting: false,
  activateChat: (isChatting) => set({ isChatting: true }),
  resetChat: (isChatting) => set({ isChatting: false }),
}));

export default useHeaderStore;
