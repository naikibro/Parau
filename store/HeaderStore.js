import { create } from "zustand";

const useHeaderStore = create((set) => ({
  isChatting: false,
  activateChat: (isChatting) => set({ isChatting: true }),
  resetChat: (isChatting) => set({ isChatting: false }),

  lastContact: undefined,
  setLastContact: (value) => set({ lastContact: value }),
}));

export default useHeaderStore;
