import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, Star, BookOpen, Play } from 'lucide-react';
import { Course, getCourseLevelLabel, getCourseLevelColor } from '@/types/course';
import { motion } from 'framer-motion';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  onViewDetails?: (courseId: string) => void;
  index?: number;
  isLoading?: boolean;
}

const levelColorClasses = {
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
};

export default function CourseCard({
  course,
  onEnroll,
  onViewDetails,
  index = 0,
  isLoading,
}: CourseCardProps) {
  const levelColor = getCourseLevelColor(course.level);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-xl transition-shadow duration-300 group overflow-hidden">
        {/* Thumbnail */}
        {course.thumbnail && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3">
              <Badge className={levelColorClasses[levelColor as keyof typeof levelColorClasses]}>
                {getCourseLevelLabel(course.level)}
              </Badge>
            </div>
          </div>
        )}

        <CardContent className="p-5">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{course.description}</p>

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-700">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xs">
              {course.instructor.firstName[0]}{course.instructor.lastName[0]}
            </div>
            <span>
              {course.instructor.firstName} {course.instructor.lastName}
            </span>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {Math.floor(course.duration / 60)} ساعت
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {course.lessons.length} درس
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {course.enrolledCount} نفر
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{course.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-500">({course.reviewCount} نظر)</span>
          </div>

          {/* Progress (if enrolled) */}
          {course.isEnrolled && course.myProgress !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">پیشرفت شما</span>
                <span className="font-semibold text-green-600">{course.myProgress}%</span>
              </div>
              <Progress value={course.myProgress} className="h-2" />
            </div>
          )}
        </CardContent>

        <CardFooter className="p-5 pt-0">
          {course.isEnrolled ? (
            <Button
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
              onClick={() => onViewDetails?.(course._id)}
            >
              <Play className="h-4 w-4 ml-2" />
              ادامه یادگیری
            </Button>
          ) : (
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onViewDetails?.(course._id)}
              >
                جزئیات
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                onClick={() => onEnroll?.(course._id)}
                disabled={isLoading}
              >
                ثبت‌نام
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
