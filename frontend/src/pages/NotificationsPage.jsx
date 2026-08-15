import { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/studentService';
import { Bell, Briefcase, Sparkles, Clock, Settings, Loader2, CheckCheck } from 'lucide-react';

const TYPE_CONFIG = {
  application: { icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
  match:       { icon: Sparkles,  color: 'text-violet-600 bg-violet-50' },
  reminder:    { icon: Clock,     color: 'text-orange-500 bg-orange-50' },
  system:      { icon: Settings,  color: 'text-slate-500 bg-slate-100' },
};

function NotificationItem({ notif, onRead }) {
  const { icon: Icon, color } = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;

  return (
    <div
      onClick={() => !notif.read && onRead(notif._id)}
      className={`flex items-start gap-4 rounded-2xl border p-4 cursor-pointer transition-all
        ${notif.read
          ? 'bg-white border-slate-100 opacity-70'
          : 'bg-white border-emerald-200 shadow-sm hover:shadow-md'
        }`}
    >
      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-semibold ${notif.read ? 'text-slate-500' : 'text-slate-900'}`}>
            {notif.title}
          </p>
          {!notif.read && <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />}
        </div>
        <p className="text-sm text-slate-500 mt-0.5">{notif.message}</p>
        <p className="text-xs text-slate-400 mt-1.5">
          {new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications().then(setNotifs).finally(() => setLoading(false));
  }, []);

  const handleRead = async (id) => {
    await markNotificationRead(id);
    setNotifs(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
  };

  const handleReadAll = async () => {
    await markAllNotificationsRead();
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">
            {unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={handleReadAll}
            className="flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition"
          >
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-emerald-600" />
        </div>
      ) : notifs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Bell size={44} className="mb-3 text-slate-300" />
          <p className="font-semibold text-slate-600 text-lg">No notifications yet</p>
          <p className="text-sm mt-1">Apply to internships to receive updates here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifs.map(n => (
            <NotificationItem key={n._id} notif={n} onRead={handleRead} />
          ))}
        </div>
      )}
    </div>
  );
}
