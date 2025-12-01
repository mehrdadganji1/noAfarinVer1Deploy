import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import api from '@/lib/api';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  
  // Prevent double verification in StrictMode
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('توکن تایید یافت نشد');
      return;
    }

    // Only verify once
    if (hasVerified.current) {
      console.log('⚠️ Skipping duplicate verification (StrictMode)');
      return;
    }
    
    hasVerified.current = true;
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      console.log('🔍 Starting email verification...');
      console.log('🔍 Token:', token);
      console.log('🔍 Token length:', token?.length);
      
      setStatus('loading');
      
      const response = await api.get(`/api/auth/verify-email?token=${token}`);
      
      console.log('📧 Full Response Object:', response);
      console.log('📧 Verification response.data:', response.data);
      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', response.headers);
      console.log('📊 Full response:', JSON.stringify(response.data, null, 2));
      
      // Check if response is successful (200-299 status codes)
      if (response.status >= 200 && response.status < 300) {
        console.log('✅ HTTP Status is OK (200-299)');
        
        // Check data structure - might be nested
        const data = response.data;
        const isSuccess = data.success === true || data.success === 'true' || response.status === 200;
        
        console.log('✅ Is Success?', isSuccess);
        console.log('✅ data.success value:', data.success, typeof data.success);
        
        if (isSuccess) {
          console.log('✅ Verification successful!');
          console.log('✅ Setting status to SUCCESS');
          
          setStatus('success');
          setMessage(data.message || 'ایمیل شما با موفقیت تایید شد!');
          
          // Clear pending email from localStorage
          localStorage.removeItem('pendingVerificationEmail');
          
          // Mark as completed to prevent any further state changes
          hasVerified.current = true;
          
          // Set flag for auto-fill login
          localStorage.setItem('fromVerification', 'true');
          
          console.log('✅ SUCCESS state set, redirecting in 3 seconds...');
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            console.log('🔄 Redirecting to login...');
            navigate('/login');
          }, 3000);
        } else {
          console.log('❌ Verification failed - success is false');
          console.log('❌ Response data:', data);
          setStatus('error');
          setMessage(data.error || 'خطا در تایید ایمیل');
        }
      } else {
        console.log('❌ HTTP Status is NOT OK:', response.status);
        setStatus('error');
        setMessage(response.data.error || 'خطا در تایید ایمیل');
      }
    } catch (error: any) {
      console.error('❌ Verification error caught:', error);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Response status:', error.response?.status);
      console.error('❌ Error message:', error.response?.data?.error);
      
      // CRITICAL: Don't overwrite success state!
      // If verification already succeeded, ignore this error (from duplicate call)
      if (hasVerified.current) {
        console.log('⚠️ Ignoring error - verification already completed successfully');
        return;
      }
      
      // CRITICAL: Check if token was already used (most common case)
      // When user clicks the verification link again after first successful verification
      if (error.response?.status === 400 && 
          error.response?.data?.error?.includes('Invalid or expired')) {
        console.log('⚠️  Token invalid - checking if user already verified...');
        
        // Try to check if user already verified
        try {
          const email = localStorage.getItem('pendingVerificationEmail');
          console.log('📧 Checking email from localStorage:', email);
          
          if (email) {
            const checkResponse = await api.get(`/api/auth/check-verification-status?email=${email}`);
            console.log('📊 Check response:', checkResponse.data);
            
            if (checkResponse.data.success && checkResponse.data.data.isVerified) {
              console.log('✅ User IS already verified! Showing success.');
              setStatus('success');
              setMessage('ایمیل شما قبلاً تایید شده است! اکنون می‌توانید وارد شوید.');
              localStorage.removeItem('pendingVerificationEmail');
              setTimeout(() => {
                console.log('🔄 Redirecting to login...');
                navigate('/login');
              }, 2000);
              return;
            } else {
              console.log('❌ User NOT verified yet. Token truly is invalid.');
            }
          } else {
            console.log('⚠️  No email in localStorage');
          }
        } catch (checkError) {
          console.error('❌ Failed to check verification status:', checkError);
        }
      }
      
      setStatus('error');
      
      // Better error message based on response
      if (error.response?.data?.expired) {
        setMessage('توکن منقضی شده است. لطفاً ایمیل تایید را مجدداً ارسال کنید.');
      } else {
        setMessage(
          error.response?.data?.error || 
          'توکن نامعتبر یا منقضی شده است'
        );
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      setResending(true);
      
      // Try to get email from localStorage first
      let email = localStorage.getItem('pendingVerificationEmail');
      
      // If not found, ask user
      if (!email) {
        email = prompt('لطفاً ایمیل خود را وارد کنید:');
        if (!email) return;
      }

      const response = await api.post('/auth/resend-verification', { email });
      
      if (response.data.success) {
        setMessage('ایمیل تایید مجدداً ارسال شد! لطفاً صندوق ورودی خود را بررسی کنید.');
        alert('ایمیل تایید مجدداً ارسال شد. لطفاً صندوق ورودی خود را بررسی کنید.');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'خطا در ارسال ایمیل';
      setMessage(errorMsg);
      alert(errorMsg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">تایید ایمیل</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'loading' && (
            <div className="text-center py-8">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">در حال تایید ایمیل...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                تایید موفقیت‌آمیز!
              </h3>
              <p className="text-gray-600 mb-4">{message}</p>
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  به زودی به صفحه ورود منتقل می‌شوید...
                </AlertDescription>
              </Alert>
              <Button 
                onClick={() => navigate('/login')} 
                className="mt-4"
              >
                ورود به حساب کاربری
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-900 mb-2">
                خطا در تایید
              </h3>
              <p className="text-gray-600 mb-4">{message}</p>
              
              <Alert className="bg-red-50 border-red-200 mb-4">
                <AlertDescription className="text-red-800">
                  <strong>دلایل احتمالی:</strong>
                  <ul className="list-disc list-inside mt-2 text-right">
                    <li>توکن منقضی شده است (24 ساعت)</li>
                    <li>لینک قبلاً استفاده شده است</li>
                    <li>توکن نامعتبر است</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Button 
                  onClick={handleResendVerification}
                  disabled={resending}
                  className="w-full"
                  variant="default"
                >
                  {resending ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <Mail className="ml-2 h-4 w-4" />
                      ارسال مجدد ایمیل تایید
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => navigate('/login')} 
                  variant="outline"
                  className="w-full"
                >
                  بازگشت به صفحه ورود
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
