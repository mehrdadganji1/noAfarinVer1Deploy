import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Button } from '../../ui/button';

const COLORS = {
  bg: '#000000',
  bgLight: '#0a0515',
  cyan: '#9e60e6',
  purple: '#7c4ab3',
  pink: '#b580fa',
  text: '#E8EAED',
  textMuted: '#c4b5d8',
};

export const HeroFuturistic: React.FC = () => {
  return (
    <section 
      className="relative min-h-screen overflow-hidden" 
      style={{ 
        background: 'linear-gradient(180deg, #000000 0%, #0a0515 25%, #0f0820 50%, #140b2a 75%, #1a0b2e 100%)'
      }}
    >
      {/* Sophisticated Background Grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(${COLORS.cyan} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.cyan} 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Elegant Gradient Accents */}
      <div
        className="absolute left-0 top-0 h-[800px] w-[800px] opacity-[0.08]"
        style={{
          background: `radial-gradient(circle, ${COLORS.cyan} 0%, transparent 70%)`,
          filter: 'blur(150px)',
        }}
      />
      <div
        className="absolute right-0 bottom-0 h-[600px] w-[600px] opacity-[0.06]"
        style={{
          background: `radial-gradient(circle, ${COLORS.purple} 0%, transparent 70%)`,
          filter: 'blur(140px)',
        }}
      />

      {/* Container - Standard Layout */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen items-center py-12 sm:py-20">
          <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-32 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center space-y-6 sm:space-y-8 text-center lg:text-right"
            >
              {/* Logo - AACO */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative inline-block"
                >
                  <h1
                    className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter lg:text-7xl"
                    style={{
                      fontFamily: "'Orbitron', monospace",
                      color: COLORS.text,
                      letterSpacing: '-0.04em',
                    }}
                  >
                    AACO
                  </h1>
                  {/* Subtle glow effect */}
                  <div
                    className="absolute -inset-2 opacity-20 blur-2xl"
                    style={{
                      background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.purple})`,
                      zIndex: -1,
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 justify-center lg:justify-start"
                >
                  <div
                    className="h-[2px] w-12 sm:w-16 hidden sm:block"
                    style={{
                      background: `linear-gradient(90deg, ${COLORS.cyan}, transparent)`,
                    }}
                  />
                  <p
                    className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.25em]"
                    style={{ color: COLORS.cyan }}
                  >
                    AI AS CO-FOUNDER
                  </p>
                </motion.div>
              </div>

              {/* Main Heading - Professional Typography */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 sm:space-y-6"
              >
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl font-bold lg:text-7xl"
                  style={{
                    color: COLORS.text,
                    letterSpacing: '-0.02em',
                    lineHeight: '1.43',
                  }}
                >
                  پویش ملّی
                  <br />
                  <span
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.purple})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    نوآفرین صنعت‌ساز
                  </span>
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  <p
                    className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg md:text-xl lg:text-2xl"
                    style={{
                      color: COLORS.textMuted,
                      letterSpacing: '-0.01em',
                      lineHeight: '2',
                    }}
                  >
                    پنج تخصص مهم و خاص
                    <br />
                    در خدمت رشد کسب‌وکار فناورانه تو
                  </p>

                  {/* Accent Line */}
                  <div
                    className="h-[1px] w-24"
                    style={{
                      background: `linear-gradient(90deg, ${COLORS.cyan}, transparent)`,
                    }}
                  />
                </div>
              </motion.div>

              {/* Info Pills - Minimal Design */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-2 sm:gap-4 justify-center lg:justify-start"
              >
                <InfoPill icon={<Calendar className="h-4 w-4 sm:h-5 sm:w-5" />} text="فصل پاییز ۱۴۰۴" />
                <InfoPill icon={<MapPin className="h-4 w-4 sm:h-5 sm:w-5" />} text="دانشگاه‌های برتر" />
              </motion.div>

              {/* CTA Buttons - Using Design System */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <a href="/register">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="group"
                  >
                    ثبت‌نام در برنامه
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  </Button>
                </a>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-[3px]"
                  style={{
                    color: COLORS.cyan,
                    borderColor: COLORS.cyan,
                  }}
                  onClick={() => {
                    const nextSection = document.getElementById('program-info');
                    if (nextSection) {
                      nextSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  اطلاعات بیشتر
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Side - Image with Epic Effects */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex items-center justify-center order-first lg:order-last"
            >
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none" style={{ transform: 'scale(1)' }}>
                {/* Glowing Background Circles */}
                <div
                  className="absolute -inset-20 opacity-30 blur-3xl"
                  style={{
                    background: `radial-gradient(circle at 30% 50%, ${COLORS.cyan}60, transparent 50%)`,
                    animation: 'pulse 4s ease-in-out infinite',
                  }}
                />
                <div
                  className="absolute -inset-20 opacity-20 blur-3xl"
                  style={{
                    background: `radial-gradient(circle at 70% 50%, ${COLORS.purple}60, transparent 50%)`,
                    animation: 'pulse 4s ease-in-out infinite 2s',
                  }}
                />

                {/* Image Container with Border */}
                <div
                  className="relative rounded-3xl overflow-hidden"
                  style={{
                    border: `3px solid ${COLORS.cyan}60`,
                    boxShadow: `
                      0 0 40px ${COLORS.cyan}50,
                      0 0 80px ${COLORS.purple}30,
                      inset 0 0 40px ${COLORS.cyan}15
                    `,
                  }}
                >
                  <img
                    src="/pngCharsAAco2.png"
                    alt="AACO Characters"
                    className="w-full h-auto relative z-10"
                    style={{
                      opacity: 0.98,
                      filter: `
                        drop-shadow(0 20px 60px ${COLORS.cyan}50)
                        drop-shadow(0 0 40px ${COLORS.purple}30)
                        brightness(1.05)
                        contrast(1.1)
                      `,
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.cyan}05, transparent 50%, ${COLORS.purple}05)`,
                    }}
                  />
                </div>

                {/* Floating Stats - Hidden on mobile */}
                <div className="hidden sm:block">
                  <FloatingStat value="100+" label="تیم" position="top-right" delay={0.8} />
                  <FloatingStat value="85%" label="موفقیت" position="bottom-left" delay={1} />
                </div>
              </div>

              {/* Add keyframes for animations */}
              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 0.3; transform: scale(1); }
                  50% { opacity: 0.5; transform: scale(1.05); }
                }
              `}</style>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InfoPill: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => {
  return (
    <div
      className="flex items-center gap-2 sm:gap-3 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium"
      style={{
        border: `1px solid ${COLORS.cyan}30`,
        background: `${COLORS.bgLight}80`,
        color: COLORS.text,
        letterSpacing: '-0.01em',
      }}
    >
      <span style={{ color: COLORS.cyan }}>{icon}</span>
      {text}
    </div>
  );
};

const FloatingStat: React.FC<{
  value: string;
  label: string;
  position: 'top-right' | 'bottom-left';
  delay: number;
}> = ({ value, label, position, delay }) => {
  const positions = {
    'top-right': '-top-6 -right-6',
    'bottom-left': '-bottom-6 -left-6',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`absolute rounded-2xl px-6 py-4 ${positions[position]}`}
      style={{
        border: `1px solid ${COLORS.cyan}40`,
        background: COLORS.bg,
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="text-center">
        <div
          className="text-3xl font-bold"
          style={{ color: COLORS.cyan }}
        >
          {value}
        </div>
        <div className="text-sm" style={{ color: COLORS.textMuted }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
};
