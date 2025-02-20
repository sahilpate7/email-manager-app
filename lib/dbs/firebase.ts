import { initializeApp } from 'firebase/app';
import {deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc} from 'firebase/firestore';
import { SessionProps, UserData } from '@types';

// Firebase config and initialization
// Prod applications might use config file
const { FIRE_API_KEY, FIRE_DOMAIN, FIRE_PROJECT_ID } = process.env;
const firebaseConfig = {
    apiKey: FIRE_API_KEY,
    authDomain: FIRE_DOMAIN,
    projectId: FIRE_PROJECT_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore data management functions

// Use setUser for storing global user data (persists between installs)
export async function setUser({ user }: SessionProps) {
    if (!user) return null;

    const { email, id, username } = user;
    const ref = doc(db, 'users', String(id));
    const data: UserData = { email };

    if (username) {
        data.username = username;
    }

    await setDoc(ref, data, { merge: true });
}

export async function setStore(session: SessionProps) {
    const {
        access_token: accessToken,
        context,
        scope,
        user: { id },
    } = session;
    // Only set on app install or update
    if (!accessToken || !scope) return null;

    const storeHash = context?.split('/')[1] || '';
    const ref = doc(db, 'store', storeHash);
    const data = { accessToken, adminId: id, scope };

    await setDoc(ref, data);
}

export async function setInitialAdminSettingsFields(session: SessionProps) {
    const { context, access_token: accessToken, scope } = session;

    // Only set on app install or update
    if (!accessToken || !scope) return null;

    const storeHash = context?.split('/')[1] || '';

    const docSnap = await getDoc(doc(db, 'store', storeHash, 'settings','adminSettings'));
    if (docSnap.exists()) {
        // console.log("Admin settings already exist. Skipping initialization.");
        return;
    }

    const ref = doc(db, 'store', storeHash,'settings','adminSettings');
    const data = {
        adminEmail: "",
        mailHost: "",
        mailUser: "",
        mailPass: "",
        mailPort: "",
    };

    await setDoc(ref, data);
}

export async function setInitialTemplateFields(session: SessionProps) {
    const { context, access_token: accessToken, scope } = session;

    // Only set on app install or update
    if (!accessToken || !scope) return null;

    const storeHash = context?.split('/')[1] || '';
    const html = "<!DOCTYPE html>\n" +
        "<html lang=\"en\">\n" +
        "  <head>\n" +
        "    <meta charset=\"UTF-8\">\n" +
        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
        "    <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">\n" +
        "    <title>HTML 5 Boilerplate</title>\n" +
        "    <link rel=\"stylesheet\" href=\"style.css\">\n" +
        "  </head>\n" +
        "  <body>\n" +
        "    <script src=\"index.js\"></script>\n" +
        "  </body>\n" +
        "</html>"

    const templates = ["newCustomer","newOrder"];
    for (const template of templates) {
        const ref = doc(db, 'store', storeHash, 'emailTemplate', template);

        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            // console.log(`Template ${template} already exists. Skipping initialization.`);
            continue;
        }

        const data = { html }; // Ensure `html` is defined somewhere
        await setDoc(ref, data);
        // console.log(`Template ${template} initialized.`);
    }
}

// User management for multi-user apps
// Use setStoreUser for storing store specific variables
export async function setStoreUser(session: SessionProps) {
    const {
        access_token: accessToken,
        context,
        owner,
        sub,
        user: { id: userId },
    } = session;
    if (!userId) return null;

    const contextString = context ?? sub;
    const storeHash = contextString?.split('/')[1] || '';
    const documentId = `${userId}_${storeHash}`; // users can belong to multiple stores
    const ref = doc(db, 'storeUsers', documentId);
    const storeUser = await getDoc(ref);

    // Set admin (store owner) if installing/ updating the app
    // https://developer.bigcommerce.com/api-docs/apps/guide/users
    if (accessToken) {
        // Create a new admin user if none exists
        if (!storeUser.exists()) {
            await setDoc(ref, { storeHash, isAdmin: true });
        } else if (!storeUser.data()?.isAdmin) {
            await updateDoc(ref, { isAdmin: true });
        }
    } else {
        // Create a new user if it doesn't exist
        if (!storeUser.exists()) {
            await setDoc(ref, { storeHash, isAdmin: owner.id === userId }); // isAdmin true if owner == user
        }
    }
}

export async function deleteUser({ context, user, sub }: SessionProps) {
    const contextString = context ?? sub;
    const storeHash = contextString?.split('/')[1] || '';
    const docId = `${user?.id}_${storeHash}`;
    const ref = doc(db, 'storeUsers', docId);

    await deleteDoc(ref);
}

export async function hasStoreUser(storeHash: string, userId: string) {
    if (!storeHash || !userId) return false;

    const docId = `${userId}_${storeHash}`;
    const userDoc = await getDoc(doc(db, 'storeUsers', docId));

    return userDoc.exists();
}

export async function getStoreToken(storeHash: string) {
    if (!storeHash) return null;
    const storeDoc = await getDoc(doc(db, 'store', storeHash));

    return storeDoc.data()?.accessToken ?? null;
}

export async function deleteStore({ store_hash: storeHash }: SessionProps) {
    const ref = doc(db, 'store', storeHash);

    await deleteDoc(ref);
}

export async function setTemplate(storeHash:string,template:string,html:string) {
    
    if (!html || !template) return false;

    const ref = doc(db, 'store', storeHash,'emailTemplate',template);
    const data = { html };
    await setDoc(ref, data);
    
    return true;
}

export async function getTemplate(storeHash: string,template:string) {
    if (!storeHash || !template) return false;
    const storeDoc = await getDoc(doc(db, 'store', storeHash, 'emailTemplate',template));

    return storeDoc.data()?.html ?? false;
}

export async function setAdminSettings(storeHash:string,settings:object) {

    if (!settings) return false;

    const ref = doc(db, 'store', storeHash,'settings','adminSettings');
    const data = settings;
    await setDoc(ref, data);

    return true;
}

export async function getAdminSettings(storeHash: string) {
    if (!storeHash) return false;
    const storeDoc = await getDoc(doc(db, 'store', storeHash, 'settings','adminSettings'));

    return storeDoc.data() ?? false;
}

