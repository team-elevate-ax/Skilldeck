'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPublicProfiles } from '@/lib/profiles';
import { Profile, Skill } from '@/types';

export default function BrowseProfiles() {
    const [profiles, setProfiles] = useState<{ profile: Profile, skills: Skill[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchProfiles() {
            try {
                const data = await getPublicProfiles();
                setProfiles(data);
            } catch (error) {
                console.error("Failed to fetch profiles", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfiles();
    }, []);

    const filteredProfiles = profiles.filter(({ profile, skills }) => {
        const term = searchTerm.toLowerCase();
        const nameMatch = profile.fullName.toLowerCase().includes(term);
        const headlineMatch = profile.headline?.toLowerCase().includes(term);
        const skillMatch = skills.some(skill => skill.name.toLowerCase().includes(term));

        return nameMatch || headlineMatch || skillMatch;
    });

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                        Browse Professionals
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover talented professionals and their showcased skills. Search through a diverse range of public profiles on SkillDeck.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-16 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                        placeholder="Search by name, skill, or role..."
                    />
                </div>

                {/* Profiles Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <p className="mt-2 text-gray-500">Loading profiles...</p>
                    </div>
                ) : (
                    <>
                        {filteredProfiles.length === 0 ? (
                            <div className="text-center text-gray-500 py-12">
                                No profiles found matching your search.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {filteredProfiles.map(({ profile, skills }) => (
                                    <div key={profile.profileId} className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center">
                                        <div className="w-20 h-20 rounded-full bg-blue-100 mb-4 overflow-hidden relative flex items-center justify-center border border-gray-100">
                                            {profile.photoURL ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={profile.photoURL} alt={profile.fullName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                                                    {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : '?'}
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate w-full">{profile.fullName}</h3>
                                        <p className="text-xs text-gray-500 h-10 overflow-hidden mb-4 px-2 w-full line-clamp-2">
                                            {profile.headline}
                                        </p>

                                        <div className="flex flex-wrap gap-2 justify-center mb-6 h-12 overflow-hidden">
                                            {skills.slice(0, 3).map(skill => (
                                                <span key={skill.id} className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] uppercase font-medium rounded-md border border-gray-100">
                                                    {skill.name}
                                                </span>
                                            ))}
                                            {skills.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] rounded-md border border-gray-100">
                                                    +{skills.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        <Link
                                            href={`/profile/${profile.username}`}
                                            className="w-full mt-auto block px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
