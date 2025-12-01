import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/lib/toast';
import { 
  Calendar, 
  FolderKanban, 
  GraduationCap, 
  Award 
} from 'lucide-react';

// New Dashboard Hooks
import {
  useDashboardStats,
  useActivityTimeline,
  useQuickStats
} from '@/hooks/useClubMemberDashboard';

// New Modular Components
import AACoHeader from '../../components/club-member/dashboard/AACoHeader.tsx';
import ModernStatsCard from '../../components/club-member/dashboard/ModernStatsCard.tsx';
import ModernActivityTimeline from '../../components/club-member/dashboard/ModernActivityTimeline.tsx';
import ModernQuickActions from '../../components/club-member/dashboard/ModernQuickActions.tsx';
import ModernXPWidget from '../../components/club-member/dashboard/ModernXPWidget.tsx';
import ModernUpcomingEvents from '../../components/club-member/dashboard/ModernUpcomingEvents.tsx';
import LeaderboardWidget from '../../components/club-member/dashboard/LeaderboardWidget.tsx';
import AchievementsShowcase from '../../components/club-member/dashboard/AchievementsShowcase.tsx';
import PerformanceKPIs from '../../components/club-member/dashboard/PerformanceKPIs.tsx';
import MembershipProgressCard from '@/components/club-member/MembershipProgressCard';
import { MembershipLevel } from '@/types/clubMember';

// Legacy imports for compatibility
import { useEvents } from '@/hooks/useEvents';

export default function ClubMemberDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // Fetch dashboard data using new hooks
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: activityData, isLoading: activityLoading } = useActivityTimeline(10, 1);
  const { data: quickStats, isLoading: quickStatsLoading } = useQuickStats();

  // Fetch events for widget
  const { data: eventsData } = useEvents({ status: 'upcoming', limit: 5 });

  // Show loading state
  const isLoading = statsLoading || activityLoading || quickStatsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-400 opacity-20 mx-auto"></div>
          </div>
          <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent animate-pulse">
            در حال بارگذاری داشبورد...
          </p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (statsError) {
    toast.error('خطا در بارگذاری اطلاعات داشبورد');
  }

  // Use dashboard stats or defaults
  const stats = dashboardStats?.activities || {
    eventsAttended: 0,
    projectsCompleted: 0,
    coursesCompleted: 0,
    achievementsEarned: 0,
  };

  const overview = dashboardStats?.overview || {
    totalXP: 0,
    level: 'bronze',
    rank: null,
    points: 0,
    memberSince: new Date(),
  };

  const progress = dashboardStats?.progress || {
    weeklyXP: 0,
    monthlyXP: 0,
    streak: 0,
    nextLevelXP: 1000,
  };

  // Transform events data
  const upcomingEvents = (eventsData?.events || []).map(event => ({
    id: event._id,
    title: event.title,
    date: new Date(event.date),
    time: event.time,
    duration: event.duration,
    type: event.type as 'workshop' | 'webinar' | 'competition' | 'meetup',
    location: event.location,
    isOnline: !!event.onlineLink,
    registered: event.registeredParticipants?.includes(user?._id || '') || false,
    capacity: event.capacity,
    registeredCount: event.registered || 0,
  }));

  // Handle stat card clicks
  const handleStatClick = (type: string) => {
    const routes: Record<string, string> = {
      events: '/club-member/events',
      projects: '/club-member/projects',
      courses: '/club-member/courses',
      achievements: '/club-member/achievements',
    };
    if (routes[type]) {
      navigate(routes[type]);
    }
  };

  // Suppress unused variable warning
  console.log('Quick stats available:', quickStats);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden" dir="rtl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#E91E8C]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#a855f7]/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">

        {/* AACO Header - New Brand Design */}
        <AACoHeader
          userName={user?.firstName || 'کاربر'}
          level={overview.level}
          points={overview.points}
          rank={overview.rank}
          streak={progress.streak}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Modern Statistics Cards with AACO Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ModernStatsCard
                title="رویدادها"
                value={stats.eventsAttended}
                subtitle="شرکت کرده"
                icon={Calendar}
                gradient="from-[#00D9FF] to-[#0891b2]"
                trend={{ value: 12, isPositive: true }}
                onClick={() => handleStatClick('events')}
              />
              <ModernStatsCard
                title="پروژه‌ها"
                value={stats.projectsCompleted}
                subtitle="تکمیل شده"
                icon={FolderKanban}
                gradient="from-[#10b981] to-[#059669]"
                trend={{ value: 8, isPositive: true }}
                onClick={() => handleStatClick('projects')}
              />
              <ModernStatsCard
                title="دوره‌ها"
                value={stats.coursesCompleted}
                subtitle="اتمام یافته"
                icon={GraduationCap}
                gradient="from-[#a855f7] to-[#7e22ce]"
                trend={{ value: 15, isPositive: true }}
                onClick={() => handleStatClick('courses')}
              />
              <ModernStatsCard
                title="دستاوردها"
                value={stats.achievementsEarned}
                subtitle="کسب شده"
                icon={Award}
                gradient="from-[#E91E8C] to-[#be185d]"
                trend={{ value: 20, isPositive: true }}
                onClick={() => handleStatClick('achievements')}
              />
            </div>

            {/* Performance KPIs - Inspired by Director Dashboard */}
            <PerformanceKPIs />

            {/* Modern Activity Timeline */}
            <ModernActivityTimeline
              activities={activityData?.activities || []}
              loading={activityLoading}
            />

            {/* Modern Quick Actions */}
            <ModernQuickActions />

            {/* Modern Upcoming Events */}
            <ModernUpcomingEvents
              events={upcomingEvents}
              loading={!eventsData}
              onViewAll={() => navigate('/club-member/events')}
            />

          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">

            {/* Modern XP Progress Widget */}
            <ModernXPWidget
              currentXP={overview.totalXP}
              nextLevelXP={progress.nextLevelXP}
              weeklyXP={progress.weeklyXP}
              monthlyXP={progress.monthlyXP}
            />

            {/* Leaderboard Widget */}
            <LeaderboardWidget currentUserRank={overview.rank || undefined} />

            {/* Achievements Showcase */}
            <AchievementsShowcase />

            {/* Membership Progress */}
            <MembershipProgressCard
              currentLevel={overview.level as MembershipLevel}
              currentPoints={overview.points}
            />

          </div>

        </div>

      </div>
    </div>
  );
}
