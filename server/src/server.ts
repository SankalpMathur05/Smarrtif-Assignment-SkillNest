import app from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

const startServer = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        console.log('MongoDB Connected Successfully');

        const server = app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err: any) => {
            console.error(`Error: ${err.message}`);
            server.close(() => process.exit(1));
        });

    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();
