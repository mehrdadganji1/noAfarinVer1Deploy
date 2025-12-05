import { useState } from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Award, 
  Target, 
  Link as LinkIcon, 
  Camera, 
  Edit3, 
  Mail, 
  Phone, 
  CheckCircle2,
  Circle,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
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

// Tab configuration
const TABS = [
  { value: "education", icon: GraduationCap, label: "تحصیلات" },
  { value: "experience", icon: Briefcase, label: "سوابق کاری" },
  { value: "certifications", icon: Award, label: "گواهینامه‌ها" },
  { value: "skills", icon: Target, label: "مهارت‌ها" },
  { value: "social", icon: LinkIcon, label: "شبکه‌های اجتماعی" },
];

// Completion item to tab mapping
const TAB_MAPPING: Record<string, string> = {
  'bio': 'education',
  'education': 'education',
  'experience': 'experience',
  'skills': 'skills',
  'certifications': 'certifications',
  'social': 'social',
};

export default function Profile() {
  const controller = useProfileController();
  const { profile, isLoading } = controller;
  const [activeTab, setActiveTab] = useState('education');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50/50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-violet-100" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 animate-spin" />
          </div>
          <p className="text-slate-500 text-sm font-medium">در حال دریافت اطلاعات...</p>
        </motion.div>
      </div>
    );
  }

  const completionItems = controller.getCompletionItems();
  const completedCount = completionItems.filter(i => i.completed).length;
  const completionPercent = Math.round((completedCount / completionItems.length) * 100);

  const stats = [
    { key: 'education', value: profile?.educationHistory?.length || 0, icon: GraduationCap },
    { key: 'experience', value: profile?.workExperience?.length || 0, icon: Briefcase },
    { key: 'certifications', value: profile?.certifications?.length || 0, icon: Award },
    { key: 'skills', value: profile?.skills?.length || 0, icon: Target },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-violet-50/30" dir="rtl">
      <div className="flex flex-col h-full">
        
        {/* Minimal Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden"
        >
          {/* Background with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-l from-violet-600 via-purple-600 to-indigo-700" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="relative px-4 py-5 md:px-8 md:py-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-4 md:gap-6">
                
                {/* Avatar */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative group flex-shrink-0"
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden shadow-2xl">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xl md:text-3xl font-bold bg-gradient-to-br from-white/20 to-white/5">
                        {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => controller.setIsPhotoModalOpen(true)}
                    className="absolute -bottom-1 -left-1 w-7 h-7 md:w-8 md:h-8 bg-white rounded-xl shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <Camera className="w-3.5 h-3.5 md:w-4 md:h-4 text-violet-600" />
                  </button>
                </motion.div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                    <h1 className="text-lg md:text-2xl font-bold text-white truncate">
                      {profile?.firstName} {profile?.lastName}
                    </h1>
                    <span className="px-2 py-0.5 bg-emerald-400/20 text-emerald-200 text-[10px] md:text-xs rounded-full font-medium backdrop-blur-sm">
                      فعال
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-white/70 text-xs md:text-sm">
                    <span className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate max-w-[150px] md:max-w-[200px]">{profile?.email}</span>
                    </span>
                    {profile?.phoneNumber && (
                      <span className="hidden sm:flex items-center gap-1.5 direction-ltr">
                        <Phone className="w-3.5 h-3.5" />
                        {profile.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="hidden md:flex items-center gap-4">
                  {/* Mini Stats */}
                  <div className="flex items-center gap-1.5">
                    {stats.map(stat => (
                      <motion.div 
                        key={stat.key}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10"
                      >
                        <stat.icon className="w-4 h-4 text-white/60" />
                        <span className="text-white font-semibold text-sm">{stat.value}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Completion Ring */}
                  <div className="relative w-14 h-14">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                      <motion.circle 
                        cx="28" cy="28" r="24" 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="4" 
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 151" }}
                        animate={{ strokeDasharray: `${completionPercent * 1.51} 151` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{completionPercent}%</span>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <Button
                    onClick={() => controller.setIsEditProfileModalOpen(true)}
                    size="sm"
                    className="bg-white/15 hover:bg-white/25 text-white border-0 backdrop-blur-sm"
                  >
                    <Edit3 className="w-4 h-4 ml-1.5" />
                    ویرایش
                  </Button>
                </div>

                {/* Mobile Actions */}
                <div className="flex md:hidden items-center gap-2">
                  <div className="relative w-10 h-10">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                      <circle cx="20" cy="20" r="16" fill="none" stroke="white" strokeWidth="3" strokeDasharray={`${completionPercent * 1.01} 101`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">{completionPercent}%</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => controller.setIsEditProfileModalOpen(true)}
                    size="sm"
                    className="bg-white/15 hover:bg-white/25 text-white border-0 text-xs px-2.5 h-8"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar - Completion Checklist */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden xl:flex w-72 bg-white/80 backdrop-blur-sm border-l border-slate-100 p-5 flex-col flex-shrink-0"
          >
            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">تکمیل پروفایل</h3>
              </div>
              <p className="text-xs text-slate-500 mr-10">پروفایل کامل‌تر = فرصت بیشتر</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-500">{completedCount} از {completionItems.length} مورد</span>
                <span className="font-bold text-violet-600">{completionPercent}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-l from-violet-500 to-purple-600 rounded-full"
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="flex-1 space-y-2 overflow-y-auto">
              {completionItems.map((item, idx) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    setActiveTab(TAB_MAPPING[item.id] || 'education');
                    item.action?.();
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-right transition-all group ${
                    item.completed
                      ? 'bg-emerald-50/80 hover:bg-emerald-100/80'
                      : 'bg-slate-50/80 hover:bg-violet-50/80'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    item.completed 
                      ? 'text-emerald-500' 
                      : 'text-slate-300 group-hover:text-violet-400'
                  }`}>
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-sm flex-1 truncate ${
                    item.completed ? 'text-emerald-700' : 'text-slate-600 group-hover:text-violet-700'
                  }`}>
                    {item.label}
                  </span>
                  {!item.completed && (
                    <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-violet-400 transition-colors" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Continue Button */}
            <Button
              className="w-full mt-4 bg-gradient-to-l from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-200/50"
              onClick={() => {
                const nextItem = completionItems.find(i => !i.completed);
                if (nextItem) {
                  setActiveTab(TAB_MAPPING[nextItem.id] || 'education');
                  nextItem.action?.();
                }
              }}
            >
              ادامه تکمیل
            </Button>
          </motion.aside>

          {/* Main Content Area */}
          <div className="flex-1 p-3 md:p-6 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col" dir="rtl">
              
              {/* Modern Tab Bar */}
              <TabsList className="bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-slate-100 mb-4 grid grid-cols-5 gap-1 shrink-0">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="relative data-[state=active]:bg-gradient-to-l data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-violet-200/50 py-2.5 md:py-3 rounded-xl transition-all text-xs md:text-sm font-medium flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2"
                  >
                    <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline truncate">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Tab Content */}
              <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 overflow-y-auto">
                <TabsContent value="education" className="mt-0 h-full" forceMount={activeTab === 'education' ? true : undefined}>
                  <motion.div
                    key="education"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <ModernEducationSection
                      educationHistory={profile?.educationHistory || []}
                      onAdd={controller.handleAddEducation}
                      onEdit={controller.handleEditEducation}
                      onDelete={controller.handleDeleteEducation}
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="experience" className="mt-0 h-full" forceMount={activeTab === 'experience' ? true : undefined}>
                  <motion.div
                    key="experience"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <ModernExperienceSection
                      workExperience={profile?.workExperience || []}
                      onAdd={controller.handleAddExperience}
                      onEdit={controller.handleEditExperience}
                      onDelete={controller.handleDeleteExperience}
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="certifications" className="mt-0 h-full" forceMount={activeTab === 'certifications' ? true : undefined}>
                  <motion.div
                    key="certifications"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <ModernCertificationsSection
                      certifications={profile?.certifications || []}
                      onAdd={() => controller.setIsCertificationModalOpen(true)}
                      onDelete={controller.handleDeleteCertification}
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="skills" className="mt-0 h-full" forceMount={activeTab === 'skills' ? true : undefined}>
                  <motion.div
                    key="skills"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <ModernSkillsSection
                      skills={profile?.skills || []}
                      onAdd={controller.handleAddSkill}
                      onEdit={controller.handleEditSkill}
                      onDelete={controller.handleDeleteSkill}
                      isLoading={controller.isSkillLoading}
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="social" className="mt-0 h-full" forceMount={activeTab === 'social' ? true : undefined}>
                  <motion.div
                    key="social"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <ModernSocialLinksSection
                      socialLinks={profile?.socialLinks}
                      onSave={controller.handleSaveSocialLinks}
                      isLoading={controller.isSocialLoading}
                    />
                  </motion.div>
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
