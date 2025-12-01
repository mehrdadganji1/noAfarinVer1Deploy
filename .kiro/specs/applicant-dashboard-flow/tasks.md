# Tasks

## Overview

This document contains the implementation tasks for the applicant dashboard flow feature. Tasks are organized by priority and dependencies.

## Task Organization

- **Phase 1:** Core utilities and hooks (no breaking changes)
- **Phase 2:** Component updates (gradual rollout)
- **Phase 3:** Testing and validation
- **Phase 4:** Documentation and cleanup

---

## Phase 1: Core Utilities and Hooks

### Task 1.1: Add getDashboardPathWithStatus to roleUtils

**Priority:** High  
**Estimated Time:** 30 minutes  
**Dependencies:** None

**Description:**
Add a new function to `roleUtils.ts` that determines dashboard path based on both user role and application status.

**Acceptance Criteria:**
- Function accepts `userRoles` and optional `applicationStatus` parameters
- Returns correct path for all role and status combinations
- Handles edge cases (null status, invalid status, multiple roles)
- Maintains backward compatibility with existing `getDashboardPath`

**Implementation Steps:**
1. Open `project1/frontend/src/utils/roleUtils.ts`
2. Add new function `getDashboardPathWithStatus` after existing functions
3. Implement logic according to design document
4. Add JSDoc comments
5. Export function

**Code Template:**
```typescript
/**
 * Get the dashboard path for a user based on their roles and application status
 * @param userRoles - User's role(s)
 * @param applicationStatus - Current application status (optional)
 * @returns Dashboard path
 */
export function getDashboardPathWithStatus(
  userRoles: string | string[],
  applicationStatus?: string | null
): string {
  const normalized = normalizeRoles(userRoles);
  
  // Priority 1: Non-applicant roles
  if (normalized.includes(UserRole.ADMIN)) return '/admin/dashboard';
  if (normalized.includes(UserRole.DIRECTOR)) return '/director/dashboard';
  if (normalized.includes(UserRole.CLUB_MEMBER)) return '/club-member/dashboard';
  
  // Priority 2: Applicant with status
  if (normalized.includes(UserRole.APPLICANT)) {
    if (!applicationStatus || applicationStatus === 'not_submitted') {
      return '/application-form';
    }
    
    const pendingStatuses = ['submitted', 'under_review', 'interview_scheduled'];
    if (pendingStatuses.includes(applicationStatus)) {
      return '/applicant/pending/dashboard';
    }
    
    if (applicationStatus === 'accepted') {
      return '/applicant/dashboard';
    }
    
    if (applicationStatus === 'rejected' || applicationStatus === 'withdrawn') {
      return '/applicant/pending/dashboard';
    }
  }
  
  return '/dashboard';
}
```

**Testing:**
- Unit test with various role and status combinations
- Verify backward compatibility

---

### Task 1.2: Create useSmartDashboardRedirect Hook

**Priority:** High  
**Estimated Time:** 45 minutes  
**Dependencies:** Task 1.1

**Description:**
Create a custom hook that combines user role and application status to determine the correct dashboard path.

**Acceptance Criteria:**
- Hook returns dashboard path, loading state, and error
- Uses `useAuthStore` for user data
- Uses `useApplicationStatus` for application data
- Calls `getDashboardPathWithStatus` to determine path
- Handles loading and error states gracefully

**Implementation Steps:**
1. Create file `project1/frontend/src/hooks/useSmartDashboardRedirect.ts`
2. Import required dependencies
3. Implement hook logic
4. Add TypeScript interfaces
5. Add JSDoc comments
6. Export hook

**Code Template:**
```typescript
import { useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useApplicationStatus } from './useApplicationStatus';
import { getDashboardPathWithStatus } from '@/utils/roleUtils';

interface SmartDashboardRedirectResult {
  dashboardPath: string;
  isLoading: boolean;
  error: Error | null;
  shouldRedirect: boolean;
}

/**
 * Hook to determine the correct dashboard path based on user role and application status
 * @returns Dashboard path, loading state, and error
 */
export function useSmartDashboardRedirect(): SmartDashboardRedirectResult {
  const { user } = useAuthStore();
  const { data: applicationData, isLoading, error } = useApplicationStatus();

  const dashboardPath = useMemo(() => {
    if (!user) return '/login';

    // For non-applicants, use standard routing
    if (!user.role.includes('applicant')) {
      return getDashboardPathWithStatus(user.role);
    }

    // For applicants, wait for application status
    if (isLoading) return '';

    const applicationStatus = applicationData?.status || 'not_submitted';
    return getDashboardPathWithStatus(user.role, applicationStatus);
  }, [user, applicationData, isLoading]);

  return {
    dashboardPath,
    isLoading: isLoading || !user,
    error: error as Error | null,
    shouldRedirect: !!dashboardPath && dashboardPath !== '',
  };
}
```

**Testing:**
- Unit test with mocked auth and application status
- Test loading states
- Test error handling

---

## Phase 2: Component Updates

### Task 2.1: Update Login Component

**Priority:** High  
**Estimated Time:** 1 hour  
**Dependencies:** Task 1.1, Task 1.2

**Description:**
Update the Login component to use smart dashboard redirect after successful authentication.

**Acceptance Criteria:**
- After successful login, fetch application status for applicants
- Use `getDashboardPathWithStatus` to determine redirect path
- Show loading state while fetching application status
- Handle errors gracefully with fallback routing
- Maintain existing functionality for non-applicants

**Implementation Steps:**
1. Open `project1/frontend/src/pages/Login.tsx`
2. Import `getDashboardPathWithStatus` from roleUtils
3. Update `handleSubmit` function
4. Add application status fetch for applicants
5. Update navigation logic
6. Add error handling
7. Test login flow

**Code Changes:**
```typescript
// In handleSubmit function, after successful login:

const response = await api.post('/auth/login', { email, password });
const { user, token } = response.data.data;

// ... existing code for rememberMe ...

console.log('🔐 Login successful, setting auth...');
setAuth(user, token);
await new Promise(resolve => setTimeout(resolve, 100));

// Smart redirect based on role and status
let dashboardPath: string;

if (user.role.includes('applicant')) {
  // Fetch application status for applicants
  try {
    const appResponse = await api.get('/applications/my-application', {
      validateStatus: (status) => status === 200 || status === 404,
      suppressErrors: true
    });
    
    const applicationStatus = appResponse.status === 404 
      ? 'not_submitted' 
      : appResponse.data.data.status;
    
    dashboardPath = getDashboardPathWithStatus(user.role, applicationStatus);
    
    console.log('📊 Application status:', applicationStatus);
    console.log('→ Redirecting to:', dashboardPath);
  } catch (error) {
    console.error('Failed to fetch application status:', error);
    // Fallback to safe default
    dashboardPath = '/application-form';
  }
} else {
  // Non-applicants use standard routing
  dashboardPath = getDashboardPath(user.role);
  console.log('→ Redirecting to:', dashboardPath);
}

navigate(dashboardPath, { replace: true });
```

**Testing:**
- Test login with no application
- Test login with pending application
- Test login with accepted application
- Test login as club member
- Test error scenarios

---

### Task 2.2: Update ApplicantDashboardGuard

**Priority:** High  
**Estimated Time:** 45 minutes  
**Dependencies:** Task 1.1

**Description:**
Update the ApplicantDashboardGuard to check application status and redirect to pending dashboard if not accepted.

**Acceptance Criteria:**
- Check if application exists
- Check if application status is 'accepted'
- Redirect to pending dashboard if status is not 'accepted'
- Allow access if status is 'accepted'
- Maintain loading state handling

**Implementation Steps:**
1. Open `project1/frontend/src/components/ApplicantDashboardGuard.tsx`
2. Update useEffect logic
3. Add status checking
4. Update redirect logic
5. Add console logging for debugging
6. Test guard behavior

**Code Changes:**
```typescript
useEffect(() => {
  // Only check for applicants
  if (!user || !user.role.includes('applicant')) {
    return;
  }

  // Don't check while loading
  if (isLoading) {
    return;
  }

  // Check if user has submitted application
  const hasSubmittedApplication = applicationData?.hasApplication && 
                                  applicationData.status !== 'not_submitted';

  console.log('🔒 Dashboard Guard Check:', {
    hasApplication: applicationData?.hasApplication,
    applicationStatus: applicationData?.status,
    hasSubmittedApplication,
  });

  // If user hasn't submitted application, redirect to application form
  if (!hasSubmittedApplication) {
    console.log('🚫 No application - Redirecting to application form');
    navigate('/application-form', { replace: true });
    return;
  }

  // Check if application is accepted
  const isAccepted = applicationData.status === 'accepted';
  
  if (!isAccepted) {
    // Redirect to pending dashboard for non-accepted applications
    console.log('⏳ Application not accepted - Redirecting to pending dashboard');
    navigate('/applicant/pending/dashboard', { replace: true });
  } else {
    console.log('✅ Application accepted - Access granted');
  }
}, [applicationData, isLoading, user, navigate]);
```

**Testing:**
- Test with no application
- Test with pending application
- Test with accepted application
- Test with rejected application

---

### Task 2.3: Update PendingApplicantGuard

**Priority:** High  
**Estimated Time:** 45 minutes  
**Dependencies:** Task 1.1

**Description:**
Update the PendingApplicantGuard to detect when application is accepted and redirect to applicant dashboard.

**Acceptance Criteria:**
- Check application status on mount and updates
- Redirect to applicant dashboard if status is 'accepted'
- Maintain existing restriction logic for pending applicants
- Handle status transitions smoothly

**Implementation Steps:**
1. Open `project1/frontend/src/components/PendingApplicantGuard.tsx`
2. Add status check at beginning of useEffect
3. Add redirect logic for accepted status
4. Update console logging
5. Test guard behavior

**Code Changes:**
```typescript
useEffect(() => {
  // Only check for applicants
  if (!user || !user.role.includes('applicant')) {
    return;
  }

  // Wait for data to load
  if (isLoading) {
    return;
  }

  const status = applicationData?.status || 'not_submitted';
  const isAccepted = status === 'accepted';

  // If application is accepted, redirect to full dashboard
  if (isAccepted) {
    console.log('✅ Application accepted - Redirecting to applicant dashboard');
    navigate('/applicant/dashboard', { replace: true });
    return;
  }

  console.log('⏳ Application pending - Checking route restrictions');

  // List of ALLOWED routes for pending applicants
  const allowedRoutes = [
    '/applicant/pending/dashboard',
    '/applicant/pending',
    '/applicant',
    '/application-status',
    '/applicant/profile',
    '/applicant/help',
    '/application-form',
  ];

  // Check if current route is allowed
  const isAllowedRoute = allowedRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + '/')
  );

  // If trying to access a restricted route, redirect to pending dashboard
  if (!isAllowedRoute) {
    console.log('🚫 Pending applicant tried to access restricted route:', location.pathname);
    navigate('/applicant/pending/dashboard', { replace: true });
  }
}, [applicationData, isLoading, user, location.pathname, navigate]);
```

**Testing:**
- Test redirect when status changes to accepted
- Test route restrictions for pending applicants
- Test allowed routes access

---

### Task 2.4: Add Role Change Detection (Optional)

**Priority:** Medium  
**Estimated Time:** 1 hour  
**Dependencies:** Task 1.1

**Description:**
Add a mechanism to detect when user role changes (e.g., from applicant to club_member) and redirect accordingly.

**Acceptance Criteria:**
- Check user role periodically or on specific events
- Detect role changes
- Update auth store with new role
- Redirect to appropriate dashboard
- Don't interfere with normal navigation

**Implementation Steps:**
1. Open `project1/frontend/src/components/Layout.tsx`
2. Add useEffect for role checking
3. Implement role comparison logic
4. Add redirect on role change
5. Add cleanup for interval
6. Test role change detection

**Code Changes:**
```typescript
// Add to Layout component
useEffect(() => {
  const checkRoleChange = async () => {
    if (!user || !token) return;

    try {
      const response = await api.get('/auth/me');
      const latestUser = response.data.data;
      
      // Check if role has changed
      const currentRoles = JSON.stringify(user.role.sort());
      const latestRoles = JSON.stringify(latestUser.role.sort());
      
      if (currentRoles !== latestRoles) {
        console.log('🔄 Role changed detected:', {
          from: user.role,
          to: latestUser.role
        });
        
        // Update auth with new user data
        setAuth(latestUser, token);
        
        // Redirect to new dashboard
        const newDashboardPath = getDashboardPath(latestUser.role);
        console.log('→ Redirecting to:', newDashboardPath);
        navigate(newDashboardPath, { replace: true });
      }
    } catch (error) {
      console.error('Failed to check role change:', error);
      // Don't redirect on error - keep user where they are
    }
  };

  // Check on mount
  checkRoleChange();

  // Optional: Check periodically (every 30 seconds)
  const interval = setInterval(checkRoleChange, 30000);

  return () => clearInterval(interval);
}, [user, token, navigate, setAuth]);
```

**Testing:**
- Test role change detection
- Test redirect on role change
- Test error handling
- Test cleanup on unmount

---

## Phase 3: Testing and Validation

### Task 3.1: Write Unit Tests

**Priority:** High  
**Estimated Time:** 2 hours  
**Dependencies:** All Phase 1 and Phase 2 tasks

**Description:**
Write comprehensive unit tests for new utilities and hooks.

**Acceptance Criteria:**
- Test `getDashboardPathWithStatus` with all combinations
- Test `useSmartDashboardRedirect` with mocked data
- Test edge cases and error scenarios
- Achieve >80% code coverage

**Test Files to Create:**
1. `project1/frontend/src/utils/__tests__/roleUtils.test.ts`
2. `project1/frontend/src/hooks/__tests__/useSmartDashboardRedirect.test.ts`

**Implementation Steps:**
1. Create test files
2. Write test cases for getDashboardPathWithStatus
3. Write test cases for useSmartDashboardRedirect
4. Run tests and fix failures
5. Check coverage

---

### Task 3.2: Write Integration Tests

**Priority:** Medium  
**Estimated Time:** 2 hours  
**Dependencies:** Task 3.1

**Description:**
Write integration tests for component interactions and routing flows.

**Acceptance Criteria:**
- Test login flow with different user types
- Test guard redirects
- Test status change transitions
- Test role change transitions

**Test Scenarios:**
1. Login with no application → redirect to form
2. Login with pending application → redirect to pending dashboard
3. Login with accepted application → redirect to applicant dashboard
4. Status change from pending to accepted → redirect
5. Role change from applicant to club_member → redirect

**Implementation Steps:**
1. Create integration test file
2. Set up test environment with mocked API
3. Write test scenarios
4. Run tests and fix failures

---

### Task 3.3: Manual Testing

**Priority:** High  
**Estimated Time:** 1 hour  
**Dependencies:** All Phase 2 tasks

**Description:**
Perform manual testing of the complete user flow.

**Test Scenarios:**
1. **New User Flow:**
   - Register new account
   - Login → Should go to application form
   - Submit application → Should go to pending dashboard
   - Admin approves → Refresh → Should go to applicant dashboard
   - Admin promotes to club member → Refresh → Should go to club member dashboard

2. **Existing User Flows:**
   - Login as user with pending application → Should go to pending dashboard
   - Login as user with accepted application → Should go to applicant dashboard
   - Login as club member → Should go to club member dashboard

3. **Edge Cases:**
   - Login with rejected application → Should go to pending dashboard with message
   - Login with withdrawn application → Should go to pending dashboard
   - Network error during status fetch → Should fallback gracefully

**Checklist:**
- [ ] New user registration and flow
- [ ] Pending applicant experience
- [ ] Approved applicant experience
- [ ] Club member experience
- [ ] Admin approval workflow
- [ ] Role promotion workflow
- [ ] Error handling
- [ ] Loading states
- [ ] Console logs are helpful
- [ ] No infinite redirect loops

---

## Phase 4: Documentation and Cleanup

### Task 4.1: Update Code Documentation

**Priority:** Medium  
**Estimated Time:** 30 minutes  
**Dependencies:** All previous tasks

**Description:**
Update code comments and JSDoc for all modified files.

**Acceptance Criteria:**
- All new functions have JSDoc comments
- Complex logic has inline comments
- Type definitions are documented
- Examples are provided where helpful

**Files to Document:**
- `roleUtils.ts`
- `useSmartDashboardRedirect.ts`
- `Login.tsx`
- `ApplicantDashboardGuard.tsx`
- `PendingApplicantGuard.tsx`

---

### Task 4.2: Update README/Documentation

**Priority:** Low  
**Estimated Time:** 30 minutes  
**Dependencies:** Task 4.1

**Description:**
Update project documentation to reflect new routing logic.

**Acceptance Criteria:**
- Document new routing flow
- Add diagrams if helpful
- Update troubleshooting guide
- Document for developers

**Documentation to Update:**
- Add routing flow diagram
- Document guard behavior
- Add troubleshooting section
- Document testing approach

---

### Task 4.3: Code Cleanup

**Priority:** Low  
**Estimated Time:** 30 minutes  
**Dependencies:** All previous tasks

**Description:**
Clean up any unused code, console logs, and temporary fixes.

**Acceptance Criteria:**
- Remove unused imports
- Remove debug console logs (keep important ones)
- Remove commented code
- Ensure consistent code style

**Cleanup Checklist:**
- [ ] Remove unused imports
- [ ] Clean up console logs
- [ ] Remove commented code
- [ ] Format code consistently
- [ ] Remove temporary fixes

---

## Task Summary

### Phase 1: Core Utilities (2 hours)
- Task 1.1: Add getDashboardPathWithStatus (30 min)
- Task 1.2: Create useSmartDashboardRedirect Hook (45 min)

### Phase 2: Component Updates (3.5 hours)
- Task 2.1: Update Login Component (1 hour)
- Task 2.2: Update ApplicantDashboardGuard (45 min)
- Task 2.3: Update PendingApplicantGuard (45 min)
- Task 2.4: Add Role Change Detection (1 hour) - Optional

### Phase 3: Testing (5 hours)
- Task 3.1: Write Unit Tests (2 hours)
- Task 3.2: Write Integration Tests (2 hours)
- Task 3.3: Manual Testing (1 hour)

### Phase 4: Documentation (1.5 hours)
- Task 4.1: Update Code Documentation (30 min)
- Task 4.2: Update README/Documentation (30 min)
- Task 4.3: Code Cleanup (30 min)

**Total Estimated Time:** 12 hours (without optional tasks)

---

## Implementation Order

1. **Day 1 (4 hours):**
   - Task 1.1: Add getDashboardPathWithStatus
   - Task 1.2: Create useSmartDashboardRedirect Hook
   - Task 2.1: Update Login Component
   - Task 2.2: Update ApplicantDashboardGuard

2. **Day 2 (4 hours):**
   - Task 2.3: Update PendingApplicantGuard
   - Task 3.1: Write Unit Tests
   - Task 3.3: Manual Testing (initial)

3. **Day 3 (4 hours):**
   - Task 3.2: Write Integration Tests
   - Task 3.3: Manual Testing (complete)
   - Task 4.1: Update Code Documentation
   - Task 4.2: Update README/Documentation
   - Task 4.3: Code Cleanup

---

## Success Criteria

The implementation is considered successful when:

1. ✅ All unit tests pass
2. ✅ All integration tests pass
3. ✅ Manual testing checklist is complete
4. ✅ No infinite redirect loops
5. ✅ Loading states work correctly
6. ✅ Error handling is robust
7. ✅ Code is documented
8. ✅ No breaking changes to existing functionality
9. ✅ Performance is acceptable (no noticeable delays)
10. ✅ User experience is smooth and intuitive

---

## Rollback Plan

If critical issues are discovered:

1. **Immediate (< 5 minutes):**
   - Revert Task 2.1 (Login changes)
   - Users can still login, may see wrong dashboard

2. **Short-term (< 30 minutes):**
   - Revert Task 2.2 and 2.3 (Guard changes)
   - System returns to previous behavior

3. **Long-term:**
   - Keep Task 1.1 and 1.2 (utilities)
   - No breaking changes, can be used later

---

## Notes

- All tasks should be completed in order within each phase
- Each task should be tested before moving to the next
- Console logs should be kept for debugging but can be removed in production
- Performance should be monitored during implementation
- User feedback should be collected after deployment
