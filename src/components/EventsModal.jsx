import React, { useState } from 'react';
import { X, CalendarDays, MapPin, Users, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UPCOMING_EVENTS } from '../data/mockData';

export const EventsModal = ({
  isOpen,
  onClose,
}) => {
  const [rsvpList, setRsvpList] = useState({});

  if (!isOpen) return null;

  const handleRsvp = (id) => {
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.7 },
    });
    setRsvpList((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-pink-500 text-white flex items-center justify-center font-bold">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-outfit">
              Campus Events & Hackathons
            </h3>
            <p className="text-xs text-slate-500">
              Workshops, cultural festivals, and technical competitions
            </p>
          </div>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
          {UPCOMING_EVENTS.map((evt) => {
            const hasRsvp = rsvpList[evt.id];
            return (
              <div
                key={evt.id}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-pink-200 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-13 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-extrabold text-rose-500 tracking-wider">
                      {evt.month}
                    </span>
                    <span className="text-lg font-extrabold text-slate-900 font-outfit leading-none mt-0.5">
                      {evt.day}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {evt.category || 'General'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {evt.subtitle}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>
                        {evt.location} • {evt.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="self-end sm:self-center">
                  <button
                    onClick={() => handleRsvp(evt.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      hasRsvp
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-[#7c3aed] text-white hover:bg-[#6d28d9] shadow-sm'
                    }`}
                  >
                    {hasRsvp ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Registered</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-3.5 h-3.5" />
                        <span>RSVP / Join</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
