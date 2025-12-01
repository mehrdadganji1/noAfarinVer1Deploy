import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  FileText,
  Users,
  Award,
  Lock,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Scale,
  UserCheck,
  Globe,
  Mail,
  Phone
} from 'lucide-react';

const TermsAndConditions: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('intro');

  const sections = [
    { id: 'intro', title: 'مقدمه', icon: BookOpen },
    { id: 'definitions', title: 'تعاریف', icon: FileText },
    { id: 'eligibility', title: 'شرایط عضویت', icon: UserCheck },
    { id: 'registration', title: 'ثبت‌نام و احراز هویت', icon: Shield },
    { id: 'rights', title: 'حقوق و تعهدات', icon: Scale },
    { id: 'intellectual', title: 'مالکیت فکری', icon: Award },
    { id: 'privacy', title: 'حریم خصوصی', icon: Lock },
    { id: 'conduct', title: 'قوانین رفتاری', icon: Users },
    { id: 'termination', title: 'لغو عضویت', icon: AlertCircle },
    { id: 'contact', title: 'تماس با ما', icon: Mail }
  ];

  // Intersection Observer for scroll detection
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    const sectionIds = ['intro', 'definitions', 'eligibility', 'registration', 'rights', 'intellectual', 'privacy', 'conduct', 'termination', 'contact'];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600 text-white py-16 shadow-2xl">
        <div className="w-[90%] mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <Scale className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-bold mb-4">قوانین و مقررات</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              پویش ملّی نوآفرین - شرایط و ضوابط استفاده از پلتفرم
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                آخرین بروزرسانی: مهرماه ۱۴۰۴
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                نسخه ۲.۰
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-[90%] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                فهرست مطالب
              </h3>
              <nav className="space-y-2 mb-6">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeSection === section.id
                        ? 'bg-gradient-to-l from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Back Button */}
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-black text-white rounded-xl transition-all shadow-lg hover:shadow-xl group"
              >
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <span className="text-sm font-medium">بازگشت به صفحه ورود</span>
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">

            {/* Section 1: Introduction */}
            <section id="intro" className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">مقدمه</h2>
                  <p className="text-slate-600 dark:text-slate-300">خوش آمدید به پویش ملّی نوآفرین</p>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                <p className="text-lg">
                  پویش ملّی نوآفرین یک برنامه جامع و ملی برای شناسایی، پرورش و حمایت از استعدادهای نوآور و کارآفرین کشور است.
                  این پلتفرم با هدف ایجاد یک اکوسیستم نوآوری پویا و کارآمد، بستری را فراهم می‌آورد تا افراد مستعد بتوانند
                  ایده‌های خود را به واقعیت تبدیل کنند.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-600 p-6 rounded-lg my-6">
                  <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    اهمیت مطالعه قوانین
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200">
                    با استفاده از این پلتفرم، شما تأیید می‌کنید که این قوانین و مقررات را به طور کامل مطالعه کرده و
                    با تمامی شرایط و ضوابط آن موافقت دارید. لطفاً قبل از ثبت‌نام و استفاده از خدمات، این سند را
                    با دقت مطالعه فرمایید.
                  </p>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-6 mb-3">اهداف پویش ملّی نوآفرین</h3>
                <ul className="space-y-3 mr-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <span>شناسایی و جذب استعدادهای برتر در حوزه‌های فناوری، کارآفرینی و نوآوری</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <span>ارائه آموزش‌های تخصصی و کاربردی برای توسعه مهارت‌های فنی و کسب‌وکار</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <span>تشکیل تیم‌های نوآور با ترکیب مکمل مهارت‌ها و تخصص‌ها</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <span>حمایت مالی و منتورینگ برای تبدیل ایده‌ها به محصولات و کسب‌وکارهای موفق</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <span>ایجاد شبکه‌ای قوی از نوآوران، سرمایه‌گذاران و متخصصان صنعت</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 2: Definitions */}
            <section id="definitions" className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">تعاریف</h2>
                  <p className="text-slate-600 dark:text-slate-300">اصطلاحات کلیدی در این سند</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-300 text-lg">پلتفرم</h4>
                  </div>
                  <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                    منظور از پلتفرم، سامانه آنلاین پویش ملّی نوآفرین است که شامل وب‌سایت، اپلیکیشن موبایل و
                    تمامی سرویس‌های مرتبط می‌باشد.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-purple-900 dark:text-purple-300 text-lg">کاربر / عضو</h4>
                  </div>
                  <p className="text-purple-800 dark:text-purple-200 text-sm leading-relaxed">
                    هر شخص حقیقی که در پلتفرم ثبت‌نام کرده و از خدمات آن استفاده می‌کند، اعم از متقاضی،
                    عضو باشگاه، منتور یا سایر نقش‌ها.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <UserCheck className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-green-900 dark:text-green-300 text-lg">متقاضی</h4>
                  </div>
                  <p className="text-green-800 dark:text-green-200 text-sm leading-relaxed">
                    فردی که درخواست عضویت در پویش را ثبت کرده و در انتظار بررسی و تأیید است.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-orange-900 dark:text-orange-300 text-lg">عضو باشگاه</h4>
                  </div>
                  <p className="text-orange-800 dark:text-orange-200 text-sm leading-relaxed">
                    فردی که پس از طی فرآیند ارزیابی و مصاحبه، به عنوان عضو رسمی پویش پذیرفته شده است.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-red-900 dark:text-red-300 text-lg">محتوای کاربر</h4>
                  </div>
                  <p className="text-red-800 dark:text-red-200 text-sm leading-relaxed">
                    هرگونه اطلاعات، متن، تصویر، ویدیو، کد یا سایر محتوایی که توسط کاربر در پلتفرم بارگذاری یا
                    اشتراک‌گذاری می‌شود.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-lg">خدمات</h4>
                  </div>
                  <p className="text-indigo-800 dark:text-indigo-200 text-sm leading-relaxed">
                    تمامی امکانات، آموزش‌ها، رویدادها، منابع و پشتیبانی‌هایی که پلتفرم در اختیار کاربران قرار می‌دهد.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Eligibility */}
            <section id="eligibility" className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">شرایط عضویت</h2>
                  <p className="text-slate-600 dark:text-slate-300">ملزومات و الزامات عضویت در پویش</p>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none space-y-4 text-slate-700 dark:text-slate-300">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">شرایط عمومی</h3>
                <p>برای عضویت در پویش ملّی نوآفرین، متقاضیان باید شرایط زیر را داشته باشند:</p>

                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-200 dark:border-green-800">
                    <h4 className="font-bold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      الزامات سنی
                    </h4>
                    <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                      <li>• حداقل ۱۸ سال تمام</li>
                      <li>• حداکثر ۳۵ سال در زمان ثبت‌نام</li>
                      <li>• ارائه مدرک شناسایی معتبر</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      تحصیلات
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <li>• حداقل دیپلم یا در حال تحصیل</li>
                      <li>• ترجیحاً افراد دارای ایده</li>
                      <li>• ارائه مدارک تحصیلی</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-200 dark:border-purple-800">
                    <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      مهارت‌ها
                    </h4>
                    <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                      <li>• علاقه به نوآوری و کارآفرینی</li>
                      <li>• مهارت‌های فنی یا کسب‌وکار</li>
                      <li>• توانایی کار تیمی</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-xl border border-orange-200 dark:border-orange-800">
                    <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      تعهدات
                    </h4>
                    <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                      <li>• تمایل به مشارکت فعال</li>
                      <li>• تعهد به حضور در دوره‌ها</li>
                      <li>• رعایت قوانین و مقررات</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border-r-4 border-amber-600 p-6 rounded-lg">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    موارد محدودکننده
                  </h4>
                  <p className="text-amber-800 dark:text-amber-200 mb-3">
                    افراد زیر نمی‌توانند در پویش ثبت‌نام کنند:
                  </p>
                  <ul className="space-y-2 text-amber-800 dark:text-amber-200 mr-6">
                    <li>• افرادی که سابقه نقض قوانین در برنامه‌های مشابه دارند</li>
                    <li>• کسانی که اطلاعات نادرست ارائه می‌دهند</li>
                    <li>• افرادی که به دلایل قانونی محدودیت دارند</li>
                  </ul>
                </div>
              </div>
            </section>


            {/* Section 4: Registration */}
            <section id="registration" className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">ثبت‌نام و احراز هویت</h2>
                  <p className="text-slate-600 dark:text-slate-300">فرآیند عضویت و تأیید هویت</p>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">مراحل ثبت‌نام</h3>

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Step 1 */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                        ۱
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-blue-900 dark:text-blue-300 text-lg mb-2">ایجاد حساب کاربری</h4>
                        <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">ثبت اطلاعات اولیه شامل نام، نام خانوادگی، ایمیل و شماره موبایل</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200 mr-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                        <span>ایمیل باید معتبر و قابل دسترسی باشد</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                        <span>شماره موبایل باید به نام خود متقاضی باشد</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                        <span>رمز عبور حداقل ۸ کاراکتر شامل حروف و اعداد</span>
                      </li>
                    </ul>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                        ۲
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-purple-900 dark:text-purple-300 text-lg mb-2">تأیید هویت</h4>
                        <p className="text-purple-800 dark:text-purple-200 text-sm mb-3">احراز هویت از طریق کد ارسالی به موبایل و ایمیل</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200 mr-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-600" />
                        <span>کد تأیید به مدت ۱۰ دقیقه معتبر است</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-600" />
                        <span>امکان درخواست مجدد کد پس از ۲ دقیقه</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-600" />
                        <span>حداکثر ۳ بار تلاش برای وارد کردن کد صحیح</span>
                      </li>
                    </ul>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-all group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                        ۳
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-green-900 dark:text-green-300 text-lg mb-2">تکمیل پروفایل</h4>
                        <p className="text-green-800 dark:text-green-200 text-sm mb-3">ارائه اطلاعات تکمیلی و مدارک مورد نیاز</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-green-800 dark:text-green-200 mr-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                        <span>بارگذاری تصویر کارت ملی یا شناسنامه</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                        <span>ارائه مدارک تحصیلی</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                        <span>تکمیل اطلاعات تماس و معرفی مهارت‌ها</span>
                      </li>
                    </ul>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-600 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                        ۴
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-orange-900 dark:text-orange-300 text-lg mb-2">بررسی و ارزیابی</h4>
                        <p className="text-orange-800 dark:text-orange-200 text-sm mb-3">بررسی مدارک و ارزیابی صلاحیت توسط تیم پویش</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200 mr-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-orange-600" />
                        <span>زمان بررسی: ۳ تا ۷ روز کاری</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-orange-600" />
                        <span>اطلاع‌رسانی از طریق ایمیل و پیامک</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-orange-600" />
                        <span>امکان درخواست اطلاعات تکمیلی</span>
                      </li>
                    </ul>
                  </div>

                  {/* Step 5 - Full Width */}
                  <div className="md:col-span-2 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800 hover:shadow-lg transition-all group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                        ۵
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-red-900 dark:text-red-300 text-lg mb-2">مصاحبه نهایی</h4>
                        <p className="text-red-800 dark:text-red-200 text-sm mb-3">مصاحبه حضوری یا آنلاین با تیم ارزیابی</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mr-4">
                      <div className="flex items-start gap-2 text-sm text-red-800 dark:text-red-200">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                        <span>زمان‌بندی هماهنگ شده با متقاضی</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-red-800 dark:text-red-200">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                        <span>ارزیابی مهارت‌ها و انگیزه‌ها</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-red-800 dark:text-red-200">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                        <span>مدت زمان: ۳۰ تا ۶۰ دقیقه</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-l from-blue-50 to-transparent dark:from-blue-900/20 border-r-4 border-blue-600 p-6 rounded-lg mt-6">
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    امنیت اطلاعات
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200">
                    تمامی اطلاعات شخصی شما با استفاده از پروتکل‌های امنیتی پیشرفته رمزنگاری و ذخیره می‌شود.
                    ما متعهد به حفظ حریم خصوصی و امنیت داده‌های شما هستیم و هیچ‌گاه اطلاعات شما را بدون
                    اجازه با اشخاص ثالث به اشتراک نمی‌گذاریم.
                  </p>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-8">مسئولیت کاربر</h3>
                <p>با ثبت‌نام در پلتفرم، شما موظف هستید:</p>
                <ul className="space-y-2 mr-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>اطلاعات صحیح، کامل و به‌روز ارائه دهید</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>رمز عبور خود را محرمانه نگه دارید و با دیگران به اشتراک نگذارید</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>در صورت مشکوک بودن حساب کاربری، فوراً به ما اطلاع دهید</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>مسئولیت تمام فعالیت‌های انجام شده از حساب کاربری خود را بپذیرید</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5: Rights and Obligations */}
            <section id="rights" className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">حقوق و تعهدات</h2>
                  <p className="text-slate-600 dark:text-slate-300">حقوق و مسئولیت‌های طرفین</p>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* User Rights */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                    <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6" />
                      حقوق کاربران
                    </h3>
                    <ul className="space-y-3 text-green-800 dark:text-green-200">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                        <span>دسترسی به تمامی آموزش‌ها و منابع آموزشی پلتفرم</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                        <span>شرکت در رویدادها، کارگاه‌ها و دوره‌های تخصصی</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                        <span>دریافت منتورینگ و مشاوره از متخصصان</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                        <span>امکان تشکیل تیم و همکاری با سایر اعضا</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                        <span>دسترسی به فرصت‌های سرمایه‌گذاری و تأمین مالی</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                        <span>استفاده از امکانات و تجهیزات فضای کار اشتراکی</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                        <span>دریافت گواهینامه‌های معتبر پس از اتمام دوره‌ها</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                        <span>حفظ حریم خصوصی و امنیت اطلاعات شخصی</span>
                      </li>
                    </ul>
                  </div>

                  {/* User Obligations */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
                    <h3 className="text-xl font-bold text-orange-900 dark:text-orange-300 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-6 h-6" />
                      تعهدات کاربران
                    </h3>
                    <ul className="space-y-3 text-orange-800 dark:text-orange-200">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 dark:text-orange-400 font-bold">•</span>
                        <span>رعایت قوانین و مقررات پلتفرم</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 dark:text-orange-400 font-bold">•</span>
                        <span>احترام به سایر اعضا و رفتار حرفه‌ای</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 dark:text-orange-400 font-bold">•</span>
                        <span>حضور منظم در جلسات و دوره‌های آموزشی</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 dark:text-orange-400 font-bold">•</span>
                        <span>مشارکت فعال در پروژه‌ها و فعالیت‌های تیمی</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 dark:text-orange-400 font-bold">•</span>
                        <span>عدم افشای اطلاعات محرمانه پلتفرم و سایر اعضا</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 dark:text-orange-400 font-bold">•</span>
                        <span>استفاده صحیح و قانونی از منابع و امکانات</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 dark:text-orange-400 font-bold">•</span>
                        <span>به‌روزرسانی منظم اطلاعات پروفایل</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 dark:text-orange-400 font-bold">•</span>
                        <span>گزارش هرگونه مشکل یا تخلف به مدیریت</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-600 p-6 rounded-lg mt-6">
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3">تعهدات پلتفرم</h4>
                  <p className="text-blue-800 dark:text-blue-200 mb-3">
                    پویش ملّی نوآفرین متعهد است:
                  </p>
                  <ul className="space-y-2 text-blue-800 dark:text-blue-200 mr-6">
                    <li>• محیطی امن، حرفه‌ای و حمایتی برای رشد اعضا فراهم کند</li>
                    <li>• آموزش‌های با کیفیت و به‌روز ارائه دهد</li>
                    <li>• فرصت‌های برابر برای تمامی اعضا ایجاد کند</li>
                    <li>• از حقوق مالکیت فکری اعضا حمایت کند</li>
                    <li>• پشتیبانی فنی و مشاوره‌ای مناسب ارائه دهد</li>
                  </ul>
                </div>
              </div>
            </section>


            {/* Section 6: Intellectual Property */}
            <section id="intellectual" className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">مالکیت فکری</h2>
                  <p className="text-slate-600 dark:text-slate-300">حقوق مالکیت معنوی و استفاده از محتوا</p>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">مالکیت محتوای پلتفرم</h3>
                <p>
                  تمامی محتوای ارائه شده توسط پلتفرم شامل متون، تصاویر، ویدیوها، نرم‌افزارها، طراحی‌ها و
                  سایر مواد آموزشی متعلق به پویش ملّی نوآفرین یا ارائه‌دهندگان مجاز آن است و تحت حمایت
                  قوانین مالکیت فکری قرار دارد.
                </p>

                <div className="bg-gradient-to-l from-purple-50 to-transparent dark:from-purple-900/20 border-r-4 border-purple-600 p-6 rounded-lg">
                  <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    محدودیت‌های استفاده
                  </h4>
                  <p className="text-purple-800 dark:text-purple-200 mb-3">
                    کاربران مجاز به موارد زیر نیستند:
                  </p>
                  <ul className="space-y-2 text-purple-800 dark:text-purple-200 mr-6">
                    <li>• کپی، تکثیر یا توزیع محتوای پلتفرم بدون مجوز کتبی</li>
                    <li>• استفاده تجاری از محتوا بدون اجازه</li>
                    <li>• تغییر، اصلاح یا مهندسی معکوس نرم‌افزارها</li>
                    <li>• حذف علائم مالکیت یا کپی‌رایت از محتوا</li>
                    <li>• انتشار محتوا در پلتفرم‌های دیگر</li>
                  </ul>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-8">مالکیت ایده‌ها و پروژه‌های کاربران</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                    <h4 className="font-bold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      ایده‌های شخصی
                    </h4>
                    <p className="text-green-800 dark:text-green-200 text-sm">
                      ایده‌ها و پروژه‌هایی که توسط کاربران قبل از عضویت در پویش توسعه یافته‌اند،
                      کاملاً متعلق به خود آنها است و پلتفرم هیچ ادعایی نسبت به آنها ندارد.
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      پروژه‌های توسعه یافته در پویش
                    </h4>
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      پروژه‌هایی که با استفاده از منابع، آموزش‌ها و حمایت‌های پویش توسعه می‌یابند،
                      مالکیت آنها به تیم سازنده تعلق دارد، اما پلتفرم حق استفاده غیرتجاری برای
                      اهداف آموزشی و تبلیغاتی را دارد.
                    </p>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
                    <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      پروژه‌های تأمین مالی شده
                    </h4>
                    <p className="text-orange-800 dark:text-orange-200 text-sm">
                      در صورت دریافت سرمایه یا تأمین مالی از طریق پویش، شرایط مالکیت و سهام
                      در قرارداد جداگانه‌ای مشخص می‌شود که باید توسط طرفین امضا گردد.
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                    <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      محافظت از ایده‌ها
                    </h4>
                    <p className="text-purple-800 dark:text-purple-200 text-sm">
                      پلتفرم متعهد به حفظ محرمانگی ایده‌ها و پروژه‌های اعضاست. توصیه می‌شود
                      برای حفاظت بیشتر، اقدامات قانونی مانند ثبت اختراع یا علامت تجاری انجام شود.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border-r-4 border-amber-600 p-6 rounded-lg mt-6">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    توصیه‌های مهم
                  </h4>
                  <ul className="space-y-2 text-amber-800 dark:text-amber-200 mr-6">
                    <li>• قبل از به اشتراک‌گذاری ایده‌های حساس، با مشاور حقوقی مشورت کنید</li>
                    <li>• مستندات و مدارک مربوط به توسعه پروژه را نگهداری کنید</li>
                    <li>• در صورت همکاری تیمی، توافقنامه مالکیت را به صورت کتبی تنظیم کنید</li>
                    <li>• از ابزارهای قانونی برای حفاظت از نوآوری‌های خود استفاده کنید</li>
                  </ul>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-8">محتوای تولیدی کاربران</h3>
                <p>
                  با بارگذاری محتوا در پلتفرم (مانند پست‌ها، نظرات، تصاویر یا ویدیوها)، شما به پلتفرم
                  مجوز غیرانحصاری، جهانی و بدون هزینه برای استفاده، نمایش، تکثیر و توزیع آن محتوا
                  در راستای ارائه خدمات می‌دهید. این مجوز تا زمانی که محتوا در پلتفرم باقی بماند،
                  معتبر است.
                </p>

                <div className="bg-red-50 dark:bg-red-900/20 border-r-4 border-red-600 p-6 rounded-lg">
                  <h4 className="font-bold text-red-900 dark:text-red-300 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    محتوای غیرمجاز
                  </h4>
                  <p className="text-red-800 dark:text-red-200 mb-3">
                    بارگذاری محتوای زیر ممنوع است و منجر به تعلیق یا حذف حساب کاربری می‌شود:
                  </p>
                  <ul className="space-y-2 text-red-800 dark:text-red-200 mr-6">
                    <li>• محتوای کپی‌رایت‌دار بدون مجوز</li>
                    <li>• محتوای توهین‌آمیز، تبعیض‌آمیز یا نفرت‌انگیز</li>
                    <li>• محتوای مغایر با قوانین و اخلاق عمومی</li>
                    <li>• محتوای تبلیغاتی یا اسپم</li>
                    <li>• محتوای حاوی بدافزار یا کد مخرب</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 7: Privacy */}
            <section id="privacy" className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">حریم خصوصی و امنیت</h2>
                  <p className="text-slate-600 dark:text-slate-300">حفاظت از اطلاعات شخصی کاربران</p>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">جمع‌آوری اطلاعات</h3>
                <p>
                  ما اطلاعات زیر را از کاربران جمع‌آوری می‌کنیم:
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 text-sm">اطلاعات هویتی</h4>
                    <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
                      <li>• نام و نام خانوادگی</li>
                      <li>• کد ملی</li>
                      <li>• تاریخ تولد</li>
                      <li>• تصویر شناسایی</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-200 dark:border-green-800">
                    <h4 className="font-bold text-green-900 dark:text-green-300 mb-3 text-sm">اطلاعات تماس</h4>
                    <ul className="space-y-1 text-xs text-green-800 dark:text-green-200">
                      <li>• ایمیل</li>
                      <li>• شماره موبایل</li>
                      <li>• آدرس محل سکونت</li>
                      <li>• شبکه‌های اجتماعی</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-200 dark:border-purple-800">
                    <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-3 text-sm">اطلاعات فعالیت</h4>
                    <ul className="space-y-1 text-xs text-purple-800 dark:text-purple-200">
                      <li>• تاریخچه ورود</li>
                      <li>• فعالیت‌های انجام شده</li>
                      <li>• پروژه‌ها و تیم‌ها</li>
                      <li>• نتایج ارزیابی‌ها</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-8">استفاده از اطلاعات</h3>
                <p>اطلاعات جمع‌آوری شده برای موارد زیر استفاده می‌شود:</p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">ارائه خدمات</h4>
                      <p className="text-sm">مدیریت حساب کاربری، دسترسی به آموزش‌ها و امکانات پلتفرم</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">بهبود خدمات</h4>
                      <p className="text-sm">تحلیل رفتار کاربران برای ارتقای کیفیت و تجربه استفاده</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">ارتباطات</h4>
                      <p className="text-sm">ارسال اطلاعیه‌ها، اخبار و به‌روزرسانی‌های مهم</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">امنیت</h4>
                      <p className="text-sm">شناسایی و جلوگیری از سوءاستفاده و فعالیت‌های مشکوک</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-l from-red-50 to-transparent dark:from-red-900/20 border-r-4 border-red-600 p-6 rounded-lg mt-6">
                  <h4 className="font-bold text-red-900 dark:text-red-300 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    اشتراک‌گذاری اطلاعات
                  </h4>
                  <p className="text-red-800 dark:text-red-200 mb-3">
                    ما اطلاعات شما را با اشخاص ثالث به اشتراک نمی‌گذاریم، مگر در موارد زیر:
                  </p>
                  <ul className="space-y-2 text-red-800 dark:text-red-200 mr-6">
                    <li>• با رضایت صریح شما</li>
                    <li>• برای ارائه خدمات توسط شرکای مورد اعتماد (با قرارداد محرمانگی)</li>
                    <li>• در صورت الزام قانونی یا درخواست مراجع قضایی</li>
                    <li>• برای حفاظت از حقوق و امنیت پلتفرم و کاربران</li>
                  </ul>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-8">حقوق کاربران</h3>
                <p>شما نسبت به اطلاعات شخصی خود دارای حقوق زیر هستید:</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-1 text-sm">دسترسی</h4>
                      <p className="text-xs text-blue-800 dark:text-blue-200">مشاهده و دریافت کپی از اطلاعات خود</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-green-900 dark:text-green-300 mb-1 text-sm">اصلاح</h4>
                      <p className="text-xs text-green-800 dark:text-green-200">ویرایش و به‌روزرسانی اطلاعات نادرست</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-1 text-sm">حذف</h4>
                      <p className="text-xs text-purple-800 dark:text-purple-200">درخواست حذف اطلاعات شخصی</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-1 text-sm">محدودیت</h4>
                      <p className="text-xs text-orange-800 dark:text-orange-200">محدود کردن پردازش اطلاعات</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>


            {/* Section 8: Code of Conduct */}
            <section id="conduct" className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">قوانین رفتاری</h2>
                  <p className="text-slate-600 dark:text-slate-300">اصول و ضوابط رفتار در جامعه نوآفرین</p>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
                <div className="bg-gradient-to-l from-blue-50 to-transparent dark:from-blue-900/20 border-r-4 border-blue-600 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3">اصول کلی</h3>
                  <p className="text-blue-800 dark:text-blue-200">
                    پویش ملّی نوآفرین یک جامعه حرفه‌ای، احترام‌آمیز و فراگیر است. تمامی اعضا موظف به
                    رعایت اصول اخلاقی و رفتار حرفه‌ای در تعاملات خود هستند.
                  </p>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white">رفتارهای مورد انتظار</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-200 dark:border-green-800">
                    <h4 className="font-bold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      احترام متقابل
                    </h4>
                    <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                      <li>• احترام به نظرات و دیدگاه‌های مختلف</li>
                      <li>• پرهیز از هرگونه تبعیض و توهین</li>
                      <li>• گوش دادن فعال و سازنده</li>
                      <li>• قدردانی از تلاش‌های دیگران</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      همکاری سازنده
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <li>• مشارکت فعال در پروژه‌های تیمی</li>
                      <li>• به اشتراک‌گذاری دانش و تجربه</li>
                      <li>• کمک به رشد و یادگیری دیگران</li>
                      <li>• پذیرش نقد سازنده</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-200 dark:border-purple-800">
                    <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      صداقت و شفافیت
                    </h4>
                    <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                      <li>• ارائه اطلاعات صحیح و دقیق</li>
                      <li>• اعتراف به اشتباهات و یادگیری از آنها</li>
                      <li>• شفافیت در ارتباطات</li>
                      <li>• پایبندی به تعهدات</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-xl border border-orange-200 dark:border-orange-800">
                    <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      حرفه‌ای‌گری
                    </h4>
                    <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                      <li>• رعایت مواعد و ضرب‌الاجل‌ها</li>
                      <li>• کیفیت بالا در کارها</li>
                      <li>• مسئولیت‌پذیری</li>
                      <li>• رفتار حرفه‌ای در تمام شرایط</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-8">رفتارهای ممنوع</h3>

                <div className="bg-red-50 dark:bg-red-900/20 border-r-4 border-red-600 p-6 rounded-lg">
                  <h4 className="font-bold text-red-900 dark:text-red-300 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    موارد قابل پیگرد
                  </h4>
                  <div className="space-y-4 text-red-800 dark:text-red-200">
                    <div>
                      <h5 className="font-bold mb-2">۱. آزار و اذیت</h5>
                      <p className="text-sm mr-4">
                        هرگونه رفتار توهین‌آمیز، تهدیدآمیز، تبعیض‌آمیز یا آزاردهنده نسبت به سایر اعضا
                        بر اساس جنسیت، نژاد، مذهب، سن، معلولیت یا هر ویژگی شخصی دیگر.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold mb-2">۲. تقلب و کلاهبرداری</h5>
                      <p className="text-sm mr-4">
                        ارائه اطلاعات نادرست، جعل مدارک، سرقت ادبی، کپی‌برداری از کارهای دیگران
                        یا هرگونه فعالیت متقلبانه.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold mb-2">۳. نقض حریم خصوصی</h5>
                      <p className="text-sm mr-4">
                        افشای اطلاعات شخصی دیگران بدون اجازه، نفوذ به حساب‌های کاربری یا
                        هرگونه تجاوز به حریم خصوصی.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold mb-2">۴. سوءاستفاده از منابع</h5>
                      <p className="text-sm mr-4">
                        استفاده نامناسب از امکانات پلتفرم، اتلاف منابع، یا استفاده برای اهداف
                        غیرمرتبط با اهداف پویش.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold mb-2">۵. فعالیت‌های غیرقانونی</h5>
                      <p className="text-sm mr-4">
                        هرگونه فعالیت مغایر با قوانین جمهوری اسلامی ایران یا استفاده از پلتفرم
                        برای اهداف غیرقانونی.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold mb-2">۶. اسپم و تبلیغات</h5>
                      <p className="text-sm mr-4">
                        ارسال پیام‌های ناخواسته، تبلیغات تجاری غیرمجاز، یا هرگونه محتوای اسپم.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-8">فرآیند رسیدگی به تخلفات</h3>

                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      ۱
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">گزارش تخلف</h4>
                      <p className="text-sm">اعضا می‌توانند تخلفات را از طریق سیستم گزارش‌دهی پلتفرم اطلاع دهند</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      ۲
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">بررسی اولیه</h4>
                      <p className="text-sm">تیم مدیریت گزارش را بررسی و در صورت لزوم اقدامات فوری انجام می‌دهد</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      ۳
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">تحقیقات</h4>
                      <p className="text-sm">بررسی دقیق موضوع و جمع‌آوری شواهد و استماع از طرفین</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      ۴
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">تصمیم‌گیری</h4>
                      <p className="text-sm">اتخاذ تصمیم مناسب بر اساس شدت تخلف و سوابق کاربر</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      ۵
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">اجرای مجازات</h4>
                      <p className="text-sm">اعمال تنبیهات از اخطار تا تعلیق یا حذف دائم حساب کاربری</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border-r-4 border-amber-600 p-6 rounded-lg mt-6">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    حق دفاع
                  </h4>
                  <p className="text-amber-800 dark:text-amber-200">
                    تمامی کاربران حق دارند در فرآیند رسیدگی به تخلفات، از خود دفاع کنند و مدارک و
                    دلایل خود را ارائه دهند. تصمیمات با رعایت عدالت و انصاف اتخاذ می‌شود.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9: Termination */}
            <section id="termination" className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">لغو و تعلیق عضویت</h2>
                  <p className="text-slate-600 dark:text-slate-300">شرایط و فرآیند خاتمه عضویت</p>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">لغو عضویت توسط کاربر</h3>
                <p>
                  کاربران می‌توانند در هر زمان درخواست لغو عضویت خود را ارائه دهند. برای این منظور:
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-600 p-6 rounded-lg">
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3">مراحل لغو عضویت</h4>
                  <ol className="space-y-2 text-blue-800 dark:text-blue-200 mr-6">
                    <li>۱. ارسال درخواست کتبی از طریق پنل کاربری یا ایمیل رسمی</li>
                    <li>۲. تکمیل فرم لغو عضویت و ذکر دلیل (اختیاری)</li>
                    <li>۳. تسویه حساب مالی در صورت وجود تعهدات</li>
                    <li>۴. تأیید نهایی و غیرفعال‌سازی حساب کاربری</li>
                    <li>۵. حذف یا آنونیم‌سازی اطلاعات شخصی طبق درخواست</li>
                  </ol>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border-r-4 border-amber-600 p-6 rounded-lg">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    نکات مهم
                  </h4>
                  <ul className="space-y-2 text-amber-800 dark:text-amber-200 mr-6">
                    <li>• لغو عضویت در طول دوره‌های آموزشی فعال ممکن است منجر به از دست دادن هزینه‌های پرداختی شود</li>
                    <li>• تعهدات قراردادی باید قبل از لغو عضویت تسویه شود</li>
                    <li>• پس از لغو عضویت، دسترسی به تمامی خدمات قطع می‌شود</li>
                    <li>• امکان بازگشت مجدد با ثبت‌نام جدید وجود دارد</li>
                  </ul>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-8">تعلیق یا لغو عضویت توسط پلتفرم</h3>
                <p>
                  پلتفرم می‌تواند در موارد زیر عضویت کاربر را تعلیق یا لغو کند:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl border border-red-200 dark:border-red-800">
                    <h4 className="font-bold text-red-900 dark:text-red-300 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      دلایل تعلیق موقت
                    </h4>
                    <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                      <li>• نقض جزئی قوانین و مقررات</li>
                      <li>• عدم حضور مکرر در جلسات</li>
                      <li>• عدم پاسخگویی به درخواست‌ها</li>
                      <li>• مشکلات مالی قابل حل</li>
                      <li>• فعالیت مشکوک نیازمند بررسی</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl border border-red-200 dark:border-red-800">
                    <h4 className="font-bold text-red-900 dark:text-red-300 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      دلایل لغو دائم
                    </h4>
                    <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                      <li>• نقض جدی قوانین و مقررات</li>
                      <li>• تقلب یا ارائه اطلاعات نادرست</li>
                      <li>• آزار و اذیت سایر اعضا</li>
                      <li>• فعالیت‌های غیرقانونی</li>
                      <li>• تکرار تخلفات پس از اخطار</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-l from-purple-50 to-transparent dark:from-purple-900/20 border-r-4 border-purple-600 p-6 rounded-lg mt-6">
                  <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-3">فرآیند اعتراض</h4>
                  <p className="text-purple-800 dark:text-purple-200 mb-3">
                    در صورت عدم موافقت با تصمیم تعلیق یا لغو عضویت، کاربر می‌تواند:
                  </p>
                  <ul className="space-y-2 text-purple-800 dark:text-purple-200 mr-6">
                    <li>• ظرف ۱۴ روز درخواست بازبینی ارسال کند</li>
                    <li>• مدارک و دلایل خود را ارائه دهد</li>
                    <li>• از کمیته رسیدگی به شکایات درخواست بررسی مجدد کند</li>
                  </ul>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-8">پیامدهای لغو عضویت</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">قطع دسترسی</h4>
                      <p className="text-sm">دسترسی به تمامی خدمات، منابع و امکانات پلتفرم قطع می‌شود</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">حذف داده‌ها</h4>
                      <p className="text-sm">اطلاعات شخصی طبق سیاست حفظ حریم خصوصی حذف یا آنونیم می‌شود</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">تعهدات باقیمانده</h4>
                      <p className="text-sm">تعهدات مالی و قراردادی همچنان معتبر و قابل پیگرد قانونی است</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white mb-1">گواهینامه‌ها</h4>
                      <p className="text-sm">گواهینامه‌های دریافتی قبل از لغو عضویت همچنان معتبر هستند</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>


            {/* Section 10: Contact */}
            <section id="contact" className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">تماس با ما</h2>
                  <p className="text-slate-600 dark:text-slate-300">راه‌های ارتباطی و پشتیبانی</p>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
                <p className="text-lg">
                  برای هرگونه سؤال، پیشنهاد یا گزارش مشکل، می‌توانید از طریق راه‌های زیر با ما در ارتباط باشید:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-green-900 dark:text-green-300">تماس مستقیم</h4>
                    </div>
                    <div className="space-y-3 text-sm text-green-800 dark:text-green-200">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span className="font-mono font-bold">09982328585</span>
                      </div>
                      <p className="text-xs text-green-700 dark:text-green-300 mr-6">
                        پاسخگویی در ساعات اداری
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-purple-900 dark:text-purple-300">دبیرخانه دائمی</h4>
                    </div>
                    <div className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                      <p className="font-bold">شرکت کیا نو تجارت افرا</p>
                      <p className="text-xs leading-relaxed">
                        زنجان - پارک علم و فناوری استان زنجان
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-blue-900 dark:text-blue-300">شبکه‌های اجتماعی</h4>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">IG</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-blue-600 dark:text-blue-400">اینستاگرام</p>
                        <p className="font-mono text-base">@noafarinevent</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-l from-blue-50 to-transparent dark:from-blue-900/20 border-r-4 border-blue-600 p-6 rounded-lg mt-8">
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    زمان پاسخگویی
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 mb-3">
                    تیم پشتیبانی ما در روزهای کاری (شنبه تا چهارشنبه) از ساعت ۹ صبح تا ۶ عصر پاسخگوی
                    شما هستند. پیام‌های دریافتی در خارج از ساعات کاری در اولین فرصت پاسخ داده می‌شوند.
                  </p>
                  <ul className="space-y-2 text-blue-800 dark:text-blue-200 mr-6 text-sm">
                    <li>• پاسخ به ایمیل‌ها: حداکثر ۴۸ ساعت کاری</li>
                    <li>• پاسخ به تماس‌های تلفنی: فوری در ساعات کاری</li>
                    <li>• پاسخ به پیام‌های شبکه‌های اجتماعی: حداکثر ۲۴ ساعت</li>
                  </ul>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-8">سایر موارد</h3>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-xl border border-slate-200 dark:border-slate-600">
                    <h4 className="font-bold text-slate-800 dark:text-white mb-2 text-sm">تغییرات قوانین</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      پلتفرم حق تغییر این قوانین را دارد. تغییرات مهم از طریق ایمیل اطلاع‌رسانی می‌شود.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-xl border border-slate-200 dark:border-slate-600">
                    <h4 className="font-bold text-slate-800 dark:text-white mb-2 text-sm">قوانین حاکم</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      این قرارداد تابع قوانین جمهوری اسلامی ایران است و مرجع حل اختلاف، دادگاه‌های تهران می‌باشد.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-xl border border-slate-200 dark:border-slate-600">
                    <h4 className="font-bold text-slate-800 dark:text-white mb-2 text-sm">زبان قرارداد</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      نسخه فارسی این قوانین، نسخه معتبر و رسمی است و در صورت تعارض، ملاک عمل خواهد بود.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Final Agreement Section */}
            <section className="bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">تأیید قوانین و مقررات</h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
                  با ثبت‌نام و استفاده از خدمات پویش ملّی نوآفرین، شما تأیید می‌کنید که این قوانین و مقررات
                  را به طور کامل مطالعه کرده و با تمامی شرایط آن موافقت دارید.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    موافقم و ثبت‌نام می‌کنم
                  </Link>

                  <Link
                    to="/login"
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/20 transition-all border-2 border-white/30 flex items-center gap-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                    بازگشت به صفحه ورود
                  </Link>
                </div>

                <div className="mt-8 pt-6 border-t border-white/20">
                  <p className="text-sm text-white/70">
                    آخرین بروزرسانی: مهرماه ۱۴۰۴ | نسخه ۲.۰
                  </p>
                  <p className="text-xs text-white/60 mt-2">
                    © ۱۴۰۴ پویش ملّی نوآفرین. تمامی حقوق محفوظ است.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12 mt-20">
        <div className="w-[90%] mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-blue-400" />
                پویش ملّی نوآفرین
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                یک برنامه جامع و ملی برای شناسایی، پرورش و حمایت از استعدادهای نوآور و کارآفرین کشور
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/noafarinevent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <span className="text-white text-sm font-bold">IG</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-400" />
                دسترسی سریع
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/login" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    ورود به سیستم
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    ثبت‌نام
                  </Link>
                </li>
                <li>
                  <Link to="/about-aaco" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    درباره ما
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    قوانین و مقررات
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Phone className="w-6 h-6 text-blue-400" />
                تماس با ما
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2 text-slate-300">
                  <Phone className="w-4 h-4 mt-1 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">تماس مستقیم</p>
                    <p className="font-mono">09982328585</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <Globe className="w-4 h-4 mt-1 text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">دبیرخانه دائمی</p>
                    <p>شرکت کیا نو تجارت افرا</p>
                    <p className="text-xs">زنجان - پارک علم و فناوری</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
              <p>© ۱۴۰۴ پویش ملّی نوآفرین. تمامی حقوق محفوظ است.</p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                آخرین بروزرسانی: مهرماه ۱۴۰۴
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
