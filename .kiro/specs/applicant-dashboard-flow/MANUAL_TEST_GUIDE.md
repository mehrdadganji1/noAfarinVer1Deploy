# Manual Testing Guide

## Overview
This guide provides step-by-step instructions for manually testing the applicant dashboard flow feature.

**Estimated Time:** 30-45 minutes  
**Prerequisites:** 
- Backend services running
- Test users created
- Browser with DevTools open

---

## Setup

### 1. Start Services
```bash
cd project1
npm run start:all
```

### 2. Open Browser DevTools
- Open Chrome/Edge DevTools (F12)
- Go to Console tab
- Keep it open to see debug logs

### 3. Clear Browser Data (Optional)
- Clear localStorage
- Clear cookies
- Hard refresh (Ctrl+Shift+R)

---

## Test Scenarios

### Scenario 1: New User Registration and Flow

**Objective:** Test complete flow from registration to club member

**Steps:**

1. **Register New User**
   - Go to `/register`
   - Fill in registration form:
     - Name: Test User
     - Email: test-new-user@example.com
     - Password: Test123456
   - Submit form
   - Verify email (if required)
   - ✅ **Expected:** Registration successful

2. **First Login**
   - Go to `/login`
   - Login with credentials
   - 📊 **Check Console:** Should see:
     ```
     🔐 Login successful, setting auth...
     📊 Application status: not_submitted
     → Redirecting to: /application-form
     ```
   - ✅ **Expected:** Redirected to `/application-form`

3. **Submit Application**
   - Fill in application form
   - Submit application
   - 📊 **Check Console:** Should see application submission logs
   - ✅ **Expected:** Application submitted successfully

4. **Logout and Login Again**
   - Logout
   - Login again
   - 📊 **Check Console:** Should see:
     ```
     📊 Application status: submitted (or under_review)
     → Redirecting to: /applicant/pending/dashboard
     ```
   - ✅ **Expected:** Redirected to `/applicant/pending/dashboard`

5. **Try to Access Restricted Routes**
   - Try to navigate to `/applicant/dashboard`
   - 📊 **Check Console:** Should see:
     ```
     ⏳ Application not accepted - Redirecting to pending dashboard
     ```
   - ✅ **Expected:** Redirected back to `/applicant/pending/dashboard`
   
   - Try to navigate to `/applicant/resources`
   - 📊 **Check Console:** Should see:
     ```
     🚫 Pending applicant tried to access restricted route: /applicant/resources
     ```
   - ✅ **Expected:** Redirected to `/applicant/pending/dashboard`

6. **Admin Approves Application**
   - Login as admin (different browser/incognito)
   - Go to applications management
   - Find the test user's application
   - Change status to "accepted"
   - ✅ **Expected:** Status updated successfully

7. **Refresh Pending Dashboard**
   - Go back to test user's browser
   - Refresh the page (F5)
   - 📊 **Check Console:** Should see:
     ```
     ✅ Application accepted - Redirecting to applicant dashboard
     ```
   - ✅ **Expected:** Automatically redirected to `/applicant/dashboard`

8. **Verify Full Access**
   - Try to navigate to `/applicant/resources`
   - ✅ **Expected:** Access granted, page loads
   
   - Try to navigate to `/applicant/messages`
   - ✅ **Expected:** Access granted, page loads

9. **Admin Promotes to Club Member**
   - Login as admin again
   - Go to user management
   - Find the test user
   - Add "club_member" role
   - ✅ **Expected:** Role updated successfully

10. **Logout and Login as Club Member**
    - Logout test user
    - Login again
    - 📊 **Check Console:** Should see:
      ```
      User roles: ["applicant", "club_member"]
      → Redirecting to: /club-member/dashboard
      ```
    - ✅ **Expected:** Redirected to `/club-member/dashboard`

**Result:** ✅ Pass / ❌ Fail  
**Notes:**

---

### Scenario 2: Existing Pending Applicant

**Objective:** Test login flow for user with pending application

**Steps:**

1. **Create Test User with Pending Application**
   - Use existing test user OR
   - Create new user and submit application

2. **Login**
   - Go to `/login`
   - Login with credentials
   - 📊 **Check Console:** Should see:
     ```
     📊 Application status: submitted (or under_review)
     → Redirecting to: /applicant/pending/dashboard
     ```
   - ✅ **Expected:** Redirected to `/applicant/pending/dashboard`

3. **Verify Pending Dashboard Content**
   - Check that pending dashboard shows:
     - Application status widget
     - Progress indicator
     - Next steps card
     - Tips and guidelines
   - ✅ **Expected:** All widgets visible and functional

4. **Test Sidebar Navigation**
   - Click on "داشبورد" in sidebar
   - ✅ **Expected:** Stays on pending dashboard
   
   - Click on "پروفایل" in sidebar
   - ✅ **Expected:** Navigates to profile page
   
   - Click on "راهنما" in sidebar
   - ✅ **Expected:** Navigates to help page

5. **Test Restricted Routes**
   - Manually navigate to `/applicant/dashboard`
   - ✅ **Expected:** Redirected to pending dashboard
   
   - Manually navigate to `/applicant/resources`
   - ✅ **Expected:** Redirected to pending dashboard

**Result:** ✅ Pass / ❌ Fail  
**Notes:**

---

### Scenario 3: Existing Accepted Applicant

**Objective:** Test login flow for user with accepted application

**Steps:**

1. **Create Test User with Accepted Application**
   - Use existing test user OR
   - Create new user, submit application, admin approves

2. **Login**
   - Go to `/login`
   - Login with credentials
   - 📊 **Check Console:** Should see:
     ```
     📊 Application status: accepted
     → Redirecting to: /applicant/dashboard
     ```
   - ✅ **Expected:** Redirected to `/applicant/dashboard`

3. **Verify Full Dashboard Access**
   - Check that dashboard shows:
     - Welcome header
     - Stats overview
     - Quick actions
     - Upcoming interviews
     - Activity feed
   - ✅ **Expected:** All widgets visible and functional

4. **Test All Applicant Routes**
   - Navigate to `/applicant/resources`
   - ✅ **Expected:** Access granted
   
   - Navigate to `/applicant/messages`
   - ✅ **Expected:** Access granted
   
   - Navigate to `/applicant/profile`
   - ✅ **Expected:** Access granted
   
   - Navigate to `/applicant/help`
   - ✅ **Expected:** Access granted

5. **Test Pending Dashboard Access**
   - Manually navigate to `/applicant/pending/dashboard`
   - 📊 **Check Console:** Should see:
     ```
     ✅ Application accepted - Redirecting to applicant dashboard
     ```
   - ✅ **Expected:** Redirected to `/applicant/dashboard`

**Result:** ✅ Pass / ❌ Fail  
**Notes:**

---

### Scenario 4: Club Member Login

**Objective:** Test login flow for club member

**Steps:**

1. **Login as Club Member**
   - Go to `/login`
   - Login with club member credentials
   - 📊 **Check Console:** Should see:
     ```
     User roles: ["club_member"]
     → Redirecting to: /club-member/dashboard
     ```
   - ✅ **Expected:** Redirected to `/club-member/dashboard`

2. **Verify Club Member Dashboard**
   - Check that dashboard shows club member content
   - ✅ **Expected:** Club member dashboard loads correctly

3. **Test Applicant Routes**
   - Try to navigate to `/applicant/dashboard`
   - ✅ **Expected:** Access denied or redirected (depends on implementation)

**Result:** ✅ Pass / ❌ Fail  
**Notes:**

---

### Scenario 5: Admin Login

**Objective:** Test login flow for admin

**Steps:**

1. **Login as Admin**
   - Go to `/login`
   - Login with admin credentials
   - 📊 **Check Console:** Should see:
     ```
     User roles: ["admin"]
     → Redirecting to: /admin/dashboard
     ```
   - ✅ **Expected:** Redirected to `/admin/dashboard`

2. **Verify Admin Dashboard**
   - Check that dashboard shows admin content
   - ✅ **Expected:** Admin dashboard loads correctly

**Result:** ✅ Pass / ❌ Fail  
**Notes:**

---

### Scenario 6: Director Login

**Objective:** Test login flow for director

**Steps:**

1. **Login as Director**
   - Go to `/login`
   - Login with director credentials
   - 📊 **Check Console:** Should see:
     ```
     User roles: ["director"]
     → Redirecting to: /director/dashboard
     ```
   - ✅ **Expected:** Redirected to `/director/dashboard`

2. **Verify Director Dashboard**
   - Check that dashboard shows director content
   - ✅ **Expected:** Director dashboard loads correctly

**Result:** ✅ Pass / ❌ Fail  
**Notes:**

---

### Scenario 7: Status Transition (Pending → Accepted)

**Objective:** Test automatic redirect when status changes

**Steps:**

1. **Login as Pending Applicant**
   - Login with pending applicant credentials
   - ✅ **Expected:** On `/applicant/pending/dashboard`

2. **Admin Approves Application**
   - In another browser/tab, login as admin
   - Approve the applicant's application
   - ✅ **Expected:** Status changed to "accepted"

3. **Refresh Pending Dashboard**
   - Go back to applicant's browser
   - Refresh the page (F5)
   - 📊 **Check Console:** Should see:
     ```
     ✅ Application accepted - Redirecting to applicant dashboard
     ```
   - ✅ **Expected:** Automatically redirected to `/applicant/dashboard`

4. **Verify Full Access**
   - Try to access all applicant routes
   - ✅ **Expected:** All routes accessible

**Result:** ✅ Pass / ❌ Fail  
**Notes:**

---

### Scenario 8: Error Handling

**Objective:** Test error handling and fallback behavior

**Steps:**

1. **Network Error During Login**
   - Open DevTools → Network tab
   - Set throttling to "Offline"
   - Try to login
   - ✅ **Expected:** Error message shown, no crash

2. **Network Error During Status Fetch**
   - Login successfully
   - Before redirect, set network to "Offline"
   - 📊 **Check Console:** Should see fallback behavior
   - ✅ **Expected:** Redirected to safe default (application form)

3. **Invalid Application Status**
   - (This requires backend modification to test)
   - ✅ **Expected:** Handled gracefully, no crash

**Result:** ✅ Pass / ❌ Fail  
**Notes:**

---

### Scenario 9: Loading States

**Objective:** Test loading states and UI feedback

**Steps:**

1. **Login Loading State**
   - Go to `/login`
   - Enter credentials
   - Click login
   - ✅ **Expected:** Loading spinner shown during login

2. **Guard Loading State**
   - Login as applicant
   - Navigate to protected route
   - ✅ **Expected:** Loading state shown while checking permissions

3. **No Flickering**
   - Observe UI during transitions
   - ✅ **Expected:** No flickering or UI jumps

**Result:** ✅ Pass / ❌ Fail  
**Notes:**

---

### Scenario 10: Edge Cases

**Objective:** Test edge cases and unusual scenarios

**Steps:**

1. **User with No Application**
   - Create user without submitting application
   - Login
   - ✅ **Expected:** Redirected to `/application-form`

2. **User with Rejected Application**
   - Create user with rejected application
   - Login
   - ✅ **Expected:** Redirected to `/applicant/pending/dashboard`
   - ✅ **Expected:** Message about rejection shown

3. **User with Withdrawn Application**
   - Create user with withdrawn application
   - Login
   - ✅ **Expected:** Redirected to `/applicant/pending/dashboard`

4. **User with Multiple Roles**
   - Create user with ["applicant", "club_member"] roles
   - Login
   - ✅ **Expected:** Redirected to highest priority dashboard (club_member)

**Result:** ✅ Pass / ❌ Fail  
**Notes:**

---

## Test Results Summary

| Scenario | Status | Notes |
|----------|--------|-------|
| 1. New User Flow | ⏳ Not Tested | |
| 2. Pending Applicant | ⏳ Not Tested | |
| 3. Accepted Applicant | ⏳ Not Tested | |
| 4. Club Member | ⏳ Not Tested | |
| 5. Admin | ⏳ Not Tested | |
| 6. Director | ⏳ Not Tested | |
| 7. Status Transition | ⏳ Not Tested | |
| 8. Error Handling | ⏳ Not Tested | |
| 9. Loading States | ⏳ Not Tested | |
| 10. Edge Cases | ⏳ Not Tested | |

**Overall Status:** ⏳ Not Started / 🔄 In Progress / ✅ Complete / ❌ Failed

---

## Issues Found

### Issue 1: [Title]
**Severity:** High / Medium / Low  
**Description:**  
**Steps to Reproduce:**  
**Expected Behavior:**  
**Actual Behavior:**  
**Fix Required:**

---

## Console Log Reference

### Expected Console Logs

**Login (Applicant with no application):**
```
🔐 Login successful, setting auth...
📊 Application status: not_submitted
→ Redirecting to: /application-form
```

**Login (Pending applicant):**
```
🔐 Login successful, setting auth...
📊 Application status: submitted
→ Redirecting to: /applicant/pending/dashboard
```

**Login (Accepted applicant):**
```
🔐 Login successful, setting auth...
📊 Application status: accepted
→ Redirecting to: /applicant/dashboard
```

**ApplicantDashboardGuard (No application):**
```
🔒 Dashboard Guard Check: {
  hasApplication: false,
  applicationStatus: undefined,
  hasSubmittedApplication: false
}
🚫 No application - Redirecting to application form
```

**ApplicantDashboardGuard (Pending):**
```
🔒 Dashboard Guard Check: {
  hasApplication: true,
  applicationStatus: "submitted",
  hasSubmittedApplication: true
}
⏳ Application not accepted - Redirecting to pending dashboard
   Status: submitted
```

**ApplicantDashboardGuard (Accepted):**
```
🔒 Dashboard Guard Check: {
  hasApplication: true,
  applicationStatus: "accepted",
  hasSubmittedApplication: true
}
✅ Application accepted - Access granted
```

**PendingApplicantGuard (Accepted):**
```
✅ Application accepted - Redirecting to applicant dashboard
```

**PendingApplicantGuard (Restricted route):**
```
⏳ Application pending - Checking route restrictions
   Status: submitted
🚫 Pending applicant tried to access restricted route: /applicant/resources
```

---

## Tips for Testing

1. **Keep DevTools Console Open**
   - All important logs are prefixed with emojis
   - Look for 🔐, 📊, ✅, ⏳, 🚫 symbols

2. **Test in Incognito Mode**
   - Prevents localStorage conflicts
   - Clean state for each test

3. **Use Multiple Browsers**
   - Test admin and user simultaneously
   - Verify real-time updates

4. **Check Network Tab**
   - Verify API calls are made
   - Check response status codes
   - Look for errors

5. **Test on Different Devices**
   - Desktop
   - Tablet
   - Mobile

6. **Test with Slow Network**
   - Use DevTools throttling
   - Verify loading states work

---

## Checklist

Before marking testing as complete, ensure:

- [ ] All 10 scenarios tested
- [ ] All console logs match expected output
- [ ] No infinite redirect loops
- [ ] Loading states work correctly
- [ ] Error handling is robust
- [ ] No TypeScript errors in console
- [ ] No React warnings in console
- [ ] UI is responsive and smooth
- [ ] All guards work as expected
- [ ] Status transitions work correctly

---

## Next Steps After Testing

1. **If All Tests Pass:**
   - Update IMPLEMENTATION_STATUS.md
   - Mark Phase 3 as complete
   - Proceed to Phase 4 (Documentation)

2. **If Issues Found:**
   - Document all issues
   - Prioritize by severity
   - Fix critical issues first
   - Re-test after fixes

3. **Write Automated Tests:**
   - Convert manual tests to unit tests
   - Write integration tests
   - Set up CI/CD testing

---

## Contact

If you encounter any issues during testing, please document them in the "Issues Found" section above.
