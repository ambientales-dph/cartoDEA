'use client';

import { collection, addDoc, getDoc, doc, serverTimestamp, type Firestore } from "firebase/firestore";
import type { MapState } from "@/lib/types";

const SHARED_MAPS_COLLECTION = 'sharedMaps';

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

    // Sanitize data to remove any 'undefined' values which Firestore rejects
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
 * Retrieves a map state from Firestore by its ID.
 * @param db The Firestore instance.
 * @param mapId The ID of the document to retrieve.
 * @returns A promise that resolves to the MapState object or null if not found.
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
            console.log("No such map state document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting map state from Firestore:", error);
        throw new Error("Could not retrieve map state.");
    }
}

/**
 * Reads a document for debugging purposes.
 * @param db The Firestore instance.
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
