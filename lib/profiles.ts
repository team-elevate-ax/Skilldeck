import { db } from '@/lib/firebase';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { Profile, ProfileFormData } from '@/types';

const PROFILES_COLLECTION = 'profiles';

export async function createProfile(userId: string, data: ProfileFormData): Promise<void> {
    const profileRef = doc(collection(db!, PROFILES_COLLECTION));

    const newProfile: Profile = {
        profileId: profileRef.id,
        userId,
        ...data,
        createdAt: (serverTimestamp() as unknown) as Date,
        updatedAt: (serverTimestamp() as unknown) as Date,
    };

    await setDoc(profileRef, newProfile);
}

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
    const q = query(
        collection(db!, PROFILES_COLLECTION),
        where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    // Return the first matching profile (should be unique per user)
    const docSnap = querySnapshot.docs[0];
    return convertTimestamps(docSnap.data() as Profile);
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
    const q = query(
        collection(db!, PROFILES_COLLECTION),
        where('username', '==', username)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const docSnap = querySnapshot.docs[0];
    return convertTimestamps(docSnap.data() as Profile);
}

export async function updateProfile(profileId: string, data: Partial<ProfileFormData>): Promise<void> {
    const profileRef = doc(db!, PROFILES_COLLECTION, profileId);

    await updateDoc(profileRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export async function getPublicProfiles(): Promise<Profile[]> {
    const q = query(
        collection(db!, PROFILES_COLLECTION),
        where('isPublic', '==', true)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => convertTimestamps(doc.data() as Profile));
}

// Helper to convert Firestore Timestamps to Dates
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertTimestamps(data: any): Profile {
    return {
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
    };
}
