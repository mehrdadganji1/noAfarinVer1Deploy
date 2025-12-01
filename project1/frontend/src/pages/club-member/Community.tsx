import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  MapPin,
  GraduationCap,
  Award,
  TrendingUp,
  MessageSquare,
  UserPlus,
  Loader2,
  Activity,
  Flame,
  UserMinus,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import SearchBar from '@/components/common/SearchBar';
import FilterSection, { FilterOption } from '@/components/common/FilterSection';
import { useSocket } from '@/contexts/SocketContext';

// API Hooks
import { useMembers } from '@/hooks/useCommunity';
import { useCommunityStats, useTrendingMembers, useActiveMembers } from '@/hooks/useCommunityStats';
import { useFollowMember, useUnfollowMember } from '@/hooks/useConnections';
import { useActivities } from '@/hooks/useActivities';
import { useReactToActivity, useAddComment } from '@/hooks/useActivityActions';
import type { MemberProfile, MemberActivity } from '@/types/community';
import { useQueryClient } from '@tanstack/react-query';

// New Enhanced Components
import { SectionContainer } from '@/components/club-member/SectionHeader';
import ActivityFeed from '@/components/club-member/ActivityFeed';
import MemberProfileModal from '@/components/club-member/MemberProfileModal';

const levelConfig = {
  bronze: { label: 'برنز', color: 'bg-amber-700 text-white' },
  silver: { label: 'نقره', color: 'bg-gray-400 text-gray-900' },
  gold: { label: 'طلا', color: 'bg-yellow-500 text-yellow-900' },
  platinum: { label: 'پلاتین', color: 'bg-purple-500 text-white' },
};

const activityTypeLabels: Record<string, string> = {
  project_completed: 'پروژه تکمیل شده',
  achievement_earned: 'دستاورد کسب شده',
  event_attended: 'شرکت در رویداد',
  course_completed: 'دوره تکمیل شده',
  skill_added: 'مهارت افزوده شده',
  connection_made: 'ارتباط جدید',
  profile_updated: 'پروفایل به‌روز شده',
  post_created: 'پست جدید',
};

const levelFilters: FilterOption[] = [
  { value: 'all', label: 'همه سطوح', count: 156 },
  { value: 'bronze', label: 'برنز', count: 48 },
  { value: 'silver', label: 'نقره', count: 52 },
  { value: 'gold', label: 'طلا', count: 42 },
  { value: 'platinum', label: 'پلاتین', count: 14 },
];

export default function Community() {
  const [activeTab, setActiveTab] = useState<'members' | 'activity'>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [page, _setPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Socket.io
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  // Fetch members
  const { data: membersData, isLoading: membersLoading } = useMembers({
    search: searchQuery || undefined,
    level: selectedLevel !== 'all' ? (selectedLevel as any) : undefined,
    page,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Fetch stats
  const { data: stats } = useCommunityStats();

  // Fetch trending and active members
  const { data: trendingMembers } = useTrendingMembers(7, 5);
  const { data: activeMembers } = useActiveMembers(30, 5);

  // Fetch activities
  const { data: activitiesData, isLoading: activitiesLoading } = useActivities({
    page: 1,
    limit: 20
  });

  // Follow/Unfollow mutations  
  const followMutation = useFollowMember();
  const unfollowMutation = useUnfollowMember();

  // Activity actions
  const reactMutation = useReactToActivity();
  const commentMutation = useAddComment();

  const members = membersData?.data || [];
  const pagination = membersData?.pagination;
  const activities = activitiesData?.data || [];

  const handleFollow = (userId: string) => {
    followMutation.mutate(userId, {
      onSuccess: () => {
        toast.success('با موفقیت دنبال شد');
      },
      onError: () => {
        toast.error('خطا در دنبال کردن');
      }
    });
  };

  const handleUnfollow = (userId: string) => {
    unfollowMutation.mutate(userId, {
      onSuccess: () => {
        toast.success('دنبال کردن لغو شد');
      },
      onError: () => {
        toast.error('خطا در لغو دنبال کردن');
      }
    });
  };

  const handleReact = (activityId: string, type: 'like' | 'love' | 'clap') => {
    reactMutation.mutate({ activityId, type });
  };

  const handleComment = (activityId: string, content: string) => {
    commentMutation.mutate({ activityId, content });
  };

  const handleMemberClick = (member: MemberProfile) => {
    setSelectedMember(member);
    setProfileModalOpen(true);
  };

  // Real-time Socket.io listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for new activities
    socket.on('activity:new', (activity: MemberActivity) => {
      console.log('🔔 New activity:', activity);
      toast.success(`فعالیت جدید از ${activity.userId?.firstName} ${activity.userId?.lastName}`);

      // Invalidate activities query to refetch
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['communityStats'] });
    });

    // Listen for new reactions
    socket.on('activity:reaction', (data: { activityId: string; reaction: any }) => {
      console.log('❤️ New reaction:', data);

      // Update activity in cache
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    });

    // Listen for new comments
    socket.on('activity:comment', (data: { activityId: string; comment: any }) => {
      console.log('💬 New comment:', data);

      // Update activity in cache
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    });

    // Listen for new connections
    socket.on('connection:new', (data: { followerId: string; followingId: string }) => {
      console.log('🤝 New connection:', data);

      // Refresh members list
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['communityStats'] });
    });

    return () => {
      socket.off('activity:new');
      socket.off('activity:reaction');
      socket.off('activity:comment');
      socket.off('connection:new');
    };
  }, [socket, isConnected, queryClient]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-purple-50/30 p-4 md:p-6" dir="rtl">
      <div className="max-w-[1600px] mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
              <Users className="h-9 w-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">شبکه اعضا</h1>
              <p className="text-sm text-gray-600">ارتباط با {stats?.overview.totalMembers || 0}+ عضو فعال باشگاه</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <SectionContainer
          header={{
            title: 'آمار شبکه',
            subtitle: 'وضعیت جامعه اعضا',
            icon: TrendingUp,
            iconColor: 'cyan',
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold">{stats?.overview.totalMembers || 0}</span>
                </div>
                <p className="text-sm font-medium">کل اعضا</p>
                <p className="text-xs text-gray-600">عضو فعال</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold">{stats?.overview.activeMembers || 0}</span>
                </div>
                <p className="text-sm font-medium">اعضای فعال</p>
                <p className="text-xs text-gray-600">فعالیت اخیر</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span className="text-2xl font-bold">{stats?.overview.totalConnections || 0}</span>
                </div>
                <p className="text-sm font-medium">اتصالات</p>
                <p className="text-xs text-gray-600">کل ارتباطات</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <span className="text-2xl font-bold">{stats?.overview.totalActivities || 0}</span>
                </div>
                <p className="text-sm font-medium">فعالیت‌ها</p>
                <p className="text-xs text-gray-600">فعالیت ثبت شده</p>
              </CardContent>
            </Card>
          </div>
        </SectionContainer>

        {/* Trending Topics */}
        {false && (
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Flame className="h-5 w-5 text-orange-500" />
                <h3 className="font-bold text-gray-900">موضوعات داغ</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[].map((topic: any, index: number) => (
                  <Badge key={`${topic.type}-${index}`} variant="secondary" className="text-sm py-2 px-4">
                    <span className="ml-2">{activityTypeLabels[topic.type] || topic.type}</span>
                    <span className="text-orange-600 font-bold">{topic.count}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trending & Active Members Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trending Members */}
          {trendingMembers && trendingMembers.length > 0 && (
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <h3 className="font-bold text-gray-900">اعضای پرطرفدار</h3>
                  <Badge variant="secondary" className="mr-auto">7 روز اخیر</Badge>
                </div>
                <div className="space-y-3">
                  {trendingMembers.map((member: any, index: number) => (
                    <div
                      key={`trending-${member.userId || member._id || index}`}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-transparent rounded-lg hover:from-purple-100 transition-all"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {member.activityCount} فعالیت • {member.totalReactions} واکنش
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{member.score}</div>
                        <div className="text-xs text-gray-500">امتیاز</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Members */}
          {activeMembers && activeMembers.length > 0 && (
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="h-5 w-5 text-green-500" />
                  <h3 className="font-bold text-gray-900">فعال‌ترین اعضا</h3>
                  <Badge variant="secondary" className="mr-auto">30 روز اخیر</Badge>
                </div>
                <div className="space-y-3">
                  {activeMembers.map((member: any, index: number) => (
                    <div
                      key={`active-${member.userId || member._id || index}`}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-transparent rounded-lg hover:from-green-100 transition-all"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {member.activityCount} فعالیت در {member.daysActive} روز
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{member.activityCount}</div>
                        <div className="text-xs text-gray-500">فعالیت</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'members'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Users className="inline-block h-5 w-5 ml-2" />
            اعضا ({pagination?.total || 0})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'activity'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Activity className="inline-block h-5 w-5 ml-2" />
            فعالیت‌ها
          </button>
        </div>

        {/* Content */}
        {activeTab === 'members' ? (
          <>
            {/* Search & Filter */}
            <Card className="border-l-4 border-l-cyan-500">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="جستجو بر اساس نام، دانشگاه، مهارت..."
                    />
                  </div>
                  <FilterSection
                    title="سطح عضویت"
                    options={levelFilters}
                    selected={selectedLevel}
                    onSelect={setSelectedLevel}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Members Grid */}
            <SectionContainer
              header={{
                title: `${pagination?.total || 0} عضو`,
                subtitle: 'لیست اعضای باشگاه',
                icon: Users,
                iconColor: 'cyan',
                badge: members.length,
              }}
            >
              {membersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>هیچ عضوی یافت نشد</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map((member: MemberProfile, index: number) => (
                    <motion.div
                      key={member._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-cyan-500 hover:scale-105 cursor-pointer"
                        onClick={() => handleMemberClick(member)}
                      >
                        <CardContent className="p-6">
                          {/* Avatar & Info */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                              {member.userId?.firstName?.[0] || ''}{member.userId?.lastName?.[0] || ''}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-lg mb-1">
                                {member.userId?.firstName} {member.userId?.lastName}
                              </h3>
                              <Badge className={member.userId?.membershipInfo?.level ? levelConfig[member.userId.membershipInfo.level.toLowerCase() as keyof typeof levelConfig]?.color : 'bg-gray-400'}>
                                {member.userId?.membershipInfo?.level || 'Bronze'}
                              </Badge>
                            </div>
                          </div>

                          {/* Bio */}
                          {member.bio && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {member.bio}
                            </p>
                          )}

                          {/* Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <GraduationCap className="h-4 w-4 text-blue-600" />
                              <span className="line-clamp-1">{member.userId?.university || 'نامشخص'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <MapPin className="h-4 w-4 text-green-600" />
                              <span className="line-clamp-1">{member.userId?.major || 'نامشخص'}</span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-center">
                              <p className="text-lg font-bold text-purple-600">{member.userId?.membershipInfo?.points || 0}</p>
                              <p className="text-xs text-gray-600">امتیاز</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-blue-600">{member.featuredProjects?.length || 0}</p>
                              <p className="text-xs text-gray-600">پروژه</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-orange-600">#{member.stats?.profileViews || 0}</p>
                              <p className="text-xs text-gray-600">رتبه</p>
                            </div>
                          </div>

                          {/* Skills */}
                          {member.skills && member.skills.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs text-gray-500 mb-2">مهارت‌ها:</p>
                              <div className="flex flex-wrap gap-1">
                                {member.skills.slice(0, 3).map((skill) => (
                                  <Badge key={skill.name} variant="secondary" className="text-xs">
                                    {skill.name}
                                  </Badge>
                                ))}
                                {member.skills.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{member.skills.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button variant="default" size="sm" className="flex-1">
                              <MessageSquare className="h-4 w-4 ml-2" />
                              پیام
                            </Button>
                            {member.isFollowing ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleUnfollow(member.userId._id)}
                                disabled={unfollowMutation.isPending}
                              >
                                {unfollowMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                ) : (
                                  <UserMinus className="h-4 w-4 ml-2" />
                                )}
                                لغو دنبال
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleFollow(member.userId._id)}
                                disabled={followMutation.isPending}
                              >
                                {followMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                ) : (
                                  <UserPlus className="h-4 w-4 ml-2" />
                                )}
                                دنبال کردن
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </SectionContainer>
          </>
        ) : (
          // Activity Feed Tab
          <SectionContainer
            header={{
              title: 'فعالیت‌های اخیر',
              subtitle: 'آخرین فعالیت‌های اعضای باشگاه',
              icon: Activity,
              iconColor: 'cyan',
            }}
          >
            {activitiesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>هیچ فعالیتی یافت نشد</p>
              </div>
            ) : (
              <ActivityFeed
                activities={activities}
                onReact={handleReact}
                onComment={handleComment}
              />
            )}
          </SectionContainer>
        )}

      </div>

      {/* Member Profile Modal */}
      <MemberProfileModal
        member={selectedMember}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </div>
  );
}
