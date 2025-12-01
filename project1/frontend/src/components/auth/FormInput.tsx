import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  required,
  error,
  disabled,
  maxLength,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="text-sm font-medium text-gray-200">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute right-3 top-3 h-5 w-5 transition-colors"
            style={{ color: isFocused ? '#9e60e6' : '#9ca3af' }}
          />
        )}
        <Input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            ${Icon ? 'pr-10' : ''} 
            ${isPassword ? 'pl-10' : ''}
            bg-white/5 border-white/10 text-white placeholder:text-gray-400
            focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
            transition-all duration-300
            ${error ? 'border-red-500' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={isPassword ? 'current-password' : 'off'}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-3 text-gray-400 hover:text-purple-400 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};
