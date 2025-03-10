import { auth, db } from "./firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDoc, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEthics } from "@/store/ethicStore";


export async function signInWithGoogle(router, startLoading, stopLoading){

    startLoading();

    const googleProvider = new GoogleAuthProvider();

    try {
        const results = await signInWithPopup(auth, googleProvider);
        const user = results.user;

        // Check if user exits.
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()){
            await setDoc(userRef, {
                uid: user.uid,
                name: user.displayName || "Anonymous",
                email: user.email || "No Email",
                photoURL: user.photoURL || "/default-avatar.png",
                isRead: false,
                createdAt: serverTimestamp(),
            });
        }

        router.push('/dashboard');
        return results.user;
        
    } catch (error) {
        console.log(error.message)
    } finally{
        stopLoading();
    }
}