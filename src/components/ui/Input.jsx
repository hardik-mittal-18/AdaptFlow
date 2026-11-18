import React from 'react';
import PropTypes from 'prop-types';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-medium text-slate-300 mb-1.5 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative rounded-xl">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          className={`w-full rounded-xl bg-slate-900/90 border ${
            error ? 'border-rose-500 ring-rose-500/20' : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
          } ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:bg-slate-950 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

export const Select = ({
  label,
  error,
  helperText,
  options = [],
  children,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-medium text-slate-300 mb-1.5 tracking-wide">
          {label}
        </label>
      )}
      <select
        className={`w-full rounded-xl bg-slate-900/90 border ${
          error ? 'border-rose-500 ring-rose-500/20' : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
        } px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 ${className}`}
        {...props}
      >
        {children || options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string
};

export default Input;
