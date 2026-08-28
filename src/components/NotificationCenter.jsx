import React, { useEffect, useState } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { api } from '../api/client';

export function NotificationCenter({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (!isOpen) return;
    api.get('/api/v1/notifications').then(setNotifications).catch(() => {});
  }, [isOpen]);
  if (!isOpen) return null;
  const markRead = async (id) => {
    await api.post(`/api/v1/notifications/${id}/read`, {});
    setNotifications((items) => items.map((item) => item.id === id ? { ...item, read: true } : item));
  };
  const markAll = async () => {
    await api.post('/api/v1/notifications/read-all', {});
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
  };
  return <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-slate-900/30" onClick={onClose}>
    <section className="mt-14 w-full max-w-md max-h-[75vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200" onClick={(event) => event.stopPropagation()}>
      <header className="flex items-center justify-between p-4 border-b border-slate-100">
        <div className="flex items-center gap-2"><Bell className="w-5 h-5 text-purple-600" /><h2 className="font-bold text-slate-900">Notifications</h2></div>
        <div className="flex items-center gap-2"><button onClick={markAll} title="Mark all as read" className="p-2 text-slate-500 hover:text-purple-600"><CheckCheck className="w-4 h-4" /></button><button onClick={onClose} title="Close" className="p-2 text-slate-500 hover:text-slate-900"><X className="w-4 h-4" /></button></div>
      </header>
      <div className="overflow-y-auto max-h-[calc(75vh-65px)] divide-y divide-slate-100">
        {!notifications.length && <p className="p-8 text-center text-sm text-slate-500">No notifications yet.</p>}
        {notifications.map((item) => <button key={item.id} onClick={() => markRead(item.id)} className={`w-full text-left p-4 hover:bg-slate-50 ${item.read ? '' : 'bg-purple-50/60'}`}><div className="flex gap-3"><div className={`mt-1 w-2 h-2 rounded-full ${item.read ? 'bg-slate-300' : 'bg-purple-600'}`} /><div className="flex-1"><p className="font-semibold text-sm text-slate-900">{item.title}</p><p className="mt-1 text-xs text-slate-600">{item.message}</p><p className="mt-2 text-[10px] text-slate-400">{new Date(item.createdAt || item.created_at).toLocaleString()}</p></div>{item.read && <Check className="w-4 h-4 text-emerald-500" />}</div></button>)}
      </div>
    </section>
  </div>;
}