import { motion } from 'framer-motion';

interface GradientDividerProps {
  fromColor?: string;
  toColor?: string;
}

export default function GradientDivider({ 
  fromColor = '#0B0F1A', 
  toColor = '#1E3A5F' 
}: GradientDividerProps) {
  return (
    <div className="relative h-[15vh] overflow-hidden">
      {/* Smooth Gradient Transition */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${fromColor} 0%, ${toColor} 100%)`,
        }}
      />
      
      {/* Animated Wave Effect */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 217, 255, 0.2) 50%, transparent 100%)',
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? 'rgba(0, 217, 255, 0.6)' : 'rgba(236, 72, 153, 0.6)',
            left: `${20 + i * 15}%`,
            top: '50%',
            boxShadow: '0 0 20px currentColor',
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
      
      {/* Subtle Mesh Gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(at 20% 50%, rgba(0, 217, 255, 0.15) 0%, transparent 50%),
            radial-gradient(at 80% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
}
