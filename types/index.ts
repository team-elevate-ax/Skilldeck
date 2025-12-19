// Type definitions for SkillDeck

export interface User {
    uid: string;
    email: string | null;
    displayName?: string | null;
}


export interface ProofOfWork {
    id?: string;
    title: string;
    url: string;
}

export interface Skill {
    id?: string;
    name: string;
}

export interface Profile {
    profileId: string;
    userId: string;
    fullName: string;
    headline: string;
    bio: string;
    // Skills and Proofs are subcollections now
    username: string;
    isPublic: boolean;
    photoURL?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
        website?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface ProfileFormData {
    fullName: string;
    headline: string;
    bio: string;
    username: string;
    isPublic: boolean;
    photoURL?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
        website?: string;
    };
}
