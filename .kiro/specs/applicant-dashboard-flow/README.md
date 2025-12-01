# Applicant Dashboard Flow - Specification

## Overview

This specification defines the implementation of an intelligent dashboard routing system that automatically directs users to the appropriate dashboard based on their role and application status.

## Problem Statement

Currently, the system does not differentiate between applicants with pending applications and those with accepted applications. All applicants are routed to the same dashboard regardless of their application status, leading to confusion and poor user experience.

## Solution

Implement a smart routing system that:
1. Checks user role AND application status after login
2. Routes to pending dashboard for applicants with pending applications
3. Routes to applicant dashboard for applicants with accepted applications
4. Routes to club member dashboard when user is promoted
5. Handles transitions smoothly when status/role changes

## User Flow

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│  Check Role & Status        │
└──────┬──────────────────────┘
       │
       ├─── No Application ────────────→ /application-form
       │
       ├─── Pending Application ───────→ /applicant/pending/dashboard
       │    (submitted, under_review,
       │     interview_scheduled)
       │
       ├─── Accepted Application ──────→ /applicant/dashboard
       │    (role: applicant)
       │
       └─── Club Member ───────────────→ /club-member/dashboard
            (role: club_member)
```

## Documents

### 1. [Requirements](./requirements.md)
Detailed requirements with user stories and acceptance criteria.

**Key Requirements:**
- Smart redirect after login based on role and status
- Pending dashboard for applicants awaiting approval
- Automatic transition when admin approves application
- Automatic transition when admin promotes to club member
- Graceful error handling for edge cases

### 2. [Design](./design.md)
Technical design and architecture.

**Key Components:**
- `getDashboardPathWithStatus()` - Utility function for routing logic
- `useSmartDashboardRedirect()` - Hook for intelligent routing
- Updated Login component with status checking
- Enhanced guards for status-based access control
- Role change detection mechanism

### 3. [Tasks](./tasks.md)
Implementation tasks organized by phase.

**Phases:**
1. **Phase 1:** Core utilities and hooks (2 hours)
2. **Phase 2:** Component updates (3.5 hours)
3. **Phase 3:** Testing and validation (5 hours)
4. **Phase 4:** Documentation and cleanup (1.5 hours)

**Total Estimated Time:** 12 hours

## Quick Start

### For Developers

1. **Read the Requirements:**
   - Understand user stories and acceptance criteria
   - Review the desired user flow

2. **Review the Design:**
   - Understand the architecture
   - Review component interactions
   - Check data flow diagrams

3. **Follow the Tasks:**
   - Start with Phase 1 (utilities)
   - Progress through phases in order
   - Test after each task

### For Reviewers

1. **Check Requirements Coverage:**
   - Verify all acceptance criteria are met
   - Test user scenarios manually

2. **Review Code Quality:**
   - Check for proper error handling
   - Verify loading states
   - Ensure no infinite loops

3. **Validate Testing:**
   - Review unit test coverage
   - Check integration tests
   - Verify manual testing checklist

## Key Features

### 1. Smart Login Redirect
After successful login, the system automatically determines the correct dashboard based on:
- User role (applicant, club_member, admin, etc.)
- Application status (for applicants)
- Application existence

### 2. Status-Based Access Control
Guards prevent access to inappropriate dashboards:
- Pending applicants can only access limited routes
- Approved applicants can access full applicant features
- Club members can access club member features

### 3. Automatic Transitions
The system detects changes and redirects automatically:
- When admin approves application → redirect to applicant dashboard
- When admin promotes to club member → redirect to club member dashboard
- Smooth transitions without page refresh (on next navigation)

### 4. Robust Error Handling
The system handles errors gracefully:
- Network errors → fallback to safe routes
- Invalid status → treat as not submitted
- Missing data → show loading states

## Technical Stack

- **Frontend:** React, TypeScript, React Router
- **State Management:** Zustand (auth), React Query (application status)
- **Routing:** React Router v6
- **API:** Axios with custom error handling

## Files Modified

### New Files
- `project1/frontend/src/hooks/useSmartDashboardRedirect.ts`

### Modified Files
- `project1/frontend/src/utils/roleUtils.ts`
- `project1/frontend/src/pages/Login.tsx`
- `project1/frontend/src/components/ApplicantDashboardGuard.tsx`
- `project1/frontend/src/components/PendingApplicantGuard.tsx`
- `project1/frontend/src/components/Layout.tsx` (optional)

## Testing Strategy

### Unit Tests
- Test `getDashboardPathWithStatus` with all role/status combinations
- Test `useSmartDashboardRedirect` with mocked data
- Test edge cases and error scenarios

### Integration Tests
- Test login flow with different user types
- Test guard redirects
- Test status change transitions

### Manual Testing
- Complete user journey from registration to club member
- Test all edge cases
- Verify error handling

## Success Metrics

1. ✅ Users are automatically routed to correct dashboard after login
2. ✅ Pending applicants see limited dashboard
3. ✅ Approved applicants see full dashboard
4. ✅ Club members see club member dashboard
5. ✅ Transitions are smooth and automatic
6. ✅ No infinite redirect loops
7. ✅ Error handling is robust
8. ✅ Loading states are clear
9. ✅ Performance is acceptable
10. ✅ Code is maintainable and documented

## Deployment Plan

### Phase 1: Development (Day 1-2)
- Implement core utilities
- Update components
- Write tests

### Phase 2: Testing (Day 3)
- Run all tests
- Perform manual testing
- Fix bugs

### Phase 3: Staging (Day 4)
- Deploy to staging environment
- Perform UAT (User Acceptance Testing)
- Collect feedback

### Phase 4: Production (Day 5)
- Deploy to production
- Monitor for issues
- Be ready to rollback if needed

## Rollback Plan

If critical issues occur:

1. **Immediate:** Revert Login.tsx changes
2. **Short-term:** Revert guard changes
3. **Long-term:** Keep utility functions (no breaking changes)

## Support and Maintenance

### Monitoring
- Track login success rates
- Monitor redirect patterns
- Log guard redirects
- Track error rates

### Debugging
- Console logs at key decision points
- Clear error messages
- Helpful loading states

### Future Enhancements
- Real-time status updates via WebSocket
- Backend optimization (include status in login response)
- Transition animations
- Progressive enhancement

## FAQ

### Q: What happens if application status fetch fails?
**A:** The system falls back to a safe default route (application form) and logs the error.

### Q: Will this break existing functionality?
**A:** No, the implementation is designed to be backward compatible. Existing routes and guards continue to work.

### Q: How long does the redirect take?
**A:** The redirect is nearly instant for non-applicants. For applicants, there's a small delay (< 500ms) to fetch application status.

### Q: Can users manually navigate to other dashboards?
**A:** No, guards prevent unauthorized access. Users are automatically redirected to their appropriate dashboard.

### Q: What if a user has multiple roles?
**A:** The system uses role priority (admin > director > club_member > applicant) to determine the dashboard.

### Q: How are status changes detected?
**A:** Status changes are detected on page load/navigation. Optional: periodic checking or WebSocket for real-time updates.

## Contact

For questions or issues:
- Review the design document for technical details
- Check the tasks document for implementation guidance
- Refer to the requirements document for acceptance criteria

## Version History

- **v1.0.0** (2024-11-30): Initial specification
  - Requirements defined
  - Design completed
  - Tasks outlined
  - Ready for implementation

---

**Status:** ✅ Ready for Implementation  
**Priority:** High  
**Estimated Effort:** 12 hours  
**Risk Level:** Low (backward compatible, gradual rollout)
