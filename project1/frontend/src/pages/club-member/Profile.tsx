import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useMyMembership } from '@/hooks/useClubMember';
import { Loader2 } from 'lucide-react';
import {
  ProfileHeader,
  ProfileStatsGrid,
  PersonalInfoCard,
  ProfileCompletionCard,
  MembershipInfoCard,
  ProfileTabs,
} from '@/components/club-member/profile';
import { MembershipLevel, MembershipStatus } from '@/types/clubMember';

interface ExtendedUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  createdAt?: string;
  profileCompletion?: number;
  educationHistory?: any[];
  workExperience?: any[];
  skills?: any[];
  [key: string]: any;
}

interface ExtendedMembershipInfo {
  memberId: string;
  memberSince: Date | string;
  level?: MembershipLevel;
  membershipLevel?: MembershipLevel;
  points: number;
  status: MembershipStatus;
  [key: string]: any;
}

export default function ClubMemberProfile() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user) as ExtendedUser;
  const { data: membershipResponse, isLoading: membershipLoading } = useMyMembership();
  const membership = membershipResponse?.data;
  const membershipInfo = membership?.membershipInfo as ExtendedMembershipInfo | undefined;
  const memberStats = membership?.stats;

  const [, setIsSettingsOpen] = useState(false);

  if (membershipLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#E91E8C] mx-auto" />
          <p className="text-lg font-bold text-gray-700">در حال بارگذاری پروفایل...</p>
        </div>
      </div>
    );
  }

  const level = membershipInfo?.level || membershipInfo?.membershipLevel;

  // Calculate missing items for profile completion
  const missingItems: string[] = [];
  if (!user?.bio) missingItems.push('افزودن بیوگرافی');
  if (!user?.phone) missingItems.push('افزودن شماره تماس');
  if (!user?.educationHistory || user.educationHistory.length === 0) missingItems.push('افزودن سوابق تحصیلی');
  if (!user?.workExperience || user.workExperience.length === 0) missingItems.push('افزودن سوابق کاری');
  if (!user?.skills || user.skills.length === 0) missingItems.push('افزودن مهارت‌ها');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#E91E8C]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#a855f7]/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <ProfileHeader
          firstName={user?.firstName}
          lastName={user?.lastName}
          email={user?.email}
          bio={user?.bio}
          level={level}
          onEdit={() => navigate('/club-member/profile/edit')}
          onPreview={() => navigate('/club-member/profile-preview')}
          onSettings={() => setIsSettingsOpen(true)}
        />

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProfileStatsGrid
            projectsCompleted={memberStats?.projectsCompleted}
            achievementsEarned={memberStats?.achievementsEarned}
            coursesCompleted={memberStats?.coursesCompleted}
            points={membershipInfo?.points}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <PersonalInfoCard
              phone={user?.phone}
              address={user?.address}
              memberSince={user?.createdAt}
            />

            <ProfileCompletionCard
              completion={user?.profileCompletion || 0}
              missingItems={missingItems}
            />

            {membershipInfo && (
              <MembershipInfoCard
                level={level}
                status={membershipInfo.status}
                memberSince={membershipInfo.memberSince}
                points={membershipInfo.points}
              />
            )}
          </motion.div>

          {/* Main Content - Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <ProfileTabs />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
