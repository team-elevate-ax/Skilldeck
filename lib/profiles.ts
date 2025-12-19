import { db } from '@/lib/firebase';
import {
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    where,
    updateDoc,
    addDoc,
    deleteDoc,
    serverTimestamp,
    Timestamp,
    or,
    and
} from 'firebase/firestore';
import { Profile, ProfileFormData, Skill, ProofOfWork } from '@/types';

const PROFILES_COLLECTION = 'profiles';
const SKILLS_COLLECTION = 'skills';
const PROOFS_COLLECTION = 'proofs';

// --- Profile Operations ---

export async function createProfile(userId: string, data: ProfileFormData): Promise<void> {
    const profileRef = doc(collection(db!, PROFILES_COLLECTION));
    // Use the doc ID as the profileId
    const newProfile: Profile = {
        profileId: profileRef.id,
        userId,
        ...data,
        createdAt: (serverTimestamp() as unknown) as Date,
        updatedAt: (serverTimestamp() as unknown) as Date,
    };

    await setDoc(profileRef, newProfile);
}

export async function getProfileByUserId(userId: string): Promise<{ profile: Profile, skills: Skill[], proofs: ProofOfWork[] } | null> {
    const q = query(
        collection(db!, PROFILES_COLLECTION),
        where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const docSnap = querySnapshot.docs[0];
    const profileData = convertTimestamps(docSnap.data() as Profile);
    const profileId = docSnap.id;

    // Fetch Subcollections
    const skills = await getSkills(profileId);
    const proofs = await getProofs(profileId);

    return { profile: profileData, skills, proofs };
}

export async function updateProfile(profileId: string, data: Partial<ProfileFormData>): Promise<void> {
    const profileRef = doc(db!, PROFILES_COLLECTION, profileId);

    await updateDoc(profileRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

// --- Subcollection Operations: Skills ---

export async function addSkill(profileId: string, skillName: string): Promise<string> {
    const skillsRef = collection(db!, PROFILES_COLLECTION, profileId, SKILLS_COLLECTION);
    const docRef = await addDoc(skillsRef, { name: skillName, createdAt: serverTimestamp() });
    return docRef.id;
}

export async function removeSkill(profileId: string, skillId: string): Promise<void> {
    const skillRef = doc(db!, PROFILES_COLLECTION, profileId, SKILLS_COLLECTION, skillId);
    await deleteDoc(skillRef);
}

export async function getSkills(profileId: string): Promise<Skill[]> {
    const skillsRef = collection(db!, PROFILES_COLLECTION, profileId, SKILLS_COLLECTION);
    const snapshot = await getDocs(skillsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));
}


// --- Subcollection Operations: Proofs ---

export async function addProof(profileId: string, proof: { title: string, url: string }): Promise<string> {
    const proofsRef = collection(db!, PROFILES_COLLECTION, profileId, PROOFS_COLLECTION);
    const docRef = await addDoc(proofsRef, { ...proof, createdAt: serverTimestamp() });
    return docRef.id;
}

export async function removeProof(profileId: string, proofId: string): Promise<void> {
    const proofRef = doc(db!, PROFILES_COLLECTION, profileId, PROOFS_COLLECTION, proofId);
    await deleteDoc(proofRef);
}

export async function updateProof(profileId: string, proofId: string, data: Partial<{ title: string, url: string }>): Promise<void> {
    const proofRef = doc(db!, PROFILES_COLLECTION, profileId, PROOFS_COLLECTION, proofId);
    await updateDoc(proofRef, data);
}

export async function getProofs(profileId: string): Promise<ProofOfWork[]> {
    const proofsRef = collection(db!, PROFILES_COLLECTION, profileId, PROOFS_COLLECTION);
    const snapshot = await getDocs(proofsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProofOfWork));
}


// ---
export async function getProfileByUsername(username: string, currentUserId?: string): Promise<{ profile: Profile, skills: Skill[], proofs: ProofOfWork[] } | null> {
    let q;
    if (currentUserId) {
        q = query(
            collection(db!, PROFILES_COLLECTION),
            and(
                where('username', '==', username),
                or(where('isPublic', '==', true), where('userId', '==', currentUserId))
            )
        );
    } else {
        q = query(
            collection(db!, PROFILES_COLLECTION),
            where('username', '==', username),
            where('isPublic', '==', true)
        );
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const docSnap = querySnapshot.docs[0];
    const profileData = convertTimestamps(docSnap.data() as Profile);
    const profileId = docSnap.id;

    // Fetch Subcollections
    const skills = await getSkills(profileId);
    const proofs = await getProofs(profileId);

    return { profile: profileData, skills, proofs };
}

export async function getPublicProfiles(): Promise<{ profile: Profile, skills: Skill[] }[]> {
    const q = query(
        collection(db!, PROFILES_COLLECTION),
        where('isPublic', '==', true)
    );

    const querySnapshot = await getDocs(q);

    // Fetch skills for each profile (needed for the card display)
    // Using Promise.all for parallel fetching
    const results = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
        const profileData = convertTimestamps(docSnap.data() as Profile);
        const skills = await getSkills(docSnap.id);
        return { profile: profileData, skills };
    }));

    return results;
}

// --- Helpers ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertTimestamps(data: any): Profile {
    return {
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
    };
}
