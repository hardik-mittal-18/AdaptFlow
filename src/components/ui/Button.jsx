import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 focus:ring-blue-500 border border-blue-500/30',
    secondary: 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700/60 shadow-sm focus:ring-slate-500',
    ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white focus:ring-slate-600',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/25 focus:ring-rose-500 border border-rose-500/30',
    glass: 'bg-white/10 hover:bg-white/15 text-white backdrop-blur-md border border-white/20 shadow-md focus:ring-white/30',
    outline: 'border border-slate-600 text-slate-200 hover:bg-slate-800/60 focus:ring-slate-500'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
    icon: 'p-2 rounded-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="h-4 w-4" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="h-4 w-4" />}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  iconPosition: PropTypes.string
};

export default Button;
