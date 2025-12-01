import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm text-white">همین حالا شروع کنید</span>
          </motion.div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            آماده‌اید تا سفر نوآوری را
            <br />
            <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
              شروع کنید؟
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            به جامعه‌ای از نوآوران، کارآفرینان و متخصصان بپیوندید و ایده‌های خود را به واقعیت تبدیل کنید
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-white/90 px-8 py-6 text-lg rounded-xl shadow-2xl hover:shadow-white/50 transition-all hover:scale-105 font-bold"
              >
                ثبت‌نام رایگان
                <ArrowLeft className="mr-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm transition-all hover:scale-105"
              >
                ورود به حساب کاربری
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-8 pt-8 text-white/80"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">بدون نیاز به کارت اعتباری</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">راه‌اندازی در کمتر از 2 دقیقه</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">پشتیبانی 24/7</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
