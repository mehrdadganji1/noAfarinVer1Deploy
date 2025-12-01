import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, Award } from 'lucide-react';

const stats = [
  { icon: Users, value: '100+', label: 'تیم استارتاپی' },
  { icon: Award, value: '85%', label: 'نرخ موفقیت' },
  { icon: TrendingUp, value: '18', label: 'هفته همراهی' },
];

export const AuthHeroSection = () => {
  return (
    <div className="relative h-full flex flex-col justify-center items-center p-12 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(158, 96, 230, 0.4) 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(124, 74, 179, 0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 text-purple-400" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            پویش ملّی
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              نوآفرین صنعت‌ساز
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            پنج متخصص سرشناس در خدمت کسب‌وکار نو
          </p>
        </motion.div>

        {/* Character Image with Epic Effects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative mb-8"
        >
          {/* Glow Ring */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.03, 1],
            }}
            transition={{
              rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
              scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute -inset-4 rounded-full opacity-50"
            style={{
              background: 'conic-gradient(from 0deg, #9e60e6, #7c4ab3, #b580fa, #9e60e6)',
              filter: 'blur(20px)',
            }}
          />

          {/* Image Container */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500/30 shadow-2xl shadow-purple-500/50">
            <motion.img
              src="/pngCharsAAco2.png"
              alt="AACO Characters"
              className="w-full h-auto relative z-10"
              style={{
                filter: 'drop-shadow(0 20px 60px rgba(158, 96, 230, 0.5))',
                transformStyle: 'preserve-3d',
              }}
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.02, 1],
                rotateX: [0, 2, 0],
                rotateY: [0, -2, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Gradient Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(158, 96, 230, 0.1) 0%, transparent 50%, rgba(124, 74, 179, 0.1) 100%)',
              }}
            />
          </div>

          {/* Floating Stats */}
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.2 }}
              className={`absolute ${
                index === 0 ? 'top-4 -right-4' : index === 1 ? 'bottom-4 -left-4' : 'top-1/2 -left-4'
              }`}
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.8,
                }}
                className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30 shadow-lg shadow-purple-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>


      </div>

      {/* Floating Particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-purple-400"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};
