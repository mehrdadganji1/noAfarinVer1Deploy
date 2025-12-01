import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

/**
 * FAQ Section Component
 * Accordion-style frequently asked questions
 */
export const FAQSection: FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: '1',
      category: 'فرآیند بررسی',
      question: 'چقدر طول می‌کشد تا درخواستم بررسی شود؟',
      answer: 'معمولاً بررسی درخواست‌ها 3 تا 5 روز کاری طول می‌کشد. در صورت نیاز به اطلاعات بیشتر، تیم ما با شما تماس خواهد گرفت.'
    },
    {
      id: '2',
      category: 'مدارک',
      question: 'چه مداركی باید آپلود کنم؟',
      answer: 'مدارک الزامی شامل: عکس پرسنلی، کارت ملی، مدرک تحصیلی، رزومه، و نامه انگیزه می‌باشد. گواهی‌های مهارتی اختیاری هستند اما می‌توانند به تقویت درخواست شما کمک کنند.'
    },
    {
      id: '3',
      category: 'مصاحبه',
      question: 'مصاحبه چگونه برگزار می‌شود؟',
      answer: 'مصاحبه‌ها به صورت حضوری یا آنلاین برگزار می‌شوند. زمان و نحوه برگزاری از طریق ایمیل و پیامک به شما اطلاع داده خواهد شد. مصاحبه معمولاً 30-45 دقیقه طول می‌کشد.'
    },
    {
      id: '4',
      category: 'نتیجه',
      question: 'چگونه از نتیجه درخواستم مطلع می‌شوم؟',
      answer: 'نتیجه نهایی از طریق ایمیل، پیامک، و داشبورد شما اعلام می‌شود. همچنین می‌توانید در بخش "وضعیت درخواست" پیگیری کنید.'
    },
    {
      id: '5',
      category: 'ویرایش',
      question: 'آیا می‌توانم اطلاعات درخواستم را ویرایش کنم؟',
      answer: 'بله، تا زمانی که درخواست شما در حال بررسی است، می‌توانید از بخش پروفایل اطلاعات خود را ویرایش کنید. پس از تایید نهایی، امکان ویرایش محدود خواهد شد.'
    },
    {
      id: '6',
      category: 'رد شدن',
      question: 'اگر درخواستم رد شود چه کنم؟',
      answer: 'در صورت رد شدن، می‌توانید پس از 3 ماه مجدداً درخواست دهید. توصیه می‌کنیم پروفایل و مهارت‌های خود را تقویت کنید و دوباره تلاش کنید.'
    },
    {
      id: '7',
      category: 'پشتیبانی',
      question: 'چگونه با پشتیبانی تماس بگیرم؟',
      answer: 'می‌توانید از طریق ایمیل noafarinevent@gmail.com یا شماره تلفن 09982328585 با تیم پشتیبانی ما در ارتباط باشید. همچنین می‌توانید از بخش "راهنما و پشتیبانی" سوال خود را ارسال کنید.'
    },
    {
      id: '8',
      category: 'شرایط عضویت',
      question: 'شرایط عضویت در AACO چیست؟',
      answer: 'متقاضیان باید دانشجوی فعال یا فارغ‌التحصیل باشند، علاقه‌مند به کارآفرینی و نوآوری، و آمادگی برای کار تیمی و یادگیری مستمر داشته باشند.'
    }
  ];

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-xl">
          <HelpCircle className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">سوالات متداول</h3>
          <p className="text-sm text-gray-600">پاسخ سوالات رایج متقاضیان</p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
          >
            <Card 
              className={`
                border-2 cursor-pointer transition-all
                ${openId === faq.id 
                  ? 'border-purple-300 shadow-lg' 
                  : 'border-gray-200 hover:border-purple-200'
                }
              `}
              onClick={() => toggleFAQ(faq.id)}
            >
              <CardContent className="p-4">
                {/* Question */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs text-purple-600 font-medium mb-1">
                      {faq.category}
                    </div>
                    <h4 className="font-semibold text-gray-800">
                      {faq.question}
                    </h4>
                  </div>
                  <motion.div
                    animate={{ rotate: openId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  </motion.div>
                </div>

                {/* Answer */}
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Help Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800">
              <strong>سوال دیگری دارید؟</strong> از بخش{' '}
              <a href="/applicant/help" className="underline font-semibold hover:text-blue-900">
                راهنما و پشتیبانی
              </a>{' '}
              با ما در ارتباط باشید.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
