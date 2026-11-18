import React from 'react';

export const Toggle = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
  size = 'md'
}) => {
  const isLg = size === 'lg';
  const trackSize = isLg ? 'w-12 h-6' : 'w-10 h-5';
  const knobSize = isLg ? 'w-5 h-5' : 'w-4 h-4';
  const knobTranslate = isLg ? 'translate-x-6' : 'translate-x-5';

  return (
    <label
      className={`inline-flex items-center justify-between gap-3 cursor-pointer select-none group ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {(label || description) && (
        <div className="flex flex-col text-left">
          {label && (
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {description}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex shrink-0 ${trackSize} items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
          checked
            ? 'bg-blue-600 dark:bg-blue-500'
            : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block ${knobSize} rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
            checked ? knobTranslate : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
};

export default Toggle;
