import React, { useEffect, useState } from 'react';
import { CalendarDays, X } from 'lucide-react';
import { api } from '../api/client';

export function BookingModal({ isOpen, onClose }) {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [resourceId, setResourceId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slot, setSlot] = useState({ start: '10:00', end: '12:00' });
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!isOpen) return;
    Promise.all([api.get('/api/v1/bookings/resources'), api.get('/api/v1/bookings/me')]).then(([available, mine]) => { setResources(available); setBookings(mine); setResourceId(available[0]?.id || ''); }).catch(() => {});
  }, [isOpen]);
  if (!isOpen) return null;
  const reserve = async (event) => { event.preventDefault(); try { const saved = await api.post('/api/v1/bookings', { resourceId, date, startTime: slot.start, endTime: slot.end }); setBookings((items) => [saved, ...items]); setMessage('Booking confirmed.'); } catch (error) { setMessage(error.message); } };
  const cancel = async (id) => { try { const updated = await api.post(`/api/v1/bookings/${id}/cancel`, {}); setBookings((items) => items.map((item) => item.id === id ? updated : item)); } catch (error) { setMessage(error.message); } };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60"><div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"><header className="flex items-center justify-between p-5 bg-slate-900 text-white"><div className="flex items-center gap-2"><CalendarDays className="w-5 h-5" /><h2 className="font-bold">Campus Bookings</h2></div><button onClick={onClose} title="Close"><X className="w-5 h-5" /></button></header><form onSubmit={reserve} className="p-5 space-y-3"><select required value={resourceId} onChange={(event) => setResourceId(event.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-sm">{resources.map((resource) => <option key={resource.id} value={resource.id}>{resource.name} · {resource.type}</option>)}</select><input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-xl border border-slate-200 p-2 text-sm" /><div className="grid grid-cols-2 gap-2"><input type="time" value={slot.start} onChange={(event) => setSlot({ ...slot, start: event.target.value })} className="rounded-xl border border-slate-200 p-2 text-sm" /><input type="time" value={slot.end} onChange={(event) => setSlot({ ...slot, end: event.target.value })} className="rounded-xl border border-slate-200 p-2 text-sm" /></div><button className="w-full rounded-xl bg-purple-600 p-2.5 text-sm font-bold text-white">Reserve Resource</button>{message && <p className="text-xs text-slate-600">{message}</p>}</form><div className="border-t border-slate-100 p-5"><h3 className="mb-3 text-sm font-bold text-slate-900">My reservations</h3>{bookings.map((booking) => <div key={booking.id} className="flex items-center justify-between border-b border-slate-100 py-2 text-xs"><span>{booking.resourceName || booking.resourceId} · {booking.date} · {booking.startTime}-{booking.endTime}</span>{booking.status === 'CONFIRMED' && <button onClick={() => cancel(booking.id)} className="text-rose-600">Cancel</button>}</div>)}</div></div></div>;
}