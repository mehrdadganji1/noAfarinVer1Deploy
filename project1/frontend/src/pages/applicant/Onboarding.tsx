import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useApplicationStatus } from '@/hooks/useApplicationStatus'
import ApprovalNotification from '@/components/applicant/ApprovalNotification'
import WelcomeScreen from '@/components/applicant/WelcomeScreen'
import RejectionScreen from '@/components/applicant/RejectionScreen'

type OnboardingStep = 'approval' | 'welcome' | 'rejection' | 'complete'

export default function Onboarding() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { data: applicationData, isLoading } = useApplicationStatus()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('approval')

  const application = applicationData?.application
  const isApproved = application?.status === 'approved'
  const isRejected = application?.status === 'rejected'

  useEffect(() => {
    if (!isLoading && application) {
      if (isApproved) {
        setCurrentStep('approval')
      } else if (isRejected) {
        setCurrentStep('rejection')
      } else {
        // Not approved or rejected yet, redirect to dashboard
        navigate('/applicant/dashboard')
      }
    }
  }, [application, isLoading, isApproved, isRejected, navigate])

  const handleApprovalContinue = () => {
    setCurrentStep('welcome')
  }

  const handleWelcomeComplete = () => {
    setCurrentStep('complete')
    // Save to localStorage that onboarding is complete
    localStorage.setItem('onboarding_complete', 'true')
    navigate('/applicant/dashboard')
  }

  const handleWelcomeSkip = () => {
    localStorage.setItem('onboarding_complete', 'true')
    navigate('/applicant/dashboard')
  }

  const handleReapply = () => {
    navigate('/application-form')
  }

  const handleContactSupport = () => {
    navigate('/applicant/help')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  // Approval flow
  if (isApproved) {
    if (currentStep === 'approval') {
      return (
        <ApprovalNotification
          onContinue={handleApprovalContinue}
          applicantName={user?.firstName ? `${user.firstName} ${user.lastName}` : undefined}
          approvedAt={application?.reviewedAt}
        />
      )
    }

    if (currentStep === 'welcome') {
      return (
        <WelcomeScreen
          onComplete={handleWelcomeComplete}
          onSkip={handleWelcomeSkip}
        />
      )
    }
  }

  // Rejection flow
  if (isRejected) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <RejectionScreen
            feedback={application?.feedback}
            rejectionReason={application?.reviewNotes}
            improvementSuggestions={[
              'مدارک خود را کامل‌تر و واضح‌تر ارسال کنید',
              'رزومه خود را با جزئیات بیشتری تنظیم کنید',
              'ایده استارتاپی خود را دقیق‌تر توضیح دهید',
              'مهارت‌های فنی خود را تقویت کنید'
            ]}
            canReapply={true}
            onReapply={handleReapply}
            onContactSupport={handleContactSupport}
            onClose={() => navigate('/applicant/dashboard')}
          />
        </div>
      </div>
    )
  }

  return null
}
