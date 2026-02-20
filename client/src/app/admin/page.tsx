'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Course, User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash, Edit, BookOpen, Users, LayoutDashboard, X } from 'lucide-react';
import API_BASE_URL from '@/lib/apiConfig';

export default function AdminDashboardPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'courses' | 'users'>('courses');
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        price: '',
        instructor: '',
        category: '',
        thumbnail: '',
        duration: '',
    });

    // @ts-ignore
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Wait until auth resolves
        if (authLoading) return;

        // Redirect if not an admin
        if (!user || user.role !== 'admin') {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [coursesRes, usersRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/courses`),
                    axios.get(`${API_BASE_URL}/api/users`),
                ]);
                setCourses(coursesRes.data);
                setUsers(usersRes.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, authLoading, router]);

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError('');
        try {
            const payload = {
                ...newCourse,
                price: parseFloat(newCourse.price),
            };
            const response = await axios.post(
                `${API_BASE_URL}/api/courses`,
                payload
            );
            setCourses([...courses, response.data]);
            setIsCreating(false);
            setNewCourse({
                title: '',
                description: '',
                price: '',
                instructor: '',
                category: '',
                thumbnail: '',
                duration: '',
            });
        } catch (error: any) {
            console.error('Failed to create course', error);
            setCreateError(error.response?.data?.message || 'Failed to create course. Please try again.');
        }
    };

    const handleDeleteCourse = async (id: string) => {
        if (confirm('Are you sure you want to delete this course?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/courses/${id}`);
                setCourses(courses.filter((course) => course._id !== id));
            } catch (error) {
                console.error('Failed to delete course', error);
            }
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-secondary/20 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <LayoutDashboard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                            <p className="text-sm text-muted-foreground">Manage your platform</p>
                        </div>
                    </div>
                    {activeTab === 'courses' && (
                        <Button
                            onClick={() => { setIsCreating(!isCreating); setCreateError(''); }}
                            variant={isCreating ? 'outline' : 'default'}
                        >
                            {isCreating ? (
                                <><X className="h-4 w-4 mr-2" /> Cancel</>
                            ) : (
                                <><Plus className="h-4 w-4 mr-2" /> Add Course</>
                            )}
                        </Button>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-background p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Courses</p>
                            <p className="text-2xl font-bold text-foreground">{courses.length}</p>
                        </div>
                    </div>
                    <div className="bg-background p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Registered Users</p>
                            <p className="text-2xl font-bold text-foreground">{users.length}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-secondary/50 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'courses'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <BookOpen className="inline h-4 w-4 mr-2" />
                        Courses
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'users'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Users className="inline h-4 w-4 mr-2" />
                        Users
                    </button>
                </div>

                {/* Create Course Form */}
                {isCreating && activeTab === 'courses' && (
                    <div className="bg-background p-8 rounded-xl shadow-sm mb-8 border border-border">
                        <h2 className="text-xl font-bold text-foreground mb-6">Create New Course</h2>
                        {createError && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md mb-4">
                                {createError}
                            </div>
                        )}
                        <form onSubmit={handleCreateCourse} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    placeholder="Course Title"
                                    value={newCourse.title}
                                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Instructor Name"
                                    value={newCourse.instructor}
                                    onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Price (e.g. 49.99)"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={newCourse.price}
                                    onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Category (e.g. Development)"
                                    value={newCourse.category}
                                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Duration (e.g. 12 hours)"
                                    value={newCourse.duration}
                                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Thumbnail URL"
                                    value={newCourse.thumbnail}
                                    onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                                />
                            </div>
                            <textarea
                                className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Course Description"
                                value={newCourse.description}
                                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                required
                            />
                            <div className="flex gap-3">
                                <Button type="submit">Create Course</Button>
                                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                    <div className="bg-background rounded-xl shadow-sm overflow-hidden border border-border">
                        <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-lg font-semibold text-foreground">Manage Courses</h3>
                            <p className="text-sm text-muted-foreground">{courses.length} course{courses.length !== 1 ? 's' : ''} total</p>
                        </div>
                        {courses.length === 0 ? (
                            <div className="py-20 text-center">
                                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground text-lg font-medium">No courses yet</p>
                                <p className="text-muted-foreground text-sm mt-1">Click "Add Course" to create your first course.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-border">
                                {courses.map((course) => (
                                    <li key={course._id} className="px-6 py-4 hover:bg-secondary/20 transition-colors flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 min-w-0">
                                            {course.thumbnail && (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="h-12 w-20 rounded-md object-cover shrink-0"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                />
                                            )}
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-semibold text-foreground truncate">{course.title}</h4>
                                                <p className="text-xs text-muted-foreground">{course.instructor} • ${course.price}</p>
                                                <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{course.category}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDeleteCourse(course._id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-background rounded-xl shadow-sm overflow-hidden border border-border">
                        <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-lg font-semibold text-foreground">Registered Users</h3>
                            <p className="text-sm text-muted-foreground">{users.length} user{users.length !== 1 ? 's' : ''} total</p>
                        </div>
                        {users.length === 0 ? (
                            <div className="py-20 text-center">
                                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground text-lg font-medium">No users yet</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-border">
                                {users.map((u) => (
                                    <li key={u._id} className="px-6 py-4 hover:bg-secondary/20 transition-colors flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <span className="text-sm font-semibold text-primary">
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-foreground">{u.name}</h4>
                                                <p className="text-xs text-muted-foreground">{u.email}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${u.role === 'admin'
                                            ? 'bg-primary/15 text-primary'
                                            : 'bg-secondary text-secondary-foreground'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
