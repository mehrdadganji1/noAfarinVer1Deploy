# Comprehensive Codebase Cleanup Script
# This script removes all unnecessary files from the project

Write-Host "Starting comprehensive codebase cleanup..." -ForegroundColor Cyan

$removedCount = 0
$errors = @()

# Function to safely remove file
function Remove-SafeFile {
    param($path)
    try {
        if (Test-Path $path) {
            Remove-Item $path -Force
            Write-Host "Removed: $path" -ForegroundColor Green
            $script:removedCount++
            return $true
        }
    } catch {
        $script:errors += "Failed to remove $path : $_"
        Write-Host "Failed: $path" -ForegroundColor Red
        return $false
    }
}

# Function to safely remove directory
function Remove-SafeDirectory {
    param($path)
    try {
        if (Test-Path $path) {
            Remove-Item $path -Recurse -Force
            Write-Host "Removed directory: $path" -ForegroundColor Green
            $script:removedCount++
            return $true
        }
    } catch {
        $script:errors += "Failed to remove directory $path : $_"
        Write-Host "Failed: $path" -ForegroundColor Red
        return $false
    }
}

Write-Host "`nCleaning root directory..." -ForegroundColor Yellow

# Root level test files and images
Remove-SafeFile "1.jpg"
Remove-SafeFile "director-stats-response.json"
Remove-SafeFile "pass.txt"
Remove-SafeFile "pngCharsAAco2.png"
Remove-SafeFile "test-event-api.ps1"
Remove-SafeFile "test-event.json"
Remove-SafeFile "users-response.json"
Remove-SafeFile "WARP.md"
Remove-SafeDirectory "images"
Remove-SafeDirectory "workBook1"

Write-Host "`nCleaning documentation files..." -ForegroundColor Yellow

# All development/debug markdown files
$mdFiles = @(
    "AACO_EVENT_APPLICATIONS_COMPLETE.md",
    "AACO_ONBOARDING_COMPLETE.md",
    "AACO_ONBOARDING_PRIORITY.md",
    "API_PORT_FIX_COMPLETE.md",
    "APPLICANT_DASHBOARD_COMPLETE.md",
    "APPLICANT_DASHBOARD_GUARD_COMPLETE.md",
    "APPLICANT_PROFILE_COMPONENTS_READY.md",
    "APPLICANT_PROFILE_ENHANCEMENT.md",
    "APPLICANT_PROFILE_ENHANCEMENT_PLAN.md",
    "APPLICANT_ROUTE_GUARD_COMPLETE.md",
    "APPLICATIONS_404_FIX.md",
    "APPLICATIONS_ENHANCED_FEATURES.md",
    "APPLICATIONS_SUBMIT_FIX_COMPLETE.md",
    "APPLICATION_STATUS_404_FIX.md",
    "AVATAR_UPLOAD_FINAL_FIX.md",
    "AVATAR_UPLOAD_FIXED.md",
    "AXIOS_404_ERROR_SUPPRESSOR.md",
    "CLEAR_CACHE_GUIDE.md",
    "CLEAR_ONBOARDING_CACHE.md",
    "CLUB_MEMBER_DASHBOARD_AACO_COLORS.md",
    "CLUB_MEMBER_DASHBOARD_COMPLETE.md",
    "CLUB_MEMBER_DASHBOARD_MODERN.md",
    "CLUB_MEMBER_DASHBOARD_PLAN.md",
    "CLUB_MEMBER_DASHBOARD_REDESIGN.md",
    "CLUB_MEMBER_PROFILE_COMPLETE.md",
    "COMPLETE_FIX_SUMMARY.md",
    "CREATE_DIRECTOR_USER.md",
    "CRITICAL_ERRORS_FIXED.md",
    "CRITICAL_FIX_INSTRUCTIONS.md",
    "DEBUG_ONBOARDING.md",
    "DIRECTOR_APPLICATIONS_COMPLETE.md",
    "DIRECTOR_APPLICATIONS_REFACTOR.md",
    "DIRECTOR_BACKEND_COMPLETE.md",
    "DIRECTOR_BACKEND_FRONTEND_INTEGRATION.md",
    "DIRECTOR_DASHBOARD_ANALYSIS.md",
    "DIRECTOR_DASHBOARD_COMPLETED_TASK_1.md",
    "DIRECTOR_DASHBOARD_CONFLICTS.md",
    "DIRECTOR_DASHBOARD_DEVELOPMENT_PLAN.md",
    "DIRECTOR_DASHBOARD_INDEX.md",
    "DIRECTOR_DASHBOARD_PROGRESS.md",
    "DIRECTOR_DASHBOARD_README.md",
    "DIRECTOR_DASHBOARD_TASKS.md",
    "DIRECTOR_DASHBOARD_TASK_TRACKER.md",
    "DIRECTOR_EVENTS_COMPLETE.md",
    "DIRECTOR_EXECUTIVE_DASHBOARD.md",
    "DIRECTOR_FULL_ACCESS.md",
    "DIRECTOR_ROLE_SEPARATION.md",
    "DIRECTOR_TRAININGS_COMPLETE.md",
    "DIRECTOR_TRAININGS_DEBUG.md",
    "DIRECTOR_USER_PROFILE_FIX.md",
    "EDIT_AND_STATUS_FEATURES.md",
    "EDIT_PROFILE_COMPLETE.md",
    "FINAL_FIX_COMPLETE.md",
    "FINAL_PRODUCTION_READY.md",
    "FINAL_SUMMARY.md",
    "FIX_404_APPLICATIONS_SUBMIT_FA.md",
    "FIX_API_PATHS.md",
    "FIX_CONNECTION_REFUSED.md",
    "FIX_USER_SERVICE_NOW.md",
    "FIXES_COMPLETED.md",
    "FRONTEND_API_URL_FIX.md",
    "HOW_TO_USE_MOBILE_AUTH.md",
    "LANDING_PAGE_FINAL.md",
    "LANDING_PAGE_REDESIGN.md",
    "LEARNING_RESOURCES_COMPLETE.md",
    "LEARNING_RESOURCES_FINAL.md",
    "LEARNING_RESOURCES_FIXED.md",
    "LEARNING_RESOURCES_SETUP.md",
    "LEARNING_RESOURCES_SYSTEM_COMPLETE.md",
    "LEARNING_SYSTEM_READY.md",
    "LEARNING_SYSTEM_SETUP.md",
    "LOGIN_GUIDE.md",
    "MANDATORY_ONBOARDING_FINAL.md",
    "MOBILE_AUTH_COMPLETE.md",
    "MOBILE_AUTH_FIXED.md",
    "MOBILE_AUTH_FIX_COMPLETE.md",
    "MOBILE_AUTH_SYSTEM.md",
    "ONBOARDING_FIX_FINAL.md",
    "PENDING_APPLICANT_LAYOUT_COMPLETE.md",
    "PENDING_APPLICANT_SYSTEM_COMPLETE.md",
    "PENDING_DASHBOARD_DEVELOPMENT_SUMMARY.md",
    "PENDING_DASHBOARD_ENHANCED.md",
    "PENDING_DASHBOARD_SIMPLIFIED.md",
    "PENDING_LAYOUT_REDESIGN_COMPLETE.md",
    "PENDING_NAVIGATION_CLEANUP_COMPLETE.md",
    "PENDING_REDESIGN_SUMMARY.md",
    "PENDING_SYSTEM_FINAL.md",
    "PORT_ARCHITECTURE_FIX.md",
    "PRODUCTION_READY_FIXES.md",
    "PROFILE_COMPLETION_ADDED.md",
    "PROFILE_QUICK_START.md",
    "PROFILE_ROUTES_FIXED.md",
    "QUICK_FIX_USER_ACCESS.md",
    "QUICK_REGISTER_GUIDE.md",
    "QUICK_START_APPLICANT.md",
    "REGISTER_FIXES_COMPLETE.md",
    "REGISTER_MOBILE_AUTH_COMPLETE.md",
    "REGISTER_MOBILE_AUTH_INTEGRATION.md",
    "REGISTER_MOBILE_FIX_COMPLETE.md",
    "ROLE_SYSTEM_FIXED.md",
    "ROLE_UPDATE_FIX.md",
    "SERVICE_CRASH_FIX_COMPLETE.md",
    "SESSION_SUMMARY.md",
    "START_DIRECTOR_DASHBOARD.md",
    "START_REGISTER_MOBILE.md",
    "SYSTEM_WORKING_SUMMARY.md",
    "TASK_1_DIRECTOR_PAGE.md",
    "TASK_2_API_ENDPOINTS.md",
    "TEAMS_FEATURE_READY.md",
    "TEST_APPLICATIONS_API.md",
    "TEST_DIRECTOR_ACCESS.md",
    "TEST_ROLE_UPDATE.md",
    "TEST_ROLE_UPDATE_COMPLETE.md",
    "TRAININGS_COMPLETE.md",
    "USER_PROFILE_ACCESS_GUIDE.md"
)

foreach ($file in $mdFiles) {
    Remove-SafeFile "project1/$file"
}

Write-Host "`nCleaning test files..." -ForegroundColor Yellow

# Test scripts
$testFiles = @(
    "check-services.bat",
    "check-user-email.js",
    "clean-login-test.html",
    "clear-cache.html",
    "create-admin.bat",
    "create-test-user.js",
    "debug-auth.html",
    "fix-all-ports.js",
    "fix-api-paths.ps1",
    "fix-api-simple.bat",
    "fix-api-urls.js",
    "fix-frontend-api-calls.ps1",
    "fix-login-complete.js",
    "fix-login-simple.js",
    "fix_api_urls.py",
    "restart-user-service.bat",
    "test-admin-login.js",
    "test-api-direct.js",
    "test-api-response.json",
    "test-application-submit.js",
    "test-applications-api.js",
    "test-avatar-browser.html",
    "test-avatar-from-frontend.js",
    "test-avatar-upload.js",
    "test-avatar-via-gateway.js",
    "test-club-member-dashboard.js",
    "test-club-member-login.js",
    "test-current-user-application.js",
    "test-current-user.js",
    "test-direct-mobile.js",
    "test-edit-profile.js",
    "test-error-suppressor.html",
    "test-event-applications.js",
    "test-frontend-api.html",
    "test-learning-resources.js",
    "test-login.html",
    "test-mobile-auth-complete.js",
    "test-mobile-auth-flow.html",
    "test-mobile-complete.js",
    "test-mobile-login-fixed.js",
    "test-mobile-verify.js",
    "test-my-application.js",
    "test-notifications-direct.js",
    "test-notifications-system.js",
    "test-profile-api.js",
    "test-register-api.bat",
    "test-resources-api-detailed.js",
    "test-role-system.js",
    "test-skill-update.js",
    "test-sms-api.js",
    "test-teams-api.js",
    "test-trainings-api.js",
    "test-trainings-direct.js",
    "verify-all-fixes.py"
)

foreach ($file in $testFiles) {
    Remove-SafeFile "project1/$file"
}

Write-Host "`n🗂️ Cleaning old backend directory..." -ForegroundColor Yellow
Remove-SafeDirectory "project1/backend"

Write-Host "`n📊 Cleanup Summary" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "Total items removed: $removedCount" -ForegroundColor Green

if ($errors.Count -gt 0) {
    Write-Host "`n⚠️ Errors encountered:" -ForegroundColor Yellow
    foreach ($error in $errors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
}

Write-Host "`nCleanup complete!" -ForegroundColor Green
