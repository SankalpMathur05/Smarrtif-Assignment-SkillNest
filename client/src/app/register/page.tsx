'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import axios from 'axios';
import API_BASE_URL from '@/lib/apiConfig';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
                name,
                email,
                password,
                secretKey,
            }, {
                withCredentials: true
            });

            login(response.data);
        } catch (err: any) {
            setError(
                err.response?.data?.message || 'Failed to register. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-secondary/30">
            <div className="w-full max-w-md space-y-8 bg-background p-8 rounded-xl shadow-lg border border-border/50">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:text-primary/90 transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <Input
                                id="secretKey"
                                name="secretKey"
                                type="password"
                                autoComplete="off"
                                required={false}
                                placeholder="Admin Secret Key (Optional)"
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Sign up
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
