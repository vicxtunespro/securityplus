"use client";
import { auth, db } from "@/libs/firebase"; // Ensure db is imported
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";

const useAuthStore = create((set, get) => ({
    user: null,
    role: null,
    loading: false,
    error: "",

    // Set user state
    setUser: (user) => set({ user }),

    // Fetch user details from Firestore
    fetchUserDetails: async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                set({ user: { uid, ...userData }, role: userData.role });
                localStorage.setItem("authUser", JSON.stringify({ uid, ...userData }));
            }
        } catch (err) {
            console.error("Error fetching user details:", err);
        }
    },

    // Login function
    login: async (email, password, router) => {
        set({ loading: true, error: "" });
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;

            await get().fetchUserDetails(user.uid); // Fetch user info from Firestore

            router.push("/dashboard"); // Redirect to dashboard
        } catch (err) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    // Logout function
    logout: async () => {
        try {
            await signOut(auth);
            set({ user: null, role: null });
            localStorage.removeItem("authUser");
        } catch (err) {
            console.error("Logout error:", err);
        }
    },

    // Auto-load session on app start
    checkAuthState: () => {
        set({ loading: true });
        onAuthStateChanged(auth, (user) => {
            if (user) {
                get().fetchUserDetails(user.uid);
            } else {
                set({ user: null, role: null });
                localStorage.removeItem("authUser");
            }
            set({ loading: false });
        });
    },
}));

export default useAuthStore;
