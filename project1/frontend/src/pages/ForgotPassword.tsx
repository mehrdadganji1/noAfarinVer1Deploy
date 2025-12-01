import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import api from '@/lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/forgot-password', { email })
      if (response.data.success) {
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'خطا در ارسال ایمیل')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">ایمیل ارسال شد</CardTitle>
            <CardDescription>
              لینک بازیابی رمز عبور به ایمیل شما ارسال شد.
              <br />
              لطفاً صندوق ورودی خود را بررسی کنید.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-4">
            <Link to="/login" className="w-full">
              <Button className="w-full">
                بازگشت به صفحه ورود
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
            ن
          </div>
          <CardTitle className="text-2xl">فراموشی رمز عبور</CardTitle>
          <CardDescription>
            ایمیل خود را وارد کنید تا لینک بازیابی برای شما ارسال شود
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">ایمیل</label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
            </Button>
            <Link 
              to="/login" 
              className="text-sm text-center text-gray-600 hover:text-primary flex items-center justify-center gap-1"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت به صفحه ورود
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
