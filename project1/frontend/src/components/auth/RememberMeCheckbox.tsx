import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface RememberMeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({ checked, onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative w-5 h-5 rounded border-2 border-purple-500/50 bg-white/5 hover:bg-white/10 transition-colors"
      >
        <motion.div
          initial={false}
          animate={{
            scale: checked ? 1 : 0,
            opacity: checked ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      </button>
      <label
        onClick={() => onChange(!checked)}
        className="text-sm text-gray-300 cursor-pointer select-none"
      >
        مرا به خاطر بسپار
      </label>
    </div>
  );
};
