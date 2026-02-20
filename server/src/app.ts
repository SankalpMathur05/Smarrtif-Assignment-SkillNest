import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: Application = express();

// Middleware
app.use(express.json());

const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.CLIENT_ORIGIN, // Vercel production URL
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(cookieParser());

// Routes
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import enrollRoutes from './routes/enrollRoutes';
import userRoutes from './routes/userRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enroll', enrollRoutes);
app.use('/api/users', userRoutes);

// Test Route
app.get('/', (req: Request, res: Response) => {
    res.send('SkillNest API is running...');
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Server Error',
    });
});

export default app;
