import { auth, db } from "./firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDoc, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";


export async function signInWithGoogle(router, startLoading, stopLoading, setUser, setRole){

    startLoading();

    const googleProvider = new GoogleAuthProvider();
    

    try {
        const results = await signInWithPopup(auth, googleProvider);
        const user = results.user;

        // Check if user exits.
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userDetails = userSnap.data();
        const role = userDetails.role

        if (!userSnap.exists()){
            await setDoc(userRef, {
                uid: user.uid,
                name: user.displayName || "Anonymous",
                email: user.email || "No Email",
                photoURL: user.photoURL || "/default-avatar.png",
                role: "user",
                isRead: false,
                createdAt: serverTimestamp(),
            });

            //All new signups with google are for users not admins
            setRole({ role: "user"});
        }else{

            //Unless other wise changed by administrators 
    
            
            setRole({ role: userDetails.role });
            console.log(`${role}`)
        }

        //Update state
        setUser ({
            uid: user.uid,
            name: user.displayName || "Anonymous",
            email: user.email || "No Email",
            photoURL: user.photoURL || "/default-avatar.png",
        });

        


        if(role === "admin"){
            router.push("/dashboard");
        }else{
            router.push("/client")
        }
        return results.user;


        
    } catch (error) {
        console.log(error.message)
    } finally{
        stopLoading();
    }
}