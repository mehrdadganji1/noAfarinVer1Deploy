import React, { useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Users, Award, TrendingUp, Clock, Zap } from 'lucide-react';
import { aacoTheme } from '../../../design-system/aaco-theme';

interface Stat {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  {
    icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />,
    value: 45,
    suffix: '+',
    label: 'متقاضی ثبت‌نام شده',
    color: aacoTheme.colors.primary[500],
  },
  {
    icon: <Award className="w-6 h-6 sm:w-8 sm:h-8" />,
    value: 12,
    suffix: '',
    label: 'منتور و مدرس',
    color: aacoTheme.colors.secondary[500],
  },
  {
    icon: <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />,
    value: 6,
    suffix: '',
    label: 'روز آموزش فشرده',
    color: aacoTheme.colors.accent[500],
  },
  {
    icon: <Clock className="w-6 h-6 sm:w-8 sm:h-8" />,
    value: 30,
    suffix: '+',
    label: 'ساعت محتوای آموزشی',
    color: aacoTheme.colors.cyan[500],
  },
];

export const StatsPremium: React.FC = () => {
  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #1a0b2e 0%, #220f3d 25%, #2a134c 50%, #32175b 75%, #3a1b6a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="py-12 sm:py-16 lg:py-32 px-4 sm:px-6 lg:px-8"
    >
      {/* Animated Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 30% 50%, ${aacoTheme.colors.primary[500]}20 0%, transparent 50%),
            radial-gradient(circle at 70% 50%, ${aacoTheme.colors.secondary[500]}20 0%, transparent 50%)
          `,
          filter: 'blur(80px)',
        }}
      />

      {/* Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${aacoTheme.colors.primary[500]}05 2px, transparent 2px),
            linear-gradient(90deg, ${aacoTheme.colors.primary[500]}05 2px, transparent 2px)
          `,
          backgroundSize: '80px 80px',
          opacity: 0.5,
        }}
      />

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center',
          }}
          className="mb-8 sm:mb-12 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1.25rem',
              background: 'rgba(158, 96, 230, 0.1)',
              border: '1px solid rgba(158, 96, 230, 0.4)',
              borderRadius: aacoTheme.borderRadius.full,
              marginBottom: '2rem',
            }}
          >
            <Zap size={16} style={{ color: '#9e60e6' }} />
            <span
              style={{
                fontSize: aacoTheme.typography.fontSize.sm,
                fontWeight: aacoTheme.typography.fontWeight.medium,
                color: '#9e60e6',
              }}
            >
              نتایج قابل اعتماد
            </span>
          </motion.div>

          <h2
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: aacoTheme.typography.fontWeight.bold,
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #9e60e6 0%, #b580fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            آمار و ارقام
          </h2>

          <p
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
              color: '#c4b5d8',
            }}
          >
            اعداد واقعی از موفقیت‌های ما
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StatCard: React.FC<{ stat: Stat; index: number }> = ({ stat, index }) => {
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      
      const duration = 2000;
      const steps = 60;
      const increment = stat.value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setCount(stat.value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, stat.value, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl"
      style={{
        position: 'relative',
        background: 'rgba(10, 5, 21, 0.6)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${
          isHovered ? stat.color + '80' : 'rgba(255, 255, 255, 0.1)'
        }`,
        textAlign: 'center',
        cursor: 'pointer',
        transition: aacoTheme.transitions.base,
        transform: isHovered ? 'translateY(-12px)' : 'translateY(0)',
        boxShadow: isHovered
          ? `0 25px 60px ${stat.color}30, 0 0 0 1px ${stat.color}40`
          : 'none',
      }}
    >
      {/* Glow Effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 0%, ${stat.color}20 0%, transparent 70%)`,
          borderRadius: aacoTheme.borderRadius.xl,
          opacity: isHovered ? 1 : 0,
          transition: aacoTheme.transitions.base,
          pointerEvents: 'none',
        }}
      />

      {/* Icon */}
      <motion.div
        animate={
          isHovered
            ? { scale: 1.2, rotate: 360 }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.6 }}
        className="p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-8 inline-flex rounded-lg sm:rounded-xl"
        style={{
          background: isHovered
            ? `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}80 100%)`
            : `${stat.color}15`,
          color: isHovered ? aacoTheme.colors.text.primary : stat.color,
          transition: aacoTheme.transitions.base,
          boxShadow: isHovered ? `0 15px 40px ${stat.color}40` : 'none',
        }}
      >
        {stat.icon}
      </motion.div>

      {/* Value */}
      <div className="mb-1 sm:mb-2 relative">
        <span
          className="text-2xl sm:text-3xl lg:text-5xl font-bold"
          style={{
            fontFamily: aacoTheme.typography.fontFamily.display,
            background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}80 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {count}
        </span>
        <span
          className="text-lg sm:text-xl lg:text-2xl mr-1"
          style={{
            color: stat.color,
          }}
        >
          {stat.suffix}
        </span>
      </div>

      {/* Label */}
      <div
        className="text-xs sm:text-sm lg:text-base"
        style={{
          color: aacoTheme.colors.text.secondary,
          fontWeight: aacoTheme.typography.fontWeight.medium,
        }}
      >
        {stat.label}
      </div>

      {/* Decorative Line - Hidden on mobile */}
      <motion.div
        initial={{ width: 0 }}
        animate={isHovered ? { width: '60%' } : { width: 0 }}
        className="hidden sm:block mt-4 lg:mt-6 mx-auto"
        style={{
          height: '3px',
          background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
          borderRadius: '2px',
        }}
      />
    </motion.div>
  );
};
