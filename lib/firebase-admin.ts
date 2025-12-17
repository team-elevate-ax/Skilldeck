import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccountJson from '@/service-account.json';

const serviceAccount = serviceAccountJson as ServiceAccount;

function formatPrivateKey(key: string) {
    return key.replace(/\\n/g, '\n');
}

if (serviceAccount.privateKey) {
    serviceAccount.privateKey = formatPrivateKey(serviceAccount.privateKey);
}

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
