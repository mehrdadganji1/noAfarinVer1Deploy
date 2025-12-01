import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trophy, Sparkles, AlertCircle } from 'lucide-react';
import { usePromoteMember } from '@/hooks/useClubMember';

interface PromoteMemberButtonProps {
  userId: string;
  userName: string;
  userEmail: string;
  applicationStatus?: string;
  isClubMember?: boolean;
}

export default function PromoteMemberButton({
  userId,
  userName,
  userEmail,
  applicationStatus,
  isClubMember = false,
}: PromoteMemberButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const promoteMutation = usePromoteMember();

  // Only show for approved applications that are not already club members
  if (applicationStatus !== 'approved' || isClubMember) {
    return null;
  }

  const handlePromote = async () => {
    console.log('🎯 Promoting user with ID:', userId);
    console.log('📋 User details:', { userName, userEmail, applicationStatus });
    try {
      await promoteMutation.mutateAsync(userId);
      setShowDialog(false);
    } catch (error) {
      console.error('❌ Promotion failed:', error);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        size="sm"
      >
        <Trophy className="h-4 w-4 ml-2" />
        ارتقا به عضو باشگاه
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>
              ارتقا به عضو باشگاه نوآفرینان
            </DialogTitle>
            <DialogDescription className="text-right pt-4 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  آیا از ارتقای این کاربر به عضو باشگاه مطمئن هستید؟
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">نام:</span>
                  <span className="font-semibold">{userName}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">ایمیل:</span>
                  <span className="font-semibold text-sm">{userEmail}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">وضعیت درخواست:</span>
                  <Badge className="bg-green-100 text-green-700 border-0">
                    <Sparkles className="h-3 w-3 ml-1" />
                    تایید شده
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="font-semibold text-purple-900">بعد از ارتقا:</p>
                    <ul className="list-disc list-inside space-y-1 mr-4">
                      <li>شناسه عضویت منحصر به فرد ایجاد می‌شود</li>
                      <li>نقش "عضو باشگاه" به کاربر اضافه می‌شود</li>
                      <li>دسترسی به داشبورد اعضا فعال می‌شود</li>
                      <li>ایمیل خوش‌آمدگویی ارسال می‌شود</li>
                    </ul>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={promoteMutation.isPending}
            >
              انصراف
            </Button>
            <Button
              onClick={handlePromote}
              disabled={promoteMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {promoteMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2" />
                  در حال ارتقا...
                </>
              ) : (
                <>
                  <Trophy className="h-4 w-4 ml-2" />
                  تایید و ارتقا
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
