'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            if (auth) {
                await signOut(auth);
                router.push('/');
            }
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <nav className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-blue-600 tracking-tight">SkillDeck</span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/profiles" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                Browse Profiles
                            </Link>
                        </div>
                    </div>


                    <div className="flex items-center gap-4">
                        {!loading && (
                            <>
                                {user ? (
                                    <>
                                        <Link href="/profile/me" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                            My Profile
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/auth"
                                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/auth?mode=signup"
                                            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
