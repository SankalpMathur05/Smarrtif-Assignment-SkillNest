import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users';
import { courses } from './data/courses';
import User from './models/User';
import Course from './models/Course';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillnest';

mongoose.connect(MONGO_URI);

const importData = async () => {
    try {
        await Course.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        const sampleCourses = courses.map((course: any) => {
            return { ...course, user: adminUser };
        });

        await Course.insertMany(sampleCourses);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Course.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
