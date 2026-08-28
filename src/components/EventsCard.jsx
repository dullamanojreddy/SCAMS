import React from 'react';
import { MapPin } from 'lucide-react';
import { UPCOMING_EVENTS } from '../data/mockData';

export const EventsCard = ({
  onViewAll,
  onSelectEvent,
}) => {
  const displayEvents = UPCOMING_EVENTS.slice(0, 2);

  return (
    <div className="bg-white dark:bg-[#111111] rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-[#222222] shadow-xs flex flex-col justify-between h-full overflow-hidden transition-colors">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
            Upcoming Events
          </h2>
          <button
            id="btn-view-all-events"
            onClick={onViewAll}
            className="text-xs font-semibold text-[#7c3aed] dark:text-purple-400 hover:text-[#6d28d9] dark:hover:text-purple-300 transition cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-2.5">
          {displayEvents.map((evt) => {
            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent?.(evt)}
                className="flex items-center gap-3 p-2 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-[#262626] hover:bg-slate-50/90 dark:hover:bg-[#181818] transition cursor-pointer group"
              >
                {/* Date Box */}
                <div className="w-11 h-12 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 flex flex-col items-center justify-center shrink-0 shadow-2xs">
                  <span className="text-[9px] font-extrabold text-rose-500 dark:text-rose-400 tracking-wider">
                    {evt.month}
                  </span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white leading-none mt-0.5 font-outfit">
                    {evt.day}
                  </span>
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-neutral-100 truncate group-hover:text-purple-700 dark:group-hover:text-purple-300 transition">
                    {evt.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate mt-0.5">
                    {evt.subtitle}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-neutral-500 mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0 text-slate-400 dark:text-neutral-500" />
                    <span className="truncate">
                      {evt.location} • {evt.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
