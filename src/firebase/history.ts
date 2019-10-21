import { secondaryFirestore } from "./firebase";
import { DocumentSnapshot } from "@firebase/firestore-types";

interface IReport {}

export async function getCollectionFromFirestore() {
  let report: IReport = {};
  let isGenerated = false;
  try {
    const docs = await secondaryFirestore.collection("Barcontrol").get();
  } catch (err) {
    console.error("Error creating report: ", err);
  }
}
