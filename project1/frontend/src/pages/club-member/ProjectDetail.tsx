import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowRight,
    Users,
    Calendar,
    Target,
    Code,
    ExternalLink,
    Github,
    FileText,
    Edit,
    Trash2,
    UserPlus,
    UserMinus,
    Loader2,
    Eye,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import {
    useProject,
    useJoinProject,
    useLeaveProject,
    useDeleteProject,
    useUpdateProject,
    useAddMilestone,
    useUpdateMilestone,
} from '@/hooks/useProjects';
import { MilestoneList } from '@/components/club-member/milestones';
import EditProjectModal from '@/components/club-member/EditProjectModal';
import { useAuthStore } from '@/store/authStore';
import {
    getProjectStatusLabel,
    getProjectStatusColor,
    getProjectCategoryLabel,
    getProjectCategoryColor,
    getMemberRoleLabel,
    getMemberRoleColor,
    formatProjectDate,
    isUserInTeam,
    getUserRole,
    getTeamSize,
    getSpotsLeft,
    MemberRole,
} from '@/types/project';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    const { data: project, isLoading, error } = useProject(id!);
    const { mutate: joinProject, isPending: isJoining } = useJoinProject();
    const { mutate: leaveProject, isPending: isLeaving } = useLeaveProject();
    const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();
    const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
    const { mutate: addMilestone, isPending: isAddingMilestone } = useAddMilestone();
    const { mutate: updateMilestone, isPending: isUpdatingMilestone } = useUpdateMilestone();

    const [selectedRole] = useState<MemberRole>(MemberRole.DEVELOPER);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleAddMilestone = (data: any) => {
        addMilestone({ projectId: project!._id, data });
    };

    const handleEditMilestone = (milestoneId: string, data: any) => {
        updateMilestone({ projectId: project!._id, milestoneId, data });
    };

    const handleMilestoneStatusChange = (milestoneId: string, newStatus: string) => {
        updateMilestone({
            projectId: project!._id,
            milestoneId,
            data: { status: newStatus as any, completedAt: new Date().toISOString() },
        });
    };

    const handleUpdateProject = (data: any) => {
        updateProject(
            { id: project!._id, data },
            {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30 p-4 md:p-6" dir="rtl">
                <div className="max-w-[1400px] mx-auto">
                    <LoadingSkeleton type="card" count={3} />
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30 p-4 md:p-6" dir="rtl">
                <div className="max-w-[1400px] mx-auto">
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-6 text-center">
                            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-red-900 mb-2">پروژه یافت نشد</h3>
                            <p className="text-red-700 mb-4">پروژه مورد نظر وجود ندارد یا حذف شده است.</p>
                            <Button onClick={() => navigate('/club-member/projects')}>
                                بازگشت به لیست پروژه‌ها
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const isInTeam = isUserInTeam(project, user?._id || '');
    const userRole = getUserRole(project, user?._id || '');
    const isCreator = project.createdBy._id === user?._id;
    const isLeader = userRole === MemberRole.LEADER;
    const canEdit = isCreator || isLeader;
    const teamSize = getTeamSize(project);
    const spotsLeft = getSpotsLeft(project);

    const handleJoin = () => {
        joinProject({ projectId: project._id, role: selectedRole });
    };

    const handleLeave = () => {
        if (confirm('آیا مطمئن هستید که می‌خواهید از این پروژه خارج شوید؟')) {
            leaveProject(project._id);
        }
    };

    const handleDelete = () => {
        if (confirm('آیا مطمئن هستید که می‌خواهید این پروژه را حذف کنید؟ این عمل قابل بازگشت نیست.')) {
            deleteProject(project._id);
            navigate('/club-member/projects');
        }
    };

    const statusColorClasses = {
        blue: 'bg-blue-100 text-blue-800 border-blue-200',
        green: 'bg-green-100 text-green-800 border-green-200',
        purple: 'bg-purple-100 text-purple-800 border-purple-200',
        gray: 'bg-gray-100 text-gray-800 border-gray-200',
        orange: 'bg-orange-100 text-orange-800 border-orange-200',
        red: 'bg-red-100 text-red-800 border-red-200',
        amber: 'bg-amber-100 text-amber-800 border-amber-200',
        cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        pink: 'bg-pink-100 text-pink-800 border-pink-200',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-emerald-50/20 to-teal-50/30 p-4 md:p-6" dir="rtl">
            <div className="max-w-[1400px] mx-auto space-y-6">

                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/club-member/projects')}
                    className="mb-4"
                >
                    <ArrowRight className="h-4 w-4 ml-2" />
                    بازگشت به لیست پروژه‌ها
                </Button>

                {/* Project Header */}
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between flex-wrap gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                    <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                                    <Badge className={statusColorClasses[getProjectStatusColor(project.status) as keyof typeof statusColorClasses]}>
                                        {getProjectStatusLabel(project.status)}
                                    </Badge>
                                    <Badge className={statusColorClasses[getProjectCategoryColor(project.category) as keyof typeof statusColorClasses]}>
                                        {getProjectCategoryLabel(project.category)}
                                    </Badge>
                                </div>

                                <p className="text-gray-700 text-lg mb-4">{project.description}</p>

                                <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>{teamSize} / {project.maxTeamSize} اعضا</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatProjectDate(project.startDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Target className="h-4 w-4" />
                                        <span>{project.progress}% پیشرفت</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        <span>{project.viewCount} بازدید</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {canEdit && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsEditModalOpen(true)}
                                        >
                                            <Edit className="h-4 w-4 ml-2" />
                                            ویرایش
                                        </Button>
                                        {isCreator && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleDelete}
                                                disabled={isDeleting}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                {isDeleting ? (
                                                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4 ml-2" />
                                                )}
                                                حذف
                                            </Button>
                                        )}
                                    </>
                                )}

                                {!isInTeam && spotsLeft > 0 && (
                                    <Button
                                        onClick={handleJoin}
                                        disabled={isJoining}
                                        className="bg-gradient-to-r from-green-500 to-emerald-500"
                                    >
                                        {isJoining ? (
                                            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                        ) : (
                                            <UserPlus className="h-4 w-4 ml-2" />
                                        )}
                                        پیوستن به پروژه
                                    </Button>
                                )}

                                {isInTeam && !isCreator && (
                                    <Button
                                        variant="outline"
                                        onClick={handleLeave}
                                        disabled={isLeaving}
                                    >
                                        {isLeaving ? (
                                            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                        ) : (
                                            <UserMinus className="h-4 w-4 ml-2" />
                                        )}
                                        خروج از پروژه
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">پیشرفت پروژه</span>
                                <span className="text-sm font-bold text-green-600">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Technologies */}
                        {project.technologies && project.technologies.length > 0 && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Code className="h-5 w-5 text-green-600" />
                                        تکنولوژی‌ها
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech, index) => (
                                            <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Goals */}
                        {project.goals && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Target className="h-5 w-5 text-blue-600" />
                                        اهداف پروژه
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{project.goals}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Challenges */}
                        {project.challenges && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-orange-600" />
                                        چالش‌ها
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{project.challenges}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Achievements */}
                        {project.achievements && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        دستاوردها
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{project.achievements}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Milestones */}
                        <MilestoneList
                            milestones={project.milestones || []}
                            canEdit={canEdit}
                            onAdd={canEdit ? handleAddMilestone : undefined}
                            onEdit={canEdit ? handleEditMilestone : undefined}
                            onStatusChange={canEdit ? handleMilestoneStatusChange : undefined}
                            isLoading={isAddingMilestone || isUpdatingMilestone}
                        />

                        {/* Links */}
                        {(project.repositoryUrl || project.demoUrl || project.documentationUrl) && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <ExternalLink className="h-5 w-5 text-blue-600" />
                                        لینک‌ها
                                    </h3>
                                    <div className="space-y-2">
                                        {project.repositoryUrl && (
                                            <a
                                                href={project.repositoryUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                                            >
                                                <Github className="h-4 w-4" />
                                                مخزن کد (Repository)
                                            </a>
                                        )}
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                دمو پروژه
                                            </a>
                                        )}
                                        {project.documentationUrl && (
                                            <a
                                                href={project.documentationUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                                            >
                                                <FileText className="h-4 w-4" />
                                                مستندات
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">

                        {/* Team Members */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-purple-600" />
                                    اعضای تیم ({teamSize}/{project.maxTeamSize})
                                </h3>

                                {spotsLeft > 0 && (
                                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm text-green-800">
                                            {spotsLeft} جای خالی باقی مانده است
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {project.teamMembers.map((member, index) => {
                                        // Handle both populated and unpopulated userId
                                        const userId = typeof member.userId === 'object' ? member.userId : null;
                                        const firstName = userId?.firstName || 'کاربر';
                                        const lastName = userId?.lastName || '';

                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                                                    {firstName[0]}{lastName[0] || ''}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 truncate">
                                                        {firstName} {lastName}
                                                    </p>
                                                    <Badge className={`text-xs ${statusColorClasses[getMemberRoleColor(member.role) as keyof typeof statusColorClasses]}`}>
                                                        {getMemberRoleLabel(member.role)}
                                                    </Badge>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Project Info */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">اطلاعات پروژه</h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-gray-600">ایجاد شده توسط:</span>
                                        <p className="font-semibold text-gray-900">
                                            {typeof project.createdBy === 'object'
                                                ? `${project.createdBy.firstName || ''} ${project.createdBy.lastName || ''}`
                                                : 'کاربر'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">تاریخ شروع:</span>
                                        <p className="font-semibold text-gray-900">
                                            {formatProjectDate(project.startDate)}
                                        </p>
                                    </div>
                                    {project.endDate && (
                                        <div>
                                            <span className="text-gray-600">تاریخ پایان:</span>
                                            <p className="font-semibold text-gray-900">
                                                {formatProjectDate(project.endDate)}
                                            </p>
                                        </div>
                                    )}
                                    {project.completedAt && (
                                        <div>
                                            <span className="text-gray-600">تاریخ تکمیل:</span>
                                            <p className="font-semibold text-gray-900">
                                                {formatProjectDate(project.completedAt)}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-gray-600">وضعیت:</span>
                                        <p className="font-semibold text-gray-900">
                                            {project.isPublic ? 'عمومی' : 'خصوصی'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">تاریخ ایجاد:</span>
                                        <p className="font-semibold text-gray-900">
                                            {formatProjectDate(project.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">برچسب‌ها</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Edit Project Modal */}
                {canEdit && (
                    <EditProjectModal
                        open={isEditModalOpen}
                        onOpenChange={setIsEditModalOpen}
                        project={project}
                        onSubmit={handleUpdateProject}
                        isLoading={isUpdating}
                    />
                )}
            </div>
        </div>
    );
}
