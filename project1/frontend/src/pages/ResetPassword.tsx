import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!token) {
      setError('توکن بازیابی یافت نشد');
      return;
    }

    if (password.length < 6) {
      setError('رمز عبور باید حداقل 6 کاراکتر باشد');
      return;
    }

    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password,
      });

      if (response.data.success) {
        setSuccess(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || 
        'خطا در تغییر رمز عبور. لطفاً دوباره تلاش کنید.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">خطا</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                لینک بازیابی نامعتبر است. لطفاً دوباره درخواست بازیابی رمز عبور دهید.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => navigate('/forgot-password')}
              className="w-full"
            >
              درخواست لینک جدید
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">رمز عبور تغییر کرد!</CardTitle>
            <CardDescription>
              رمز عبور شما با موفقیت تغییر کرد.
              <br />
              می‌توانید با رمز عبور جدید وارد شوید.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800 text-center">
                به زودی به صفحه ورود منتقل می‌شوید...
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => navigate('/login')}
              className="w-full"
            >
              ورود به حساب کاربری
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-4">
            <Lock className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">تغییر رمز عبور</CardTitle>
          <CardDescription>
            رمز عبور جدید خود را وارد کنید
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">رمز عبور جدید</label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="حداقل 6 کاراکتر"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 pl-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                رمز عبور باید حداقل 6 کاراکتر باشد
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">تکرار رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="تکرار رمز عبور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10 pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  <div className={`h-1 flex-1 rounded ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <div className={`h-1 flex-1 rounded ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <div className={`h-1 flex-1 rounded ${password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`} />
                </div>
                <p className="text-xs text-gray-500">
                  {password.length < 6 && 'ضعیف'}
                  {password.length >= 6 && password.length < 8 && 'متوسط'}
                  {password.length >= 8 && 'قوی'}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
