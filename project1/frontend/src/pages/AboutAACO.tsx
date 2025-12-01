import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Users, Lightbulb, TrendingUp, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/landing/Footer';

const AboutAACO: React.FC = () => {
  const specialties = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'استراتژی کسب‌وکار',
      description: 'طراحی و توسعه مدل کسب‌وکار، تحلیل بازار و برنامه‌ریزی استراتژیک برای رشد پایدار'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'توسعه محصول',
      description: 'از ایده تا محصول نهایی، با متدولوژی‌های مدرن و تمرکز بر نیاز مشتری'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'بازاریابی و فروش',
      description: 'استراتژی‌های دیجیتال مارکتینگ، برندسازی و توسعه کانال‌های فروش'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'مالی و سرمایه‌گذاری',
      description: 'مدیریت مالی، جذب سرمایه و ارتباط با سرمایه‌گذاران'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'فناوری و نوآوری',
      description: 'بهره‌گیری از فناوری‌های نوین و هوش مصنوعی برای رقابت‌پذیری'
    },
  ];

  const benefits = [
    {
      title: 'دسترسی به متخصصان',
      description: 'ارتباط مستقیم با متخصصان برتر در هر پنج حوزه تخصصی'
    },
    {
      title: 'شبکه‌سازی حرفه‌ای',
      description: 'ایجاد ارتباط با سایر کارآفرینان، سرمایه‌گذاران و شرکای تجاری'
    },
    {
      title: 'آموزش‌های تخصصی',
      description: 'دوره‌ها و کارگاه‌های عملی برای ارتقای مهارت‌های کسب‌وکاری'
    },
    {
      title: 'منتورینگ اختصاصی',
      description: 'راهنمایی شخصی‌سازی شده برای چالش‌های خاص کسب‌وکار شما'
    },
    {
      title: 'تسهیلات ویژه',
      description: 'دسترسی به منابع، ابزارها و تسهیلات مورد نیاز برای رشد'
    },
    {
      title: 'فرصت‌های سرمایه‌گذاری',
      description: 'معرفی به سرمایه‌گذاران و فرصت‌های تامین مالی'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-12 px-4 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <img
              src="/logoweb-min.png"
              alt="درباره AACO"
              className="w-[70%] max-w-3xl mx-auto object-contain"
            />
          </motion.div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-16"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-4">ماموریت ما</h2>
            <p className="text-white/80 text-lg leading-relaxed text-center max-w-4xl mx-auto">
              ماموریت AACO ایجاد یک اکوسیستم جامع برای حمایت از کسب‌وکارهای فناورانه است. ما معتقدیم که با ارائه تخصص‌های کلیدی در حوزه‌های مختلف، می‌توانیم به نوآوران کمک کنیم تا ایده‌های خود را به محصولات و خدمات موفق تبدیل کنند.
            </p>
          </motion.div>

          {/* Specialties Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-4">پنج تخصص کلیدی AACO</h2>
            <p className="text-white/70 text-center mb-8 max-w-2xl mx-auto">
              هر کسب‌وکار فناورانه برای موفقیت نیاز به پنج تخصص اساسی دارد
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialties.map((specialty, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all"
                >
                  <div className="text-purple-400 mb-4">{specialty.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{specialty.title}</h3>
                  <p className="text-white/70 leading-relaxed">{specialty.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">مزایای شرکت در AACO</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                >
                  <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-white/70">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              آماده‌ای ایده خودت رو تبدیل به کسب‌وکار فناورانه کنی؟
            </h2>
            <p className="text-white/80 text-lg mb-6">
              همین حالا به AACO بپیوندید و از تخصص‌های ما بهره‌مند شوید
            </p>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-xl text-lg font-bold shadow-2xl inline-flex items-center gap-3"
              >
                شروع کنید
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutAACO;
