import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Cpu,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';

const BOARDS = [
  { id: 'overview', title: 'Executive Overview', icon: Layers, subtitle: 'Platform Health & Churn Probability Overview' },
  { id: 'revenue', title: 'Revenue & Retention Risk', icon: DollarSign, subtitle: 'High-Value Customer Protection & MRR Exposure' },
  { id: 'users', title: 'Customer Telemetry', icon: Users, subtitle: 'Demographics, Contract Skew & Service Utilization' },
  { id: 'feedback', title: 'Continuous Feedback Engine', icon: Activity, subtitle: 'Verified Ground Truths & Retraining Triggers' },
  { id: 'performance', title: 'MLOps & Statistical Drift', icon: Cpu, subtitle: 'Evidently AI KS-Test & Model Latency Percentiles' }
];

// Sample telemetry datasets
const inferenceTrendData = [
  { time: '00:00', requests: 120, churnRisk: 22 },
  { time: '04:00', requests: 80, churnRisk: 18 },
  { time: '08:00', requests: 350, churnRisk: 31 },
  { time: '12:00', requests: 580, churnRisk: 42 },
  { time: '16:00', requests: 620, churnRisk: 38 },
  { time: '20:00', requests: 410, churnRisk: 27 },
  { time: 'Now', requests: 490, churnRisk: 33 }
];

const revenueExposureData = [
  { tier: '$0-$35 (Basic)', safe: 1240, atRisk: 180 },
  { tier: '$35-$70 (DSL)', safe: 950, atRisk: 310 },
  { tier: '$70-$100 (Fiber)', safe: 720, atRisk: 640 },
  { tier: '$100+ (Premium)', safe: 480, atRisk: 520 }
];

const driftMetricData = [
  { feature: 'monthlyCharges', pValue: 0.012, threshold: 0.05, drifted: true },
  { feature: 'contractType', pValue: 0.028, threshold: 0.05, drifted: true },
  { feature: 'tenureMonths', pValue: 0.184, threshold: 0.05, drifted: false },
  { feature: 'totalCharges', pValue: 0.220, threshold: 0.05, drifted: false },
  { feature: 'paymentMethod', pValue: 0.091, threshold: 0.05, drifted: false }
];

const demographicsData = [
  { name: 'Month-to-Month', value: 55, color: '#EF4444' },
  { name: 'One Year', value: 25, color: '#3B82F6' },
  { name: 'Two Year', value: 20, color: '#10B981' }
];

export const SlideBoardCarousel = ({ onNavigateToSection }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef(null);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % BOARDS.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + BOARDS.length) % BOARDS.length);
  };

  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentBoard = BOARDS[currentIndex];

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.92,
      rotateY: dir > 0 ? 15 : -15,
      filter: 'blur(4px)'
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        rotateY: { duration: 0.4 }
      }
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.92,
      rotateY: dir < 0 ? 15 : -15,
      filter: 'blur(4px)',
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 }
      }
    })
  };

  return (
    <div
      ref={carouselRef}
      className="relative w-full [perspective:1200px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Controls & Board Selector Pills */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl bg-slate-900/80 p-1.5 border border-slate-800/80 backdrop-blur-md">
          {BOARDS.map((board, idx) => {
            const Icon = board.icon;
            const isActive = idx === currentIndex;
            return (
              <button
                key={board.id}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{board.title}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            title={isAutoPlaying ? 'Pause Autoplay' : 'Resume Autoplay'}
          >
            {isAutoPlaying ? <Pause className="h-3.5 w-3.5 text-blue-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
            <span className="text-[11px]">{isAutoPlaying ? 'Autoplay' : 'Paused'}</span>
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={prevSlide}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Previous board"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextSlide}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Next board"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Animated Board Canvas */}
      <div className="relative min-h-[460px] w-full overflow-hidden rounded-3xl">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            <Card className="border-slate-800/80 bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-slate-900/90 shadow-2xl backdrop-blur-2xl">
              {/* Board Header Banner */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800/60 p-6 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-600/20 p-2.5 text-blue-400 border border-blue-500/30">
                    {React.createElement(currentBoard.icon, { className: 'h-5 w-5' })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white tracking-tight">{currentBoard.title}</h2>
                      <Badge variant="primary" size="sm">Board {currentIndex + 1} of 5</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{currentBoard.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Live 3D Telemetry Feed</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>

              {/* Dynamic Content Per Board */}
              <CardBody className="p-6">
                {/* BOARD 0: OVERVIEW */}
                {currentIndex === 0 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                        <span className="text-xs font-medium text-slate-400">Total Inferences</span>
                        <div className="mt-2 text-2xl font-bold text-white">48,219</div>
                        <div className="mt-1 flex items-center text-xs text-emerald-400 font-semibold">
                          <TrendingUp className="h-3 w-3 mr-1" /> +14.8% vs last week
                        </div>
                      </div>
                      <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                        <span className="text-xs font-medium text-slate-400">Production Accuracy</span>
                        <div className="mt-2 text-2xl font-bold text-emerald-400">81.4%</div>
                        <span className="text-[11px] text-slate-500">Random Forest v1.0.0</span>
                      </div>
                      <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                        <span className="text-xs font-medium text-slate-400">Candidate Accuracy</span>
                        <div className="mt-2 text-2xl font-bold text-blue-400">84.7%</div>
                        <span className="text-[11px] text-emerald-400 font-medium">+3.3% Lift Approved</span>
                      </div>
                      <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                        <span className="text-xs font-medium text-slate-400">Drift Assessment</span>
                        <div className="mt-2 flex items-center gap-1.5">
                          <AlertTriangle className="h-5 w-5 text-amber-400" />
                          <span className="text-lg font-bold text-amber-300">2 Features</span>
                        </div>
                        <span className="text-[11px] text-amber-400/80">Retraining Triggered</span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300">Live Inference Request Velocity & Churn Spike Attribution</span>
                        <span className="text-[11px] text-slate-500">24h Telemetry</span>
                      </div>
                      <div className="h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={inferenceTrendData}>
                            <defs>
                              <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                              </linearGradient>
                              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                            <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                            <YAxis stroke="#64748B" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                            <Area type="monotone" dataKey="requests" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorReq)" name="Inference Requests" />
                            <Area type="monotone" dataKey="churnRisk" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" name="Churn Predicted %" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {/* BOARD 1: REVENUE & RETENTION RISK */}
                {currentIndex === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-2xl bg-slate-950/60 p-5 border border-slate-800/80">
                        <span className="text-xs font-medium text-slate-400">Total Monthly Revenue (MRR)</span>
                        <div className="mt-2 text-3xl font-bold text-white">$482,900</div>
                        <p className="mt-1 text-xs text-slate-400">7,043 Active Telco Subscriptions</p>
                      </div>
                      <div className="rounded-2xl bg-rose-950/20 p-5 border border-rose-900/40">
                        <span className="text-xs font-medium text-rose-300">Revenue at Churn Risk (Monthly)</span>
                        <div className="mt-2 text-3xl font-bold text-rose-400">$64,800</div>
                        <p className="mt-1 text-xs text-rose-400/80">13.4% Exposure across High Risk cohort</p>
                      </div>
                      <div className="rounded-2xl bg-emerald-950/20 p-5 border border-emerald-900/40">
                        <span className="text-xs font-medium text-emerald-300">Retained by Retrained Model Lift</span>
                        <div className="mt-2 text-3xl font-bold text-emerald-400">+$18,240</div>
                        <p className="mt-1 text-xs text-emerald-400/80">+4.6% recall improvement on fiber optic churners</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300">Churn Exposure by Monthly Billing Bracket</span>
                        <span className="text-[11px] text-slate-500">Fiber Optic Skew Evident</span>
                      </div>
                      <div className="h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={revenueExposureData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                            <XAxis dataKey="tier" stroke="#64748B" fontSize={11} />
                            <YAxis stroke="#64748B" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                            <Bar dataKey="safe" fill="#10B981" name="Safe Customers" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="atRisk" fill="#EF4444" name="At-Risk Customers" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {/* BOARD 2: DEMOGRAPHICS & TELEMETRY */}
                {currentIndex === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-2xl bg-slate-950/60 p-5 border border-slate-800/80 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-white">Contract Type Commitment Breakdown</h4>
                        <p className="text-xs text-slate-400 mt-1">Month-to-month contracts generate 72% of total churn signals</p>
                      </div>
                      <div className="h-56 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={demographicsData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {demographicsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-around text-xs">
                        {demographicsData.map((d) => (
                          <div key={d.name} className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="text-slate-300">{d.name} ({d.value}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-950/60 p-5 border border-slate-800/80 space-y-4">
                      <h4 className="text-sm font-semibold text-white">Top Predictive Churn Driver Attributions</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>Contract: Month-to-Month</span>
                            <span className="font-semibold text-rose-400">+0.85 Impact</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-rose-500 rounded-full" style={{ width: '85%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>Internet: Fiber Optic</span>
                            <span className="font-semibold text-rose-400">+0.65 Impact</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-rose-500 rounded-full" style={{ width: '65%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>TechSupport: No Support Assigned</span>
                            <span className="font-semibold text-amber-400">+0.40 Impact</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '40%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>Tenure: Long-term Commitment</span>
                            <span className="font-semibold text-emerald-400">-0.48 Protective</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '48%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* BOARD 3: FEEDBACK & RETRAINING */}
                {currentIndex === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800">
                        <span className="text-xs text-slate-400">Verified Feedback</span>
                        <div className="mt-2 text-2xl font-bold text-white">142 / 200</div>
                        <span className="text-[11px] text-emerald-400">71% Quota Reached</span>
                      </div>
                      <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800">
                        <span className="text-xs text-slate-400">True Positives</span>
                        <div className="mt-2 text-2xl font-bold text-emerald-400">78 Cases</div>
                        <span className="text-[11px] text-slate-400">Correct Churn Flag</span>
                      </div>
                      <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800">
                        <span className="text-xs text-slate-400">False Negatives</span>
                        <div className="mt-2 text-2xl font-bold text-rose-400">14 Cases</div>
                        <span className="text-[11px] text-rose-400/80">Addressing via XGBoost</span>
                      </div>
                      <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800">
                        <span className="text-xs text-slate-400">DVC Commit Hash</span>
                        <div className="mt-2 text-sm font-mono font-bold text-blue-400 truncate">sha256:d8a9f...</div>
                        <span className="text-[11px] text-slate-400">Immutable Dataset</span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-blue-950/20 p-5 border border-blue-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-blue-400" />
                          <h4 className="text-sm font-bold text-white">Retraining Pipeline Status: Validation Passed</h4>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          Candidate model <code className="text-blue-400 font-mono">v1.1.0-xgboost</code> achieved +3.3% accuracy lift and zero latency regression. Ready for Super Admin Blue-Green promotion.
                        </p>
                      </div>
                      <Badge variant="primary" size="lg" className="px-4 py-2">Gatekeeper Cleared</Badge>
                    </div>
                  </div>
                )}

                {/* BOARD 4: MLOPS & DRIFT */}
                {currentIndex === 4 && (
                  <div className="space-y-6">
                    <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">Evidently AI 2-Sample Kolmogorov-Smirnov Statistical Drift Analysis</span>
                        <span className="text-[11px] text-amber-400">Significance Level $\alpha = 0.05$</span>
                      </div>
                      <div className="divide-y divide-slate-800/60">
                        {driftMetricData.map((d) => (
                          <div key={d.feature} className="py-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-300">{d.feature}</span>
                              {d.drifted ? (
                                <Badge variant="danger" size="sm" dot>Drifted</Badge>
                              ) : (
                                <Badge variant="success" size="sm">Stable</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-slate-400">p-value: <code className={`font-mono ${d.drifted ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>{d.pValue}</code></span>
                              <span className="text-slate-500">threshold: {d.threshold}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SlideBoardCarousel;
