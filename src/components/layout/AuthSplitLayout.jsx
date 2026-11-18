import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import { ROLE_CONFIG, ROLES } from '../../config/roles';

export const AuthSplitLayout = ({
  children,
  activeRole = ROLES.CONSUMER,
  title,
  subtitle,
  backTo = '/'
}) => {
  const roleMeta = ROLE_CONFIG[activeRole] || ROLE_CONFIG[ROLES.CONSUMER];

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col lg:flex-row font-sans text-slate-100 overflow-x-hidden selection:bg-blue-600/30 selection:text-white">
      {/* LEFT COLUMN: Branded Animated 3D Gradient Showcase Panel */}
      <div className="relative w-full lg:w-1/2 min-h-[320px] lg:min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/40 p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80">
        {/* Ambient Radial Lights */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Back Link & Brand */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Platform</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <Layers className="h-4 w-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">AdaptFlow</span>
          </div>
        </div>

        {/* Center: Dynamic Role Hero Graphic & Pitch */}
        <div className="relative z-10 my-8 lg:my-0 space-y-6 max-w-lg">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3.5 py-1.5 border border-blue-500/20 text-xs font-semibold text-blue-400">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Target Portal: {roleMeta.title}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Self-Adaptive AI with <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Closed Feedback Loops</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {roleMeta.description}
            </p>
          </motion.div>

          {/* Role Value Points */}
          <div className="space-y-3 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Cryptographic Row Level Security (RLS) tenant isolation</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Real-time Evidently AI Kolmogorov-Smirnov drift alarms</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Zero-downtime Blue-Green promotion & instant rollback</span>
            </div>
          </div>
        </div>

        {/* Bottom: Live Telemetry Indicator */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Supabase Auth & GoTrue OAuth Active</span>
          </div>
          <span className="font-mono text-slate-500">v1.1.0-prod</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Glassmorphic Form Card Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 relative">
        <div className="w-full max-w-md space-y-6">
          {title && (
            <div className="text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;
