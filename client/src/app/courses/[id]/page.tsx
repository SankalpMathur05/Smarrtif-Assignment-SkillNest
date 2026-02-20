'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Course } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, DollarSign, Award } from 'lucide-react';
import API_BASE_URL from '@/lib/apiConfig';

export default function CourseDetailPage() {
    const { id } = useParams();
    // @ts-ignore
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [enrollLoading, setEnrollLoading] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/courses/${id}`);
                setCourse(response.data);
            } catch (error) {
                console.error('Failed to fetch course', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchCourse();
        }
    }, [id]);

    useEffect(() => {
        const checkEnrollment = async () => {
            if (user && course) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/enroll/my-enrollments`);
                    const myCourses = response.data;
                    const enrolled = myCourses.find((c: Course) => c._id === course._id);
                    if (enrolled) setIsEnrolled(true);
                } catch (error) {
                    console.error("Failed to check enrollment", error);
                }
            }
        }
        checkEnrollment();
    }, [user, course]);


    const handleEnroll = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        setEnrollLoading(true);
        try {
            await axios.post(
                `${API_BASE_URL}/api/enroll/${id}`,
                {}
            );
            setIsEnrolled(true);
            router.push('/dashboard');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Enrollment failed');
        } finally {
            setEnrollLoading(false);
        }
    };

    if (isLoading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!course) {
        return <div className="text-center py-20 text-2xl">Course not found</div>;
    }

    return (
        <div className="min-h-screen bg-background py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-border/50">
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-96 object-cover"
                            />
                        </div>

                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                                    {course.category}
                                </span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-foreground mb-6">
                                {course.title}
                            </h1>

                            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                                <p className="text-lg leading-relaxed whitespace-pre-line">
                                    {course.description}
                                </p>
                            </div>

                            {/* Curriculum Placeholder */}
                            <div className="mt-12 bg-secondary/20 p-8 rounded-2xl border border-border/50">
                                <h3 className="text-2xl font-bold mb-6 flex items-center">
                                    <BookOpen className="h-6 w-6 mr-2 text-primary" />
                                    Curriculum Overview
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex items-center p-4 bg-background rounded-lg border border-border/40">
                                        <div className="bg-primary/10 p-2 rounded-full mr-4 text-primary font-bold">01</div>
                                        <span>Introduction to {course.title}</span>
                                    </li>
                                    <li className="flex items-center p-4 bg-background rounded-lg border border-border/40">
                                        <div className="bg-primary/10 p-2 rounded-full mr-4 text-primary font-bold">02</div>
                                        <span>Core Concepts and Fundamentals</span>
                                    </li>
                                    <li className="flex items-center p-4 bg-background rounded-lg border border-border/40">
                                        <div className="bg-primary/10 p-2 rounded-full mr-4 text-primary font-bold">03</div>
                                        <span>Advanced Techniques</span>
                                    </li>
                                    <li className="flex items-center p-4 bg-background rounded-lg border border-border/40">
                                        <div className="bg-primary/10 p-2 rounded-full mr-4 text-primary font-bold">04</div>
                                        <span>Final Project & Certification</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-background rounded-2xl p-8 shadow-xl border border-border sticky top-24">
                            <div className="text-3xl font-bold text-foreground mb-6 flex items-center">
                                <DollarSign className="h-8 w-8 text-primary" />
                                {course.price}
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center text-muted-foreground">
                                    <Clock className="h-5 w-5 mr-3 text-primary" />
                                    <span>Duration: {course.duration}</span>
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                    <BookOpen className="h-5 w-5 mr-3 text-primary" />
                                    <span>Instructor: {course.instructor}</span>
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                    <Award className="h-5 w-5 mr-3 text-primary" />
                                    <span>Certificate of Completion</span>
                                </div>
                            </div>

                            {isEnrolled ? (
                                <Button className="w-full text-lg h-12" size="lg" disabled>
                                    Enrolled
                                </Button>
                            ) : (
                                <Button
                                    className="w-full text-lg h-12 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                                    size="lg"
                                    onClick={handleEnroll}
                                    isLoading={enrollLoading}
                                >
                                    Enroll Now
                                </Button>
                            )}
                            <p className="text-xs text-center text-muted-foreground mt-4">
                                30-Day Money-Back Guarantee
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
