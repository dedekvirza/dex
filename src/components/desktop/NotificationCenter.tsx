import React from 'react';
import { useDeX } from '../../context/DeXContext';
import { AppIcon } from '../common/AppIcon';
import { Bell, Trash2, X, CheckCheck, Info } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const {
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    notifications,
    dismissNotification,
    clearAllNotifications,
    markNotificationRead,
    openApp,
    settings
  } = useDeX();

  if (!isNotificationCenterOpen) return null;

  const isTopTaskbar = settings.taskbarPosition === 'top';

  return (
    <div
      id="dex-notification-center"
      onClick={e => e.stopPropagation()}
      style={{
        bottom: isTopTaskbar ? 'auto' : '56px',
        top: isTopTaskbar ? '56px' : 'auto',
        right: '50px'
      }}
      className={`fixed z-[900] w-84 max-h-[480px] p-4 rounded-3xl shadow-2xl border backdrop-blur-2xl text-xs select-none flex flex-col animate-in fade-in zoom-in-95 duration-150 ${
        settings.darkMode
          ? 'bg-neutral-900/95 border-neutral-700/80 text-neutral-100'
          : 'bg-white/95 border-neutral-200 text-neutral-900'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-sm tracking-tight text-white dark:text-neutral-100">
            Pusat Notifikasi
          </span>
        </div>

        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors"
              title="Hapus Semua"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setIsNotificationCenterOpen(false)}
            className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
        {notifications.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-neutral-500 gap-2">
            <Bell className="w-10 h-10 opacity-30 stroke-[1.2]" />
            <span className="text-xs">Tidak ada notifikasi baru</span>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-3 rounded-2xl border transition-all relative group flex flex-col gap-1.5 ${
                notif.unread
                  ? 'bg-blue-600/10 border-blue-500/30'
                  : settings.darkMode
                  ? 'bg-neutral-800/40 border-neutral-800'
                  : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              {/* Top Row: App info & dismiss button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-blue-600/30 text-blue-400 flex items-center justify-center">
                    <AppIcon name={notif.icon || 'Bell'} className="w-3 h-3" />
                  </div>
                  <span className="font-semibold text-neutral-300 text-[11px] truncate max-w-[140px]">
                    {notif.appName}
                  </span>
                  <span className="text-[10px] text-neutral-500">• {notif.timestamp}</span>
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    dismissNotification(notif.id);
                  }}
                  className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Title & Message */}
              <div>
                <span className="font-bold text-white text-xs block">{notif.title}</span>
                <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {/* Action Button if specified */}
              {notif.actionLabel && notif.onActionAppId && (
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      openApp(notif.onActionAppId!);
                      setIsNotificationCenterOpen(false);
                      dismissNotification(notif.id);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[10px] transition-colors"
                  >
                    {notif.actionLabel}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500">
        <span>Samsung DeX Notification Hub</span>
        <span>{notifications.filter(n => n.unread).length} belum dibaca</span>
      </div>
    </div>
  );
};
