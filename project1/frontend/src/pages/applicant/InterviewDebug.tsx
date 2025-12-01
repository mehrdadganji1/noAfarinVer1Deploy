import { useAuthStore } from '@/store/authStore'
import { useApplicationStatus } from '@/hooks/useApplicationStatus'
import { 
  useUpcomingInterviews, 
  usePastInterviews,
  useNextInterview 
} from '@/hooks/useInterview'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function InterviewDebug() {
  const user = useAuthStore((state) => state.user)
  
  const { data: applicationData, isLoading: isLoadingApp, error: appError } = useApplicationStatus()
  const { interviews: upcomingInterviews, isLoading: isLoadingUpcoming, error: upcomingError } = useUpcomingInterviews(user?._id)
  const { interviews: pastInterviews, isLoading: isLoadingPast, error: pastError } = usePastInterviews(user?._id)
  const nextInterview = useNextInterview(user?._id)

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">🔍 Interview Debug Page</h1>
      
      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>1. User Info</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
            {JSON.stringify(user, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Application Status */}
      <Card>
        <CardHeader>
          <CardTitle>2. Application Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {isLoadingApp ? '⏳ Yes' : '✅ No'}</p>
            <p><strong>Has Application:</strong> {applicationData?.hasApplication ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Status:</strong> {applicationData?.status || 'N/A'}</p>
            {appError && (
              <div className="text-red-600">
                <strong>Error:</strong> {(appError as any).message}
              </div>
            )}
            <details>
              <summary className="cursor-pointer font-semibold">Full Application Data</summary>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs mt-2">
                {JSON.stringify(applicationData, null, 2)}
              </pre>
            </details>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Interviews */}
      <Card>
        <CardHeader>
          <CardTitle>3. Upcoming Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {isLoadingUpcoming ? '⏳ Yes' : '✅ No'}</p>
            <p><strong>Count:</strong> {upcomingInterviews?.length || 0}</p>
            {upcomingError && (
              <div className="text-red-600">
                <strong>Error:</strong> {(upcomingError as any).message}
              </div>
            )}
            <details>
              <summary className="cursor-pointer font-semibold">Full Data</summary>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs mt-2">
                {JSON.stringify(upcomingInterviews, null, 2)}
              </pre>
            </details>
          </div>
        </CardContent>
      </Card>

      {/* Past Interviews */}
      <Card>
        <CardHeader>
          <CardTitle>4. Past Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {isLoadingPast ? '⏳ Yes' : '✅ No'}</p>
            <p><strong>Count:</strong> {pastInterviews?.length || 0}</p>
            {pastError && (
              <div className="text-red-600">
                <strong>Error:</strong> {(pastError as any).message}
              </div>
            )}
            <details>
              <summary className="cursor-pointer font-semibold">Full Data</summary>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs mt-2">
                {JSON.stringify(pastInterviews, null, 2)}
              </pre>
            </details>
          </div>
        </CardContent>
      </Card>

      {/* Next Interview */}
      <Card>
        <CardHeader>
          <CardTitle>5. Next Interview</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
            {JSON.stringify(nextInterview, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* API Test */}
      <Card>
        <CardHeader>
          <CardTitle>6. Direct API Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>Test these URLs in your browser or Postman:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <a 
                  href={`http://localhost:3000/api/applicants/${user?._id}/interviews`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GET /api/applicants/{user?._id}/interviews
                </a>
              </li>
              <li>
                <a 
                  href={`http://localhost:3000/api/applications/user/${user?._id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GET /api/applications/user/{user?._id}
                </a>
              </li>
              <li>
                <a 
                  href="http://localhost:3008/health"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GET Application Service Health (Direct)
                </a>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
