import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import { getStorage, ref } from "@firebase/storage";

const firebaseConfig = {
    // PROJECT 2
    // IRC-herexamen
    // webapp: My React native chat application
    apiKey: "AIzaSyBb1rzlMoDIi-OEBHn3mqV-TYi5ImRtGgQ",
    authDomain: "irc-herexamen.firebaseapp.com",
    projectId: "irc-herexamen",
    storageBucket: "irc-herexamen.appspot.com",
    messagingSenderId: "294306271313",
    appId: "1:294306271313:web:77fa50d22bdfe086b3a870",
    measurementId: "G-RZTX7N11DD"

    // PROJECT 1
    // IRC-native
    // apiKey: "AIzaSyAJWJ9ZgXxlOfccALBgjCNwCgo606oxXuE", 
    // authDomain: "irc-native.firebaseapp.com",
    // projectId: "irc-native",
    // storageBucket: "irc-native.appspot.com",
    // messagingSenderId: "973093963642",
    // appId: "1:973093963642:web:419da91db93acdb83338c3"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);


export {
    auth,
    db,
    storage,
}