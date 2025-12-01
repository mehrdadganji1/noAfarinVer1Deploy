# Design Document

## Overview

This document describes the technical design for implementing intelligent dashboard routing based on user role and application status. The solution provides a seamless user experience by automatically directing users to the appropriate dashboard and handling transitions between different states.

## Architecture

### High-Level Flow

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│  Fetch Application Status   │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Determine Dashboard Path   │
│  (Role + Status)            │
└──────┬──────────────────────┘
       │
       ├─────────────────────────────────────┐
       │                                     │
       ▼                                     ▼
┌──────────────────┐              ┌──────────────────┐
│  No Application  │              │  Has Application │
└────┬─────────────┘              └────┬─────────────┘
     │                                  │
     ▼                                  │
/application-form                       │
                                        ├──────────────────────────┐
                                        │                          │
                                        ▼                          ▼
                              ┌──────────────────┐      ┌──────────────────┐
                              │  Status: Pending │      │  Status: Accepted│
                              │  (submitted,     │      │                  │
                              │   under_review,  │      │                  │
                              │   interview)     │      │                  │
                              └────┬─────────────┘      └────┬─────────────┘
                                   │                          │
                                   ▼                          │
                    /applicant/pending/dashboard              │
                                                               ├──────────────┐
                                                               │              │
                                                               ▼              ▼
                                                    ┌────────────────┐  ┌─────────────┐
                                                    │ Role: applicant│  │Role: club_  │
                                                    │                │  │   member    │
                                                    └────┬───────────┘  └─────┬───────┘
                                                         │                     │
                                                         ▼                     ▼
                                              /applicant/dashboard  /club-member/dashboard
```

## Components

### 1. Smart Dashboard Redirect Hook

**File:** `project1/frontend/src/hooks/useSmartDashboardRedirect.ts`

**Purpose:** Centralized hook that determines the correct dashboard path based on user role and application status.

**Interface:**
```typescript
interface SmartDashboardRedirectResult {
  dashboardPath: string;
  isLoading: boolean;
  error: Error | null;
  shouldRedirect: boolean;
}

function useSmartDashboardRedirect(): SmartDashboardRedirectResult
```

**Logic:**
1. Get user from auth store
2. Fetch application status using `useApplicationStatus`
3. Determine dashboard path using `getDashboardPathWithStatus`
4. Return path and loading state

**Dependencies:**
- `useAuthStore` - Get current user
- `useApplicationStatus` - Get application data
- `getDashboardPathWithStatus` - Utility function

### 2. Enhanced Role Utils

**File:** `project1/frontend/src/utils/roleUtils.ts`

**New Function:** `getDashboardPathWithStatus`

**Signature:**
```typescript
function getDashboardPathWithStatus(
  userRoles: string | string[],
  applicationStatus?: string | null
): string
```

**Logic:**
```typescript
// Priority 1: Check for non-applicant roles
if (hasRole(userRoles, UserRole.ADMIN)) return '/admin/dashboard'
if (hasRole(userRoles, UserRole.DIRECTOR)) return '/director/dashboard'
if (hasRole(userRoles, UserRole.CLUB_MEMBER)) return '/club-member/dashboard'

// Priority 2: Handle applicant with application status
if (hasRole(userRoles, UserRole.APPLICANT)) {
  if (!applicationStatus || applicationStatus === 'not_submitted') {
    return '/application-form'
  }
  
  const pendingStatuses = ['submitted', 'under_review', 'interview_scheduled']
  if (pendingStatuses.includes(applicationStatus)) {
    return '/applicant/pending/dashboard'
  }
  
  if (applicationStatus === 'accepted') {
    return '/applicant/dashboard'
  }
  
  // Rejected or withdrawn - show pending with message
  if (applicationStatus === 'rejected' || applicationStatus === 'withdrawn') {
    return '/applicant/pending/dashboard'
  }
}

// Default fallback
return '/dashboard'
```

### 3. Updated Login Component

**File:** `project1/frontend/src/pages/Login.tsx`

**Changes:**

**Property 1: Smart Redirect After Login**

GIVEN user successfully logs in
WHEN authentication is complete
THEN system SHALL:
1. Fetch application status if user is applicant
2. Use `getDashboardPathWithStatus` to determine path
3. Navigate to correct dashboard

**Implementation:**
```typescript
// After successful login
const response = await api.post('/auth/login', { email, password });
const { user, token } = response.data.data;

setAuth(user, token);
await new Promise(resolve => setTimeout(resolve, 100));

// Smart redirect based on role and status
let dashboardPath: string;

if (user.role.includes('applicant')) {
  // Fetch application status for applicants
  try {
    const appResponse = await api.get('/applications/my-application', {
      validateStatus: (status) => status === 200 || status === 404,
    });
    
    const applicationStatus = appResponse.status === 404 
      ? 'not_submitted' 
      : appResponse.data.data.status;
    
    dashboardPath = getDashboardPathWithStatus(user.role, applicationStatus);
  } catch (error) {
    // Fallback to safe default
    dashboardPath = '/application-form';
  }
} else {
  // Non-applicants use standard routing
  dashboardPath = getDashboardPath(user.role);
}

navigate(dashboardPath, { replace: true });
```

### 4. Enhanced Applicant Dashboard Guard

**File:** `project1/frontend/src/components/ApplicantDashboardGuard.tsx`

**Changes:**

**Property 1: Status-Based Routing**

GIVEN user accesses applicant dashboard
WHEN guard checks access
THEN system SHALL:
1. Check if application exists
2. Check application status
3. Redirect to pending dashboard if status is not 'accepted'
4. Allow access if status is 'accepted'

**Implementation:**
```typescript
useEffect(() => {
  if (!user || !user.role.includes('applicant')) return;
  if (isLoading) return;

  const hasSubmittedApplication = applicationData?.hasApplication && 
                                  applicationData.status !== 'not_submitted';

  if (!hasSubmittedApplication) {
    navigate('/application-form', { replace: true });
    return;
  }

  // Check if application is accepted
  const isAccepted = applicationData.status === 'accepted';
  
  if (!isAccepted) {
    // Redirect to pending dashboard for non-accepted applications
    navigate('/applicant/pending/dashboard', { replace: true });
  }
}, [applicationData, isLoading, user, navigate]);
```

### 5. Enhanced Pending Applicant Guard

**File:** `project1/frontend/src/components/PendingApplicantGuard.tsx`

**Changes:**

**Property 1: Automatic Promotion Detection**

GIVEN user is on pending dashboard
WHEN application status becomes 'accepted'
THEN system SHALL redirect to applicant dashboard

**Implementation:**
```typescript
useEffect(() => {
  if (!user || !user.role.includes('applicant')) return;
  if (isLoading) return;

  const status = applicationData?.status || 'not_submitted';
  const isAccepted = status === 'accepted';

  // If application is accepted, redirect to full dashboard
  if (isAccepted) {
    navigate('/applicant/dashboard', { replace: true });
    return;
  }

  // Existing restriction logic for pending applicants
  const allowedRoutes = [
    '/applicant/pending/dashboard',
    '/applicant/pending',
    '/applicant',
    '/application-status',
    '/applicant/profile',
    '/applicant/help',
    '/application-form',
  ];

  const isAllowedRoute = allowedRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + '/')
  );

  if (!isAllowedRoute) {
    navigate('/applicant/pending/dashboard', { replace: true });
  }
}, [applicationData, isLoading, user, location.pathname, navigate]);
```

### 6. Role Promotion Detection

**File:** `project1/frontend/src/components/Layout.tsx` (or new component)

**Purpose:** Detect when user role changes from applicant to club_member

**Property 1: Periodic Role Check**

GIVEN user is logged in
WHEN component mounts or at intervals
THEN system SHALL:
1. Check current user role from token/API
2. Compare with stored role
3. Redirect if role has changed

**Implementation:**
```typescript
// In Layout component or dedicated RoleChangeDetector
useEffect(() => {
  const checkRoleChange = async () => {
    try {
      const response = await api.get('/auth/me');
      const latestUser = response.data.data;
      
      // Check if role has changed
      if (JSON.stringify(user?.role) !== JSON.stringify(latestUser.role)) {
        // Role has changed - update auth and redirect
        setAuth(latestUser, token);
        
        const newDashboardPath = getDashboardPath(latestUser.role);
        navigate(newDashboardPath, { replace: true });
      }
    } catch (error) {
      console.error('Failed to check role change:', error);
    }
  };

  // Check on mount
  checkRoleChange();

  // Optional: Check periodically (every 30 seconds)
  const interval = setInterval(checkRoleChange, 30000);

  return () => clearInterval(interval);
}, [user, token, navigate, setAuth]);
```

## Data Flow

### Login Flow

```
User enters credentials
       ↓
POST /auth/login
       ↓
Receive user + token
       ↓
Set auth in store
       ↓
Is user applicant?
   ↙         ↘
 Yes          No
  ↓            ↓
GET /applications/my-application    Use getDashboardPath(role)
  ↓                                        ↓
Get status                          Navigate to dashboard
  ↓
Use getDashboardPathWithStatus(role, status)
  ↓
Navigate to correct dashboard
```

### Dashboard Access Flow

```
User navigates to route
       ↓
Route guard activated
       ↓
Check user role
       ↓
Is applicant?
   ↙         ↘
 Yes          No
  ↓            ↓
Check application status    Allow access
  ↓
Status = accepted?
   ↙         ↘
 Yes          No
  ↓            ↓
Allow access   Redirect to pending
```

### Status Change Detection Flow

```
User on pending dashboard
       ↓
Guard checks status
       ↓
Status = accepted?
   ↙         ↘
 Yes          No
  ↓            ↓
Redirect to    Stay on
applicant      pending
dashboard      dashboard
```

## State Management

### Application Status State

**Location:** React Query cache (via `useApplicationStatus`)

**Structure:**
```typescript
{
  hasApplication: boolean;
  status: string;
  profileCompletion: number;
  documentsSubmitted: number;
  documentsRequired: number;
  application: Application | null;
}
```

**Cache Strategy:**
- Stale time: 30 seconds
- Refetch on window focus: true
- Retry: false (to avoid console errors)

### User State

**Location:** Zustand store (`useAuthStore`)

**Structure:**
```typescript
{
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
```

## Error Handling

### Scenario 1: Application Status Fetch Fails

**Handling:**
```typescript
try {
  const appResponse = await api.get('/applications/my-application');
  // Process response
} catch (error) {
  // Fallback to safe default
  dashboardPath = '/application-form';
}
```

### Scenario 2: Invalid Application Status

**Handling:**
```typescript
const validStatuses = ['draft', 'submitted', 'under_review', 'interview_scheduled', 'accepted', 'rejected', 'withdrawn'];

if (!validStatuses.includes(status)) {
  // Treat as not submitted
  return '/application-form';
}
```

### Scenario 3: Network Error During Role Check

**Handling:**
```typescript
try {
  const response = await api.get('/auth/me');
  // Process response
} catch (error) {
  console.error('Failed to check role change:', error);
  // Don't redirect - keep user where they are
}
```

## Performance Considerations

### 1. Minimize API Calls

**Strategy:** Cache application status with React Query
- Reduces redundant API calls
- Provides instant access to cached data
- Automatic background refetching

### 2. Optimize Login Flow

**Strategy:** Parallel data fetching where possible
```typescript
// Instead of sequential
const user = await login();
const status = await getStatus();

// Use parallel (if backend supports)
const [user, status] = await Promise.all([
  login(),
  getStatus()
]);
```

### 3. Lazy Load Components

**Strategy:** Code-split dashboard components
```typescript
const PendingDashboard = lazy(() => import('./pages/applicant/PendingDashboard'));
const ApplicantDashboard = lazy(() => import('./pages/applicant/ApplicantDashboard'));
const ClubMemberDashboard = lazy(() => import('./pages/club-member/ClubMemberDashboard'));
```

## Security Considerations

### 1. Server-Side Validation

**Requirement:** All route guards must be backed by server-side authorization

**Implementation:**
- Backend validates user role and application status
- Frontend guards are for UX only, not security
- API endpoints check permissions before returning data

### 2. Token Validation

**Requirement:** Verify token validity before routing

**Implementation:**
```typescript
// In auth middleware
if (!token || isTokenExpired(token)) {
  navigate('/login', { replace: true });
  return;
}
```

### 3. Prevent Unauthorized Access

**Requirement:** Guards must prevent access to restricted routes

**Implementation:**
- Multiple layers of guards (role + status)
- Redirect to safe routes on unauthorized access
- Clear error messages for debugging

## Testing Strategy

### Unit Tests

**Test 1: getDashboardPathWithStatus**
```typescript
describe('getDashboardPathWithStatus', () => {
  it('returns pending dashboard for submitted application', () => {
    const path = getDashboardPathWithStatus(['applicant'], 'submitted');
    expect(path).toBe('/applicant/pending/dashboard');
  });

  it('returns applicant dashboard for accepted application', () => {
    const path = getDashboardPathWithStatus(['applicant'], 'accepted');
    expect(path).toBe('/applicant/dashboard');
  });

  it('returns club member dashboard for club_member role', () => {
    const path = getDashboardPathWithStatus(['club_member'], 'accepted');
    expect(path).toBe('/club-member/dashboard');
  });
});
```

**Test 2: useSmartDashboardRedirect**
```typescript
describe('useSmartDashboardRedirect', () => {
  it('returns loading state while fetching', () => {
    const { result } = renderHook(() => useSmartDashboardRedirect());
    expect(result.current.isLoading).toBe(true);
  });

  it('returns correct path for pending applicant', async () => {
    // Mock application status
    mockApplicationStatus({ status: 'submitted' });
    
    const { result } = renderHook(() => useSmartDashboardRedirect());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.dashboardPath).toBe('/applicant/pending/dashboard');
  });
});
```

### Integration Tests

**Test 1: Login to Pending Dashboard**
```typescript
it('redirects to pending dashboard after login with pending application', async () => {
  // Mock login response
  mockLogin({ role: ['applicant'] });
  mockApplicationStatus({ status: 'submitted' });
  
  // Perform login
  await userEvent.type(emailInput, 'test@example.com');
  await userEvent.type(passwordInput, 'password');
  await userEvent.click(loginButton);
  
  // Verify redirect
  await waitFor(() => {
    expect(window.location.pathname).toBe('/applicant/pending/dashboard');
  });
});
```

**Test 2: Status Change Redirect**
```typescript
it('redirects from pending to applicant dashboard when status changes', async () => {
  // Start on pending dashboard
  mockApplicationStatus({ status: 'submitted' });
  render(<PendingDashboard />);
  
  // Simulate status change
  mockApplicationStatus({ status: 'accepted' });
  
  // Trigger refetch
  await act(async () => {
    queryClient.invalidateQueries(['application-status']);
  });
  
  // Verify redirect
  await waitFor(() => {
    expect(window.location.pathname).toBe('/applicant/dashboard');
  });
});
```

### E2E Tests

**Test 1: Complete User Journey**
```typescript
test('user journey from registration to club member', async () => {
  // 1. Register
  await register({ email: 'test@example.com', password: 'password' });
  
  // 2. Login - should go to application form
  await login({ email: 'test@example.com', password: 'password' });
  expect(page.url()).toContain('/application-form');
  
  // 3. Submit application - should go to pending dashboard
  await submitApplication();
  expect(page.url()).toContain('/applicant/pending/dashboard');
  
  // 4. Admin approves - should go to applicant dashboard
  await adminApproveApplication();
  await page.reload();
  expect(page.url()).toContain('/applicant/dashboard');
  
  // 5. Admin promotes to club member - should go to club member dashboard
  await adminPromoteToClubMember();
  await page.reload();
  expect(page.url()).toContain('/club-member/dashboard');
});
```

## Migration Strategy

### Phase 1: Add New Functions (No Breaking Changes)

1. Add `getDashboardPathWithStatus` to roleUtils.ts
2. Create `useSmartDashboardRedirect` hook
3. Test new functions in isolation

### Phase 2: Update Components Gradually

1. Update Login.tsx to use smart redirect
2. Update ApplicantDashboardGuard.tsx
3. Update PendingApplicantGuard.tsx
4. Test each component after update

### Phase 3: Add Role Change Detection (Optional)

1. Add role change detection to Layout
2. Test with manual role changes
3. Monitor for issues

### Phase 4: Cleanup

1. Remove old unused code
2. Update documentation
3. Add logging for debugging

## Rollback Plan

If issues occur:

1. **Immediate:** Revert Login.tsx changes
   - Users can still login
   - May see wrong dashboard but can navigate manually

2. **Short-term:** Revert guard changes
   - Restore original guard logic
   - System returns to previous behavior

3. **Long-term:** Keep new utilities
   - New functions don't break anything
   - Can be used for future improvements

## Monitoring and Logging

### Key Metrics

1. **Login Success Rate**
   - Track successful logins
   - Monitor redirect failures

2. **Dashboard Access Patterns**
   - Track which dashboards users access
   - Identify routing issues

3. **Guard Redirect Frequency**
   - Monitor how often guards redirect
   - Identify potential loops

### Logging Points

```typescript
// Login
console.log('🔐 Login successful, determining dashboard...', {
  role: user.role,
  applicationStatus,
  dashboardPath
});

// Guard redirect
console.log('🚫 Access denied, redirecting...', {
  from: location.pathname,
  to: redirectPath,
  reason: 'status_not_accepted'
});

// Status change detected
console.log('✅ Status changed, redirecting...', {
  oldStatus,
  newStatus,
  from: location.pathname,
  to: newPath
});
```

## Future Enhancements

### 1. Real-Time Status Updates

**Implementation:** WebSocket listener for status changes
```typescript
socket.on('application:status_changed', (data) => {
  queryClient.invalidateQueries(['application-status']);
  // Automatic redirect handled by guards
});
```

### 2. Backend Optimization

**Implementation:** Include application status in login response
```typescript
// Backend: authController.login
const application = await Application.findOne({ userId: user._id });
return {
  user,
  token,
  applicationStatus: application?.status || 'not_submitted'
};
```

### 3. Progressive Enhancement

**Implementation:** Show transition animations
```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={dashboardPath}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
  >
    {/* Dashboard content */}
  </motion.div>
</AnimatePresence>
```

## Conclusion

This design provides a robust, maintainable solution for intelligent dashboard routing. The implementation is:

- **Modular:** Each component has a single responsibility
- **Testable:** Clear interfaces and predictable behavior
- **Scalable:** Easy to add new roles or statuses
- **Performant:** Minimal API calls and efficient caching
- **Secure:** Multiple layers of validation
- **User-Friendly:** Smooth transitions and clear feedback
