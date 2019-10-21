import {
  auth,
  firestore,
  tempFirestore,
  connectToTemp,
  disconnectFromTemp
} from "./firebase";
import { shouldLog } from "../constants/util";

//USERS

const generateUserSettings = (
  email: string,
  name: string[],
  location: string
) => ({
  currentLocation: location,
  email,
  firstName: name[0],
  lastName: name[1],
  locations: [location],
  role: "user",
  settings: {
    isInactiveVisible: true,
    language: "NO"
  }
});

export const createNewUser = async (
  email: string,
  password: string,
  name: string[],
  location: string
) => {
  try {
    const user = await auth.createUserWithEmailAndPassword(email, password);
    const uid = user.user && user.user.uid;
    const settings = generateUserSettings(email, name, location);
    firestore
      .doc(`Users/${uid}`)
      .set(settings)
      .then(() => shouldLog(`User created with uid ${uid}`));
  } catch (err) {
    shouldLog("Error creating new user: ", err);
  }
};

const resetUserPassword = () => {
  //IS IT POSSIBLE TO SEND RESET REQUEST TO OTHER USER?
};

const updateUserData = () => {
  //USE FIRESTORE TO UPDATE USER DATA
};

export const users = {
  createNewUser,
  resetUserPassword,
  updateUserData
};

//USERS END

//CLIENTS

export interface IClientData {
  Users: Array<{ email: string; role: "user" | "admin"; uid: string }>;
  firebaseConfig: any;
  lastChanged: {
    global: Date | string;
    sections: {
      categories: Date | string;
      customers: Date | string;
      loans: Date | string;
      products: Date | string;
      sales: Date | string;
      suppliers: Date | string;
    };
  };
  logoUrl: string;
  name: string;
  primaryColor: string;
}

//ADD CLIENT TO LIST IN FIRESTORE
export const createNewClient = (clientName: string, fullName: string) => {
  const creationDate = new Date();
  const clientData: IClientData = {
    Users: [],
    firebaseConfig: {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      messagingSenderId: "",
      projectId: "",
      storageBucket: ""
    },
    lastChanged: {
      global: creationDate,
      sections: {
        categories: creationDate,
        customers: creationDate,
        loans: creationDate,
        products: creationDate,
        sales: creationDate,
        suppliers: creationDate
      }
    },
    logoUrl: "",
    name: fullName,
    primaryColor: "#e3aa39"
  };
  firestore.doc(`Clients/${clientName}`).set(clientData);
};

export const updateClientData = (clientName: string, data: any) => {
  firestore.doc(`Clients/${clientName}`).set(data, { merge: true });
};

const initialClientFirestore: { [key: string]: any } = {
  Categories: {
    categories: [],
    history: [],
    currentID: 0
  },
  Customers: {
    customers: [],
    history: [],
    currentID: 0
  },
  Loans: {
    loans: [],
    history: [],
    currentID: 0
  },
  Orders: {
    orders: [],
    history: [],
    currentID: 0
  },
  Products: {
    products: [],
    history: [],
    currentID: 0
  },
  Reports: {
    byDate: {}
  },
  Sales: {
    sales: [],
    history: [],
    currentID: 0
  },
  Suppliers: {
    suppliers: [],
    history: [],
    currentID: 0
  }
};

//USE FIREBASE CONFIG TO INITIALIZE TEMPFIRESTORE
export const initializeClientFirestore = async (
  clientName: string,
  config: any
) => {
  await connectToTemp(config);
  let savedSections = 0;
  Object.keys(initialClientFirestore).forEach(async section => {
    shouldLog(
      `Initializing section ${section} with data `,
      initialClientFirestore[section]
    );
    tempFirestore
      .doc(`${clientName}/${section}`)
      .set(initialClientFirestore[section])
      .then(() => {
        shouldLog(`Saved section ${section}`);
        savedSections++;
        if (savedSections === 8) {
          disconnectFromTemp();
        }
      })
      .catch(err => shouldLog(err));
  });
};

export const clients = {
  createNewClient,
  updateClientData,
  initializeClientFirestore
};

//CLIENTS END
