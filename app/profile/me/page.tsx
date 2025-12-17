'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProfileByUserId } from '@/lib/profiles';
import { Profile } from '@/types';

export default function MyProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [fetching, setFetching] = useState(true);

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

    if (loading || (fetching && user)) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            My Profile
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Manage your public profile information.
                        </p>
                    </div>
                    <button
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        onClick={() => alert('Edit feature coming next!')}
                    >
                        Edit Profile
                    </button>
                </div>

                {profile ? (
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.fullName}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Username</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">@{profile.username}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Bio</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.bio || 'No bio yet'}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${profile.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {profile.isPublic ? 'Public' : 'Private'}
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        Profile not found.
                    </div>
                )}
            </div>
        </div>
    );
}
