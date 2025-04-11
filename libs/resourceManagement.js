import { db } from '@/libs/firebase'
import { getDoc, doc, setDoc, updateDoc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

class ResourceManager {
    constructor(collectionName) {
        this.db = db;
        this.collectionName = collectionName;
    }

    async getAll() {
        try {
            const docRef = collection(this.db, this.collectionName);
            const dataSnapshot = await getDocs(docRef);
            const data = dataSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            console.log(data);
            return data;  
        } catch (error) {
            console.error("Error getting documents: ", error);
            throw error; // Optionally rethrow the error for further handling
        }
    }

    async get(id) {
        try {
            const docRef = doc(this.db, this.collectionName, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() }; // Return the document data along with its ID
            } else {
                throw new Error("No such document!");
            }
        } catch (error) {
            console.error("Error getting document: ", error);
            throw error; // Rethrow the error for handling in the component
        }
    }

    async addResource(resource) {
        try {
            const docRef = await addDoc(collection(this.db, this.collectionName), resource);
            console.log("Document written with ID: ", docRef.id);
            return docRef.id; // Return the ID of the newly created document
        } catch (error) {
            console.error("Error adding document: ", error);
            throw error;
        }
    }

    async updateResource(id, updatedData) {
        try {
            const docRef = doc(this.db, this.collectionName, id);
            await updateDoc(docRef, updatedData);
            console.log("Document updated with ID: ", id);
        } catch (error) {
            console.error("Error updating document: ", error);
            throw error;
        }
    }

    async deleteResource(id) {
        try {
            const docRef = doc(this.db, this.collectionName, id);
            await deleteDoc(docRef);
            console.log("Document deleted with ID: ", id);
        } catch (error) {
            console.error("Error deleting document: ", error);
            throw error;
        }
    }
}

//User managerment
export const clientManager = new ResourceManager('users');

//Officer manager
export const officerManager = new ResourceManager('guards');

//Shift manager
export const shiftManager = new ResourceManager('shifts');
