import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white text-4xl mb-4">
            ⚠️
          </div>
          <CardTitle className="text-2xl text-red-600">دسترسی غیرمجاز</CardTitle>
          <CardDescription>
            شما دسترسی لازم برای مشاهده این صفحه را ندارید.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            لطفاً با مدیر سیستم تماس بگیرید یا به داشبورد بازگردید.
          </p>
          <div className="flex gap-4">
            <Link to="/dashboard" className="flex-1">
              <Button variant="default" className="w-full">
                بازگشت به داشبورد
              </Button>
            </Link>
            <Link to="/login" className="flex-1">
              <Button variant="outline" className="w-full">
                ورود مجدد
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
