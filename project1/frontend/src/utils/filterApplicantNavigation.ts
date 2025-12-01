import { NavigationGroup } from '@/config/navigation';

/**
 * Filter navigation items for applicants based on application submission status
 * If application not submitted: only show Dashboard and Profile
 * If application submitted: show all items
 */
export function filterApplicantNavigation(
  navigationGroups: NavigationGroup[],
  hasSubmittedApplication: boolean,
  userRoles: string[]
): NavigationGroup[] {
  // Only filter for applicants
  if (!userRoles.includes('applicant')) {
    return navigationGroups;
  }

  // If application submitted, show all navigation
  if (hasSubmittedApplication) {
    return navigationGroups;
  }

  // If application NOT submitted, only show Dashboard and Profile
  const allowedPaths = [
    '/applicant/dashboard',
    '/applicant/profile'
  ];

  return navigationGroups.map(group => ({
    ...group,
    items: group.items.filter(item => 
      allowedPaths.some(path => item.path.startsWith(path))
    )
  })).filter(group => group.items.length > 0); // Remove empty groups
}
