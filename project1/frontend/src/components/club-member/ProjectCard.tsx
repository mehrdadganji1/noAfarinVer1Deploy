import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  GitBranch,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Project, getTeamSize, getSpotsLeft, isUserInTeam, getUserRole } from '@/types/project';
import { useAuthStore } from '@/store/authStore';

interface ProjectCardProps {
  project: Project;
  onJoin?: (projectId: string) => void;
  onLeave?: (projectId: string) => void;
  onViewDetails?: (projectId: string) => void;
  index?: number;
  isLoading?: boolean;
}

const statusConfig = {
  planning: { label: 'برنامه‌ریزی', color: 'bg-gray-100 text-gray-700', icon: Target },
  in_progress: { label: 'در حال اجرا', color: 'bg-blue-100 text-blue-700', icon: TrendingUp },
  review: { label: 'بررسی', color: 'bg-purple-100 text-purple-700', icon: GitBranch },
  completed: { label: 'تکمیل شده', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  on_hold: { label: 'متوقف', color: 'bg-orange-100 text-orange-700', icon: Clock },
  cancelled: { label: 'لغو شده', color: 'bg-red-100 text-red-700', icon: Target },
};

export default function ProjectCard({ project, onJoin, onLeave, onViewDetails, index = 0, isLoading }: ProjectCardProps) {
  const { user } = useAuthStore();
  const statusInfo = statusConfig[project.status] || statusConfig.planning;
  const StatusIcon = statusInfo.icon;
  
  const teamSize = getTeamSize(project);
  const spotsLeft = getSpotsLeft(project);
  const isJoined = user ? isUserInTeam(project, user._id) : false;
  const userRole = user ? getUserRole(project, user._id) : null;
  
  const daysLeft = project.endDate 
    ? Math.ceil((new Date(project.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  
  const completedMilestones = project.milestones?.filter(m => m.status === 'completed').length || 0;
  const totalMilestones = project.milestones?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-xl transition-shadow duration-300 group">
        <CardHeader>
          <div className="flex items-start justify-between mb-3">
            <Badge className={statusInfo.color}>
              <StatusIcon className="h-3 w-3 ml-1" />
              {statusInfo.label}
            </Badge>
            {isJoined && (
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle2 className="h-3 w-3 ml-1" />
                عضو هستید
              </Badge>
            )}
          </div>

          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors mb-2">
            {project.title}
          </CardTitle>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {project.description}
          </p>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">پیشرفت پروژه</span>
              <span className="font-semibold text-gray-900">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent>
          {/* Team Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  تیم پروژه
                </span>
              </div>
              <span className="text-xs text-gray-600">
                {teamSize}/{project.maxTeamSize} نفر
              </span>
            </div>

            {userRole && (
              <div className="text-xs text-gray-600">
                نقش شما: <span className="font-medium text-blue-600">{userRole}</span>
              </div>
            )}
          </div>

          {/* Milestones */}
          {totalMilestones > 0 && (
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>
                {completedMilestones} از {totalMilestones} مایلستون انجام شده
              </span>
            </div>
          )}

          {/* Timeline */}
          <div className="flex items-center justify-between mb-4 p-2 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700">
                {new Date(project.startDate).toLocaleDateString('fa-IR', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            {daysLeft !== null && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className={daysLeft < 7 ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                  {daysLeft > 0 ? `${daysLeft} روز مانده` : 'منقضی شده'}
                </span>
              </div>
            )}
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.technologies.length - 4}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-2">
          {isJoined ? (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onLeave?.(project._id)}
                disabled={isLoading}
              >
                {isLoading ? 'در حال پردازش...' : 'خروج از پروژه'}
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={() => onViewDetails?.(project._id)}
              >
                مشاهده جزئیات
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="default"
                className="flex-1"
                onClick={() => onJoin?.(project._id)}
                disabled={spotsLeft <= 0 || isLoading}
              >
                {isLoading
                  ? 'در حال پردازش...'
                  : spotsLeft <= 0
                  ? 'تکمیل ظرفیت'
                  : 'درخواست پیوستن'}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onViewDetails?.(project._id)}
              >
                جزئیات
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
