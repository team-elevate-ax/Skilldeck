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
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
                        SkillDeck
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        <Link href="/browse" className="text-gray-700 hover:text-blue-600 transition">
                            Browse Profiles
                        </Link>

                        {!loading && (
                            <>
                                {user ? (
                                    <>
                                        <Link href="/profile/me" className="text-gray-700 hover:text-blue-600 transition">
                                            My Profile
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                        >
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
