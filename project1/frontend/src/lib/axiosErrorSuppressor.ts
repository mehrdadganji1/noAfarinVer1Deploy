/**
 * Axios Error Suppressor
 * 
 * This utility suppresses console.error logs from axios for expected 404 responses.
 * Axios internally logs errors before they reach interceptors, which can clutter the console.
 */

// Store original console.error
const originalConsoleError = console.error;

// List of URL patterns where 404 is expected and should not be logged
const EXPECTED_404_PATTERNS = [
  '/applications/my-application',
  '/applications/user/',
  '/aaco-applications/my-application',
  '/aaco-applications/check-status',
  '/documents',
  '/interviews',
  '/messages',
  '/teams',
  '/trainings',
  '/evaluations',
  '/community/',
  '/courses',
  '/xp/',
  '/profile/',
  '/completion',
  '/membership/',
  '/stats/',
  '/achievements/',
  '/streaks/',
  '/challenges'
];

// List of URL patterns where 500 errors should show user-friendly messages
const EXPECTED_500_PATTERNS = [
  '/avatar',
  '/upload'
];

/**
 * Check if an error should be suppressed
 */
function shouldSuppressError(args: any[]): boolean {
  // Convert all arguments to string for checking
  const errorString = String(args[0] || '');
  
  // Check if it's a 404 error
  const is404 = errorString.includes('404') || errorString.includes('Not Found');
  if (is404) {
    // Check if the URL matches any expected pattern
    const matchesPattern = EXPECTED_404_PATTERNS.some(pattern => errorString.includes(pattern));
    
    if (matchesPattern) {
      // Completely suppress - no log at all
      return true;
    }
  }
  
  // Check if it's a 500 error on expected endpoints
  const is500 = errorString.includes('500') || errorString.includes('Internal Server Error');
  if (is500) {
    const matchesPattern = EXPECTED_500_PATTERNS.some(pattern => errorString.includes(pattern));
    if (matchesPattern) {
      // Log user-friendly message instead
      console.warn('⚠️ خطا در سرور. لطفاً دوباره تلاش کنید.');
      return true;
    }
  }
  
  return false;
}

/**
 * Override console.error to suppress expected 404s and 500s
 */
export function suppressExpected404Errors() {
  console.error = (...args: any[]) => {
    // If this is an expected error, don't log it (or log user-friendly message)
    if (shouldSuppressError(args)) {
      return;
    }
    
    // Otherwise, use original console.error
    originalConsoleError.apply(console, args);
  };
  
  console.log('✅ Error suppressor initialized');
}

/**
 * Restore original console.error (for testing or cleanup)
 */
export function restoreConsoleError() {
  console.error = originalConsoleError;
  console.log('⚠️ Console.error restored to original');
}
