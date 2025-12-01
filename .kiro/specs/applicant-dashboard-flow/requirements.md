# Requirements Document

## Introduction

This specification defines the user flow for applicants through different dashboard states based on their application status and role. The system must automatically route users to the appropriate dashboard after login and handle transitions when their status or role changes.

## Glossary

- **System**: The Noafarin platform frontend and backend
- **Applicant**: A user with the 'applicant' role who has registered but may or may not have submitted an application
- **Pending Applicant**: An applicant whose application status is 'submitted', 'under_review', or 'interview_scheduled'
- **Approved Applicant**: An applicant whose application status is 'accepted'
- **Club Member**: A user who has been promoted to the 'club_member' role by an administrator
- **Application Status**: The current state of a user's application ('draft', 'submitted', 'under_review', 'interview_scheduled', 'accepted', 'rejected', 'withdrawn')
- **Dashboard**: The main interface shown to a user after login
- **Pending Dashboard**: A limited dashboard shown to pending applicants at /applicant/pending/dashboard
- **Applicant Dashboard**: A full-featured dashboard shown to approved applicants at /applicant/dashboard
- **Club Member Dashboard**: A dashboard shown to club members at /club-member/dashboard
- **Admin**: A user with administrative privileges who can approve applications and change user roles

## Requirements

### Requirement 1

**User Story:** As a new applicant, I want to be directed to the appropriate dashboard immediately after login, so that I see content relevant to my current application status.

#### Acceptance Criteria

1. WHEN an applicant logs in and has no application THEN the System SHALL redirect the user to the application form at /application-form
2. WHEN an applicant logs in and has a pending application (status: submitted, under_review, or interview_scheduled) THEN the System SHALL redirect the user to the pending dashboard at /applicant/pending/dashboard
3. WHEN an applicant logs in and has an accepted application THEN the System SHALL redirect the user to the applicant dashboard at /applicant/dashboard
4. WHEN a club member logs in THEN the System SHALL redirect the user to the club member dashboard at /club-member/dashboard
5. WHEN the System determines the redirect path THEN the System SHALL fetch the user's application status before navigation

### Requirement 2

**User Story:** As a pending applicant, I want to see a limited dashboard with relevant information, so that I understand my application is being reviewed and know what to expect next.

#### Acceptance Criteria

1. WHEN a pending applicant accesses the pending dashboard THEN the System SHALL display application status information
2. WHEN a pending applicant accesses the pending dashboard THEN the System SHALL display estimated timeline information
3. WHEN a pending applicant accesses the pending dashboard THEN the System SHALL display next steps and guidelines
4. WHEN a pending applicant attempts to access restricted routes THEN the System SHALL redirect them to the pending dashboard
5. WHEN a pending applicant accesses allowed routes (profile, help, application status) THEN the System SHALL permit access

### Requirement 3

**User Story:** As an administrator, I want the system to automatically transition users to the correct dashboard when I approve their application, so that users immediately gain access to full features.

#### Acceptance Criteria

1. WHEN an admin changes an application status to 'accepted' THEN the System SHALL allow the applicant to access the applicant dashboard on their next page load
2. WHEN an applicant with accepted status accesses any route THEN the System SHALL verify their status and route them to the applicant dashboard if they attempt to access the pending dashboard
3. WHEN an applicant with accepted status refreshes the page THEN the System SHALL maintain their access to the applicant dashboard
4. WHEN the System checks application status THEN the System SHALL use the most recent status from the database
5. WHEN an application status changes from pending to accepted THEN the System SHALL update the user's accessible routes

### Requirement 4

**User Story:** As an administrator, I want the system to automatically transition users to the club member dashboard when I promote them, so that they immediately see club member features.

#### Acceptance Criteria

1. WHEN an admin changes a user's role to 'club_member' THEN the System SHALL allow the user to access the club member dashboard on their next page load
2. WHEN a club member accesses any route THEN the System SHALL verify their role and route them to the club member dashboard if they attempt to access applicant routes
3. WHEN a club member refreshes the page THEN the System SHALL maintain their access to the club member dashboard
4. WHEN the System checks user role THEN the System SHALL use the most recent role from the authentication token or database
5. WHEN a user's role changes from applicant to club_member THEN the System SHALL update the user's accessible routes

### Requirement 5

**User Story:** As an applicant, I want the system to handle edge cases gracefully, so that I always see appropriate content even when errors occur.

#### Acceptance Criteria

1. WHEN the System fails to fetch application status THEN the System SHALL redirect the user to a safe default route (application form or pending dashboard)
2. WHEN an applicant has a rejected application THEN the System SHALL display the pending dashboard with rejection information
3. WHEN an applicant has a withdrawn application THEN the System SHALL allow the user to resubmit or display appropriate messaging
4. WHEN the System is loading application status THEN the System SHALL display a loading indicator
5. WHEN a user has multiple roles THEN the System SHALL use the highest priority role to determine the dashboard

### Requirement 6

**User Story:** As a developer, I want centralized routing logic, so that dashboard navigation is consistent across the application.

#### Acceptance Criteria

1. WHEN the System determines a dashboard path THEN the System SHALL use a centralized utility function
2. WHEN the System checks application status THEN the System SHALL use a reusable hook
3. WHEN the System routes users THEN the System SHALL consider both role and application status
4. WHEN the System updates routing logic THEN the System SHALL maintain backward compatibility with existing code
5. WHEN the System handles routing THEN the System SHALL separate concerns between authentication, authorization, and navigation

### Requirement 7

**User Story:** As an applicant, I want smooth transitions between dashboard states, so that my experience is seamless when my status changes.

#### Acceptance Criteria

1. WHEN an applicant's status changes THEN the System SHALL detect the change on the next page load or navigation
2. WHEN an applicant is on the wrong dashboard for their status THEN the System SHALL redirect them to the correct dashboard
3. WHEN the System redirects a user THEN the System SHALL use replace navigation to prevent back button issues
4. WHEN a user navigates between pages THEN the System SHALL verify their current status and role
5. WHEN the System performs a redirect THEN the System SHALL complete the redirect before rendering content

### Requirement 8

**User Story:** As a system architect, I want clear separation between pending and approved applicant experiences, so that the system is maintainable and extensible.

#### Acceptance Criteria

1. WHEN pending applicants access the system THEN the System SHALL use PendingLayout with limited navigation
2. WHEN approved applicants access the system THEN the System SHALL use full Layout with complete navigation
3. WHEN the System renders layouts THEN the System SHALL base the decision on application status
4. WHEN the System switches layouts THEN the System SHALL maintain consistent styling and user experience
5. WHEN developers modify layouts THEN the System SHALL ensure changes do not affect the other layout type
