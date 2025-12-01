import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight,
  Clock,
  Users,
  Star,
  BookOpen,
  Play,
  CheckCircle2,
  Loader2,
  Award,
} from 'lucide-react';
import { useCourse, useEnrollCourse, useDropCourse } from '@/hooks/useCourses';
import { getCourseLevelLabel, getCourseLevelColor } from '@/types/course';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: course, isLoading, error } = useCourse(id!);
  const { mutate: enrollCourse, isPending: isEnrolling } = useEnrollCourse();
  const { mutate: dropCourse, isPending: isDropping } = useDropCourse();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30 p-6" dir="rtl">
        <div className="max-w-[1400px] mx-auto">
          <LoadingSkeleton type="card" count={3} />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30 p-6" dir="rtl">
        <div className="max-w-[1400px] mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <p className="text-red-700">دوره یافت نشد</p>
              <Button onClick={() => navigate('/club-member/courses')} className="mt-4">
                بازگشت به لیست دوره‌ها
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const levelColor = getCourseLevelColor(course.level);
  const completedLessons = course.lessons.filter((l) => l.isCompleted).length;
  const totalLessons = course.lessons.length;

  const levelColorClasses = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30 p-6" dir="rtl">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/club-member/courses')}>
          <ArrowRight className="h-4 w-4 ml-2" />
          بازگشت
        </Button>

        {/* Course Header */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Thumbnail */}
              {course.thumbnail && (
                <div className="lg:w-1/3">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                      <Badge className={levelColorClasses[levelColor as keyof typeof levelColorClasses]}>
                        {getCourseLevelLabel(course.level)}
                      </Badge>
                    </div>
                    <p className="text-gray-700 text-lg mb-4">{course.description}</p>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                    {course.instructor.firstName[0]}{course.instructor.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">مدرس دوره</p>
                    <p className="font-semibold text-gray-900">
                      {course.instructor.firstName} {course.instructor.lastName}
                    </p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span>{Math.floor(course.duration / 60)} ساعت</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-gray-600" />
                    <span>{totalLessons} درس</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span>{course.enrolledCount} دانشجو</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating.toFixed(1)} ({course.reviewCount})</span>
                  </div>
                </div>

                {/* Progress (if enrolled) */}
                {course.isEnrolled && course.myProgress !== undefined && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">پیشرفت شما</span>
                      <span className="text-sm font-bold text-green-600">{course.myProgress}%</span>
                    </div>
                    <Progress value={course.myProgress} className="h-3" />
                    <p className="text-xs text-gray-600 mt-1">
                      {completedLessons} از {totalLessons} درس تکمیل شده
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  {course.isEnrolled ? (
                    <>
                      <Button
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                        onClick={() => navigate(`/club-member/courses/${course._id}/learn`)}
                      >
                        <Play className="h-4 w-4 ml-2" />
                        ادامه یادگیری
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => dropCourse(course._id)}
                        disabled={isDropping}
                      >
                        {isDropping ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'خروج از دوره'
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                      onClick={() => enrollCourse(course._id)}
                      disabled={isEnrolling}
                    >
                      {isEnrolling ? (
                        <>
                          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                          در حال ثبت‌نام...
                        </>
                      ) : (
                        <>
                          <Award className="h-4 w-4 ml-2" />
                          ثبت‌نام در دوره
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lessons */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  سرفصل‌های دوره ({totalLessons} درس)
                </h3>
                <div className="space-y-2">
                  {course.lessons.map((lesson, index) => (
                    <div
                      key={lesson._id || index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                          {lesson.description && (
                            <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{lesson.duration} دقیقه</span>
                        {lesson.isCompleted && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {course.reviews && course.reviews.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    نظرات دانشجویان ({course.reviewCount})
                  </h3>
                  <div className="space-y-4">
                    {course.reviews.slice(0, 5).map((review) => (
                      <div key={review._id} className="border-b border-gray-200 pb-4 last:border-0">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                            {review.userId.firstName[0]}{review.userId.lastName[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">
                                {review.userId.firstName} {review.userId.lastName}
                              </span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">برچسب‌ها</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">اطلاعات دوره</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">دسته‌بندی:</span>
                    <p className="font-semibold text-gray-900">{course.category || 'عمومی'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">تعداد دانشجویان:</span>
                    <p className="font-semibold text-gray-900">{course.enrolledCount} نفر</p>
                  </div>
                  <div>
                    <span className="text-gray-600">آخرین بروزرسانی:</span>
                    <p className="font-semibold text-gray-900">
                      {new Date(course.updatedAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
