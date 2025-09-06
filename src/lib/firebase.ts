
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Create a more robust mock Firestore instance that mimics the real Firebase API
const createMockFirestore = () => {
  const mockCollection = (path: string) => {
    const collectionRef = {
      id: path,
      path: path,
      parent: null,
      type: 'collection',
      doc: (docId: string) => ({
        id: docId,
        path: `${path}/${docId}`,
        parent: collectionRef,
        type: 'document',
        get: async () => ({ exists: false, data: () => ({}), id: docId }),
        set: async () => {},
        update: async () => {},
        delete: async () => {}
      }),
      add: async (data: any) => ({ id: 'mock-id', data: () => data }),
      get: async () => ({ docs: [], empty: true, size: 0 }),
      onSnapshot: () => () => {}
    };
    return collectionRef;
  };

  const mockDoc = (path: string) => ({
    id: path.split('/').pop() || 'mock-doc',
    path: path,
    parent: null,
    type: 'document',
    get: async () => ({ exists: false, data: () => ({}), id: path.split('/').pop() }),
    set: async () => {},
    update: async () => {},
    delete: async () => {}
  });

  const mockFirestoreInstance: any = {
    app: { name: 'mock-app' },
    type: 'firestore',
    collection: mockCollection,
    doc: mockDoc,
    enableNetwork: async () => {},
    disableNetwork: async () => {},
    clearPersistence: async () => {},
    enablePersistence: async () => {},
    terminate: async () => {},
    waitForPendingWrites: async () => {}
  };

  return mockFirestoreInstance;
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:demo"
};

// Initialize Firebase only when needed
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

const initializeFirebase = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      // Only initialize if we have valid config (not demo values)
      const hasValidConfig = firebaseConfig.apiKey && 
                            firebaseConfig.apiKey !== 'demo-api-key' &&
                            firebaseConfig.projectId && 
                            firebaseConfig.projectId !== 'demo-project';
      
      if (hasValidConfig) {
        // Client-side initialization
        if (!getApps().length) {
          app = initializeApp(firebaseConfig);
        } else {
          app = getApps()[0];
        }
        
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
        console.log('Firebase initialized successfully with real credentials');
      } else {
        // Use mock objects if no valid config
        console.warn('Firebase not configured. Using mock objects. Please set up your Firebase credentials in .env.local');
        app = { name: 'mock-app', options: {}, config: firebaseConfig };
        auth = {
          currentUser: null,
          onAuthStateChanged: () => () => {},
          signOut: async () => {},
          signInWithEmailAndPassword: async () => ({ user: null }),
          createUserWithEmailAndPassword: async () => ({ user: null })
        };
        db = createMockFirestore();
        storage = {
          ref: (path: string) => ({
            put: async (file: any) => ({ ref: { getDownloadURL: async () => 'mock-url' } }),
            getDownloadURL: async () => 'mock-url'
          })
        };
      }
    } catch (error) {
      console.error('Firebase initialization error:', error);
      // Provide fallback objects
      app = { name: 'mock-app', options: {}, config: firebaseConfig };
      auth = {
        currentUser: null,
        onAuthStateChanged: () => () => {},
        signOut: async () => {},
        signInWithEmailAndPassword: async () => ({ user: null }),
        createUserWithEmailAndPassword: async () => ({ user: null })
      };
      db = createMockFirestore();
      storage = {
        ref: (path: string) => ({
          put: async (file: any) => ({ ref: { getDownloadURL: async () => 'mock-url' } }),
          getDownloadURL: async () => 'mock-url'
        })
      };
    }
  } else {
    // Server-side: provide mock objects that won't cause build errors
    app = {
      name: 'mock-app',
      options: {},
      config: firebaseConfig
    };
    auth = {
      currentUser: null,
      onAuthStateChanged: () => () => {},
      signOut: async () => {},
      signInWithEmailAndPassword: async () => ({ user: null }),
      createUserWithEmailAndPassword: async () => ({ user: null })
    };
    db = createMockFirestore();
    storage = {
      ref: (path: string) => ({
        put: async (file: any) => ({ ref: { getDownloadURL: async () => 'mock-url' } }),
        getDownloadURL: async () => 'mock-url'
      })
    };
  }
};

// Initialize Firebase immediately for client-side, lazily for server-side
if (typeof window !== 'undefined') {
  initializeFirebase();
} else {
  // For server-side, initialize with mock objects
  app = {
    name: 'mock-app',
    options: {},
    config: firebaseConfig
  };
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    signOut: async () => {},
    signInWithEmailAndPassword: async () => ({ user: null }),
    createUserWithEmailAndPassword: async () => ({ user: null })
  };
  db = createMockFirestore();
  storage = {
    ref: (path: string) => ({
      put: async (file: any) => ({ ref: { getDownloadURL: async () => 'mock-url' } }),
      getDownloadURL: async () => 'mock-url'
    })
  };
}

// Create wrapper functions that work with both real and mock Firebase
const safeCollection = (firestore: any, path: string) => {
  // Check if we have a real Firestore instance
  if (firestore && firestore.type === 'firestore' && typeof firestore.collection === 'function') {
    return firestore.collection(path);
  }
  // Check if we have a real Firebase Firestore instance (different structure)
  if (firestore && firestore._delegate && typeof firestore.collection === 'function') {
    return firestore.collection(path);
  }
  // Fallback to mock collection
  return createMockFirestore().collection(path);
};

const safeDoc = (firestore: any, path: string) => {
  // Check if we have a real Firestore instance
  if (firestore && firestore.type === 'firestore' && typeof firestore.doc === 'function') {
    return firestore.doc(path);
  }
  // Check if we have a real Firebase Firestore instance (different structure)
  if (firestore && firestore._delegate && typeof firestore.doc === 'function') {
    return firestore.doc(path);
  }
  // Fallback to mock doc
  return createMockFirestore().doc(path);
};

export { app, auth, db, storage, safeCollection, safeDoc };
