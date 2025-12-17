// Type definitions for SkillDeck

export interface User {
    uid: string;
    email: string | null;
    displayName?: string | null;
}

export interface ProofOfWork {
    title: string;
    url: string;
}

export interface Profile {
    profileId: string;
    userId: string;
    fullName: string;
    headline: string;
    bio: string;
    skills: string[];
    proofOfWork: ProofOfWork[];
    username: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProfileFormData {
    fullName: string;
    headline: string;
    bio: string;
    skills: string[];
    proofOfWork: ProofOfWork[];
    username: string;
    isPublic: boolean;
}
