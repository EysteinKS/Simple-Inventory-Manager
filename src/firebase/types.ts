import { LastChanged } from "../redux/types";
import { FirebaseAppConfig } from "@firebase/app-types";

export interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface ClientData {
  name: string;
  logoUrl: string | null;
  primaryColor: string | null;
  lastChanged: LastChanged;
  firebaseConfig: FirebaseAppConfig;
}

export interface ClientRequest {
  name: string;
  dateRequested: Date;
  email: string;
}
