import { DocumentSnapshot } from "@firebase/firestore-types";
import { firestore } from "./firebase";
import { shouldLog, parseDate } from "../constants/util";
import { getAllStorage } from "../redux/middleware/localStorage";
import { RootState } from "../redux/types";

export default class Subscription {
  private static instance: Subscription;
  private unsub: () => void = () => {};

  static getInstance(): Subscription {
    if (!Subscription.instance) {
      Subscription.instance = new Subscription();
    }
    return Subscription.instance;
  }

  public createSubscription(
    client: string,
    onSnapshot: (doc: DocumentSnapshot) => void
  ) {
    this.unsub = firestore.doc(`Clients/${client}`).onSnapshot(onSnapshot);
  }

  public unsubscribe() {
    shouldLog("Unsubscribing...");
    this.unsub();
  }
}

export const listenToUpdates = (client: string, onChange: () => void) => {
  const sub = Subscription.getInstance();
  shouldLog("Listening to updates");

  sub.createSubscription(client, doc => {
    const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
    if (source === "Local") return;
    shouldLog("Update detected");
    const data = doc.data() as any;

    const lastChanged = () => {
      const ls = getAllStorage() as RootState;
      shouldLog("ls: ", ls);
      return ls.auth.location.lastChanged.global as string;
    };

    const oldLastChanged = new Date(lastChanged()).toString();
    const newLastChanged = parseDate(data.lastChanged.global).toString();

    shouldLog("oldLastChanged", oldLastChanged);
    shouldLog("newLastChanged", newLastChanged);
    if (oldLastChanged !== newLastChanged) {
      shouldLog("lastChanged is different!");
      onChange();
    }
  });
};
