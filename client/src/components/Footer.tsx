import Link from 'next/link';
import { Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-background border-t border-border/40">
            <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
                <div className="flex justify-center space-x-6">
                    <Link href="#" className="text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Twitter</span>
                        <Twitter className="h-6 w-6" />
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-gray-500">
                        <span className="sr-only">GitHub</span>
                        <Github className="h-6 w-6" />
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-gray-500">
                        <span className="sr-only">LinkedIn</span>
                        <Linkedin className="h-6 w-6" />
                    </Link>
                </div>
                <div className="mt-8 text-center text-base text-gray-400">
                    &copy; {new Date().getFullYear()} SkillNest, Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
