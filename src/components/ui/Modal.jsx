import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  className = ''
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full ${maxWidth} rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 z-10 transition-all duration-300 scale-100 animate-in fade-in zoom-in-95 ${className}`}>
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  maxWidth: PropTypes.string,
  className: PropTypes.string
};

export default Modal;
