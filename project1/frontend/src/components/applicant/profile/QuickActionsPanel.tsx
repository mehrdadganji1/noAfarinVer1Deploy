import { FC } from 'react';
import { motion } from 'framer-motion';
import {
  Edit3,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  Link as LinkIcon,
  FileText,
  Download,
  Share2,
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  color: string;
  onClick: () => void;
}

interface QuickActionsPanelProps {
  onEditProfile: () => void;
  onAddEducation: () => void;
  onAddExperience: () => void;
  onAddCertification: () => void;
  onManageSkills: () => void;
  onManageSocialLinks: () => void;
  onExportPDF?: () => void;
  onShareProfile?: () => void;
}

export const QuickActionsPanel: FC<QuickActionsPanelProps> = ({
  onEditProfile,
  onAddEducation,
  onAddExperience,
  onAddCertification,
  onManageSkills,
  onManageSocialLinks,
  onExportPDF,
  onShareProfile,
}) => {
  const actions: QuickAction[] = [
    {
      id: 'edit',
      label: 'ویرایش پروفایل',
      icon: Edit3,
      color: 'from-blue-500 to-indigo-500',
      onClick: onEditProfile,
    },
    {
      id: 'education',
      label: 'افزودن تحصیلات',
      icon: GraduationCap,
      color: 'from-purple-500 to-pink-500',
      onClick: onAddEducation,
    },
    {
      id: 'experience',
      label: 'افزودن تجربه',
      icon: Briefcase,
      color: 'from-green-500 to-emerald-500',
      onClick: onAddExperience,
    },
    {
      id: 'certification',
      label: 'افزودن گواهینامه',
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
      onClick: onAddCertification,
    },
    {
      id: 'skills',
      label: 'مدیریت مهارت‌ها',
      icon: Code,
      color: 'from-cyan-500 to-blue-500',
      onClick: onManageSkills,
    },
    {
      id: 'social',
      label: 'لینک‌های اجتماعی',
      icon: LinkIcon,
      color: 'from-pink-500 to-rose-500',
      onClick: onManageSocialLinks,
    },
  ];

  const secondaryActions: QuickAction[] = [];

  if (onExportPDF) {
    secondaryActions.push({
      id: 'export',
      label: 'دانلود PDF',
      icon: Download,
      color: 'from-gray-500 to-gray-600',
      onClick: onExportPDF,
    });
  }

  if (onShareProfile) {
    secondaryActions.push({
      id: 'share',
      label: 'اشتراک‌گذاری',
      icon: Share2,
      color: 'from-indigo-500 to-purple-500',
      onClick: onShareProfile,
    });
  }

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          عملیات سریع
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className="group relative p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600"
              >
                {/* Icon Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`} />

                {/* Content */}
                <div className="relative flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                    {action.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Secondary Actions */}
      {secondaryActions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex gap-3">
            {secondaryActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.onClick}
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                >
                  <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {action.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QuickActionsPanel;
