import React from 'react';
import PropTypes from 'prop-types';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const variants = {
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-blue-950/80 text-blue-400 border-blue-800/60',
    success: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
    warning: 'bg-amber-950/80 text-amber-400 border-amber-800/60',
    danger: 'bg-rose-950/80 text-rose-400 border-rose-800/60',
    purple: 'bg-purple-950/80 text-purple-400 border-purple-800/60'
  };

  const dots = {
    neutral: 'bg-slate-400',
    primary: 'bg-blue-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    purple: 'bg-purple-400'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variants[variant] || variants.neutral} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dots[variant] || dots.neutral} animate-pulse`} />}
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string,
  size: PropTypes.string,
  dot: PropTypes.bool,
  className: PropTypes.string
};

export default Badge;
