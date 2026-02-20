import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
    title: string;
    description: string;
    price: number;
    instructor: string;
    category: string;
    thumbnail: string;
    duration: string;
    enrolledStudents: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const CourseSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
    },
    instructor: {
        type: String,
        required: [true, 'Please add an instructor name'],
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    thumbnail: {
        type: String,
        required: [true, 'Please add a thumbnail URL'],
    },
    duration: {
        type: String,
        required: [true, 'Please add a duration (e.g., "5 hours")'],
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<ICourse>('Course', CourseSchema);
