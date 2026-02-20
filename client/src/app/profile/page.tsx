'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { User as UserIcon, Camera, Loader2 } from 'lucide-react';
import API_BASE_URL from '@/lib/apiConfig';

export default function ProfilePage() {
    // @ts-ignore
    const { user, login, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState('');
    const [bio, setBio] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatar(user.avatar || '');
            setBio(user.bio || '');
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsUpdating(true);

        try {
            const { data } = await axios.put(
                `${API_BASE_URL}/api/users/profile`,
                {
                    name,
                    email,
                    password: password || undefined,
                    avatar,
                    bio,
                }
            );

            // Update local context
            login(data);
            setMessage('Profile updated successfully');
            setPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary/20 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-background rounded-3xl shadow-xl border border-border overflow-hidden">
                    <div className="relative h-32 bg-gradient-to-r from-primary to-indigo-600">
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative">
                                <span className="inline-block h-32 w-32 rounded-full overflow-hidden border-4 border-background bg-muted">
                                    {avatar ? (
                                        <img src={avatar} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <UserIcon className="h-full w-full text-muted-foreground p-4" />
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-8 px-8">
                        <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                        <p className="text-muted-foreground">{user.email}</p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            {message && (
                                <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-4 rounded-lg text-sm font-medium">
                                    {message}
                                </div>
                            )}
                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Full Name
                                    </label>
                                    <Input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Email Address
                                    </label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Avatar URL
                                    </label>
                                    <div className="flex gap-4">
                                        <Input
                                            type="url"
                                            placeholder="https://example.com/avatar.jpg"
                                            value={avatar}
                                            onChange={(e) => setAvatar(e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Link to an image for your profile picture.</p>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Bio
                                    </label>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Tell us a bit about yourself"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border">
                                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            New Password
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="Leave blank to keep current"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Confirm New Password
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder="Leave blank to keep current"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isUpdating} className="min-w-[120px]">
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
