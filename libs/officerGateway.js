import { collection, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

//Get all officer in the database
export const getOfficers = async () => {
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

//Get specific officer provided the id
export const getOfficer = async (id) => {
    try {
        const officerRef = doc(db, 'guards', id);
        const officer = await getDoc(officerRef);

        if(officer.exists){
            const officerDetails = {id: officer.id, ...officer.data()}
            return officerDetails;
        }else{
            console.error("Officer doesnt exit");
        }
    } catch (error) {
        console.error("Something went wrong: ", error.message);
    }
}

//Delete an officer provide his id
export const deleteOffice = async (id) => {
    await deleteDoc(doc(db, "guards", id));
    return;
}




