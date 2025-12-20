import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
// Firebase Admin initialized via environment variables for security and cloud deployment
const serviceAccount: ServiceAccount = {
    projectId: (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) as string,
    clientEmail: (process.env.FIREBASE_CLIENT_EMAIL) as string,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')) as string,
};

export function initAdmin() {
    if (getApps().length === 0) {
        initializeApp({
            credential: cert(serviceAccount),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
    }
}

export const adminAuth = () => {
    initAdmin();
    return getAuth();
};

export const adminDb = () => {
    initAdmin();
    return getFirestore();
};
