import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

export const PasswordStrengthMeter = ({ password = '' }) => {
  const analysis = useMemo(() => {
    const checks = [
      { label: 'At least 8 characters', pass: password.length >= 8 },
      { label: 'Contains uppercase letter (A-Z)', pass: /[A-Z]/.test(password) },
      { label: 'Contains a number (0-9)', pass: /[0-9]/.test(password) },
      { label: 'Contains special character (!@#$...)', pass: /[^A-Za-z0-9]/.test(password) }
    ];

    const score = checks.filter((c) => c.pass).length;

    const strength = [
      { label: 'Too Weak', color: 'bg-slate-700', text: 'text-slate-500' },
      { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' },
      { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' },
      { label: 'Good', color: 'bg-blue-500', text: 'text-blue-400' },
      { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' }
    ][score];

    return { checks, score, strength };
  }, [password]);

  if (!password) return null;

  return (
    <div className="space-y-2 pt-1 text-xs">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400">Password strength:</span>
        <span className={`font-semibold ${analysis.strength.text}`}>{analysis.strength.label}</span>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              analysis.score >= step ? analysis.strength.color : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-1 pt-1 text-[10px]">
        {analysis.checks.map((check) => (
          <div
            key={check.label}
            className={`flex items-center gap-1.5 ${check.pass ? 'text-emerald-400' : 'text-slate-500'}`}
          >
            {check.pass ? <Check className="h-3 w-3" /> : <X className="h-3 w-3 text-slate-600" />}
            <span>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
