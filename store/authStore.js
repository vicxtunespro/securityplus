'use client'
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { create } from "zustand";

const useAuthStore = create((set, get) => ({
    user: null,
    email: "",
    password: "",
    role: "",
    error: "",
    loading: false,

    // Modification functions
    setEmail: (email) => set((state) => ({ ...state, email })),
    setPassword: (password) => set((state) => ({ ...state, password })),
    setRole: (role) => set((state) => ({ ...state, role })),
    setUser: (user) => set({ user }),

    // Login function
    login: async (router) => {
        set((state) => ({ ...state, loading: true, error: "" }));

        try {
            // Retrieve the latest email & password from Zustand
            const { email, password } = get();
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            set((state) => ({ ...state, user: userCredentials.user }));

            // Redirect after successful login
            router.push("/dashboard");
        } catch (err) {
            set((state) => ({ ...state, error: err.message }));
        } finally {
            set((state) => ({ ...state, loading: false }));
        }
    },

    // Logout function
    logout: async () => {
        try {
            await signOut(auth);
            set((state) => ({ ...state, user: null }));
        } catch (err) {
            console.error("Logout error:", err);
        }
    },
}));




export default useAuthStore;
