import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, GraduationCap, Briefcase, Zap, BarChart3, GitBranch, LucideIcon } from 'lucide-react';
import OverviewTab from './tabs/OverviewTab.tsx';
import EducationTab from './tabs/EducationTab.tsx';
import ExperienceTab from './tabs/ExperienceTab.tsx';
import SkillsTab from './tabs/SkillsTab.tsx';
import AnalyticsTab from './tabs/AnalyticsTab.tsx';
import ActivityTab from './tabs/ActivityTab.tsx';

interface Tab {
    key: string;
    label: string;
    icon: LucideIcon;
}

const tabs: Tab[] = [
    { key: 'overview', label: 'نمای کلی', icon: Activity },
    { key: 'education', label: 'تحصیلات', icon: GraduationCap },
    { key: 'experience', label: 'تجربیات', icon: Briefcase },
    { key: 'skills', label: 'مهارت‌ها', icon: Zap },
    { key: 'analytics', label: 'آمار', icon: BarChart3 },
    { key: 'activity', label: 'فعالیت', icon: GitBranch },
];

export default function ProfileTabs() {
    const [activeTab, setActiveTab] = useState('overview');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab />;
            case 'education':
                return <EducationTab />;
            case 'experience':
                return <ExperienceTab />;
            case 'skills':
                return <SkillsTab />;
            case 'analytics':
                return <AnalyticsTab />;
            case 'activity':
                return <ActivityTab />;
            default:
                return <OverviewTab />;
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 bg-gray-50/50 overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <motion.button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 min-w-[120px] px-6 py-4 text-sm font-bold transition-all relative ${activeTab === tab.key
                                ? 'text-[#E91E8C] bg-white'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                }`}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Icon className="w-5 h-5" />
                                <span>{tab.label}</span>
                            </div>
                            {activeTab === tab.key && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E91E8C] via-[#a855f7] to-[#00D9FF]"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderTabContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
