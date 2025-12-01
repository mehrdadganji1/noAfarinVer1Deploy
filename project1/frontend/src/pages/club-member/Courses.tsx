import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, GraduationCap, TrendingUp, Users, Award, CheckCircle2 } from 'lucide-react';
import { useCourses, useCourseStats, useEnrollCourse } from '@/hooks/useCourses';
import CourseCard from '@/components/club-member/CourseCard';
import SearchBar from '@/components/common/SearchBar';
import FilterSection, { FilterOption } from '@/components/common/FilterSection';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import EmptyState from '@/components/common/EmptyState';
import { SectionContainer } from '@/components/club-member/SectionHeader';

const levels: FilterOption[] = [
  { value: 'all', label: 'همه سطوح' },
  { value: 'beginner', label: 'مبتدی' },
  { value: 'intermediate', label: 'متوسط' },
  { value: 'advanced', label: 'پیشرفته' },
];

export default function Courses() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: stats } = useCourseStats();
  const { data: coursesData, isLoading } = useCourses({
    level: selectedLevel !== 'all' ? selectedLevel : undefined,
    search: searchQuery,
    page,
    limit,
  });

  const { mutate: enrollCourse, isPending: isEnrolling } = useEnrollCourse();

  const courses = coursesData?.courses || [];

  const handleEnroll = (courseId: string) => {
    enrollCourse(courseId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30 p-4 md:p-6" dir="rtl">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white shadow-lg flex items-center justify-center">
              <GraduationCap className="h-9 w-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">دوره‌های آموزشی</h1>
              <p className="text-sm text-gray-600">یادگیری و توسعه مهارت‌های خود</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <SectionContainer
            header={{
              title: 'آمار دوره‌ها',
              subtitle: 'وضعیت یادگیری شما',
              icon: TrendingUp,
              iconColor: 'purple',
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl font-bold">{stats.total}</span>
                  </div>
                  <p className="text-sm font-medium">کل دوره‌ها</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold">{stats.myEnrolled}</span>
                  </div>
                  <p className="text-sm font-medium">دوره‌های من</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    <span className="text-2xl font-bold">{stats.myCompleted}</span>
                  </div>
                  <p className="text-sm font-medium">تکمیل شده</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-5 h-5 text-orange-600" />
                    <span className="text-2xl font-bold">{stats.published}</span>
                  </div>
                  <p className="text-sm font-medium">منتشر شده</p>
                </CardContent>
              </Card>
            </div>
          </SectionContainer>
        )}

        {/* Search & Filters */}
        <SectionContainer
          header={{
            title: 'جستجو و فیلتر',
            icon: BookOpen,
            iconColor: 'purple',
          }}
        >
          <div className="space-y-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="جستجوی دوره..."
            />
            <div className="grid grid-cols-1 gap-4">
              <FilterSection
                title="سطح"
                options={levels}
                selected={selectedLevel}
                onSelect={setSelectedLevel}
              />
            </div>
          </div>
        </SectionContainer>

        {/* Courses Grid */}
        <SectionContainer
          header={{
            title: `${courses.length} دوره`,
            subtitle: searchQuery ? 'نتایج جستجو' : 'لیست همه دوره‌ها',
            icon: BookOpen,
            iconColor: 'green',
            badge: courses.length,
          }}
        >
          {isLoading ? (
            <LoadingSkeleton type="card" count={6} />
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  index={index}
                  onEnroll={handleEnroll}
                  onViewDetails={(id) => navigate(`/club-member/courses/${id}`)}
                  isLoading={isEnrolling}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={GraduationCap}
              title="دوره‌ای یافت نشد"
              description="در حال حاضر دوره‌ای با این فیلترها وجود ندارد"
            />
          )}

          {/* Pagination */}
          {coursesData && coursesData.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-gray-600">
                صفحه {page} از {coursesData.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  قبلی
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(coursesData.totalPages, p + 1))}
                  disabled={page === coursesData.totalPages}
                >
                  بعدی
                </Button>
              </div>
            </div>
          )}
        </SectionContainer>
      </div>
    </div>
  );
}
