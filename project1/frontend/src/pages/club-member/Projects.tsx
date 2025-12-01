import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, FolderKanban, Target, TrendingUp, Users, CheckCircle2, Code } from 'lucide-react';
import ProjectCard from '@/components/club-member/ProjectCard';
import SearchBar from '@/components/common/SearchBar';
import FilterSection, { FilterOption } from '@/components/common/FilterSection';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import EmptyState from '@/components/common/EmptyState';
import { useProjects, useProjectStats, useJoinProject, useLeaveProject } from '@/hooks/useProjects';

// New Enhanced Components
import { SectionContainer } from '@/components/club-member/SectionHeader';
import { ProgressTrackerCard } from '@/components/club-member/ProgressTracker';

const categories: FilterOption[] = [
  { value: 'all', label: 'همه' },
  { value: 'web', label: 'وب' },
  { value: 'mobile', label: 'موبایل' },
  { value: 'ai', label: 'هوش مصنوعی' },
  { value: 'iot', label: 'IoT' },
  { value: 'blockchain', label: 'بلاکچین' },
];

const statuses: FilterOption[] = [
  { value: 'all', label: 'همه' },
  { value: 'planning', label: 'برنامه‌ریزی' },
  { value: 'in-progress', label: 'در حال اجرا' },
  { value: 'review', label: 'بررسی' },
  { value: 'completed', label: 'تکمیل شده' },
];

export default function Projects() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [page, setPage] = useState(1);

  // Fetch projects from API
  const { data: projectsData, isLoading, error } = useProjects({
    category: selectedCategory !== 'all' ? (selectedCategory as any) : undefined,
    status: selectedStatus !== 'all' ? (selectedStatus as any) : undefined,
    page,
    limit: 12,
  });

  // Fetch project stats
  const { data: stats, isLoading: statsLoading } = useProjectStats();

  // Mutations
  const { mutate: joinProject, isPending: isJoining } = useJoinProject();
  const { mutate: leaveProject, isPending: isLeaving } = useLeaveProject();

  const handleJoin = (projectId: string) => {
    joinProject({ projectId });
  };

  const handleLeave = (projectId: string) => {
    leaveProject(projectId);
  };

  // Client-side search filter
  const projects = projectsData?.projects || [];
  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30 p-4 md:p-6" dir="rtl">
      <div className="max-w-[1600px] mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 border-2 border-white shadow-lg flex items-center justify-center">
              <FolderKanban className="h-9 w-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">پروژه‌ها</h1>
              <p className="text-sm text-gray-600">مشاهده و مشارکت در پروژه‌های باشگاه</p>
            </div>
          </div>

          <Button
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            onClick={() => navigate('/club-member/projects/new')}
          >
            <Plus className="h-5 w-5 ml-2" />
            پروژه جدید
          </Button>
        </div>

        {/* Statistics */}
        <SectionContainer
          header={{
            title: 'آمار پروژه‌ها',
            subtitle: 'وضعیت مشارکت شما در پروژه‌ها',
            icon: TrendingUp,
            iconColor: 'green',
          }}
        >
          {statsLoading ? (
            <LoadingSkeleton type="stat" count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <FolderKanban className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl font-bold">{stats?.total || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600">همه پروژه‌ها</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Code className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold">{stats?.inProgress || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600">در حال اجرا</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-2xl font-bold">{stats?.myProjects || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600">پروژه‌های من</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    <span className="text-2xl font-bold">{stats?.completed || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600">تکمیل شده</p>
                </CardContent>
              </Card>
            </div>
          )}
        </SectionContainer>

        {/* Project Progress Tracker */}
        {stats && stats.myProjects > 0 && (
          <ProgressTrackerCard
            title="پیشرفت پروژه‌های من"
            subtitle="وضعیت پروژه‌های فعال شما"
            items={[
              {
                label: 'برنامه‌ریزی',
                value: stats.planning || 0,
                maxValue: stats.myProjects,
                icon: Target,
                color: 'blue',
                description: 'پروژه‌های در مرحله طراحی',
              },
              {
                label: 'در حال اجرا',
                value: stats.inProgress || 0,
                maxValue: stats.myProjects,
                icon: Code,
                color: 'green',
                description: 'پروژه‌های فعال',
              },
              {
                label: 'تکمیل شده',
                value: stats.completed || 0,
                maxValue: stats.total || 1,
                icon: CheckCircle2,
                color: 'amber',
                description: 'پروژه‌های موفق',
              },
            ]}
            orientation="vertical"
          />
        )}

        {/* Search & Filters */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="جستجوی پروژه..."
              />

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FilterSection
                  title="دسته‌بندی"
                  options={categories}
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                />
                <FilterSection
                  title="وضعیت"
                  options={statuses}
                  selected={selectedStatus}
                  onSelect={setSelectedStatus}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <SectionContainer
          header={{
            title: `${filteredProjects.length} پروژه`,
            subtitle: searchQuery ? `نتایج جستجو` : 'لیست همه پروژه‌ها',
            icon: FolderKanban,
            iconColor: 'green',
            badge: filteredProjects.length,
          }}
        >
          <div>

            {/* Pagination */}
            {projectsData && projectsData.totalPages > 1 && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  صفحه {page} از {projectsData.totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                  >
                    قبلی
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(projectsData.totalPages, p + 1))}
                    disabled={page === projectsData.totalPages || isLoading}
                  >
                    بعدی
                  </Button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && <LoadingSkeleton type="card" count={6} />}

            {/* Error State */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6 text-center">
                  <p className="text-red-600">خطا در دریافت پروژه‌ها. لطفاً دوباره تلاش کنید.</p>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredProjects.length === 0 && (
              <EmptyState
                icon={FolderKanban}
                title="پروژه‌ای یافت نشد"
                description="هیچ پروژه‌ای با فیلترهای انتخابی شما وجود ندارد."
              />
            )}

            {/* Projects List */}
            {!isLoading && !error && filteredProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project: any, index: number) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    index={index}
                    onJoin={handleJoin}
                    onLeave={handleLeave}
                    onViewDetails={(id) => navigate(`/club-member/projects/${id}`)}
                    isLoading={isJoining || isLeaving}
                  />
                ))}
              </div>
            )}
          </div>
        </SectionContainer>

      </div>
    </div>
  );
}
