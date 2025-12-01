import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ApplicantRouteGuard } from './components/ApplicantRouteGuard'
import { ApplicantDashboardGuard } from './components/ApplicantDashboardGuard'
import { ApplicantApprovalGuard } from './components/ApplicantApprovalGuard'
import { PendingApplicantGuard } from './components/PendingApplicantGuard'
import RoleBasedRedirect from './components/RoleBasedRedirect'
import Layout from './components/Layout'
import { SocketProvider } from './contexts/SocketContext'
import { UserRole } from './types/roles'
import { suppressExpected404Errors } from './lib/axiosErrorSuppressor'
import Landing from './pages/Landing'
import AboutAACO from './pages/AboutAACO'
import TermsAndConditions from './pages/TermsAndConditions'
import Login from './pages/Login'
import MobileAuth from './pages/MobileAuth'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import EmailVerification from './pages/EmailVerification'
import ResetPassword from './pages/ResetPassword'
import EditEvent from './pages/admin/EditEvent'
import CreateEvent from './pages/admin/CreateEvent'
import CreateTeam from './pages/admin/CreateTeam'
import CreateTraining from './pages/admin/CreateTraining'
import XPLeaderboard from './pages/gamification/Leaderboard'
import GamificationHome from './pages/gamification/GamificationHome'
import GamificationOverview from './pages/gamification/GamificationOverview'
import RewardsShop from './pages/gamification/RewardsShop'
import Challenges from './pages/gamification/Challenges'
import XPHistory from './pages/gamification/XPHistory'
import StreakLeaderboard from './pages/gamification/StreakLeaderboard'
import Unauthorized from './pages/Unauthorized'
import Users from './pages/admin/Users'
import UserProfile from './pages/admin/UserProfile'
import Applications from './pages/admin/Applications'
import AdminDocuments from './pages/admin/Documents'
import Analytics from './pages/admin/Analytics'
import ActivityLog from './pages/admin/ActivityLog'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'
import AdminEvents from './pages/admin/Events'
import AdminTrainings from './pages/admin/Trainings'
import AdminFundings from './pages/admin/Fundings'
import Notifications from './pages/Notifications'
import NotificationAnalytics from './pages/NotificationAnalytics'
import NotificationSettings from './pages/NotificationSettings'
import ApplicantDashboard from './pages/applicant/ApplicantDashboard'
import Documents from './pages/applicant/Documents'
import ApplicantProfile from './pages/applicant/Profile'
import ApplicantInterview from './pages/applicant/Interview'
import ApplicantMessages from './pages/applicant/MessagesChat'
import ApplicantResources from './pages/applicant/Resources'
import ApplicantHelp from './pages/applicant/Help'
import ApplicantOnboarding from './pages/applicant/Onboarding'
import ApplicantNotifications from './pages/applicant/ApplicantNotifications'
// Pending pages - completely independent
import { PendingLayout } from './components/pending/layout/PendingLayout'
import PendingDashboard from './pages/pending/Dashboard'
import PendingProfile from './pages/pending/Profile'
import PendingHelp from './pages/pending/Help'
import PendingStatus from './pages/pending/Status'
import PendingSettings from './pages/pending/Settings'
import AACOApplicationForm from './pages/pending/AACOApplicationForm'
import AACOApplicationView from './pages/pending/AACOApplicationView'
import ClubMemberDashboard from './pages/club-member/ClubMemberDashboard'
import ClubMemberProfile from './pages/club-member/Profile'
import ClubMemberEvents from './pages/club-member/Events'
import ClubMemberEventDetail from './pages/club-member/EventDetail'
import ClubMemberProjects from './pages/club-member/Projects'
import ClubMemberProjectDetail from './pages/club-member/ProjectDetail'
import ClubMemberCreateProject from './pages/club-member/CreateProject'
import ClubMemberCourses from './pages/club-member/Courses'
import ClubMemberCourseDetail from './pages/club-member/CourseDetail'
import ClubMemberCommunity from './pages/club-member/Community'
import ClubMemberIdeasBank from './pages/club-member/IdeasBank'
import ClubMemberTeams from './pages/club-member/Teams'
import { Achievements as ClubMemberAchievements } from './pages/club-member/Achievements'
import AllAchievements from './pages/club-member/AllAchievements'
import PublicProfileView from './pages/club-member/PublicProfileView'
import LearningResources from './pages/club-member/LearningResources'
import ResourceViewer from './pages/club-member/ResourceViewer'
import DirectorDashboard from './pages/director/DirectorDashboard'
import DirectorApplications from './pages/director/Applications'
import ApplicationDetail from './pages/director/ApplicationDetail'
import DirectorEvents from './pages/director/Events'
import DirectorEventDetail from './pages/director/EventDetail'
import DirectorTrainings from './pages/director/Trainings'
import DirectorTrainingDetail from './pages/director/TrainingDetail'
import UserManagement from './pages/director/UserManagement'
import AACoEventApplications from './pages/director/AACoEventApplications'
import AdminDashboard from './pages/admin/Dashboard'
import AACOApplications from './pages/admin/AACOApplications'
import Teams from './pages/admin/Teams'
import TeamDetail from './pages/admin/TeamDetail'
import Events from './pages/admin/Events'
import EventDetail from './pages/admin/EventDetail'
import Trainings from './pages/admin/Trainings'
import TrainingDetail from './pages/admin/TrainingDetail'
import Fundings from './pages/admin/Fundings'

// Initialize error suppressor once
suppressExpected404Errors();

function App() {
  console.log('🚀 App initialized - Landing page is the home page!');
  console.log('Current URL:', window.location.href);
  console.log('Current pathname:', window.location.pathname);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* PUBLIC ROUTES - NO AUTHENTICATION REQUIRED */}
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/about-aaco" element={<AboutAACO />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mobile-auth" element={<MobileAuth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* NOTIFICATIONS - Protected Route with Layout */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <SocketProvider>
                <Layout />
              </SocketProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Notifications />} />
        </Route>
        <Route
          path="/notifications/analytics"
          element={
            <ProtectedRoute>
              <SocketProvider>
                <Layout />
              </SocketProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<NotificationAnalytics />} />
        </Route>
        <Route
          path="/notifications/settings"
          element={
            <ProtectedRoute>
              <SocketProvider>
                <Layout />
              </SocketProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<NotificationSettings />} />
        </Route>

        {/* PENDING APPLICANT ROUTES - Completely independent with single layout */}
        <Route
          path="/pending"
          element={
            <ProtectedRoute requiredRoles={[UserRole.APPLICANT]}>
              <SocketProvider>
                <PendingLayout />
              </SocketProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<PendingDashboard />} />
          <Route path="profile" element={<PendingProfile />} />
          <Route path="settings" element={<PendingSettings />} />
          <Route path="help" element={<PendingHelp />} />
          <Route path="status" element={<PendingStatus />} />
          <Route path="application-form" element={<AACOApplicationForm />} />
          <Route path="aaco-application" element={<AACOApplicationForm />} />
          <Route path="aaco-application-view" element={<AACOApplicationView />} />
        </Route>

        {/* APPLICANT ROUTES - For approved applicants */}
        <Route
          path="/applicant/*"
          element={
            <ProtectedRoute requiredRoles={[UserRole.APPLICANT]}>
              <SocketProvider>
                <PendingApplicantGuard>
                  <ApplicantApprovalGuard>
                    <Layout />
                  </ApplicantApprovalGuard>
                </PendingApplicantGuard>
              </SocketProvider>
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ApplicantDashboardGuard>
                <ApplicantDashboard />
              </ApplicantDashboardGuard>
            }
          />
          <Route
            path="dashboard"
            element={
              <ApplicantDashboardGuard>
                <ApplicantDashboard />
              </ApplicantDashboardGuard>
            }
          />
          <Route path="notifications" element={<ApplicantNotifications />} />
          <Route path="documents" element={<Documents />} />
          <Route path="profile" element={<ApplicantProfile />} />
          <Route path="interview" element={<ApplicantInterview />} />
          <Route path="interviews" element={<ApplicantInterview />} />
          <Route path="messages" element={<ApplicantMessages />} />
          <Route path="resources" element={<ApplicantResources />} />
          <Route path="faq" element={<ApplicantHelp />} />
          <Route path="help" element={<ApplicantHelp />} />
          <Route path="onboarding" element={<ApplicantOnboarding />} />
        </Route>

        {/* DIRECTOR ROUTES - Direct Access (مدیرکل - دسترسی کامل) */}
        <Route
          path="/director/*"
          element={
            <ProtectedRoute requiredRoles={[UserRole.DIRECTOR]}>
              <SocketProvider>
                <Layout />
              </SocketProvider>
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path="dashboard" element={<DirectorDashboard />} />

          {/* Analytics & Reports */}
          <Route path="analytics" element={<Analytics />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="reports" element={<Reports />} />

          {/* User Management (از Admin) */}
          <Route path="users" element={<UserManagement />} />
          <Route path="users/:userId" element={<UserProfile />} />
          <Route path="applications" element={<DirectorApplications />} />
          <Route path="applications/:id" element={<ApplicationDetail />} />
          <Route path="aaco-event-applications" element={<AACoEventApplications />} />
          <Route path="documents" element={<AdminDocuments />} />

          {/* Content Management */}
          <Route path="events" element={<DirectorEvents />} />
          <Route path="events/new" element={<CreateEvent />} />
          <Route path="events/:id" element={<DirectorEventDetail />} />
          <Route path="events/:id/edit" element={<EditEvent />} />
          <Route path="trainings" element={<DirectorTrainings />} />
          <Route path="trainings/new" element={<CreateTraining />} />
          <Route path="trainings/:id" element={<DirectorTrainingDetail />} />
          <Route path="fundings" element={<AdminFundings />} />

          {/* Settings & Notifications (از Admin) */}
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="notifications/analytics" element={<NotificationAnalytics />} />
          <Route path="notifications/settings" element={<NotificationSettings />} />
        </Route>

        {/* ADMIN ROUTES - Direct Access */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
              <SocketProvider>
                <Layout />
              </SocketProvider>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="applications" element={<Applications />} />
          <Route path="aaco-applications" element={<AACOApplications />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="teams" element={<Teams />} />
          <Route path="teams/new" element={<CreateTeam />} />
          <Route path="teams/:id" element={<TeamDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="events/new" element={<CreateEvent />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="events/:id/edit" element={<EditEvent />} />
          <Route path="trainings" element={<Trainings />} />
          <Route path="trainings/new" element={<CreateTraining />} />
          <Route path="trainings/:id" element={<TrainingDetail />} />
          <Route path="fundings" element={<Fundings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="notifications/analytics" element={<NotificationAnalytics />} />
          <Route path="notifications/settings" element={<NotificationSettings />} />
        </Route>

        {/* CLUB MEMBER ROUTES - Direct Access */}
        <Route
          path="/club-member/*"
          element={
            <ProtectedRoute requiredRoles={[UserRole.CLUB_MEMBER]}>
              <SocketProvider>
                <Layout />
              </SocketProvider>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ClubMemberDashboard />} />
          <Route path="profile" element={<ClubMemberProfile />} />
          <Route path="profile-preview" element={<PublicProfileView />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="notifications/analytics" element={<NotificationAnalytics />} />
          <Route path="notifications/settings" element={<NotificationSettings />} />
          <Route path="events" element={<ClubMemberEvents />} />
          <Route path="events/:id" element={<ClubMemberEventDetail />} />
          <Route path="projects" element={<ClubMemberProjects />} />
          <Route path="projects/new" element={<ClubMemberCreateProject />} />
          <Route path="projects/:id" element={<ClubMemberProjectDetail />} />
          <Route path="courses" element={<ClubMemberCourses />} />
          <Route path="courses/:id" element={<ClubMemberCourseDetail />} />
          <Route path="community" element={<ClubMemberCommunity />} />
          <Route path="ideas" element={<ClubMemberIdeasBank />} />
          <Route path="teams" element={<ClubMemberTeams />} />
          <Route path="achievements" element={<ClubMemberAchievements />} />
          <Route path="achievements/all" element={<AllAchievements />} />
          <Route path="resources" element={<LearningResources />} />
          <Route path="resources/:resourceId" element={<ResourceViewer />} />
          <Route path="gamification" element={<ClubMemberDashboard />} />
          <Route path="gamification/home" element={<GamificationHome />} />
          <Route path="gamification/overview" element={<GamificationOverview />} />
          <Route path="xp-history" element={<XPHistory />} />
          <Route path="leaderboard" element={<XPLeaderboard />} />
          <Route path="streak-leaderboard" element={<StreakLeaderboard />} />
          <Route path="rewards" element={<RewardsShop />} />
          <Route path="challenges" element={<Challenges />} />
        </Route>

        {/* PROTECTED ROUTES - AUTHENTICATION REQUIRED */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <SocketProvider>
                <ApplicantRouteGuard>
                  <Layout />
                </ApplicantRouteGuard>
              </SocketProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<RoleBasedRedirect />} />
          <Route
            path="admin"
            element={
              <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Admin Dashboard Routes */}
          <Route path="analytics" element={<Analytics />} />
          <Route path="activity" element={<ActivityLog />} />

          <Route path="teams" element={<Teams />} />
          <Route path="teams/:id" element={<TeamDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="trainings" element={<Trainings />} />
          <Route path="trainings/:id" element={<TrainingDetail />} />
          <Route path="leaderboard" element={<XPLeaderboard />} />
          <Route path="fundings" element={<Fundings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="notifications/analytics" element={<NotificationAnalytics />} />
          <Route path="notifications/settings" element={<NotificationSettings />} />

          {/* Applicant Routes - Protected by Application Guard */}
          <Route path="applicant/dashboard" element={<ApplicantDashboard />} />
          <Route path="applicant/profile" element={<ApplicantProfile />} />
          
          {/* These routes require application submission */}
          <Route path="applicant/notifications" element={<ApplicantNotifications />} />
          <Route path="applicant/documents" element={<Documents />} />
          <Route path="applicant/interviews" element={<ApplicantInterview />} />
          <Route path="applicant/messages" element={<ApplicantMessages />} />
          <Route path="applicant/resources" element={<ApplicantResources />} />
          <Route path="applicant/help" element={<ApplicantHelp />} />
          <Route path="applicant/onboarding" element={<ApplicantOnboarding />} />

          {/* Club Member Routes */}
          <Route path="club-member/dashboard" element={<ClubMemberDashboard />} />
          <Route path="club-member/profile" element={<ClubMemberProfile />} />
          <Route path="club-member/profile-preview" element={<PublicProfileView />} />
          <Route path="club-member/notifications" element={<Notifications />} />
          <Route path="club-member/notifications/analytics" element={<NotificationAnalytics />} />
          <Route path="club-member/notifications/settings" element={<NotificationSettings />} />
          <Route path="club-member/events" element={<ClubMemberEvents />} />
          <Route path="club-member/events/:id" element={<ClubMemberEventDetail />} />
          <Route path="club-member/projects" element={<ClubMemberProjects />} />
          <Route path="club-member/projects/new" element={<ClubMemberCreateProject />} />
          <Route path="club-member/projects/:id" element={<ClubMemberProjectDetail />} />
          <Route path="club-member/courses" element={<ClubMemberCourses />} />
          <Route path="club-member/courses/:id" element={<ClubMemberCourseDetail />} />
          <Route path="club-member/community" element={<ClubMemberCommunity />} />
          <Route path="club-member/ideas" element={<ClubMemberIdeasBank />} />
          <Route path="club-member/teams" element={<ClubMemberTeams />} />
          <Route path="club-member/achievements" element={<ClubMemberAchievements />} />
          <Route path="club-member/achievements/all" element={<AllAchievements />} />
          <Route path="club-member/gamification" element={<ClubMemberDashboard />} />
          <Route path="club-member/gamification/home" element={<GamificationHome />} />
          <Route path="club-member/gamification/overview" element={<GamificationOverview />} />
          <Route path="club-member/xp-history" element={<XPHistory />} />
          <Route path="club-member/leaderboard" element={<XPLeaderboard />} />
          <Route path="club-member/streak-leaderboard" element={<StreakLeaderboard />} />
          <Route path="club-member/rewards" element={<RewardsShop />} />
          <Route path="club-member/challenges" element={<Challenges />} />

          {/* Director Routes */}
          <Route path="director/dashboard" element={<DirectorDashboard />} />
          <Route path="director/applications" element={<DirectorApplications />} />
          <Route path="director/applications/:id" element={<ApplicationDetail />} />
          <Route path="director/events" element={<DirectorEvents />} />
          <Route path="director/events/:id" element={<DirectorEventDetail />} />
          <Route path="director/trainings" element={<DirectorTrainings />} />
          <Route path="director/trainings/:id" element={<DirectorTrainingDetail />} />
          <Route path="director/users" element={<UserManagement />} />

          {/* Admin Routes */}
          <Route
            path="admin/dashboard"
            element={
              <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/applications" element={<Applications />} />
          <Route path="admin/documents" element={<AdminDocuments />} />
          <Route path="admin/analytics" element={<Analytics />} />
          <Route path="admin/activity" element={<ActivityLog />} />
          <Route path="admin/reports" element={<Reports />} />
          <Route path="admin/settings" element={<Settings />} />
          <Route path="admin/teams" element={<Teams />} />
          <Route path="admin/teams/new" element={<CreateTeam />} />
          <Route path="admin/teams/:id" element={<TeamDetail />} />
          <Route path="admin/events" element={<AdminEvents />} />
          <Route path="admin/events/:id" element={<EventDetail />} />
          <Route path="admin/trainings" element={<AdminTrainings />} />
          <Route path="admin/trainings/new" element={<CreateTraining />} />
          <Route path="admin/trainings/:id" element={<TrainingDetail />} />
          <Route path="admin/fundings" element={<AdminFundings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
