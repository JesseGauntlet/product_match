import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

if (!getApps().length) {
  // Check if GOOGLE_APPLICATION_CREDENTIALS environment variable exists
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      // Initialize using the credentials file path
      initializeApp({
        credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
      });
    } catch (error) {
      console.error('Error initializing Firebase with credentials file:', error);
      throw error;
    }
  } else if (process.env.FIREBASE_PROJECT_ID && 
             process.env.FIREBASE_CLIENT_EMAIL && 
             process.env.FIREBASE_PRIVATE_KEY) {
    // Fall back to using individual credential parts if provided
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    throw new Error('Firebase credentials not provided. Set either GOOGLE_APPLICATION_CREDENTIALS or the individual Firebase credential environment variables.');
  }
}

const firestore = getFirestore();
export default firestore;
