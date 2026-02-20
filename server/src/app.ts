import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: [
        process.env.CLIENT_ORIGIN || 'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3000',
    ],
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
