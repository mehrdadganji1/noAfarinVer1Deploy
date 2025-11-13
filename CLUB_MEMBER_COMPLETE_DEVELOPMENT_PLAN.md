# 🚀 پلن جامع توسعه همزمان Backend & Frontend
## داشبورد عضو باشگاه نوآفرین

**تاریخ ایجاد:** 2025-11-13  
**نوع پروژه:** Full-Stack Development (Microservices Architecture)  
**تکنولوژی:** Node.js + TypeScript + MongoDB | React + TypeScript + TailwindCSS  
**تخمین کل زمان:** 120-150 ساعت (3-4 هفته با تیم 3 نفره)

---

## 📋 فهرست مطالب

1. [تحلیل وضعیت موجود](#1-تحلیل-وضعیت-موجود)
2. [معماری سیستم](#2-معماری-سیستم)
3. [فازهای توسعه](#3-فازهای-توسعه)
4. [تقسیم کار Backend & Frontend](#4-تقسیم-کار-backend--frontend)
5. [جزئیات فنی هر فاز](#5-جزئیات-فنی-هر-فاز)
6. [استراتژی تست](#6-استراتژی-تست)
7. [استراتژی Deploy](#7-استراتژی-deploy)
8. [مدیریت پروژه](#8-مدیریت-پروژه)

---

## 1. تحلیل وضعیت موجود

### 1.1 Backend Services - وضعیت فعلی

#### ✅ **سرویس‌های کامل و آماده:**

| سرویس | پورت | Controllers | Models | Routes | وضعیت |
|-------|------|-------------|---------|--------|-------|
| **User Service** | 3001 | 14 controllers (17KB-18KB) | 8 models | 10 routes | ✅ 95% کامل |
| **Event Service** | 3003 | eventController (9.7KB) | Event model | 8 routes | ✅ 90% کامل |
| **Project Service** | 3010 | projectController (13KB) | Project model | 11 routes | ✅ 90% کامل |
| **Training Service** | 3005 | courseController (9.6KB) | Course model | 9 routes | ✅ 85% کامل |
| **Evaluation Service** | 3004 | achievementController (6.2KB) | Achievement model | 6 routes | ✅ 80% کامل |
| **Team Service** | 3002 | teamController (5.2KB) | Team model | 7 routes | ✅ 75% کامل |

#### 🔑 **Endpoints اصلی موجود:**

**Membership APIs (User Service):**
```
✅ POST   /api/membership/promote/:userId          # ارتقا به عضو
✅ GET    /api/membership/members                  # لیست اعضا
✅ GET    /api/membership/stats/:userId            # آمار عضو
✅ PUT    /api/membership/level/:userId            # تغییر سطح
✅ PUT    /api/membership/status/:userId           # تغییر وضعیت
✅ GET    /api/membership/history                  # تاریخچه ارتقا
```

**Community APIs (User Service):**
```
✅ GET    /api/community/profiles                  # لیست پروفایل‌ها
✅ GET    /api/community/profiles/:userId          # پروفایل خاص
✅ PUT    /api/community/profiles/me               # ویرایش پروفایل
✅ POST   /api/community/connections/follow/:userId    # Follow
✅ DELETE /api/community/connections/unfollow/:userId  # Unfollow
✅ GET    /api/community/messages/conversations    # مکالمات
✅ POST   /api/community/messages/send             # ارسال پیام
✅ GET    /api/community/activities                # فید فعالیت
✅ GET    /api/community/stats                     # آمار جامعه
```

**Event APIs (Event Service):**
```
✅ GET    /api/events/stats                        # آمار رویدادها
✅ GET    /api/events                              # لیست رویدادها
✅ GET    /api/events/:id                          # جزئیات رویداد
✅ POST   /api/events                              # ایجاد رویداد
✅ POST   /api/events/:id/register                 # ثبت‌نام
✅ DELETE /api/events/:id/register                 # لغو ثبت‌نام
✅ POST   /api/events/:id/attendance               # ثبت حضور
```

**Project APIs (Project Service):**
```
✅ GET    /api/projects/stats                      # آمار پروژه‌ها
✅ GET    /api/projects                            # لیست پروژه‌ها
✅ GET    /api/my-projects                         # پروژه‌های من
✅ POST   /api/projects                            # ایجاد پروژه
✅ POST   /api/projects/:id/join                   # Join پروژه
✅ DELETE /api/projects/:id/leave                  # Leave پروژه
✅ PUT    /api/milestones/:milestoneId             # به‌روزرسانی Milestone
```

**Course APIs (Training Service):**
```
✅ GET    /api/courses/stats                       # آمار دوره‌ها
✅ GET    /api/courses                             # لیست دوره‌ها
✅ POST   /api/courses/:id/enroll                  # ثبت‌نام دوره
✅ DELETE /api/courses/:id/drop                    # Drop دوره
✅ PUT    /api/courses/:id/progress                # به‌روزرسانی پیشرفت
✅ POST   /api/courses/:id/review                  # افزودن نظر
```

**Achievement APIs (Evaluation Service):**
```
✅ GET    /api/achievements/stats                  # آمار دستاوردها
✅ GET    /api/achievements                        # لیست دستاوردها
✅ GET    /api/achievements/user/:userId           # دستاوردهای کاربر
✅ POST   /api/achievements/:id/award              # اعطای دستاورد
```

### 1.2 Frontend - وضعیت فعلی

#### ✅ **صفحات کامل (Production Ready):**

| صفحه | فایل | خطوط کد | وضعیت | Features |
|------|------|---------|-------|----------|
| **Dashboard** | ClubMemberDashboard.tsx | 294 | ✅ 100% | Stats, Widgets, Progress |
| **Events** | Events.tsx | 274 | ✅ 100% | List, Filter, Register |
| **Projects** | Projects.tsx | 288 | ✅ 100% | List, Filter, Join/Leave |
| **Courses** | Courses.tsx | 294 | ✅ 100% | List, Filter, Enroll/Drop |
| **Achievements** | Achievements.tsx | 260 | ✅ 100% | Grid, Filter, Stats |

#### 🔄 **صفحات نیمه‌کامل:**

| صفحه | فایل | خطوط کد | وضعیت | کارهای باقی‌مانده |
|------|------|---------|-------|--------------------|
| **Community** | Community.tsx | 281 | 🟡 70% | پیام مستقیم، Activity Feed |
| **Event Detail** | EventDetail.tsx | 376 | 🟡 80% | رویدادهای مرتبط، Comments |
| **Profile** | Profile.tsx | 418 | 🟡 75% | نمایش دستاوردها، Stats |
| **Teams** | Teams.tsx | ? | 🟡 50% | CRUD کامل، Management |
| **Ideas Bank** | IdeasBank.tsx | ? | 🟡 40% | CRUD، Voting، Comments |

#### ✅ **کامپوننت‌ها (14 کامپوننت - آماده):**
- StatCard, EventCard, ProjectCard, CourseCard, AchievementBadge
- SectionHeader, MemberStatsCards
- UpcomingEventsWidget, RecentAchievementsWidget
- MembershipProgressCard, ProgressTracker
- QuickActionsGrid, ActivityFeed, MetricCard

#### ✅ **API Hooks (24+ hook - آماده):**
- useClubMember, useEvents, useProjects, useCourses, useAchievements
- useCommunity, useConnections, useMessages, useActivities
- و 15+ hook دیگر...

---

## 2. معماری سیستم

### 2.1 معماری Backend - Microservices

```
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (Port 3000)                  │
│           Load Balancer | Rate Limiting | CORS              │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼───────┐    ┌───────▼───────┐    ┌───────▼───────┐
│  User Service │    │ Event Service │    │Project Service│
│   Port 3001   │    │   Port 3003   │    │   Port 3010   │
│               │    │               │    │               │
│ • Auth        │    │ • Events      │    │ • Projects    │
│ • Membership  │    │ • Register    │    │ • Teams       │
│ • Community   │    │ • Attendance  │    │ • Milestones  │
│ • Connections │    │ • Stats       │    │ • Stats       │
│ • Messages    │    └───────────────┘    └───────────────┘
│ • Activities  │
└───────┬───────┘
        │
┌───────▼───────┐    ┌─────────────┐    ┌─────────────┐
│Training Service│    │ Evaluation  │    │Team Service │
│   Port 3005    │    │   Service   │    │  Port 3002  │
│                │    │  Port 3004  │    │             │
│ • Courses      │    │             │    │ • Teams     │
│ • Enrollment   │    │ • Achievements   │ • Members   │
│ • Progress     │    │ • Awards    │    │ • Roles     │
│ • Reviews      │    │ • Stats     │    │             │
└────────────────┘    └─────────────┘    └─────────────┘
        │                     │                   │
        └─────────────────────┼───────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   MongoDB Cluster │
                    │  + Redis + RabbitMQ│
                    └───────────────────┘
```

### 2.2 معماری Frontend - React SPA

```
┌──────────────────────────────────────────────────────────┐
│                     React Application                     │
│                   (Port 5173 - Vite)                     │
└──────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐ ┌──────▼──────┐ ┌─────────▼────────┐
│     Pages      │ │ Components  │ │   API Hooks      │
│                │ │             │ │                  │
│ • Dashboard    │ │ • Cards     │ │ • useEvents      │
│ • Events       │ │ • Widgets   │ │ • useProjects    │
│ • Projects     │ │ • Headers   │ │ • useCourses     │
│ • Courses      │ │ • Progress  │ │ • useAchievements│
│ • Achievements │ │ • Stats     │ │ • useCommunity   │
│ • Community    │ │             │ │                  │
└────────────────┘ └─────────────┘ └──────────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                  ┌────────▼────────┐
                  │  State Management│
                  │                 │
                  │ • Zustand (Auth)│
                  │ • React Query   │
                  │ • Local Storage │
                  └─────────────────┘
```

### 2.3 Data Flow Pattern

```
User Action (Frontend)
    │
    ▼
React Component (onClick/onChange)
    │
    ▼
Custom Hook (useMutation/useQuery)
    │
    ▼
Axios Request → API Gateway (Port 3000)
    │
    ▼
Route to Specific Service (3001-3010)
    │
    ▼
Controller (Business Logic)
    │
    ▼
Model (MongoDB Query)
    │
    ▼
Database Response
    │
    ▼
Controller (Format Response)
    │
    ▼
API Gateway → Frontend
    │
    ▼
React Query (Cache Update)
    │
    ▼
Component Re-render (UI Update)
```

---

## 3. فازهای توسعه

### 📅 تقسیم‌بندی زمانی

```
Week 1: Phase 1 (Foundation)     ████████░░░░░░░░░░░░ 40%
Week 2: Phase 2 (Core Features)  ░░░░░░░░████████░░░░ 40%
Week 3: Phase 3 (Advanced)       ░░░░░░░░░░░░░░░░████ 20%
Week 4: Testing & Deploy         ░░░░░░░░░░░░░░░░░░░░ QA
```

### Phase 1: Foundation & Core Setup
**مدت:** 1 هفته (40 ساعت)  
**هدف:** راه‌اندازی زیرساخت و تکمیل صفحات نیمه‌کامل

### Phase 2: Advanced Features
**مدت:** 1 هفته (40 ساعت)  
**هدف:** امکانات پیشرفته Community و Real-time

### Phase 3: Polish & Optimization
**مدت:** 1 هفته (30 ساعت)  
**هدف:** بهینه‌سازی، تست و آماده‌سازی برای Production

### Phase 4: Testing & Deployment
**مدت:** 3-5 روز (20 ساعت)  
**هدف:** تست جامع و Deploy

---

## 4. تقسیم کار Backend & Frontend

### 4.1 تیم پیشنهادی

```
┌─────────────────────────────────────────┐
│         Project Manager (0.5 FTE)       │  ← Planning, Coordination
├─────────────────────────────────────────┤
│      Backend Developer (1 FTE)          │  ← Node.js + TypeScript
├─────────────────────────────────────────┤
│      Frontend Developer (1 FTE)         │  ← React + TypeScript
├─────────────────────────────────────────┤
│    Full-Stack Developer (0.5 FTE)       │  ← Integration & Testing
└─────────────────────────────────────────┘
```

### 4.2 Parallel Development Strategy

**روز 1-2: Setup & Planning**
- **Backend:** بررسی و تست تمام endpoints موجود
- **Frontend:** Setup Component Library و Design System
- **هماهنگی:** API Contract تعریف شود (OpenAPI/Swagger)

**روز 3-5: Core Features**
- **Backend (B1):** تکمیل IdeasBank API
- **Frontend (F1):** تکمیل Community Page
- **Backend (B2):** تکمیل Teams Management API
- **Frontend (F2):** تکمیل Event Detail Page
- **Integration:** تست API + Frontend

**روز 6-8: Advanced Features**
- **Backend (B1):** Real-time Notifications (Socket.io)
- **Frontend (F1):** تکمیل Teams Page
- **Backend (B2):** Advanced Search & Filters
- **Frontend (F2):** تکمیل Ideas Bank Page
- **Integration:** تست Integration

**روز 9-10: Polish**
- **Backend:** Performance Optimization, Caching
- **Frontend:** UI Polish, Animations, Accessibility
- **Both:** Bug Fixes

---

## 5. جزئیات فنی هر فاز

### PHASE 1: Foundation (Week 1 - 40h)

#### 🎯 **اهداف:**
1. تکمیل صفحات نیمه‌کامل
2. راه‌اندازی Ideas Bank API
3. بهبود Teams Management
4. تست و یکپارچگی

---

#### **Day 1-2: Community Page Complete**
**مدت:** 16 ساعت (8h Backend + 8h Frontend)

##### Backend Tasks (8h):

**B1.1 - Community Stats Enhancement** (2h)
- File: `services/user-service/src/controllers/communityStatsController.ts`
- Tasks:
  - ✅ بررسی endpoint موجود `/api/community/stats`
  - ➕ افزودن آمار هفتگی/ماهانه
  - ➕ افزودن trending topics
  - ➕ افزودن member growth rate
  
**Code Example:**
```typescript
// services/user-service/src/controllers/communityStatsController.ts

export const getCommunityStats = async (req: Request, res: Response) => {
  try {
    const timeRange = req.query.range as string || '30d';
    
    // محاسبه آمار
    const stats = await calculateCommunityStats(timeRange);
    
    res.json({
      success: true,
      data: {
        totalMembers: stats.totalMembers,
        activeMembers: stats.activeMembers,
        newMembersThisWeek: stats.newMembersThisWeek,
        growthRate: stats.growthRate,
        topContributors: stats.topContributors,
        trendingTopics: stats.trendingTopics,
        engagementRate: stats.engagementRate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

**B1.2 - Activity Feed Enhancement** (3h)
- File: `services/user-service/src/controllers/memberActivityController.ts`
- Tasks:
  - ✅ بررسی `/api/community/activities`
  - ➕ افزودن فیلتر بر اساس نوع فعالیت
  - ➕ افزودن Pagination بهینه
  - ➕ افزودن Real-time updates support
  - ➕ افزودن Like/Comment functionality

**Code Example:**
```typescript
// Activity Types
enum ActivityType {
  EVENT_JOINED = 'event_joined',
  PROJECT_CREATED = 'project_created',
  COURSE_COMPLETED = 'course_completed',
  ACHIEVEMENT_EARNED = 'achievement_earned',
  POST_CREATED = 'post_created',
  COMMENT_ADDED = 'comment_added'
}

export const getActivityFeed = async (req: Request, res: Response) => {
  const { page = 1, limit = 20, type, userId } = req.query;
  
  const query: any = { visibility: 'public' };
  if (type) query.type = type;
  if (userId) query.userId = userId;
  
  const activities = await MemberActivity
    .find(query)
    .sort({ createdAt: -1 })
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .populate('userId', 'name avatar membershipLevel')
    .populate('relatedUsers', 'name avatar');
  
  const total = await MemberActivity.countDocuments(query);
  
  res.json({
    success: true,
    data: activities,
    pagination: {
      page: +page,
      limit: +limit,
      total,
      pages: Math.ceil(total / +limit)
    }
  });
};
```

**B1.3 - Message System Testing** (2h)
- File: `services/user-service/src/controllers/messageController.ts`
- Tasks:
  - ✅ تست تمام endpoints موجود
  - 🐛 رفع باگ‌های احتمالی
  - ➕ افزودن typing indicator support
  - ➕ افزودن file attachment support

**B1.4 - API Documentation** (1h)
- ایجاد Swagger/OpenAPI docs برای Community APIs

##### Frontend Tasks (8h):

**F1.1 - Complete Community Page** (5h)
- File: `frontend/src/pages/club-member/Community.tsx`
- Tasks:
  - ✅ نمایش لیست اعضا با فیلتر
  - ➕ افزودن Activity Feed
  - ➕ افزودن Trending Members Section
  - ➕ افزودن Search با autocomplete
  - ➕ یکپارچگی Follow/Unfollow

**Code Example:**
```typescript
// frontend/src/pages/club-member/Community.tsx

const Community = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'activity'>('members');
  const [filters, setFilters] = useState({
    level: 'all',
    search: '',
    page: 1
  });

  const { data: members, isLoading } = useClubMembers(filters);
  const { data: activities } = useActivities({ page: 1, limit: 20 });
  const { data: stats } = useCommunityStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="کل اعضا"
            value={stats?.totalMembers || 0}
            icon={Users}
            color="purple"
            trend={{ value: stats?.growthRate || 0, direction: 'up' }}
          />
          {/* ... سایر stat cards */}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('members')}
            className={activeTab === 'members' ? 'active' : ''}
          >
            اعضا
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={activeTab === 'activity' ? 'active' : ''}
          >
            فعالیت‌ها
          </button>
        </div>

        {/* Content */}
        {activeTab === 'members' ? (
          <MembersGrid members={members} loading={isLoading} />
        ) : (
          <ActivityFeed activities={activities} />
        )}
        
      </div>
    </div>
  );
};
```

**F1.2 - Activity Feed Component** (2h)
- File: `frontend/src/components/club-member/ActivityFeed.tsx`
- Tasks:
  - ایجاد کامپوننت ActivityFeed
  - افزودن Like/Comment UI
  - افزودن Infinite Scroll

**F1.3 - Member Card Component** (1h)
- File: `frontend/src/components/club-member/MemberCard.tsx`
- ایجاد کارت نمایش عضو با Follow/Unfollow

---

#### **Day 3-4: Event Detail & Profile Pages**
**مدت:** 16 ساعت (6h Backend + 10h Frontend)

##### Backend Tasks (6h):

**B2.1 - Event Comments API** (3h)
- File: `services/event-service/src/controllers/eventController.ts`
- Tasks:
  - ➕ افزودن `/api/events/:id/comments` POST
  - ➕ افزودن `/api/events/:id/comments` GET
  - ➕ افزودن `/api/events/:id/comments/:commentId` DELETE
  - ➕ افزودن Model Comment

**Code Example:**
```typescript
// services/event-service/src/models/Comment.ts
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  userId: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true,
    maxLength: 500
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('Comment', commentSchema);
```

**B2.2 - Related Events Algorithm** (2h)
- File: `services/event-service/src/services/recommendationService.ts`
- Tasks:
  - ایجاد الگوریتم پیشنهاد رویدادهای مرتبط
  - بر اساس: نوع رویداد، تگ‌ها، تاریخ

**B2.3 - Profile Stats API** (1h)
- File: `services/user-service/src/controllers/profileController.ts`
- Tasks:
  - ✅ تست `/api/profile/:userId/stats`
  - ➕ افزودن recent activities
  - ➕ افزودن badges/achievements

##### Frontend Tasks (10h):

**F2.1 - Complete Event Detail Page** (5h)
- File: `frontend/src/pages/club-member/EventDetail.tsx`
- Tasks:
  - ✅ نمایش جزئیات کامل رویداد
  - ➕ بخش Comments
  - ➕ بخش Related Events
  - ➕ بخش Attendees List
  - ➕ دکمه Share Event

**F2.2 - Complete Profile Page** (5h)
- File: `frontend/src/pages/club-member/Profile.tsx`
- Tasks:
  - ✅ نمایش اطلاعات پروفایل
  - ➕ نمایش دستاوردها (Grid)
  - ➕ نمایش آمار فعالیت
  - ➕ نمایش Recent Activities
  - ➕ ویرایش پروفایل (Modal/Form)

---

#### **Day 5: Ideas Bank API Development**
**مدت:** 8 ساعت (Backend فقط)

**B3.1 - Ideas Bank Service Setup** (1h)
- ایجاد یا استفاده از سرویس موجود
- تصمیم: آیا Ideas Bank باید سرویس جدید باشد یا بخشی از Project Service؟
- **پیشنهاد:** افزودن به Project Service

**B3.2 - Ideas Model** (1h)
- File: `services/project-service/src/models/Idea.ts`

```typescript
import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 1000 },
  category: {
    type: String,
    enum: ['Technology', 'Business', 'Social', 'Environment', 'Education', 'Health', 'Other'],
    required: true
  },
  tags: [{ type: String }],
  createdBy: { type: String, required: true },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Under Review', 'Approved', 'Rejected', 'Archived'],
    default: 'Published'
  },
  votes: [{
    userId: String,
    type: { type: String, enum: ['up', 'down'] },
    createdAt: { type: Date, default: Date.now }
  }],
  voteCount: { type: Number, default: 0 },
  comments: [{
    userId: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  collaborators: [{
    userId: String,
    role: { type: String, enum: ['Owner', 'Collaborator'] }
  }],
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String
  }],
  implementationStatus: {
    type: String,
    enum: ['Idea', 'Planning', 'In Progress', 'Implemented', 'Abandoned'],
    default: 'Idea'
  },
  visibility: {
    type: String,
    enum: ['Public', 'Members Only', 'Private'],
    default: 'Public'
  },
  featured: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Indexes
ideaSchema.index({ title: 'text', description: 'text', tags: 'text' });
ideaSchema.index({ createdBy: 1 });
ideaSchema.index({ category: 1, status: 1 });
ideaSchema.index({ voteCount: -1 });

export default mongoose.model('Idea', ideaSchema);
```

**B3.3 - Ideas Controller** (3h)
- File: `services/project-service/src/controllers/ideaController.ts`

```typescript
import Idea from '../models/Idea';
import { Request, Response } from 'express';

// GET /api/ideas - لیست ایده‌ها
export const getAllIdeas = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      status = 'Published',
      sort = 'recent' // recent, popular, trending
    } = req.query;

    const query: any = { status };
    if (category && category !== 'all') query.category = category;

    let sortOption: any = { createdAt: -1 }; // recent
    if (sort === 'popular') sortOption = { voteCount: -1 };
    if (sort === 'trending') sortOption = { voteCount: -1, createdAt: -1 };

    const ideas = await Idea
      .find(query)
      .sort(sortOption)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .lean();

    const total = await Idea.countDocuments(query);

    res.json({
      success: true,
      data: ideas,
      pagination: {
        page: +page,
        limit: +limit,
        total,
        pages: Math.ceil(total / +limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/ideas - ایجاد ایده
export const createIdea = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { title, description, category, tags } = req.body;

    const idea = await Idea.create({
      title,
      description,
      category,
      tags: tags || [],
      createdBy: userId,
      collaborators: [{ userId, role: 'Owner' }]
    });

    res.status(201).json({
      success: true,
      data: idea,
      message: 'ایده با موفقیت ایجاد شد'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/ideas/:id/vote - رای دادن
export const voteIdea = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'up' or 'down'
    const userId = req.user?.userId;

    const idea = await Idea.findById(id);
    if (!idea) {
      return res.status(404).json({ success: false, message: 'ایده یافت نشد' });
    }

    // حذف رای قبلی
    idea.votes = idea.votes.filter(v => v.userId !== userId);

    // افزودن رای جدید
    idea.votes.push({ userId, type, createdAt: new Date() });

    // محاسبه مجدد voteCount
    const upVotes = idea.votes.filter(v => v.type === 'up').length;
    const downVotes = idea.votes.filter(v => v.type === 'down').length;
    idea.voteCount = upVotes - downVotes;

    await idea.save();

    res.json({
      success: true,
      data: { voteCount: idea.voteCount },
      message: 'رای شما ثبت شد'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/ideas/:id/comments - افزودن کامنت
export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.userId;

    const idea = await Idea.findById(id);
    if (!idea) {
      return res.status(404).json({ success: false, message: 'ایده یافت نشد' });
    }

    idea.comments.push({ userId, content, createdAt: new Date() });
    await idea.save();

    res.json({
      success: true,
      data: idea.comments[idea.comments.length - 1],
      message: 'نظر شما ثبت شد'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/ideas/stats - آمار
export const getIdeasStats = async (req: Request, res: Response) => {
  try {
    const total = await Idea.countDocuments({ status: 'Published' });
    const implemented = await Idea.countDocuments({ implementationStatus: 'Implemented' });
    const trending = await Idea.find({ status: 'Published' })
      .sort({ voteCount: -1 })
      .limit(5);

    const categoryCounts = await Idea.aggregate([
      { $match: { status: 'Published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        implemented,
        trending,
        byCategory: categoryCounts
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/ideas/my - ایده‌های من
export const getMyIdeas = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const ideas = await Idea.find({ createdBy: userId }).sort({ createdAt: -1 });

    res.json({ success: true, data: ideas });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

**B3.4 - Ideas Routes** (1h)
- File: `services/project-service/src/routes/ideaRoutes.ts`

```typescript
import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';
import * as ideaController from '../controllers/ideaController';

const router = Router();

// Public routes
router.get('/ideas/stats', optionalAuth, ideaController.getIdeasStats);
router.get('/ideas', optionalAuth, ideaController.getAllIdeas);
router.get('/ideas/:id', optionalAuth, ideaController.getIdeaById);

// Protected routes
router.post('/ideas', authenticate, ideaController.createIdea);
router.put('/ideas/:id', authenticate, ideaController.updateIdea);
router.delete('/ideas/:id', authenticate, ideaController.deleteIdea);
router.post('/ideas/:id/vote', authenticate, ideaController.voteIdea);
router.post('/ideas/:id/comments', authenticate, ideaController.addComment);
router.get('/my-ideas', authenticate, ideaController.getMyIdeas);

export default router;
```

**B3.5 - Register Routes** (1h)
- File: `services/project-service/src/index.ts`
- افزودن: `app.use('/api', ideaRoutes);`

**B3.6 - Testing** (1h)
- تست تمام endpoints با Postman/Thunder Client

---

#### **Day 6-7: Ideas Bank Frontend + Teams Page**
**مدت:** 16 ساعت (16h Frontend)

**F3.1 - Ideas Bank Page** (10h)
- File: `frontend/src/pages/club-member/IdeasBank.tsx`

```typescript
import { useState } from 'react';
import { useIdeas, useIdeaStats, useCreateIdea, useVoteIdea } from '@/hooks/useIdeas';
import IdeaCard from '@/components/club-member/IdeaCard';
import CreateIdeaModal from '@/components/club-member/CreateIdeaModal';

const IdeasBank = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    sort: 'recent',
    page: 1
  });

  const { data: ideas, isLoading } = useIdeas(filters);
  const { data: stats } = useIdeaStats();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        
        {/* Header */}
        <SectionHeader
          title="بانک ایده‌ها"
          subtitle="ایده‌های خلاقانه اعضای باشگاه"
          icon={Lightbulb}
          iconColor="amber"
          badge={stats?.total}
          action={{
            label: 'افزودن ایده',
            icon: Plus,
            onClick: () => setShowCreateModal(true)
          }}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="کل ایده‌ها"
            value={stats?.total || 0}
            icon={Lightbulb}
            color="amber"
          />
          <StatCard
            title="پیاده‌سازی شده"
            value={stats?.implemented || 0}
            icon={CheckCircle}
            color="green"
          />
          {/* ... */}
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="..."
          >
            <option value="all">همه دسته‌ها</option>
            <option value="Technology">فناوری</option>
            <option value="Business">کسب‌وکار</option>
            {/* ... */}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => setFilters({...filters, sort: e.target.value})}
          >
            <option value="recent">جدیدترین</option>
            <option value="popular">محبوب‌ترین</option>
            <option value="trending">پرطرفدار</option>
          </select>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas?.data.map(idea => (
            <IdeaCard key={idea._id} idea={idea} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={filters.page}
          totalPages={ideas?.pagination.pages || 1}
          onPageChange={(page) => setFilters({...filters, page})}
        />

        {/* Create Modal */}
        {showCreateModal && (
          <CreateIdeaModal
            onClose={() => setShowCreateModal(false)}
          />
        )}
        
      </div>
    </div>
  );
};
```

**F3.2 - IdeaCard Component** (3h)
- File: `frontend/src/components/club-member/IdeaCard.tsx`
- Features: Vote buttons, Comment count, Tags, Author info

**F3.3 - CreateIdeaModal Component** (2h)
- File: `frontend/src/components/club-member/CreateIdeaModal.tsx`
- Form با validation

**F3.4 - useIdeas Hook** (1h)
- File: `frontend/src/hooks/useIdeas.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useIdeas = (filters: any) => {
  return useQuery({
    queryKey: ['ideas', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const res = await api.get(`/projects/ideas?${params}`);
      return res.data;
    }
  });
};

export const useCreateIdea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/projects/ideas', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    }
  });
};

export const useVoteIdea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, type }: { id: string; type: 'up' | 'down' }) => {
      const res = await api.post(`/projects/ideas/${id}/vote`, { type });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    }
  });
};
```

---

#### **Day 8-10: Teams Management Complete**
**مدت:** 24 ساعت (10h Backend + 14h Frontend)

##### Backend Tasks (10h):

**B4.1 - Teams API Enhancement** (5h)
- File: `services/team-service/src/controllers/teamController.ts`
- Tasks:
  - ✅ بررسی endpoints موجود
  - ➕ افزودن Team Stats API
  - ➕ افزودن Team Invitations API
  - ➕ افزودن Team Activity Log
  - ➕ افزودن Member Roles Management

**Code Example:**
```typescript
// GET /api/teams/:id/stats
export const getTeamStats = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const team = await Team.findById(id).populate('members projects');
  if (!team) {
    return res.status(404).json({ success: false, message: 'تیم یافت نشد' });
  }

  const stats = {
    totalMembers: team.members.length,
    activeProjects: team.projects.filter(p => p.status === 'In Progress').length,
    completedProjects: team.projects.filter(p => p.status === 'Completed').length,
    totalEvents: await Event.countDocuments({ teamId: id }),
    achievements: await Achievement.countDocuments({ teamId: id })
  };

  res.json({ success: true, data: stats });
};

// POST /api/teams/:id/invite
export const inviteToTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, role = 'Member' } = req.body;
  
  // ارسال دعوتنامه
  await TeamInvitation.create({
    teamId: id,
    invitedBy: req.user?.userId,
    invitedUser: userId,
    role,
    status: 'Pending'
  });

  // ارسال نوتیفیکیشن
  await sendNotification(userId, {
    type: 'TEAM_INVITATION',
    message: `شما به تیم دعوت شده‌اید`,
    data: { teamId: id }
  });

  res.json({ success: true, message: 'دعوتنامه ارسال شد' });
};
```

**B4.2 - Team Invitation Model** (2h)
- File: `services/team-service/src/models/TeamInvitation.ts`

**B4.3 - Integration با Notification Service** (2h)
- اتصال به User Service برای ارسال نوتیفیکیشن

**B4.4 - Testing** (1h)

##### Frontend Tasks (14h):

**F4.1 - Teams Page Complete** (10h)
- File: `frontend/src/pages/club-member/Teams.tsx`

```typescript
const Teams = () => {
  const [activeTab, setActiveTab] = useState<'my-teams' | 'all-teams'>('my-teams');
  const { data: myTeams } = useMyTeams();
  const { data: allTeams } = useTeams({ page: 1, limit: 12 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        
        <SectionHeader
          title="تیم‌ها"
          subtitle="تیم‌های باشگاه نوآفرین"
          icon={Users}
          iconColor="blue"
          action={{
            label: 'ایجاد تیم',
            onClick: () => setShowCreateTeamModal(true)
          }}
        />

        {/* Tabs */}
        <div className="flex gap-4">
          <Tab active={activeTab === 'my-teams'} onClick={() => setActiveTab('my-teams')}>
            تیم‌های من
          </Tab>
          <Tab active={activeTab === 'all-teams'} onClick={() => setActiveTab('all-teams')}>
            همه تیم‌ها
          </Tab>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'my-teams' ? myTeams : allTeams)?.map(team => (
            <TeamCard key={team._id} team={team} />
          ))}
        </div>

      </div>
    </div>
  );
};
```

**F4.2 - TeamCard Component** (2h)
- نمایش اطلاعات تیم
- دکمه Join/Leave
- نمایش اعضا

**F4.3 - CreateTeamModal Component** (2h)
- فرم ایجاد تیم

---

### PHASE 2: Advanced Features (Week 2 - 40h)

#### **Day 11-13: Real-time Features**
**مدت:** 24 ساعت (12h Backend + 12h Frontend)

##### Backend: Socket.io Integration (12h)

**B5.1 - Socket.io Setup** (3h)
- File: `services/user-service/src/sockets/index.ts`

```typescript
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export const initializeSocketIO = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.user.userId;
    console.log(`User connected: ${userId}`);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Join community room
    socket.join('community');

    // Typing indicator
    socket.on('typing:start', (data) => {
      socket.to(`conversation:${data.conversationId}`).emit('user:typing', {
        userId,
        conversationId: data.conversationId
      });
    });

    socket.on('typing:stop', (data) => {
      socket.to(`conversation:${data.conversationId}`).emit('user:stopped-typing', {
        userId
      });
    });

    // New message
    socket.on('message:send', async (data) => {
      // ذخیره پیام در دیتابیس
      const message = await saveMessage(data);
      
      // ارسال به دریافت‌کننده
      io.to(`user:${data.recipientId}`).emit('message:received', message);
    });

    // Activity updates
    socket.on('activity:new', (data) => {
      socket.to('community').emit('activity:created', data);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
};
```

**B5.2 - Notification System** (4h)
- File: `services/user-service/src/services/notificationService.ts`
- Real-time notifications برای:
  - پیام‌های جدید
  - دعوت‌های تیم
  - ثبت‌نام رویداد
  - دستاوردهای جدید
  - کامنت‌ها

**B5.3 - Online Status Tracking** (3h)
- ردیابی وضعیت آنلاین/آفلاین کاربران
- Last seen timestamp

**B5.4 - Testing Real-time Events** (2h)

##### Frontend: Socket.io Integration (12h)

**F5.1 - Socket Context** (3h)
- File: `frontend/src/contexts/SocketContext.tsx`

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!token || !user) return;

    const newSocket = io(import.meta.env.VITE_API_URL, {
      auth: { token }
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
```

**F5.2 - Real-time Notifications Component** (4h)
- File: `frontend/src/components/notifications/NotificationBell.tsx`
- نمایش نوتیفیکیشن‌های real-time
- صدای نوتیفیکیشن
- Badge با تعداد

**F5.3 - Real-time Messaging** (3h)
- به‌روزرسانی Message Component
- Typing indicator
- Online/Offline status

**F5.4 - Real-time Activity Feed** (2h)
- به‌روزرسانی خودکار Activity Feed

---

#### **Day 14-15: Advanced Search & Filters**
**مدت:** 16 ساعت (8h Backend + 8h Frontend)

##### Backend: Elasticsearch/Advanced Search (8h)

**B6.1 - Full-Text Search Implementation** (4h)
- استفاده از MongoDB Text Index یا Elasticsearch
- جستجو در: Events, Projects, Courses, Ideas, Members

```typescript
// services/user-service/src/controllers/searchController.ts

export const globalSearch = async (req: Request, res: Response) => {
  const { query, type, limit = 10 } = req.query;

  const results = await Promise.all([
    // Search Events
    type === 'all' || type === 'events' 
      ? Event.find({ $text: { $search: query as string } }).limit(+limit)
      : [],
    
    // Search Projects
    type === 'all' || type === 'projects'
      ? Project.find({ $text: { $search: query as string } }).limit(+limit)
      : [],
    
    // Search Courses
    type === 'all' || type === 'courses'
      ? Course.find({ $text: { $search: query as string } }).limit(+limit)
      : [],
    
    // Search Members
    type === 'all' || type === 'members'
      ? User.find({ $text: { $search: query as string }, role: 'CLUB_MEMBER' }).limit(+limit)
      : []
  ]);

  res.json({
    success: true,
    data: {
      events: results[0],
      projects: results[1],
      courses: results[2],
      members: results[3]
    }
  });
};
```

**B6.2 - Advanced Filters** (2h)
- فیلترهای پیشرفته برای هر بخش
- Multi-select filters
- Date range filters

**B6.3 - Saved Searches** (2h)
- ذخیره جستجوهای کاربران
- پیشنهاد جستجوهای محبوب

##### Frontend: Search UI (8h)

**F6.1 - Global Search Component** (4h)
- File: `frontend/src/components/search/GlobalSearch.tsx`
- Search bar با autocomplete
- نمایش نتایج real-time
- دسته‌بندی نتایج

**F6.2 - Advanced Filter Panel** (3h)
- فیلترهای پیشرفته برای هر صفحه
- Multi-select با checkboxes
- Date pickers

**F6.3 - Search Results Page** (1h)
- صفحه نمایش نتایج جستجو

---

### PHASE 3: Polish & Optimization (Week 3 - 30h)

#### **Day 16-18: UI/UX Polish**
**مدت:** 24 ساعت (Frontend)

**F7.1 - Animations & Transitions** (6h)
- بهبود انیمیشن‌های موجود
- افزودن Page Transitions
- Skeleton Loading بهتر

**F7.2 - Accessibility Improvements** (4h)
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast improvements

**F7.3 - Dark Mode** (6h)
- پیاده‌سازی Dark Mode
- Theme Switcher
- ذخیره تنظیمات کاربر

**F7.4 - Mobile Optimization** (4h)
- بهبود UI در موبایل
- Touch gestures
- Bottom Navigation (اختیاری)

**F7.5 - Error Handling & Empty States** (4h)
- بهبود Error Pages
- بهبود Empty States
- Retry mechanisms

---

#### **Day 19-20: Performance Optimization**
**مدت:** 16 ساعت (8h Backend + 8h Frontend)

##### Backend Optimization (8h)

**B7.1 - Database Optimization** (3h)
- افزودن Indexes مناسب
- Query Optimization
- Connection Pooling

**B7.2 - Redis Caching** (3h)
- Cache کردن Stats APIs
- Cache کردن لیست‌های پرتکرار
- Invalidation Strategy

**B7.3 - API Rate Limiting** (2h)
- پیاده‌سازی Rate Limiting
- بر اساس IP و User

##### Frontend Optimization (8h)

**F7.6 - Code Splitting** (2h)
- Lazy Loading Routes
- Component-level Code Splitting

**F7.7 - Image Optimization** (2h)
- Lazy Loading Images
- WebP format
- Responsive Images

**F7.8 - Bundle Optimization** (2h)
- Tree Shaking
- Minification
- Chunk Optimization

**F7.9 - Performance Monitoring** (2h)
- React Query DevTools
- Performance Metrics
- Error Tracking (Sentry)

---

### PHASE 4: Testing & Deployment (Week 4 - 20h)

#### **Day 21-22: Testing**
**مدت:** 16 ساعت

**T1 - Backend Testing** (8h)
- Unit Tests (Jest)
- Integration Tests
- API Endpoint Tests

**T2 - Frontend Testing** (8h)
- Component Tests (Vitest + React Testing Library)
- E2E Tests (Playwright)
- Visual Regression Tests

---

#### **Day 23-24: Deployment**
**مدت:** 16 ساعت

**D1 - CI/CD Setup** (4h)
- GitHub Actions
- Auto Deploy on Merge

**D2 - Production Deployment** (4h)
- Docker Images
- Deploy to Production

**D3 - Monitoring & Logging** (4h)
- Setup Monitoring
- Error Tracking
- Performance Monitoring

**D4 - Documentation** (4h)
- API Documentation
- User Guide
- Developer Guide

---

## 6. استراتژی تست

### 6.1 Backend Testing Strategy

```typescript
// Example: Event Controller Test
// services/event-service/src/__tests__/eventController.test.ts

import request from 'supertest';
import app from '../app';
import Event from '../models/Event';

describe('Event Controller', () => {
  let authToken: string;
  let eventId: string;

  beforeAll(async () => {
    // Get auth token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'Test1234!' });
    authToken = res.body.token;
  });

  describe('GET /api/events', () => {
    it('should return list of events', async () => {
      const res = await request(app)
        .get('/api/events')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter events by type', async () => {
      const res = await request(app)
        .get('/api/events?type=Workshop')
        .expect(200);

      expect(res.body.data.every(e => e.type === 'Workshop')).toBe(true);
    });
  });

  describe('POST /api/events/:id/register', () => {
    it('should register user for event', async () => {
      const res = await request(app)
        .post(`/api/events/${eventId}/register`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('ثبت‌نام');
    });

    it('should not register twice', async () => {
      await request(app)
        .post(`/api/events/${eventId}/register`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });
});
```

### 6.2 Frontend Testing Strategy

```typescript
// Example: EventCard Component Test
// frontend/src/components/club-member/__tests__/EventCard.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EventCard from '../EventCard';

const mockEvent = {
  _id: '123',
  title: 'کارگاه React',
  date: new Date(),
  type: 'Workshop',
  registered: false,
  capacity: 50
};

describe('EventCard', () => {
  const queryClient = new QueryClient();

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <EventCard event={mockEvent} />
      </QueryClientProvider>
    );
  };

  it('should render event details', () => {
    renderComponent();
    expect(screen.getByText('کارگاه React')).toBeInTheDocument();
  });

  it('should show register button when not registered', () => {
    renderComponent();
    expect(screen.getByText('ثبت‌نام')).toBeInTheDocument();
  });

  it('should call onRegister when button clicked', () => {
    const onRegister = jest.fn();
    renderComponent();
    
    fireEvent.click(screen.getByText('ثبت‌نام'));
    expect(onRegister).toHaveBeenCalledWith('123');
  });
});
```

---

## 7. استراتژی Deploy

### 7.1 Docker Compose Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=https://api.noafarin.com
    depends_on:
      - api-gateway

  # API Gateway
  api-gateway:
    build: ./services/api-gateway
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - mongodb
      - redis

  # User Service
  user-service:
    build: ./services/user-service
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    depends_on:
      - mongodb
      - redis
      - rabbitmq

  # ... سایر سرویس‌ها

  # MongoDB
  mongodb:
    image: mongo:7
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}

  # Redis
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  mongodb_data:
  redis_data:
```

### 7.2 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: |
          cd services/user-service && npm ci
          cd ../event-service && npm ci
          # ... سایر سرویس‌ها
      
      - name: Run Tests
        run: |
          cd services/user-service && npm test
          # ... سایر سرویس‌ها

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker Images
        run: |
          docker build -t noafarin/frontend:latest ./frontend
          docker build -t noafarin/api-gateway:latest ./services/api-gateway
          # ... سایر سرویس‌ها
      
      - name: Push to Registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push noafarin/frontend:latest
          # ... سایر images

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/noafarin
            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d
```

---

## 8. مدیریت پروژه

### 8.1 Daily Standup Structure

```
09:00 AM - Daily Standup (15 min)
├─ Backend Dev: آنچه دیروز انجام داد
├─ Frontend Dev: آنچه دیروز انجام داد
├─ Full-Stack Dev: آنچه دیروز انجام داد
├─ مشکلات و Blockers
└─ برنامه امروز
```

### 8.2 Sprint Planning

**Sprint Duration:** 1 هفته  
**Sprint Planning:** دوشنبه صبح (2 ساعت)  
**Sprint Review:** جمعه عصر (1 ساعت)  
**Sprint Retro:** جمعه عصر (30 دقیقه)

### 8.3 Communication Tools

- **Slack/Discord:** ارتباط روزانه
- **Jira/Linear:** Task Management
- **GitHub:** Code & PRs
- **Figma:** Design Collaboration
- **Notion:** Documentation

---

## 9. خلاصه تخمین زمان

| فاز | مدت | Backend | Frontend | Testing |
|-----|-----|---------|----------|---------|
| **Phase 1: Foundation** | 40h | 24h | 16h | - |
| **Phase 2: Advanced** | 40h | 20h | 20h | - |
| **Phase 3: Polish** | 30h | 8h | 22h | - |
| **Phase 4: Testing & Deploy** | 20h | - | - | 20h |
| **کل** | **130h** | **52h** | **58h** | **20h** |

---

## 10. Deliverables نهایی

### ✅ Backend Deliverables
- [ ] 10 Microservices کامل و مستند
- [ ] 100+ API Endpoints تست شده
- [ ] Real-time WebSocket Support
- [ ] API Documentation (Swagger)
- [ ] Unit Tests (Coverage > 70%)
- [ ] Integration Tests

### ✅ Frontend Deliverables
- [ ] 10+ صفحه کامل و responsive
- [ ] 20+ کامپوننت قابل استفاده مجدد
- [ ] 30+ Custom Hooks
- [ ] Dark Mode Support
- [ ] PWA Support (اختیاری)
- [ ] Component Tests
- [ ] E2E Tests

### ✅ Documentation
- [ ] API Documentation
- [ ] User Guide
- [ ] Developer Guide
- [ ] Deployment Guide

### ✅ DevOps
- [ ] Docker Compose Setup
- [ ] CI/CD Pipeline
- [ ] Monitoring & Logging
- [ ] Backup Strategy

---

## 11. نکات مهم و Risks

### ⚠️ Risks

1. **Technical Risks:**
   - Real-time features ممکن است پیچیده شوند
   - Performance issues در Scale بالا
   - Integration issues بین Microservices

2. **Timeline Risks:**
   - Scope creep
   - Unexpected bugs
   - Dependencies بین tasks

3. **Resource Risks:**
   - کمبود developer
   - تخصص در تکنولوژی‌های خاص

### ✅ Mitigation Strategies

1. **Agile Approach:** Sprint‌های کوچک با Deliverables مشخص
2. **Early Testing:** تست مداوم در طول توسعه
3. **Code Reviews:** Review کردن تمام PRها
4. **Documentation:** مستندسازی همزمان با کد
5. **Buffer Time:** 20% buffer برای unpredictable issues

---

## 12. چک‌لیست نهایی

### Pre-Development
- [ ] تیم تشکیل شده
- [ ] Tools Setup شده
- [ ] Design System نهایی شده
- [ ] API Contracts تعریف شده

### During Development
- [ ] Daily Standups
- [ ] Code Reviews
- [ ] Continuous Testing
- [ ] Documentation

### Pre-Launch
- [ ] Full Testing Complete
- [ ] Performance Optimization
- [ ] Security Audit
- [ ] User Acceptance Testing

### Launch
- [ ] Production Deployment
- [ ] Monitoring Setup
- [ ] Support Team Ready
- [ ] Rollback Plan Ready

---

**تهیه‌کننده:** تیم توسعه نوآفرین  
**تاریخ آخرین به‌روزرسانی:** 2025-11-13  
**نسخه:** 1.0.0

---

## پیوست‌ها

### A. تکنولوژی‌های استفاده شده

**Backend:**
- Node.js 18+
- TypeScript 5+
- Express.js
- MongoDB + Mongoose
- Redis
- RabbitMQ
- Socket.io
- JWT Authentication

**Frontend:**
- React 18
- TypeScript 5+
- Vite
- TailwindCSS
- Framer Motion
- React Query (TanStack)
- Zustand
- Axios

**DevOps:**
- Docker
- Docker Compose
- GitHub Actions
- Nginx

### B. منابع مفید

- [React Query Docs](https://tanstack.com/query)
- [Socket.io Docs](https://socket.io/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**این پلن یک راهنمای جامع برای توسعه حرفه‌ای داشبورد عضو باشگاه نوآفرین است. با پیروی از این پلن، تیم می‌تواند به صورت هماهنگ و موازی روی Backend و Frontend کار کند و محصول نهایی را در 3-4 هفته تحویل دهد.**
