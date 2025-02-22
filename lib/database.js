
import { db } from "./firebase";
import { addDoc, collection, getDocs } from 'firebase/firestore'

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

export const addOfficer = async (officerInfo) =>{
    try {
        await addDoc(collection(db, "guards"), officerInfo);
        console.log("New officer created successful");
    } catch (err) {
        console.log(err.message);
    }
}