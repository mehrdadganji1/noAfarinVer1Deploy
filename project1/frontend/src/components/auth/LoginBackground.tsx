import { motion } from 'framer-motion';

export const LoginBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main Gradient - Ultra Dark Luxury */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #0a0515 20%, #1a0b2e 40%, #2d1b4e 60%, #3d2463 80%, #4a2c6f 100%)',
        }}
      />

      {/* Noise Texture for Luxury Feel */}
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
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />

      {/* Luxury Animated Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(124, 74, 179, 0.4) 0%, rgba(88, 28, 135, 0.2) 50%, transparent 70%)',
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
        className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(158, 96, 230, 0.35) 0%, rgba(109, 40, 217, 0.2) 50%, transparent 70%)',
        }}
      />

      {/* Additional Accent Orb */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.25, 0.1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[80px]"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%)',
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
          backgroundSize: '100px 100px',
        }}
      />

      {/* Diagonal Lines for Depth */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            rgba(158, 96, 230, 0.5) 0px,
            rgba(158, 96, 230, 0.5) 1px,
            transparent 1px,
            transparent 60px
          )`,
        }}
      />

      {/* Luxury Floating Particles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            background: `radial-gradient(circle, rgba(158, 96, 230, ${0.6 + Math.random() * 0.4}), transparent)`,
            boxShadow: `0 0 ${10 + Math.random() * 10}px rgba(158, 96, 230, 0.5)`,
          }}
          animate={{
            y: [0, -50 - Math.random() * 30, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
