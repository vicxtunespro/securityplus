
import { db } from "./firebase";
import { collection, getDocs } from 'firebase/firestore'

export const getGuards = async () => {
    try {
        //Step 1: Create a query snapshot
        const querySnapshot = await getDocs(collection(db, "guards"));

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

    } catch (error) {
        console.error("Error fetching guards: ", error);
        return [];
    }
}