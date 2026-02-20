'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, BookOpen, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                                SkillNest
                            </span>
                        </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        {user && (
                            <Link
                                href={user.role === 'admin' ? '/admin' : '/dashboard'}
                                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                            >
                                Dashboard
                            </Link>
                        )}
                        <Link
                            href="/courses"
                            className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                            Courses
                        </Link>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {user ? (
                            <div className="ml-3 relative group">
                                <div className="py-2"> {/* Add padding wrapper to bridge the gap if needed, or rely on group on parent */}
                                    <button type="button" className="max-w-xs flex items-center text-sm rounded-full focus:outline-none transition-colors" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                        <span className="sr-only">Open user menu</span>
                                        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full hover:bg-secondary/50 transition-colors">
                                            <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-muted border border-border">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <UserIcon className="h-full w-full text-muted-foreground p-1" />
                                                )}
                                            </span>
                                            <span className="text-sm font-medium text-foreground hidden sm:block">
                                                {user.name.split(' ')[0]}
                                            </span>
                                            <svg className="h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                                {/* Dropdown menu */}
                                <div className="hidden group-hover:block absolute right-0 top-full mt-0 w-48 rounded-md shadow-lg py-1 bg-popover text-popover-foreground ring-1 ring-black ring-opacity-5 focus:outline-none z-50 origin-top-right transform transition-all duration-200 border border-border">
                                    <div className="px-4 py-3 border-b border-border">
                                        <p className="text-sm font-medium truncate">{user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                                        Your Profile
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center space-x-4">
                                <Link href="/login">
                                    <Button variant="ghost">Log in</Button>
                                </Link>
                                <Link href="/register">
                                    <Button>Sign up</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href="/courses"
                            onClick={() => setIsOpen(false)}
                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                        >
                            Courses
                        </Link>
                        {user && (
                            <Link
                                href={user.role === 'admin' ? '/admin' : '/dashboard'}
                                onClick={() => setIsOpen(false)}
                                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-200">
                        {user ? (
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <UserIcon className="h-10 w-10 rounded-full bg-gray-100 p-2" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">
                                        {user.name}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {user.email}
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <Button variant="ghost" className="w-full justify-start" onClick={logout}>Logout</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 space-y-1 px-4">
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full mb-2">Log in</Button>
                                </Link>
                                <Link href="/register" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full">Sign up</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
