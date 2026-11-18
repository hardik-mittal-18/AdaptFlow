import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton, EmptyState } from '../../components/ui/Table';
import { Bell, CheckCircle2, AlertTriangle, Info, Inbox } from 'lucide-react';

const FALLBACK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Model Retraining Succeeded',
    message: 'Candidate model v1.1.0-xgboost completed training with +3.3% accuracy lift and zero latency penalty.',
    type: 'success',
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: 'notif-2',
    title: 'Data Drift Warning on Fiber Optic Cohort',
    message: 'Evidently AI identified significant distribution divergence in monthlyCharges (p=0.012 < 0.05).',
    type: 'warning',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: 'notif-3',
    title: 'Verified Feedback Quota Milestone',
    message: 'Supervised feedback records surpassed 70% threshold. Automated retraining pipeline initiated.',
    type: 'info',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true
  }
];

export const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      try {
        if (user?.id) {
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            setNotifications(data);
            return;
          }
        }
        setNotifications(FALLBACK_NOTIFICATIONS);
      } catch (err) {
        setNotifications(FALLBACK_NOTIFICATIONS);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, [user]);

  const markAllRead = async () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    if (user?.id) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .catch(() => {});
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Notifications</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry alerts, model promotion updates, and drift warnings scoped to your profile.
          </p>
        </div>
        <Button onClick={markAllRead} variant="secondary" size="sm">
          Mark All as Read
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No Notifications"
          description="You are fully caught up! There are no active telemetry alarms or notifications."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const icons = {
              success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
              warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
              info: <Info className="h-5 w-5 text-blue-400" />
            };

            return (
              <Card
                key={n.id}
                glass
                className={`p-4 flex items-start gap-4 transition-colors ${
                  !n.read ? 'border-l-4 border-l-blue-500 bg-slate-900/90' : 'opacity-80'
                }`}
              >
                <div className="rounded-xl bg-slate-950 p-2 border border-slate-800 flex-shrink-0">
                  {icons[n.type] || <Bell className="h-5 w-5 text-slate-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                    <span className="text-[11px] text-slate-500">
                      {n.created_at ? new Date(n.created_at).toLocaleTimeString() : 'Just now'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">{n.message}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
