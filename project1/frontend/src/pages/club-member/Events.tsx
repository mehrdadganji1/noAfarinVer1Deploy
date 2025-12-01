import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Grid3x3,
  List,
  CheckCircle2,
  Users,
  TrendingUp,
  Clock,
} from 'lucide-react';
import EventCard from '@/components/club-member/EventCard';
import SearchBar from '@/components/common/SearchBar';
import FilterSection from '@/components/common/FilterSection';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import EmptyState from '@/components/common/EmptyState';
import { useEvents, useEventStats, useRegisterEvent, useCancelRegistration } from '@/hooks/useEvents';

// New Enhanced Components
import { SectionContainer } from '@/components/club-member/SectionHeader';

const eventTypes = [
  { value: 'all', label: 'همه' },
  { value: 'workshop', label: 'کارگاه' },
  { value: 'networking', label: 'شبکه‌سازی' },
  { value: 'seminar', label: 'سمینار' },
  { value: 'webinar', label: 'وبینار' },
  { value: 'industrial_visit', label: 'بازدید صنعتی' },
  { value: 'pitch_session', label: 'جلسه پیچ' },
];

const eventStatuses = [
  { value: 'all', label: 'همه' },
  { value: 'upcoming', label: 'آینده' },
  { value: 'ongoing', label: 'در حال برگزاری' },
  { value: 'completed', label: 'برگزار شده' },
];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('upcoming');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);

  // API Hooks
  const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useEvents({
    type: selectedType !== 'all' ? selectedType : undefined,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    page,
    limit: 12,
  });

  const { data: stats, isLoading: statsLoading } = useEventStats();
  const { mutate: register, isPending: isRegistering } = useRegisterEvent();
  const { mutate: unregister, isPending: isUnregistering } = useCancelRegistration();

  const handleRegister = (eventId: string) => {
    register(eventId);
  };

  const handleUnregister = (eventId: string) => {
    unregister(eventId);
  };


  // Client-side search filtering
  const events = eventsData?.events || [];
  const filteredEvents = searchQuery
    ? events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : events;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-cyan-50/20 to-purple-50/30 p-4 md:p-6" dir="rtl">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-white shadow-lg flex items-center justify-center">
              <Calendar className="h-9 w-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">رویدادها</h1>
              <p className="text-sm text-gray-600">مشاهده و ثبت‌نام در رویدادهای باشگاه</p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-10 w-10"
            >
              <Grid3x3 className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-10 w-10"
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <SectionContainer
          header={{
            title: 'آمار رویدادها',
            subtitle: 'وضعیت شرکت شما در رویدادها',
            icon: TrendingUp,
            iconColor: 'blue',
          }}
        >
          {statsLoading ? (
            <LoadingSkeleton type="stat" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl font-bold">{stats?.total || 0}</span>
                  </div>
                  <p className="text-sm font-medium">همه رویدادها</p>
                  <p className="text-xs text-gray-600">کل رویدادها</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold">{stats?.upcoming || 0}</span>
                  </div>
                  <p className="text-sm font-medium">پیش رو</p>
                  <p className="text-xs text-gray-600">رویدادهای آینده</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    <span className="text-2xl font-bold">{stats?.userRegistered || 0}</span>
                  </div>
                  <p className="text-sm font-medium">ثبت‌نام شده</p>
                  <p className="text-xs text-gray-600">رویدادهای شما</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-2xl font-bold">{stats?.userAttended || 0}</span>
                  </div>
                  <p className="text-sm font-medium">شرکت کرده</p>
                  <p className="text-xs text-gray-600">حضور موفق</p>
                </CardContent>
              </Card>
            </div>
          )}
        </SectionContainer>

        {/* Search & Filters */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="جستجوی رویداد..."
              />

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FilterSection
                  title="نوع رویداد"
                  options={eventTypes}
                  selected={selectedType}
                  onSelect={setSelectedType}
                />
                <FilterSection
                  title="وضعیت"
                  options={eventStatuses}
                  selected={selectedStatus}
                  onSelect={setSelectedStatus}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid/List */}
        <SectionContainer
          header={{
            title: `${eventsData?.total || 0} رویداد`,
            subtitle: searchQuery ? `${filteredEvents.length} نتیجه یافت شد` : 'لیست همه رویدادها',
            icon: Calendar,
            iconColor: 'blue',
            badge: filteredEvents.length,
          }}
        >
          <div>
            {/* Pagination */}
            {eventsData && eventsData.totalPages > 1 && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  صفحه {page} از {eventsData.totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || eventsLoading}
                  >
                    قبلی
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(eventsData.totalPages, p + 1))}
                    disabled={page === eventsData.totalPages || eventsLoading}
                  >
                    بعدی
                  </Button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {eventsLoading && <LoadingSkeleton type="card" count={6} />}

            {/* Error State */}
            {eventsError && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6 text-center">
                  <p className="text-red-600">خطا در دریافت رویدادها. لطفاً دوباره تلاش کنید.</p>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!eventsLoading && !eventsError && filteredEvents.length === 0 && (
              <EmptyState
                icon={Calendar}
                title="رویدادی یافت نشد"
                description="با فیلترهای دیگری جستجو کنید یا بعداً مراجعه کنید."
              />
            )}

            {/* Events List */}
            {!eventsLoading && !eventsError && filteredEvents.length > 0 && (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                    isLoading={isRegistering || isUnregistering}
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
