import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface TactileButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'kraft' | 'ghost';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  variant = 'primary',
  children,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-colors select-none cursor-pointer';
  
  const variantStyles = {
    primary: 'bg-[#b2430f] hover:bg-[#8a3410] text-white border border-[#f6a83c] shadow-md shadow-[#e2571a]/20',
    secondary: 'bg-[#3a1d0c] hover:bg-[#46250f] text-[#f8fafc] border border-[#6b3a18] hover:border-[#ddb98f]/60',
    kraft: 'bg-[#ddb98f] hover:bg-[#ebdcc0] text-[#241007] border border-[#b9975f] font-semibold',
    ghost: 'bg-transparent hover:bg-[#3a1d0c] text-[#cbd5e1] hover:text-[#f8fafc] border border-transparent hover:border-[#6b3a18]'
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
