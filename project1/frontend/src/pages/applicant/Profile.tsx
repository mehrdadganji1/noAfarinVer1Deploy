import { useState } from 'react';
import { GraduationCap, Briefcase, Award, Target, Link as LinkIcon, Camera, Edit3, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ModernEducationSection } from '@/components/applicant/profile/sections/ModernEducationSection';
import { ModernExperienceSection } from '@/components/applicant/profile/sections/ModernExperienceSection';
import { ModernCertificationsSection } from '@/components/applicant/profile/sections/ModernCertificationsSection';
import { ModernSkillsSection } from '@/components/applicant/profile/sections/ModernSkillsSection';
import { ModernSocialLinksSection } from '@/components/applicant/profile/sections/ModernSocialLinksSection';
import EducationFormModal from '@/components/applicant/EducationFormModal';
import ExperienceFormModal from '@/components/applicant/ExperienceFormModal';
import CertificationFormModal from '@/components/applicant/CertificationFormModal';
import ProfilePhotoModal from '@/components/applicant/ProfilePhotoModal';
import EditProfileModal from '@/components/applicant/profile/EditProfileModal';
import { useProfileController } from '@/hooks/useProfileController';

export default function Profile() {
  const controller = useProfileController();
  const { profile, isLoading } = controller;
  const [activeTab, setActiveTab] = useState('education');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 text-sm">در حال دریافت اطلاعات...</p>
        </div>
      </div>
    );
  }

  const completionItems = controller.getCompletionItems();
  const completedCount = completionItems.filter(i => i.completed).length;
  const completionPercent = Math.round((completedCount / completionItems.length) * 100);

  const stats = [
    { key: 'education', label: 'تحصیلات', value: profile?.educationHistory?.length || 0, icon: GraduationCap, color: 'text-blue-600 bg-blue-100' },
    { key: 'experience', label: 'تجربه کاری', value: profile?.workExperience?.length || 0, icon: Briefcase, color: 'text-violet-600 bg-violet-100' },
    { key: 'certifications', label: 'گواهینامه', value: profile?.certifications?.length || 0, icon: Award, color: 'text-emerald-600 bg-emerald-100' },
    { key: 'skills', label: 'مهارت', value: profile?.skills?.length || 0, icon: Target, color: 'text-rose-600 bg-rose-100' },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50" dir="rtl">
      <div className="flex flex-col">
        {/* Minimal Mobile Header */}
        <div className="bg-gradient-to-l from-indigo-600 via-purple-600 to-violet-700 px-3 py-3 md:px-6 md:py-6">
          {/* Mobile Layout - Horizontal */}
          <div className="flex md:hidden items-center gap-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/30 overflow-hidden">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-base font-bold">
                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                  </div>
                )}
              </div>
              <button
                onClick={() => controller.setIsPhotoModalOpen(true)}
                className="absolute -bottom-0.5 -left-0.5 w-5 h-5 bg-white rounded-lg shadow-lg flex items-center justify-center"
              >
                <Camera className="w-2.5 h-2.5 text-gray-600" />
              </button>
            </div>

            {/* Name & Status */}
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-bold text-white truncate">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-green-400/20 text-green-200 text-[9px] rounded-full">فعال</span>
            </div>

            {/* Completion & Edit */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="relative w-9 h-9">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="white" strokeWidth="2.5" strokeDasharray={`${completionPercent * 0.88} 88`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">{completionPercent}%</span>
                </div>
              </div>
              <Button
                onClick={() => controller.setIsEditProfileModalOpen(true)}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-0 text-[10px] px-2 h-7"
              >
                <Edit3 className="w-3 h-3 ml-1" />
                ویرایش
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center gap-6">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/30 overflow-hidden">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                  </div>
                )}
              </div>
              <button
                onClick={() => controller.setIsPhotoModalOpen(true)}
                className="absolute -bottom-1 -left-1 w-7 h-7 bg-white rounded-lg shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">
                  {profile?.firstName} {profile?.lastName}
                </h1>
                <span className="px-2 py-0.5 bg-green-400/20 text-green-200 text-xs rounded-full">فعال</span>
              </div>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                {profile?.university && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[200px]">{profile.university}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">{profile?.email}</span>
                </span>
                {profile?.phoneNumber && (
                  <span className="flex items-center gap-1 direction-ltr">
                    <Phone className="w-3.5 h-3.5" />
                    {profile.phoneNumber}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2">
                {stats.map(stat => (
                  <div key={stat.key} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg">
                    <stat.icon className="w-4 h-4 text-white/70" />
                    <span className="text-white font-semibold text-sm">{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="relative w-14 h-14">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                  <circle cx="28" cy="28" r="24" fill="none" stroke="white" strokeWidth="4" strokeDasharray={`${completionPercent * 1.51} 151`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{completionPercent}%</span>
                </div>
              </div>

              <Button
                onClick={() => controller.setIsEditProfileModalOpen(true)}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-0 text-sm px-4"
              >
                <Edit3 className="w-4 h-4 ml-1" />
                ویرایش
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Sidebar - Completion Checklist - Hidden on mobile */}
          <div className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-l border-gray-200 p-3 overflow-y-auto hidden xl:flex flex-col flex-shrink-0">
            <div className="mb-3">
              <h3 className="font-semibold text-gray-800 text-sm">تکمیل پروفایل</h3>
              <p className="text-xs text-gray-500">پروفایل کامل‌تر = فرصت بیشتر</p>
            </div>
            <div className="flex-1 space-y-1.5 overflow-y-auto">
              {completionItems.map((item, idx) => {
                // Map completion item to tab
                const tabMapping: Record<string, string> = {
                  'bio': 'education',
                  'education': 'education',
                  'experience': 'experience',
                  'skills': 'skills',
                  'certifications': 'certifications',
                  'social': 'social',
                };
                const targetTab = tabMapping[item.id] || 'education';
                
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => {
                      setActiveTab(targetTab);
                      item.action?.();
                    }}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg text-right transition-all ${
                      item.completed
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                      item.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-white'
                    }`}>
                      {item.completed ? '✓' : idx + 1}
                    </div>
                    <span className="text-xs flex-1 truncate">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
            <Button
              size="sm"
              className="w-full mt-3 bg-gradient-to-l from-purple-600 to-indigo-600 text-xs"
              onClick={() => {
                const nextItem = completionItems.find(i => !i.completed);
                if (nextItem) {
                  const tabMapping: Record<string, string> = {
                    'bio': 'education',
                    'education': 'education',
                    'experience': 'experience',
                    'skills': 'skills',
                    'certifications': 'certifications',
                    'social': 'social',
                  };
                  setActiveTab(tabMapping[nextItem.id] || 'education');
                  nextItem.action?.();
                }
              }}
            >
              ادامه تکمیل
            </Button>
          </div>

          {/* Main Content Area - Fully Responsive */}
          <div className="flex-1 p-2 sm:p-3 md:p-4 flex flex-col overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col" dir="rtl">
              {/* Mobile-First Tab Bar */}
              <TabsList className="bg-white p-0.5 sm:p-1 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 mb-2 sm:mb-3 grid grid-cols-5 gap-0.5 sm:gap-1 shrink-0">
                {[
                  { value: "education", icon: GraduationCap, label: "تحصیلات", fullLabel: "تحصیلات" },
                  { value: "experience", icon: Briefcase, label: "سوابق", fullLabel: "سوابق کاری" },
                  { value: "certifications", icon: Award, label: "گواهی", fullLabel: "گواهینامه‌ها" },
                  { value: "skills", icon: Target, label: "مهارت", fullLabel: "مهارت‌ها" },
                  { value: "social", icon: LinkIcon, label: "شبکه", fullLabel: "شبکه‌های اجتماعی" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-gradient-to-l data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white py-1.5 sm:py-2.5 rounded-md sm:rounded-lg transition-all text-[10px] sm:text-sm font-medium flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5"
                  >
                    <tab.icon className="w-4 h-4 sm:w-4 sm:h-4" />
                    <span className="sm:hidden truncate leading-tight">{tab.label}</span>
                    <span className="hidden sm:inline truncate">{tab.fullLabel}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Tab Content - Responsive Padding */}
              <div className="flex-1 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-2 sm:p-3 md:p-4 overflow-y-auto">
                <TabsContent value="education" className="mt-0 h-full">
                  <ModernEducationSection
                    educationHistory={profile?.educationHistory || []}
                    onAdd={controller.handleAddEducation}
                    onEdit={controller.handleEditEducation}
                    onDelete={controller.handleDeleteEducation}
                  />
                </TabsContent>

                <TabsContent value="experience" className="mt-0 h-full">
                  <ModernExperienceSection
                    workExperience={profile?.workExperience || []}
                    onAdd={controller.handleAddExperience}
                    onEdit={controller.handleEditExperience}
                    onDelete={controller.handleDeleteExperience}
                  />
                </TabsContent>

                <TabsContent value="certifications" className="mt-0 h-full">
                  <ModernCertificationsSection
                    certifications={profile?.certifications || []}
                    onAdd={() => controller.setIsCertificationModalOpen(true)}
                    onDelete={controller.handleDeleteCertification}
                  />
                </TabsContent>

                <TabsContent value="skills" className="mt-0 h-full">
                  <ModernSkillsSection
                    skills={profile?.skills || []}
                    onAdd={controller.handleAddSkill}
                    onEdit={controller.handleEditSkill}
                    onDelete={controller.handleDeleteSkill}
                    isLoading={controller.isSkillLoading}
                  />
                </TabsContent>

                <TabsContent value="social" className="mt-0 h-full">
                  <ModernSocialLinksSection
                    socialLinks={profile?.socialLinks}
                    onSave={controller.handleSaveSocialLinks}
                    isLoading={controller.isSocialLoading}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EducationFormModal
        isOpen={controller.isEducationModalOpen}
        onClose={() => {
          controller.setIsEducationModalOpen(false);
          controller.setEditingEducation(undefined);
        }}
        onSubmit={controller.handleSubmitEducation}
        initialData={controller.editingEducation}
        isLoading={controller.isEducationLoading}
      />

      <ExperienceFormModal
        isOpen={controller.isExperienceModalOpen}
        onClose={() => {
          controller.setIsExperienceModalOpen(false);
          controller.setEditingExperience(undefined);
        }}
        onSubmit={controller.handleSubmitExperience}
        initialData={controller.editingExperience}
        isLoading={controller.isExperienceLoading}
      />

      <CertificationFormModal
        isOpen={controller.isCertificationModalOpen}
        onClose={() => controller.setIsCertificationModalOpen(false)}
        onSubmit={controller.handleSubmitCertification}
        isLoading={controller.isCertificationLoading}
      />

      <EditProfileModal
        isOpen={controller.isEditProfileModalOpen}
        onClose={() => controller.setIsEditProfileModalOpen(false)}
        profile={profile}
        onUpdate={controller.handleProfileUpdate}
      />

      <ProfilePhotoModal
        isOpen={controller.isPhotoModalOpen}
        onClose={() => controller.setIsPhotoModalOpen(false)}
        onUpload={controller.handleUploadPhoto}
        currentPhoto={profile?.avatar}
        isLoading={controller.isPhotoLoading}
      />
    </div>
  );
}
