'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import axios from 'axios';
import API_BASE_URL from '@/lib/apiConfig';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                email,
                password,
            }, {
                withCredentials: true
            });

            login(response.data);
        } catch (err: any) {
            setError(
                err.response?.data?.message || 'Failed to login. Please check your credentials.'
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
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Or{' '}
                        <Link
                            href="/register"
                            className="font-medium text-primary hover:text-primary/90 transition-colors"
                        >
                            create a new account
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
                                autoComplete="current-password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Sign in
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
