'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { getProfileByUserId, createProfile, updateProfile, addSkill, removeSkill, addProof, removeProof, updateProof } from '@/lib/profiles';
import { useRouter } from 'next/navigation';
import { Skill, ProofOfWork } from '@/types';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function ProfileSetup() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profileId, setProfileId] = useState<string | null>(null);

    // Form fields
    const [fullName, setFullName] = useState('');
    const [headline, setHeadline] = useState('');
    const [bio, setBio] = useState('');
    const [username, setUsername] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [photoURL, setPhotoURL] = useState('');

    // Social Links
    const [linkedin, setLinkedin] = useState('');
    const [twitter, setTwitter] = useState('');
    const [github, setGithub] = useState('');
    const [website, setWebsite] = useState('');

    // Subcollections Local State (synced with DB)
    const [skills, setSkills] = useState<Skill[]>([]);
    const [proofs, setProofs] = useState<ProofOfWork[]>([]);

    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth');
            return;
        }

        async function loadProfile() {
            if (user?.uid) {
                try {
                    const data = await getProfileByUserId(user.uid);
                    if (data) {
                        setProfileId(data.profile.profileId);
                        setFullName(data.profile.fullName);
                        setHeadline(data.profile.headline);
                        setBio(data.profile.bio);
                        setUsername(data.profile.username);
                        setIsPublic(data.profile.isPublic);
                        setPhotoURL(data.profile.photoURL || '');
                        if (data.profile.socialLinks) {
                            setLinkedin(data.profile.socialLinks.linkedin || '');
                            setTwitter(data.profile.socialLinks.twitter || '');
                            setGithub(data.profile.socialLinks.github || '');
                            setWebsite(data.profile.socialLinks.website || '');
                        }

                        // Load subcollections
                        // The getProfileByUserId helper already fetches these, but type might need adjustment
                        setSkills(data.skills);
                        setProofs(data.proofs);
                    } else {
                        // Initialize defaults or keep empty
                        setFullName(user.displayName || '');
                    }
                } catch (error) {
                    console.error("Failed to load profile", error);
                } finally {
                    setLoadingData(false);
                }
            }
        }

        if (user) {
            loadProfile();
        }
    }, [user, loading, router]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setPhotoURL(url);
        } catch (error) {
            console.error(error);
            alert("Image upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };


    const handleSaveProfile = async () => {
        if (!user) return;

        // Validation
        if (!fullName.trim() || !headline.trim() || !bio.trim() || !username.trim()) {
            alert("Please fill in all mandatory fields (Full Name, Headline, Bio, Username).");
            return;
        }

        setSaving(true);
        try {
            const profileData = {
                fullName,
                headline,
                bio,
                username: username || user.email?.split('@')[0] || 'user',
                isPublic,
                photoURL,
                socialLinks: {
                    linkedin,
                    twitter,
                    github,
                    website
                }
            };

            if (profileId) {
                await updateProfile(profileId, profileData);
            } else {
                await createProfile(user.uid, profileData);
                // After creating, fetch again to get the ID so we can add skills/proofs
                const data = await getProfileByUserId(user.uid);
                if (data) setProfileId(data.profile.profileId);
            }
            router.push('/profile/me');
        } catch (error) {
            console.error(error);
            alert('Failed to save profile.');
        } finally {
            setSaving(false);
        }
    };

    // Skills Operations
    const handleAddSkill = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            e.preventDefault();
            if (!profileId) {
                alert("Please save your profile details first before adding skills.");
                return;
            }
            try {
                const id = await addSkill(profileId, newSkill.trim());
                setSkills([...skills, { id, name: newSkill.trim() }]);
                setNewSkill('');
            } catch (error) {
                console.error("Failed to add skill", error);
            }
        }
    };

    const handleRemoveSkill = async (skillId: string) => {
        if (!profileId) return;
        try {
            await removeSkill(profileId, skillId);
            setSkills(skills.filter(s => s.id !== skillId));
        } catch (error) {
            console.error("Failed to remove skill", error);
        }
    };

    // Proofs Operations
    const handleAddProofStub = async () => {
        if (!profileId) {
            // If profile not saved, maybe save it automatically? For now, alert
            alert("Please save your profile first.");
            return;
        }
        try {
            // Create empty placeholder in DB
            const id = await addProof(profileId, { title: '', url: '' });
            setProofs([...proofs, { id, title: '', url: '' }]);
        } catch (error) {
            console.error("Failed to add proof", error);
        }
    };

    const handleUpdateProof = async (id: string, field: 'title' | 'url', value: string) => {
        // Optimistic update local
        const updatedProofs = proofs.map(p => p.id === id ? { ...p, [field]: value } : p);
        setProofs(updatedProofs);

        // Debounce actual save in real app, here we might wait for save button or just save on blur
        // For simplicity, let's auto-save on change (could be spammy) or rely on a "Save" button for individual proofs?
        // The previous design had inputs. Let's stick to updating state and having a specific behavior or effect.
        if (profileId) {
            // Real-time update might be too much for firestore writes. 
            // Ideally we update local state, then have a "Blur" event to save.
            // Im implementing onBlur for the inputs below.
        }
    };

    const saveProofOnBlur = async (id: string) => {
        if (!profileId) return;
        const proof = proofs.find(p => p.id === id);
        if (proof) {
            await updateProof(profileId, id, { title: proof.title, url: proof.url });
        }
    };

    const handleRemoveProof = async (id: string) => {
        if (!profileId) return;
        try {
            await removeProof(profileId, id);
            setProofs(proofs.filter(p => p.id !== id));
        } catch (error) {
            console.error("Failed to remove proof", error);
        }
    };

    if (loadingData) return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column: Edit Form */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                            <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Your Profile</h1>

                            {/* Personal Details */}
                            <div className="space-y-6 mb-8">
                                <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Personal Details</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                                            {photoURL ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-blue-600 text-xl font-bold">{fullName ? fullName.charAt(0) : 'U'}</span>
                                            )}
                                        </div>
                                        <label className="cursor-pointer bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span>{uploading ? 'Uploading...' : 'Change Photo'}</span>
                                            <input type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        id="fullname"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                                    <input
                                        type="text"
                                        id="headline"
                                        value={headline}
                                        onChange={(e) => setHeadline(e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <textarea
                                        id="bio"
                                        rows={4}
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Public Profile Settings */}
                            <div className="space-y-6 mb-8">
                                <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Public Profile Settings</h2>

                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <label htmlFor="public-toggle" className="block text-sm font-medium text-gray-700">Make profile public</label>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Your public profile URL will be: <span className="text-blue-600">{typeof window !== 'undefined' ? `${window.location.origin}/profile/${username}` : `/profile/${username}`}</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsPublic(!isPublic)}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isPublic ? 'bg-blue-600' : 'bg-gray-200'}`}
                                    >
                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="space-y-6 mb-8">
                                <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Skills</h2>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {skills.map(skill => (
                                        <span key={skill.id || skill.name} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {skill.name}
                                            <button
                                                type="button"
                                                onClick={() => skill.id && handleRemoveSkill(skill.id)}
                                                className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                                            >
                                                <span className="sr-only">Remove skill</span>
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={handleAddSkill}
                                    placeholder="Add a skill and press Enter"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                                />
                                {!profileId && <p className="text-xs text-amber-600 mt-1">Save profile to enable adding skills.</p>}
                            </div>

                            {/* Proof of Work */}
                            <div className="space-y-6 mb-8">
                                <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Proof-of-Work</h2>
                                <div className="space-y-4">
                                    {proofs.map((proof) => (
                                        <div key={proof.id || proof.title} className="flex gap-2 items-start">
                                            <div className="flex-grow space-y-2">
                                                <input
                                                    type="text"
                                                    value={proof.title}
                                                    onChange={(e) => proof.id && handleUpdateProof(proof.id, 'title', e.target.value)}
                                                    onBlur={() => proof.id && saveProofOnBlur(proof.id)}
                                                    placeholder="Project Title"
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                                                />
                                                <input
                                                    type="text"
                                                    value={proof.url}
                                                    onChange={(e) => proof.id && handleUpdateProof(proof.id, 'url', e.target.value)}
                                                    onBlur={() => proof.id && saveProofOnBlur(proof.id)}
                                                    placeholder="URL (e.g., https://...)"
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => proof.id && handleRemoveProof(proof.id)}
                                                className="mt-1 text-red-500 hover:text-red-700 p-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddProofStub}
                                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    + Add Proof-of-Work Link
                                </button>
                                {!profileId && <p className="text-xs text-amber-600 mt-1 max-w-full text-center">Save profile to enable adding proofs.</p>}
                            </div>

                            {/* Connect Section */}
                            <div className="space-y-6 mb-8">
                                <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Connect</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                                        <input type="text" id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
                                    </div>
                                    <div>
                                        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">Twitter (X)</label>
                                        <input type="text" id="twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://twitter.com/..." className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
                                    </div>
                                    <div>
                                        <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                                        <input type="text" id="github" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
                                    </div>
                                    <div>
                                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                        <input type="text" id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Live Preview */}
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Live Public Profile Preview</h2>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                            <p className="text-xs text-blue-600 mb-4 font-medium">Public URL: {typeof window !== 'undefined' ? `${window.location.origin}/profile/${username || 'username'}` : `/profile/${username || 'username'}`}</p>

                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                                    {photoURL ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={photoURL} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-blue-600 text-xl font-bold">{fullName ? fullName.charAt(0) : 'U'}</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{fullName || 'Your Name'}</h3>
                                    <p className="text-sm text-gray-600">{headline || 'Your Headline Description'}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-bold text-gray-900 mb-2 text-sm">About Me</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    {bio || 'Your bio will appear here.'}
                                </p>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-bold text-gray-900 mb-2 text-sm">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {skills.length > 0 ? skills.map(skill => (
                                        <span key={skill.id} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                                            {skill.name}
                                        </span>
                                    )) : (
                                        <span className="text-xs text-gray-400 italic">No skills added yet</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 mb-2 text-sm">Proof-of-Work</h4>
                                <div className="space-y-3">
                                    {proofs.length > 0 ? proofs.map((proof) => (
                                        <div key={proof.id} className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gray-900 rounded-sm flex items-center justify-center flex-shrink-0">
                                                <span className="text-[10px] text-white">⚡</span>
                                            </div>
                                            <a href={proof.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate block w-full">{proof.title || 'Project Title'}</a>
                                        </div>
                                    )) : (
                                        <span className="text-xs text-gray-400 italic">No proofs added yet</span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-2 text-sm">Connect</h4>
                                <div className="flex gap-4">
                                    {linkedin && (
                                        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700">
                                            <span className="sr-only">LinkedIn</span>
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                        </a>
                                    )}
                                    {twitter && (
                                        <a href={twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                                            <span className="sr-only">Twitter</span>
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                        </a>
                                    )}
                                    {github && (
                                        <a href={github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-800">
                                            <span className="sr-only">GitHub</span>
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                        </a>
                                    )}
                                    {website && (
                                        <a href={website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                                            <span className="sr-only">Website</span>
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-8.955 3-12a9 9 0 010 12z" /></svg>
                                        </a>
                                    )}
                                    {!linkedin && !twitter && !github && !website && (
                                        <span className="text-xs text-gray-400 italic">No social links added</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
