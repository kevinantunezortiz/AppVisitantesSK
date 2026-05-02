import { initializeApp } from "firebase/app";
import { 
    initializeFirestore, 
    persistentLocalCache, 
    persistentMultipleTabManager 
} from "firebase/firestore";

const firebaseConfig = {
	apiKey: 'AIzaSyDfHasUn9olSiAe59At2XcZFnyYMvGJm2U',
	authDomain: 'appvisitantes-c3b62.firebaseapp.com',
	projectId: 'appvisitantes-c3b62',
	storageBucket: 'appvisitantes-c3b62.firebasestorage.app',
	messagingSenderId: '924367990190',
	appId: '1:924367990190:web:48d333388355359e5cac3f'
};
const app = initializeApp(firebaseConfig);

// Esta es la forma moderna que elimina el warning y mejora el soporte offline
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export { db };

