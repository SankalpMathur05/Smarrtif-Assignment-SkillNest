export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
    avatar?: string;
    bio?: string;
}

export interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    instructor: string;
    category: string;
    thumbnail: string;
    duration: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
}
