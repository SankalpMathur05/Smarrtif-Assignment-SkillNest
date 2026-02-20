import Link from 'next/link';
import { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, DollarSign } from 'lucide-react';

interface CourseCardProps {
    course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
    return (
        <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-all duration-300 flex flex-col h-full group">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-primary shadow-sm">
                    {course.category}
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {course.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                    {course.description}
                </p>

                <div className="flex items-center text-xs text-muted-foreground mb-4 space-x-4">
                    <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {course.duration}
                    </div>
                    <div className="flex items-center">
                        <BookOpen className="h-3.5 w-3.5 mr-1" />
                        {course.instructor}
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/40">
                    <div className="flex items-center font-bold text-lg text-foreground">
                        <DollarSign className="h-4 w-4 text-primary" />
                        {course.price}
                    </div>
                    <Link href={`/courses/${course._id}`}>
                        <Button size="sm" variant="secondary" className="hover:bg-primary hover:text-primary-foreground">
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
