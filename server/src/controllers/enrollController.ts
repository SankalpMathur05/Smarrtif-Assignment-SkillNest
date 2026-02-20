import { Request, Response } from 'express';
import Course from '../models/Course';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
    user?: IUser;
}

// @desc    Enroll in a course
// @route   POST /api/enroll/:courseId
// @access  Private
const enrollCourse = async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;
    const userId = req.user?._id;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        // Check if user is already enrolled
        // @ts-ignore
        if (course.enrolledStudents.includes(userId)) {
            res.status(400).json({ message: 'Already enrolled in this course' });
            return;
        }

        // Add user to course enrolledStudents
        // @ts-ignore
        course.enrolledStudents.push(userId);
        await course.save();

        // Add course to user's coursesEnrolled
        // @ts-ignore
        const user = await User.findById(userId);
        if (user) {
            // @ts-ignore
            user.coursesEnrolled.push(course._id);
            await user.save();
        }

        res.status(200).json({ message: 'Enrolled successfully', course });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user enrollments
// @route   GET /api/user/enrollments
// @access  Private
const getUserEnrollments = async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    try {
        // Find courses where enrolledStudents array contains userId
        // Also can be fetched from User model now
        const user = await User.findById(userId).populate('coursesEnrolled');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // @ts-ignore
        res.json(user.coursesEnrolled);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export { enrollCourse, getUserEnrollments };
