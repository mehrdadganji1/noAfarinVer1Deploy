import { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  X,
  MapPin,
  Briefcase,
  Award,
  Users,
  Activity,
  Heart,
  MessageSquare,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Send,
  UserPlus,
  UserMinus,
  Loader2,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MemberProfile } from '@/types/community';
import { getAvailabilityLabel, formatMessageTime } from '@/types/community';
import { useActivities } from '@/hooks/useActivities';
import { useFollowMember, useUnfollowMember } from '@/hooks/useConnections';
import { toast } from 'react-hot-toast';

interface MemberProfileModalProps {
  member: MemberProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const levelConfig = {
  bronze: { label: 'برنز', color: 'bg-amber-700 text-white', textColor: 'text-amber-700' },
  silver: { label: 'نقره', color: 'bg-gray-400 text-gray-900', textColor: 'text-gray-600' },
  gold: { label: 'طلا', color: 'bg-yellow-500 text-yellow-900', textColor: 'text-yellow-600' },
  platinum: { label: 'پلاتین', color: 'bg-purple-500 text-white', textColor: 'text-purple-600' },
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

export default function MemberProfileModal({ member, open, onOpenChange }: MemberProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'activities'>('overview');

  // Fetch member activities
  const { data: activitiesData, isLoading: activitiesLoading } = useActivities({
    page: 1,
    limit: 10
  });

  // Follow/Unfollow mutations
  const followMutation = useFollowMember();
  const unfollowMutation = useUnfollowMember();

  if (!member) return null;

  const memberLevel = member.userId?.membershipInfo?.level?.toString().toLowerCase() || 'bronze';
  const levelStyle = levelConfig[memberLevel as keyof typeof levelConfig] || levelConfig.bronze;

  const memberActivities = activitiesData?.data?.filter(
    (activity: any) => activity.userId?._id === member.userId?._id
  ) || [];

  const handleFollow = () => {
    if (!member.userId?._id) return;

    followMutation.mutate(member.userId._id, {
      onSuccess: () => {
        toast.success('با موفقیت دنبال شد');
      },
      onError: () => {
        toast.error('خطا در دنبال کردن');
      }
    });
  };

  const handleUnfollow = () => {
    if (!member.userId?._id) return;

    unfollowMutation.mutate(member.userId._id, {
      onSuccess: () => {
        toast.success('دنبال کردن لغو شد');
      },
      onError: () => {
        toast.error('خطا در لغو دنبال کردن');
      }
    });
  };

  const socialLinks = [
    { icon: Globe, url: member.website, label: 'وب‌سایت' },
    { icon: Github, url: member.github, label: 'Github' },
    { icon: Linkedin, url: member.linkedin, label: 'LinkedIn' },
    { icon: Twitter, url: member.twitter, label: 'Twitter' },
    { icon: Instagram, url: member.instagram, label: 'Instagram' },
  ].filter(link => link.url);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header with Cover */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end -mt-16 relative z-10">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                  {member.userId?.firstName?.charAt(0)}{member.userId?.lastName?.charAt(0)}
                </div>
                <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${
                  member.availability?.status === 'available' ? 'bg-green-500' :
                  member.availability?.status === 'busy' ? 'bg-orange-500' : 'bg-gray-400'
                }`} />
              </div>

              {/* Name & Title */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {member.userId?.firstName} {member.userId?.lastName}
                  </h2>
                  <Badge className={levelStyle.color}>
                    {levelStyle.label}
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      member.availability?.status === 'available' ? 'bg-green-500' :
                      member.availability?.status === 'busy' ? 'bg-orange-500' : 'bg-gray-400'
                    }`} />
                    {getAvailabilityLabel(member.availability?.status as any)}
                  </Badge>
                </div>
                {member.headline && (
                  <p className="text-gray-600 mt-1 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {member.headline}
                  </p>
                )}
                {member.location && (
                  <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {member.location}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {member.isFollowing ? (
                  <Button
                    onClick={handleUnfollow}
                    disabled={unfollowMutation.isPending}
                    variant="outline"
                    className="gap-2"
                  >
                    {unfollowMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserMinus className="h-4 w-4" />
                    )}
                    لغو دنبال کردن
                  </Button>
                ) : (
                  <Button
                    onClick={handleFollow}
                    disabled={followMutation.isPending}
                    className="gap-2"
                  >
                    {followMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    دنبال کردن
                  </Button>
                )}
                <Button variant="outline" className="gap-2">
                  <Send className="h-4 w-4" />
                  پیام
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
                activeTab === 'overview'
                  ? 'text-cyan-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              اطلاعات کلی
              {activeTab === 'overview' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
                activeTab === 'activities'
                  ? 'text-cyan-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              فعالیت‌ها
              {activeTab === 'activities' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600"
                />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 mt-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Eye className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                      <p className="text-2xl font-bold text-gray-900">
                        {member.stats?.profileViews || 0}
                      </p>
                      <p className="text-xs text-gray-600">بازدید پروفایل</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-6 w-6 mx-auto text-green-500 mb-2" />
                      <p className="text-2xl font-bold text-gray-900">
                        {member.stats?.connectionsCount || 0}
                      </p>
                      <p className="text-xs text-gray-600">ارتباطات</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Award className="h-6 w-6 mx-auto text-amber-500 mb-2" />
                      <p className="text-2xl font-bold text-gray-900">
                        {member.stats?.endorsementsReceived || 0}
                      </p>
                      <p className="text-xs text-gray-600">تاییدیه‌ها</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-6 w-6 mx-auto text-purple-500 mb-2" />
                      <p className="text-2xl font-bold text-gray-900">
                        {member.userId?.membershipInfo?.points || 0}
                      </p>
                      <p className="text-xs text-gray-600">امتیاز</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Bio */}
                {member.bio && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2">درباره من</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{member.bio}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Skills */}
                {member.skills && member.skills.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900 mb-3">مهارت‌ها</h3>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="gap-2">
                            <span>{skill.name}</span>
                            {skill.endorsements > 0 && (
                              <span className="text-xs text-gray-500">
                                +{skill.endorsements}
                              </span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Interests */}
                {member.interests && member.interests.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900 mb-3">علاقه‌مندی‌ها</h3>
                      <div className="flex flex-wrap gap-2">
                        {member.interests.map((interest, idx) => (
                          <Badge key={idx} variant="outline">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Languages */}
                {member.languages && member.languages.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900 mb-3">زبان‌ها</h3>
                      <div className="space-y-2">
                        {member.languages.map((lang, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              {lang.name}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {lang.proficiency === 'native' ? 'زبان مادری' :
                               lang.proficiency === 'fluent' ? 'روان' :
                               lang.proficiency === 'conversational' ? 'مکالمه' : 'مبتدی'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900 mb-3">لینک‌های اجتماعی</h3>
                      <div className="flex flex-wrap gap-2">
                        {socialLinks.map((link, idx) => {
                          const Icon = link.icon;
                          return (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                            >
                              <Icon className="h-4 w-4 text-gray-600" />
                              <span className="text-gray-700">{link.label}</span>
                            </a>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Looking For */}
                {member.availability?.lookingFor && member.availability.lookingFor.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900 mb-3">به دنبال</h3>
                      <div className="flex flex-wrap gap-2">
                        {member.availability.lookingFor.map((item, idx) => (
                          <Badge key={idx} variant="secondary">
                            {item === 'collaboration' ? 'همکاری' :
                             item === 'mentorship' ? 'منتورینگ' :
                             item === 'job' ? 'فرصت شغلی' : 'یادگیری'}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="activities"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 mt-6"
              >
                {activitiesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                  </div>
                ) : memberActivities.length > 0 ? (
                  memberActivities.map((activity: any) => (
                    <Card key={activity._id} className="hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                            {activity.userId?.firstName?.charAt(0)}{activity.userId?.lastName?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <p className="font-semibold text-gray-900">
                                {activity.userId?.firstName} {activity.userId?.lastName}
                              </p>
                              <Badge variant="secondary" className="text-xs">
                                {activityTypeLabels[activity.type] || activity.type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatMessageTime(activity.createdAt)}
                              </span>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-1">{activity.title}</h4>
                            <p className="text-sm text-gray-600">{activity.description}</p>

                            {/* Engagement Stats */}
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                <span>{activity.reactions?.length || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{activity.comments?.length || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{activity.viewsCount || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">هنوز فعالیتی ثبت نشده است</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
