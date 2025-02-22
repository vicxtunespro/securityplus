import { create } from "zustand";

const useNavStore = create((set) => ({
  min: false, // Default state
  minimize: () => set({ min: true }),
  maximize: () => set({ min: false }),
  toggleMenu: () => set((state) => ({ min: !state.min })),
}));

export default useNavStore;
