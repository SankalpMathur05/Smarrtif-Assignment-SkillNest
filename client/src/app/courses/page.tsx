'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Course } from '@/types';
import CourseCard from '@/components/CourseCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import API_BASE_URL from '@/lib/apiConfig';

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/courses`);
                setCourses(response.data);
                setFilteredCourses(response.data);
            } catch (error) {
                console.error('Failed to fetch courses', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        const results = courses.filter((course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCourses(results);
    }, [searchTerm, courses]);

    return (
        <div className="min-h-screen bg-secondary/20 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Explore Courses
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Find the perfect course to upgrade your skills.
                        </p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Search courses..."
                            className="pl-10 h-11 bg-background shadow-sm border-border/60 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-96 rounded-xl bg-gray-200 animate-pulse" />
                        ))}
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course) => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-medium text-muted-foreground">No courses found matching your search.</h3>
                    </div>
                )}
            </div>
        </div>
    );
}
