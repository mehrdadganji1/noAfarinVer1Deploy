import { motion } from 'framer-motion';

export const RegisterBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main Gradient - Ultra Dark Luxury */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #0a0515 15%, #1a0b2e 30%, #2d1b4e 50%, #3d2463 70%, #4a2c6f 85%, #5a3580 100%)',
        }}
      />

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Radial Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />

      {/* Luxury Animated Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.2, 0.35, 0.2],
          x: [0, 30, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-0 left-0 w-[750px] h-[750px] rounded-full blur-[110px]"
        style={{
          background: 'radial-gradient(circle, rgba(158, 96, 230, 0.4) 0%, rgba(124, 74, 179, 0.2) 50%, transparent 70%)',
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.35, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
        className="absolute bottom-0 right-0 w-[650px] h-[650px] rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(124, 74, 179, 0.35) 0%, rgba(88, 28, 135, 0.2) 50%, transparent 70%)',
        }}
      />

      {/* Center Accent Orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[90px]"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%)',
        }}
      />

      {/* Luxury Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(158, 96, 230, 0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(158, 96, 230, 0.8) 1px, transparent 1px)
          `,
          backgroundSize: '90px 90px',
        }}
      />

      {/* Diagonal Lines */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            rgba(158, 96, 230, 0.5) 0px,
            rgba(158, 96, 230, 0.5) 1px,
            transparent 1px,
            transparent 70px
          )`,
        }}
      />

      {/* Luxury Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${1.5 + Math.random() * 3}px`,
            height: `${1.5 + Math.random() * 3}px`,
            background: `radial-gradient(circle, rgba(158, 96, 230, ${0.5 + Math.random() * 0.5}), transparent)`,
            boxShadow: `0 0 ${8 + Math.random() * 12}px rgba(158, 96, 230, 0.4)`,
          }}
          animate={{
            y: [0, -45 - Math.random() * 25, 0],
            x: [0, (Math.random() - 0.5) * 15, 0],
            opacity: [0, 0.7, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4.5 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
