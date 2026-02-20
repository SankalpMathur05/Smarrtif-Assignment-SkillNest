'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Course } from '@/types';
import CourseCard from '@/components/CourseCard';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import API_BASE_URL from '@/lib/apiConfig';

export default function DashboardPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // @ts-ignore
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Wait for auth to finish loading
        if (authLoading) return;

        // If auth done and no user, redirect
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchEnrollments = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/api/enroll/my-enrollments`);
                setCourses(response.data);
            } catch (error) {
                console.error('Failed to fetch enrollments', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEnrollments();
    }, [user, authLoading, router]);

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-secondary/20 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-foreground mb-8">My Learning Dashboard</h1>

                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-background rounded-2xl border border-border border-dashed">
                        <h3 className="text-xl font-medium text-muted-foreground mb-4">You haven't enrolled in any courses yet.</h3>
                        <a href="/courses" className="text-primary hover:underline font-semibold">Browse Courses</a>
                    </div>
                )}
            </div>
        </div>
    );
}
