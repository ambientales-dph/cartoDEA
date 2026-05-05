
'use client';

import { collection, addDoc, getDoc, getDocs, query, where, orderBy, deleteDoc, doc, serverTimestamp, type Firestore } from "firebase/firestore";
import type { MapState } from "@/lib/types";

const SHARED_MAPS_COLLECTION = 'sharedMaps';
const USER_MAPS_COLLECTION = 'userMaps';

/**
 * Removes all keys with 'undefined' values from an object recursively.
 * Firestore does not support 'undefined'.
 */
function sanitizeData(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(sanitizeData);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([_, v]) => v !== undefined)
                .map(([k, v]) => [k, sanitizeData(v)])
        );
    }
    return obj;
}

/**
 * Saves the current map state to Firestore and returns the new document's ID.
 * @param db The Firestore instance.
 * @param mapState The map state object to save, including the subject.
 * @returns A promise that resolves to the new document ID, or rejects on error.
 */
export async function saveMapState(db: Firestore, mapState: MapState): Promise<string> {
    if (!db) {
        throw new Error("Firestore instance not provided to saveMapState.");
    }

    const sanitizedState = sanitizeData(mapState);

    const dataToSend = {
        ...sanitizedState,
        createdAt: serverTimestamp(),
    };

    try {
        const docRef = await addDoc(collection(db, SHARED_MAPS_COLLECTION), dataToSend);
        return docRef.id;
    } catch (serverError: any) {
        console.error("Error writing document to Firestore:", serverError);
        throw new Error(`Could not save map state: ${serverError.message}`);
    }
}

/**
 * Saves a map to the user's personal library.
 */
export async function saveUserMap(db: Firestore, userId: string, mapState: MapState): Promise<string> {
    if (!db || !userId) throw new Error("Parámetros insuficientes para guardar el mapa.");

    const sanitizedState = sanitizeData(mapState);
    const dataToSend = {
        ...sanitizedState,
        userId,
        updatedAt: serverTimestamp(),
    };

    try {
        const docRef = await addDoc(collection(db, USER_MAPS_COLLECTION), dataToSend);
        return docRef.id;
    } catch (error: any) {
        console.error("Error saving user map:", error);
        throw new Error(`Error al guardar el mapa: ${error.message}`);
    }
}

/**
 * Fetches all maps saved by a specific user.
 */
export async function getUserMaps(db: Firestore, userId: string): Promise<(MapState & { id: string })[]> {
    if (!db || !userId) return [];

    try {
        const q = query(
            collection(db, USER_MAPS_COLLECTION),
            where("userId", "==", userId),
            orderBy("updatedAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            ...(doc.data() as MapState),
            id: doc.id
        }));
    } catch (error: any) {
        console.error("Error fetching user maps:", error);
        return [];
    }
}

/**
 * Deletes a user map by ID.
 */
export async function deleteUserMap(db: Firestore, mapId: string) {
    if (!db || !mapId) return;
    try {
        await deleteDoc(doc(db, USER_MAPS_COLLECTION, mapId));
    } catch (error) {
        console.error("Error deleting user map:", error);
    }
}

/**
 * Retrieves a map state from Firestore by its ID.
 */
export async function getMapState(db: Firestore, mapId: string): Promise<MapState | null> {
    if (!db) {
        console.error("Firestore instance not available for getMapState.");
        return null;
    }
    try {
        const docRef = doc(db, SHARED_MAPS_COLLECTION, mapId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as MapState;
        } else {
            // Check in userMaps as well if not found in shared
            const userDocRef = doc(db, USER_MAPS_COLLECTION, mapId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                return userDocSnap.data() as MapState;
            }
            return null;
        }
    } catch (error) {
        console.error("Error getting map state from Firestore:", error);
        throw new Error("Could not retrieve map state.");
    }
}

/**
 * Reads a document for debugging purposes.
 */
export async function debugReadDocument(db: Firestore) {
  if (!db) {
    console.error("Firestore instance not available for debugReadDocument.");
    return;
  }
  try {
    const docRef = doc(db, 'sharedMaps', 'debug-test');
    await getDoc(docRef);
  } catch (error) {
    console.log("Debug read initiated. If a permission error is expected, this is normal.");
  }
}
