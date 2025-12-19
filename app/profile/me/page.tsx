'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProfileByUserId } from '@/lib/profiles';
import { Profile, Skill, ProofOfWork } from '@/types';

// Fallback for non-secure contexts (http via IP) where navigator.clipboard is unavailable
function copyToClipboardFallback(text: string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert('URL copied to clipboard!');
        } else {
            alert('Unable to copy. Please copy manually: ' + text);
        }
    } catch (err) {
        alert('Unable to copy. Please copy manually: ' + text);
    }
    document.body.removeChild(textArea);
}

export default function MyProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [profileData, setProfileData] = useState<{ profile: Profile, skills: Skill[], proofs: ProofOfWork[] } | null>(null);
    const [fetching, setFetching] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        async function loadProfile() {
            if (user?.uid) {
                try {
                    const data = await getProfileByUserId(user.uid);
                    setProfileData(data);
                } catch (error) {
                    console.error('Error fetching profile:', error);
                } finally {
                    setFetching(false);
                }
            }
        }

        if (user) {
            loadProfile();
        }
    }, [user]);

    const handleCopy = () => {
        if (!profileData) return; // Ensure profileData is available
        const url = typeof window !== 'undefined' ? `${window.location.origin}/profile/${profileData.profile.username}` : `/profile/${profileData.profile.username}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch(() => {
                copyToClipboardFallback(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        } else {
            copyToClipboardFallback(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading || (fetching && user)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-500">Loading profile...</div>
            </div>
        );
    }

    if (!user) return null;

    if (!profileData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h1>
                    <p className="text-gray-600 mb-6">You haven't set up your profile yet.</p>
                    <Link href="/profile/setup" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                        Setup Profile
                    </Link>
                </div>
            </div>
        );
    }

    const { profile, skills, proofs } = profileData;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 relative overflow-hidden border-2 border-white shadow-sm">
                        {profile.photoURL ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={profile.photoURL} alt={profile.fullName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-blue-600 text-3xl font-bold">{profile.fullName ? profile.fullName.charAt(0).toUpperCase() : '?'}</div>
                        )}
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.fullName}</h1>
                    <p className="text-lg text-gray-600 font-medium mb-6">
                        {profile.headline}
                    </p>

                    <Link
                        href="/profile/setup"
                        className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Edit Profile
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-sm font-semibold text-gray-900 mb-2">Public Profile URL</h2>
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md border border-gray-200">
                        <svg className="w-5 h-5 text-gray-400 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                        <span className="flex-grow text-sm text-gray-600 truncate">{typeof window !== 'undefined' ? `${window.location.origin}/profile/${profile.username}` : `/profile/${profile.username}`}</span>
                        <button
                            onClick={handleCopy}
                            className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-200 uppercase tracking-wide border ${copied
                                ? 'bg-green-50 border-green-200 text-green-600'
                                : 'bg-white border-gray-300 text-blue-600 hover:bg-gray-50'
                                }`}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 italic">This section is only visible to you.</p>
                </div>

                {/* About Me */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">About Me</h2>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {profile.bio || 'No bio provided.'}
                    </p>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Skills</h2>
                    <div className="flex flex-wrap gap-3">
                        {skills && skills.length > 0 ? skills.map((skill) => (
                            <span key={skill.id} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                {skill.name}
                            </span>
                        )) : (
                            <span className="text-gray-500 text-sm italic">No skills listed.</span>
                        )}
                    </div>
                </div>

                {/* Proof of Work */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Proof of Work</h2>
                    <div className="space-y-4">
                        {proofs && proofs.length > 0 ? proofs.map((proof) => (
                            <a
                                key={proof.id}
                                href={proof.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                        {proof.title}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400 font-medium truncate max-w-[150px]">
                                    {proof.url}
                                </span>
                            </a>
                        )) : (
                            <span className="text-gray-500 text-sm italic">No proof of work listed.</span>
                        )}
                    </div>
                </div>

                {/* Connect Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Connect</h2>
                    <div className="flex flex-wrap gap-6">
                        {profile.socialLinks?.linkedin && (
                            <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-blue-700 transition-colors">
                                <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                LinkedIn
                            </a>
                        )}
                        {profile.socialLinks?.twitter && (
                            <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-blue-400 transition-colors">
                                <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                Twitter
                            </a>
                        )}
                        {profile.socialLinks?.github && (
                            <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                                <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                GitHub
                            </a>
                        )}
                        {profile.socialLinks?.website && (
                            <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-blue-500 transition-colors">
                                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-8.955 3-12a9 9 0 010 12z" /></svg>
                                Website
                            </a>
                        )}
                        {!profile.socialLinks?.linkedin && !profile.socialLinks?.twitter && !profile.socialLinks?.github && !profile.socialLinks?.website && (
                            <span className="text-gray-500 text-sm italic">No social links provided.</span>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
