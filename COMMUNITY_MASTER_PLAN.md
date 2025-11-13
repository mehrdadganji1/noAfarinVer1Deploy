# 🌐 Community Page - Master Development Plan

**تاریخ:** 2025-11-10  
**صفحه:** Club Member Community  
**هدف:** توسعه کامل شبکه اجتماعی اعضای باشگاه

---

## 📋 **Table of Contents**

1. [Feature Overview](#feature-overview)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Database Models](#database-models)
5. [API Endpoints](#api-endpoints)
6. [Components Design](#components-design)
7. [Development Tasks](#development-tasks)
8. [Timeline](#timeline)

---

## 🎯 **Feature Overview**

### **Core Features:**
1. **Member Directory**
   - پروفایل اعضا با اطلاعات کامل
   - Skills, Projects, Achievements showcase
   - Contact information & Social links
   - University & Major information

2. **Member Search & Filter**
   - جستجو بر اساس نام، دانشگاه، مهارت
   - فیلتر بر اساس Level (Bronze, Silver, Gold, Platinum)
   - فیلتر بر اساس Skills
   - فیلتر بر اساس دانشگاه
   - Sort by: Points, Join Date, Projects, Rank

3. **Member Profiles**
   - پروفایل عمومی با آمار
   - Recent Activities
   - Projects List
   - Achievements Display
   - Skills & Expertise

4. **Connection System**
   - Follow/Unfollow members
   - Followers/Following lists
   - Connection suggestions

5. **Messaging System**
   - Direct messaging بین اعضا
   - Message threads
   - Real-time notifications

6. **Member Stats & Analytics**
   - کل اعضا
   - اعضای جدید (ماهانه)
   - توزیع بر اساس Level
   - توزیع بر اساس دانشگاه
   - Most Active Members

---

## 🏗️ **Backend Architecture**

### **Service:** User Service (Port 3001)
**Reason:** Community features مرتبط به User data هستند

### **New Collections:**

#### **1. MemberProfiles Collection**
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  bio: string,
  headline: string, // "Full Stack Developer at XYZ"
  location: string,
  website: string,
  github: string,
  linkedin: string,
  twitter: string,
  
  skills: [{ 
    name: string, 
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert',
    endorsements: number
  }],
  
  interests: [string],
  languages: [{ name: string, proficiency: string }],
  
  availability: {
    status: 'available' | 'busy' | 'not_available',
    lookingFor: ['collaboration', 'mentorship', 'job', 'learning'],
    preferredRoles: [string]
  },
  
  visibility: {
    profile: 'public' | 'members_only' | 'private',
    email: boolean,
    phone: boolean,
    projects: boolean
  },
  
  stats: {
    profileViews: number,
    connectionsCount: number,
    endorsementsReceived: number
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

#### **2. Connections Collection**
```typescript
{
  _id: ObjectId,
  followerId: ObjectId (ref: User),
  followingId: ObjectId (ref: User),
  status: 'active' | 'blocked',
  createdAt: Date
}
```

#### **3. Messages Collection**
```typescript
{
  _id: ObjectId,
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  conversationId: string, // UUID
  content: string,
  attachments: [{
    type: 'image' | 'file' | 'link',
    url: string,
    name: string
  }],
  status: 'sent' | 'delivered' | 'read',
  readAt: Date,
  createdAt: Date
}
```

#### **4. MemberActivities Collection**
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: 'project_completed' | 'achievement_earned' | 'event_attended' | 'course_completed',
  title: string,
  description: string,
  metadata: Object,
  visibility: 'public' | 'connections' | 'private',
  reactions: [{
    userId: ObjectId,
    type: 'like' | 'celebrate' | 'support'
  }],
  commentsCount: number,
  createdAt: Date
}
```

---

## 🔌 **API Endpoints**

### **Member Profiles (10 endpoints)**

```typescript
// Profile Management
GET    /api/community/profiles                    # Get all member profiles (with filters)
GET    /api/community/profiles/:userId            # Get specific member profile
PUT    /api/community/profiles/me                 # Update my profile
PUT    /api/community/profiles/me/visibility      # Update visibility settings

// Profile Stats
GET    /api/community/profiles/:userId/stats      # Get member stats
POST   /api/community/profiles/:userId/view       # Record profile view

// Skills & Endorsements
POST   /api/community/profiles/:userId/endorse    # Endorse a skill
GET    /api/community/profiles/:userId/endorsers  # Get endorsers list

// Search & Suggestions
GET    /api/community/search                      # Advanced search
GET    /api/community/suggestions                 # Connection suggestions
```

### **Connections (8 endpoints)**

```typescript
// Connection Management
POST   /api/community/connections/follow/:userId   # Follow a member
DELETE /api/community/connections/unfollow/:userId # Unfollow
GET    /api/community/connections/followers        # My followers
GET    /api/community/connections/following        # Who I follow
GET    /api/community/connections/:userId/followers # User's followers
GET    /api/community/connections/:userId/following # Who user follows
GET    /api/community/connections/status/:userId   # Check connection status
POST   /api/community/connections/block/:userId    # Block member
```

### **Messaging (10 endpoints)**

```typescript
// Conversations
GET    /api/community/messages/conversations       # My conversations
GET    /api/community/messages/conversations/:id   # Get conversation messages
POST   /api/community/messages/send                # Send message
PUT    /api/community/messages/:id/read            # Mark as read
DELETE /api/community/messages/:id                 # Delete message

// Message Management
GET    /api/community/messages/unread/count        # Unread count
POST   /api/community/messages/search              # Search messages
GET    /api/community/messages/archived            # Archived conversations
PUT    /api/community/messages/archive/:id         # Archive conversation
PUT    /api/community/messages/unarchive/:id       # Unarchive conversation
```

### **Activities (6 endpoints)**

```typescript
// Activity Feed
GET    /api/community/activities                   # Get activity feed
GET    /api/community/activities/:userId           # Get user activities
POST   /api/community/activities                   # Create activity
PUT    /api/community/activities/:id               # Update activity
DELETE /api/community/activities/:id               # Delete activity
POST   /api/community/activities/:id/react         # React to activity
```

### **Stats & Analytics (4 endpoints)**

```typescript
// Community Stats
GET    /api/community/stats                        # Overall community stats
GET    /api/community/stats/trending               # Trending members
GET    /api/community/stats/active                 # Most active members
GET    /api/community/stats/new-members            # Recently joined
```

---

## 🎨 **Frontend Components**

### **Base Components (از Design System موجود):**
- ✅ StatCard
- ✅ SectionContainer
- ✅ SearchBar
- ✅ FilterSection
- ✅ LoadingSkeleton
- ✅ EmptyState

### **New Components (8 components):**

#### **1. MemberCard.tsx** (200 lines)
```typescript
interface MemberCardProps {
  member: Member;
  variant?: 'grid' | 'list';
  showActions?: boolean;
  onConnect?: () => void;
  onMessage?: () => void;
  onViewProfile?: () => void;
}

Features:
- Avatar با fallback initials
- Level badge (Bronze/Silver/Gold/Platinum)
- Stats (Points, Projects, Rank)
- Skills badges (top 3)
- Connection status indicator
- Action buttons (Message, Follow, View Profile)
- Hover effects
- Responsive layout
```

#### **2. MemberProfileModal.tsx** (350 lines)
```typescript
interface MemberProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

Features:
- Full profile view
- Tabs: Overview, Projects, Achievements, Activity
- Stats section
- Skills with endorsements
- Contact information (با visibility check)
- Social links
- Recent activities
- Connection/Message buttons
- Loading states
```

#### **3. ConnectionsWidget.tsx** (180 lines)
```typescript
interface ConnectionsWidgetProps {
  userId?: string;
  type: 'followers' | 'following';
  variant?: 'compact' | 'full';
}

Features:
- List of connections
- Avatar grid
- Connection count
- Show more button
- Empty state
- Loading skeleton
```

#### **4. MessageThreadCard.tsx** (200 lines)
```typescript
interface MessageThreadCardProps {
  conversation: Conversation;
  selected?: boolean;
  onSelect: () => void;
}

Features:
- Avatar
- Last message preview
- Unread badge
- Timestamp
- Online indicator
- Hover effects
```

#### **5. MessageComposer.tsx** (250 lines)
```typescript
interface MessageComposerProps {
  recipientId: string;
  onSend: (message: string) => void;
}

Features:
- Rich text input
- File attachment
- Emoji picker
- Send button
- Character counter
- Enter to send (Shift+Enter for new line)
```

#### **6. ActivityFeedItem.tsx** (220 lines)
```typescript
interface ActivityFeedItemProps {
  activity: Activity;
  onReact: (type: ReactionType) => void;
  onComment: () => void;
}

Features:
- Activity type icon
- User info
- Activity content
- Timestamp
- Reactions (Like, Celebrate, Support)
- Comments count
- Expand/Collapse
```

#### **7. MemberSearchFilters.tsx** (180 lines)
```typescript
interface MemberSearchFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

Features:
- Multi-select filters
- Level checkboxes
- Skills autocomplete
- University selector
- Location filter
- Active filters display
- Reset button
```

#### **8. MemberStatsOverview.tsx** (150 lines)
```typescript
interface MemberStatsOverviewProps {
  stats: CommunityStats;
  loading?: boolean;
}

Features:
- Total members
- New members this month (با trend)
- Distribution by level (chart)
- Most active members
- Animations
```

---

## 📱 **Pages Structure**

### **1. Community.tsx** (Main Page - Enhanced)
```typescript
Sections:
- Header با gradient
- Stats Overview (4 cards)
- Search & Filters
- Member Grid/List
- Pagination
- Infinite scroll option

Layout:
- Grid: 3 columns (desktop), 2 (tablet), 1 (mobile)
- Sidebar: Filters (collapsible on mobile)
```

### **2. MemberProfile.tsx** (New Page)
```typescript
Route: /club-member/community/:userId

Sections:
- Profile Header (cover + avatar)
- About section
- Stats cards
- Skills & Expertise
- Projects showcase
- Achievements gallery
- Recent activity feed
- Connection widget
```

### **3. Messages.tsx** (New Page)
```typescript
Route: /club-member/messages

Layout:
- Split view: Conversations list | Active thread
- Mobile: Stack layout با back button
- Empty state: Start new conversation
- Search conversations
```

---

## 🔧 **Custom Hooks**

### **1. useMemberProfile.ts**
```typescript
export const useMemberProfile = (userId: string)
export const useUpdateProfile = ()
export const useProfileStats = (userId: string)
```

### **2. useConnections.ts**
```typescript
export const useFollow = ()
export const useUnfollow = ()
export const useFollowers = (userId: string)
export const useFollowing = (userId: string)
export const useConnectionStatus = (userId: string)
export const useSuggestedConnections = ()
```

### **3. useMessages.ts**
```typescript
export const useConversations = ()
export const useConversation = (conversationId: string)
export const useSendMessage = ()
export const useUnreadCount = ()
export const useMarkAsRead = ()
```

### **4. useMemberSearch.ts**
```typescript
export const useSearchMembers = (filters: FilterState)
export const useFilterOptions = ()
```

### **5. useActivityFeed.ts**
```typescript
export const useActivityFeed = (userId?: string)
export const useCreateActivity = ()
export const useReactToActivity = ()
```

---

## 📝 **Development Tasks**

### **Phase 1: Backend Foundation (Day 1-2)**

#### **Task 1.1: Database Models** (2 hours)
- [ ] Create MemberProfile Model
- [ ] Create Connection Model
- [ ] Create Message Model
- [ ] Create Activity Model
- [ ] Add indexes for performance

#### **Task 1.2: Profile Controllers** (3 hours)
- [ ] profileController.ts (10 methods)
- [ ] Validation schemas با Zod
- [ ] Error handling
- [ ] Tests

#### **Task 1.3: Connection Controllers** (2 hours)
- [ ] connectionController.ts (8 methods)
- [ ] Follow/Unfollow logic
- [ ] Connection suggestions algorithm
- [ ] Tests

#### **Task 1.4: Message Controllers** (3 hours)
- [ ] messageController.ts (10 methods)
- [ ] Conversation threading
- [ ] Real-time setup (Socket.io)
- [ ] Tests

#### **Task 1.5: Activity Controllers** (2 hours)
- [ ] activityController.ts (6 methods)
- [ ] Feed algorithm (sort by relevance)
- [ ] Reactions system
- [ ] Tests

#### **Task 1.6: Stats Controllers** (1 hour)
- [ ] communityStatsController.ts (4 methods)
- [ ] Aggregation queries
- [ ] Caching strategy
- [ ] Tests

#### **Task 1.7: Routes Setup** (1 hour)
- [ ] communityRoutes.ts
- [ ] Middleware: authenticate, authorize
- [ ] Rate limiting
- [ ] Integration با app.ts

**Total Backend: ~14 hours**

---

### **Phase 2: Frontend Components (Day 3-4)**

#### **Task 2.1: TypeScript Types** (1 hour)
- [ ] types/community.ts
- [ ] Interfaces برای Member, Connection, Message, Activity
- [ ] Enums
- [ ] Helper functions

#### **Task 2.2: API Hooks** (3 hours)
- [ ] hooks/useMemberProfile.ts
- [ ] hooks/useConnections.ts
- [ ] hooks/useMessages.ts
- [ ] hooks/useMemberSearch.ts
- [ ] hooks/useActivityFeed.ts

#### **Task 2.3: Base Components** (6 hours)
- [ ] MemberCard.tsx
- [ ] MemberProfileModal.tsx
- [ ] ConnectionsWidget.tsx
- [ ] MessageThreadCard.tsx
- [ ] MessageComposer.tsx
- [ ] ActivityFeedItem.tsx
- [ ] MemberSearchFilters.tsx
- [ ] MemberStatsOverview.tsx

#### **Task 2.4: Pages** (4 hours)
- [ ] Community.tsx (Enhanced)
- [ ] MemberProfile.tsx (New)
- [ ] Messages.tsx (New)
- [ ] Routes integration

**Total Frontend: ~14 hours**

---

### **Phase 3: Real-time Features (Day 5)**

#### **Task 3.1: Socket.io Setup** (2 hours)
- [ ] Backend: Socket server setup
- [ ] Events: message_sent, message_read, user_online, user_offline
- [ ] Rooms برای conversations
- [ ] Authentication middleware

#### **Task 3.2: Frontend Socket Client** (2 hours)
- [ ] Socket context provider
- [ ] useSocket hook
- [ ] Real-time message updates
- [ ] Online status indicators
- [ ] Typing indicators

#### **Task 3.3: Notifications** (2 hours)
- [ ] In-app notifications
- [ ] Toast notifications
- [ ] Unread badges
- [ ] Notification center

**Total Real-time: ~6 hours**

---

### **Phase 4: Polish & Testing (Day 6)**

#### **Task 4.1: UI/UX Polish** (3 hours)
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Animations
- [ ] Responsive design check
- [ ] RTL support check

#### **Task 4.2: Testing** (3 hours)
- [ ] Backend unit tests
- [ ] Frontend component tests
- [ ] Integration tests
- [ ] E2E tests (critical flows)

#### **Task 4.3: Performance** (2 hours)
- [ ] Query optimization
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Caching strategy
- [ ] Bundle size check

**Total Polish: ~8 hours**

---

## 📊 **Timeline**

| Phase | Tasks | Duration | Days |
|-------|-------|----------|------|
| **Phase 1** | Backend Foundation | 14 hours | Day 1-2 |
| **Phase 2** | Frontend Components | 14 hours | Day 3-4 |
| **Phase 3** | Real-time Features | 6 hours | Day 5 |
| **Phase 4** | Polish & Testing | 8 hours | Day 6 |
| **TOTAL** | - | **42 hours** | **6 days** |

---

## 🎯 **Success Criteria**

### **Backend:**
- ✅ 38 API endpoints کامل و تست شده
- ✅ 4 Database models با indexes
- ✅ Real-time messaging works
- ✅ Connection system works
- ✅ Activity feed works
- ✅ Performance: < 200ms response time

### **Frontend:**
- ✅ 8 Professional components
- ✅ 3 Complete pages
- ✅ Real-time updates work
- ✅ Search & filters work smoothly
- ✅ Mobile responsive
- ✅ Loading states everywhere
- ✅ No console errors

### **Features:**
- ✅ Members can view profiles
- ✅ Members can follow/unfollow
- ✅ Members can send messages
- ✅ Members can search & filter
- ✅ Activity feed shows recent updates
- ✅ Real-time notifications work
- ✅ Stats dashboard shows accurate data

---

## 🚀 **Getting Started**

```bash
# Start with Backend
cd services/user-service
npm run dev

# Then Frontend
cd frontend
npm run dev

# Access:
http://localhost:5173/club-member/community
```

---

## 📚 **Resources**

- Design System: `/frontend/src/styles/design-tokens.ts`
- Existing Components: `/frontend/src/components/club-member/`
- API Structure: Similar to existing services
- Socket.io Docs: https://socket.io/docs/v4/

---

**این پلن کامل و حرفه‌ای برای توسعه Community Page آماده است!** 🎉
