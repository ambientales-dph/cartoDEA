'use client';

import { useMemo, useEffect } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase, getFirebaseConfig } from './config';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

/**
 * A client-side component that initializes Firebase and provides it to the app.
 * This component should be used in a client-side context (i.e. in a 'use client' file).
 */
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use useMemo to initialize Firebase only once per session.
  // This part is safe to run on both server and client.
  const { firebaseApp, auth, firestore } = useMemo(() => {
    const config = getFirebaseConfig();
    const app = initializeFirebase(config);
    const authInstance = getAuth(app);
    const firestoreInstance = getFirestore(app);
    return { firebaseApp: app, auth: authInstance, firestore: firestoreInstance };
  }, []);

  // Conectar a emuladores solo si está explícitamente configurado por variable de entorno
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
      // Ensure we don't connect more than once
      if (!(auth as any)._isEmulator) {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
          disableWarnings: true,
        });
      }
      if (!(firestore as any)._isEmulator) {
        connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
      }
    }
  }, [auth, firestore]); // Depend on auth and firestore instances

  return (
    <FirebaseProvider firebaseApp={firebaseApp}>
      {children}
      <FirebaseErrorListener />
    </FirebaseProvider>
  );
}
