import React from 'react';
import PropTypes from 'prop-types';

export const Card = ({
  children,
  className = '',
  glass = true,
  hover = false,
  glow = false,
  ...props
}) => {
  const base = 'rounded-2xl transition-all duration-300';
  const glassStyles = glass 
    ? 'bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 shadow-xl' 
    : 'bg-slate-900 border border-slate-800 shadow-md';
  const hoverStyles = hover 
    ? 'hover:border-slate-700 hover:shadow-2xl hover:-translate-y-0.5' 
    : '';
  const glowStyles = glow 
    ? 'relative before:absolute before:-inset-0.5 before:bg-gradient-to-r before:from-blue-500/20 before:to-indigo-500/20 before:rounded-2xl before:blur-sm before:-z-10' 
    : '';

  return (
    <div className={`${base} ${glassStyles} ${hoverStyles} ${glowStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', title, subtitle, action }) => (
  <div className={`p-5 border-b border-slate-800/60 flex items-center justify-between ${className}`}>
    <div>
      {title && <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>}
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      {children}
    </div>
    {action && <div className="flex items-center gap-2">{action}</div>}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-4 border-t border-slate-800/60 bg-slate-950/40 rounded-b-2xl ${className}`}>
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  glass: PropTypes.bool,
  hover: PropTypes.bool,
  glow: PropTypes.bool
};

export default Card;
