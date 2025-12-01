import { motion } from 'framer-motion';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const getStrength = () => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'ضعیف', color: '#ef4444' };
    if (strength === 3) return { strength, label: 'متوسط', color: '#f59e0b' };
    if (strength === 4) return { strength, label: 'خوب', color: '#3b82f6' };
    return { strength, label: 'عالی', color: '#10b981' };
  };

  const { strength, label, color } = getStrength();

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between text-xs text-gray-300">
        <span>قدرت رمز عبور:</span>
        <span className="font-medium" style={{ color }}>
          {label}
        </span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <motion.div
            key={level}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: level * 0.1 }}
            className="h-1.5 flex-1 rounded-full overflow-hidden"
            style={{
              backgroundColor: level <= strength ? color : 'rgba(255, 255, 255, 0.1)',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
