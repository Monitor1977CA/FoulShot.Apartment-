/**
 * @file services/dbService.ts
 * @description This service provides a robust, promise-based wrapper around IndexedDB
 * for storing and retrieving large binary data like images. It replaces less reliable
 * or quota-limited storage options like localStorage, making it suitable for production applications.
 */

import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'ImageCacheDB';
const STORE_NAME = 'images';
// --- ROBUSTNESS FIX: DB Version Bump ---
// The database version has been incremented. This is a critical fix for users who might have
// an older, broken version of the database cached without the 'images' object store.
// Bumping the version forces the `upgrade` callback to run, which will correctly
// create the missing object store and repair the user's local database state.
const DB_VERSION = 2;

/**
 * Converts a base64 string into a Blob object.
 * @param {string} b64Data - The base64 encoded data (without the data URL prefix).
 * @param {string} contentType - The MIME type of the data.
 * @param {number} sliceSize - The size of chunks to process.
 * @returns {Blob} The resulting Blob object.
 */
export const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512): Blob => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

/**
 * Converts a Blob object into a base64 string, suitable for API transmission.
 * This is a more robust, promise-based alternative to manual ArrayBuffer conversion.
 * @param {Blob} blob - The Blob to convert.
 * @returns {Promise<string>} A promise that resolves with the base64 encoded data (without the data URL prefix).
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      // Ensure the result is a string before trying to split it.
      if (typeof result !== 'string') {
        reject(new Error(`FileReader result was not a string, but: ${typeof result}`));
        return;
      }
      const base64Data = result.split(',')[1];
      if (base64Data) {
        resolve(base64Data);
      } else {
        reject(new Error("Failed to extract base64 data from FileReader result. The result might be an empty data URL."));
      }
    };
    // The 'error' event's details are on the reader's 'error' property. This provides a much more
    // descriptive error message than the generic ProgressEvent object.
    reader.onerror = () => {
      const error = reader.error;
      reject(new Error(`FileReader failed to read blob: ${error?.name} - ${error?.message}`));
    };
    // Start the read operation.
    reader.readAsDataURL(blob);
  });
};


/**
 * Gets a database connection. The `idb` library handles connection pooling and reuse internally.
 * @returns {Promise<IDBPDatabase>} A promise that resolves with the database instance.
 */
const getDb = (): Promise<IDBPDatabase> => {
  if (typeof window === 'undefined') {
    // Return a mock object for server-side or build environments to prevent errors.
    return Promise.reject(new Error("IndexedDB not available in this environment."));
  }
  
  // Directly return the promise from openDB.
  // The 'idb' library handles connection reuse internally, which is more robust
  // than a manual singleton implementation.
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Create the object store for our images.
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

/**
 * A service object that encapsulates all IndexedDB operations for the image cache.
 */
export const dbService = {
  /**
   * Saves an image Blob to the database.
   * @param {string} id - The unique identifier for the image (e.g., card ID).
   * @param {Blob} blob - The image data as a Blob.
   */
  async saveImage(id: string, blob: Blob): Promise<void> {
    try {
        const db = await getDb();
        // --- DEFENSIVE CHECK ---
        // Prevents crashes if the object store somehow doesn't exist.
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          console.error(`Object store "${STORE_NAME}" does not exist. Cannot save image.`);
          return;
        }
        await db.put(STORE_NAME, blob, id);
    } catch (error) {
        console.error("Failed to save image to IndexedDB:", error);
    }
  },

  /**
   * Retrieves an image Blob from the database.
   * @param {string} id - The ID of the image to retrieve.
   * @returns {Promise<Blob | undefined>} The image Blob, or undefined if not found.
   */
  async getImage(id: string): Promise<Blob | undefined> {
    try {
        const db = await getDb();
        // --- DEFENSIVE CHECK ---
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          console.error(`Object store "${STORE_NAME}" does not exist. Cannot get image.`);
          return undefined;
        }
        return db.get(STORE_NAME, id);
    } catch (error) {
        console.error("Failed to get image from IndexedDB:", error);
        return undefined;
    }
  },

  /**
   * Retrieves all images from the database. Used for hydrating the cache on startup.
   * @returns {Promise<{ id: string, blob: Blob }[]>} An array of objects containing image IDs and their corresponding Blobs.
   */
  async getAllImages(): Promise<{ id: string, blob: Blob }[]> {
    try {
        const db = await getDb();
         // --- DEFENSIVE CHECK ---
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          console.error(`Object store "${STORE_NAME}" does not exist. Cannot get all images.`);
          return [];
        }
        const keys = await db.getAllKeys(STORE_NAME);
        const blobs = await db.getAll(STORE_NAME);
        return keys.map((key, index) => ({
        id: String(key),
        blob: blobs[index]
        }));
    } catch (error) {
        console.error("Failed to get all images from IndexedDB:", error);
        return [];
    }
  },

  /**
   * Clears the entire image cache from the database.
   */
  async clearImages(): Promise<void> {
    try {
        const db = await getDb();
         // --- DEFENSIVE CHECK ---
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          console.error(`Object store "${STORE_NAME}" does not exist. Cannot clear images.`);
          return;
        }
        await db.clear(STORE_NAME);
    } catch (error) {
        console.error("Failed to clear IndexedDB:", error);
    }
  }
};