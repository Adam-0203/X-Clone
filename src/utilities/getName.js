import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

async function getUser(id){
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data()
}

export {getUser}