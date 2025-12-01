import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart,
  MessageCircle,
  ThumbsUp,
  Award,
  TrendingUp,
  Calendar,
  BookOpen,
  Target,
  User,
  Sparkles,
  Send,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { CommunityActivity } from '@/hooks/useActivities';

// Activity type icons
const activityIcons: Record<string, any> = {
  project_completed: Target,
  achievement_earned: Award,
  event_attended: Calendar,
  course_completed: BookOpen,
  skill_added: TrendingUp,
  connection_made: User,
  profile_updated: User,
  post_created: MessageCircle,
};

// Activity type colors
const activityColors: Record<string, string> = {
  project_completed: 'text-green-600 bg-green-50',
  achievement_earned: 'text-amber-600 bg-amber-50',
  event_attended: 'text-blue-600 bg-blue-50',
  course_completed: 'text-purple-600 bg-purple-50',
  skill_added: 'text-cyan-600 bg-cyan-50',
  connection_made: 'text-pink-600 bg-pink-50',
  profile_updated: 'text-gray-600 bg-gray-50',
  post_created: 'text-indigo-600 bg-indigo-50',
};

// Activity type labels (Persian)
const activityLabels: Record<string, string> = {
  project_completed: 'پروژه تکمیل شد',
  achievement_earned: 'دستاورد کسب شد',
  event_attended: 'شرکت در رویداد',
  course_completed: 'دوره تکمیل شد',
  skill_added: 'مهارت افزوده شد',
  connection_made: 'ارتباط جدید',
  profile_updated: 'پروفایل به‌روزرسانی شد',
  post_created: 'پست جدید',
};

interface ActivityFeedProps {
  activities: CommunityActivity[];
  onReact?: (activityId: string, type: 'like' | 'love' | 'clap') => void;
  onComment?: (activityId: string, content: string) => void;
}

export default function ActivityFeed({ activities, onReact, onComment }: ActivityFeedProps) {
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  };

  const getRelativeTime = (date: Date | string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return 'لحظاتی پیش';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} دقیقه پیش`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ساعت پیش`;
    return `${Math.floor(seconds / 86400)} روز پیش`;
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type] || MessageCircle;
        const colorClass = activityColors[activity.type] || 'text-gray-600 bg-gray-50';
        const label = activityLabels[activity.type] || activity.type;

        return (
          <motion.div
            key={activity._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-lg font-bold text-blue-600 flex-shrink-0">
                    {activity.userId?.avatar ? (
                      <img
                        src={activity.userId.avatar}
                        alt={activity.userId.firstName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(activity.userId?.firstName || '', activity.userId?.lastName || '')
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-bold text-gray-900">
                        {activity.userId?.firstName} {activity.userId?.lastName}
                      </h4>
                      {activity.userId?.membershipInfo?.membershipLevel && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.userId.membershipInfo.membershipLevel}
                        </Badge>
                      )}
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${colorClass}`}>
                        <Icon className="h-3 w-3" />
                        <span className="text-xs font-medium">{label}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{getRelativeTime(activity.createdAt)}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4 pr-16">
                  <h3 className="font-semibold text-gray-900 mb-2">{activity.title}</h3>
                  <p className="text-gray-700 text-sm mb-3">{activity.description}</p>
                  
                  {activity.content && (
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                      {activity.content}
                    </p>
                  )}

                  {/* Images */}
                  {activity.images && activity.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {activity.images.slice(0, 4).map((image, idx) => (
                        <img
                          key={`${activity._id}-image-${idx}`}
                          src={image}
                          alt={`فعالیت ${idx + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-100 pr-16">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-pink-600 transition-colors"
                    onClick={() => onReact?.(activity._id, 'like')}
                  >
                    <Heart className="h-4 w-4 ml-1" />
                    <span className="text-sm">
                      {activity.reactions?.filter(r => r.type === 'like').length || 0}
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-amber-600 transition-colors"
                    onClick={() => onReact?.(activity._id, 'love')}
                  >
                    <Sparkles className="h-4 w-4 ml-1" />
                    <span className="text-sm">
                      {activity.reactions?.filter(r => r.type === 'love').length || 0}
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => onReact?.(activity._id, 'clap')}
                  >
                    <ThumbsUp className="h-4 w-4 ml-1" />
                    <span className="text-sm">
                      {activity.reactions?.filter(r => r.type === 'clap').length || 0}
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-green-600 transition-colors"
                    onClick={() => setShowComments(prev => ({ ...prev, [activity._id]: !prev[activity._id] }))}
                  >
                    <MessageCircle className="h-4 w-4 ml-1" />
                    <span className="text-sm">{activity.comments?.length || 0}</span>
                  </Button>
                </div>

                {/* Comments Section */}
                {showComments[activity._id] && (
                  <div className="mt-4 pr-16 space-y-3">
                    {/* Existing Comments */}
                    {activity.comments && activity.comments.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {activity.comments.map((comment) => (
                          <div key={comment._id} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 mb-1">
                                  {comment.userId?.firstName} {comment.userId?.lastName}
                                </p>
                                <p className="text-sm text-gray-700">{comment.content}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {getRelativeTime(new Date(comment.createdAt))}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="نظر خود را بنویسید..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                        value={commentInputs[activity._id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [activity._id]: e.target.value }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && commentInputs[activity._id]?.trim()) {
                            onComment?.(activity._id, commentInputs[activity._id]);
                            setCommentInputs(prev => ({ ...prev, [activity._id]: '' }));
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        className="bg-cyan-600 hover:bg-cyan-700"
                        onClick={() => {
                          if (commentInputs[activity._id]?.trim()) {
                            onComment?.(activity._id, commentInputs[activity._id]);
                            setCommentInputs(prev => ({ ...prev, [activity._id]: '' }));
                          }
                        }}
                        disabled={!commentInputs[activity._id]?.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
