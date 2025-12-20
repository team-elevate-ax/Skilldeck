'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProfileByUserId } from '@/lib/profiles';
import { Profile } from '@/types';

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
    const [profile, setProfile] = useState<Profile | null>(null);
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
                    setProfile(data);
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
        if (!profile) return;
        const url = typeof window !== 'undefined' ? `${window.location.origin}/profile/${profile.username}` : `/profile/${profile.username}`;
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

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h1>
                    <p className="text-gray-600 mb-6">You haven&apos;t set up your profile yet.</p>
                    <Link href="/profile/setup" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                        Setup Profile
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 relative overflow-hidden border-2 border-white shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=random`} alt={profile.fullName} className="w-full h-full object-cover" />
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
                        {profile.skills && profile.skills.length > 0 ? profile.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                {skill}
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
                        {profile.proofOfWork && profile.proofOfWork.length > 0 ? profile.proofOfWork.map((proof, index) => (
                            <a
                                key={index}
                                href={proof.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group"
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

            </div>
        </div>
    );
}
