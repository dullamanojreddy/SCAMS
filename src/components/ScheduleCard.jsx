import React from 'react';
import { MapPin } from 'lucide-react';
import { TODAY_SCHEDULE } from '../data/mockData';

export const ScheduleCard = ({
  onViewTimetable,
  onSelectClass,
}) => {
  const getColorBar = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500 shadow-xs shadow-blue-500/30';
      case 'emerald':
        return 'bg-emerald-500 shadow-xs shadow-emerald-500/30';
      case 'lime':
        return 'bg-lime-500 shadow-xs shadow-lime-500/30';
      case 'purple':
        return 'bg-purple-500 shadow-xs shadow-purple-500/30';
      case 'rose':
        return 'bg-rose-500 shadow-xs shadow-rose-500/30';
      default:
        return 'bg-indigo-500 shadow-xs shadow-indigo-500/30';
    }
  };

  return (
    <div className="bg-white dark:bg-[#111111] rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-[#222222] shadow-xs flex flex-col h-full overflow-hidden transition-colors">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h2 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
          Today's Schedule
        </h2>
        <button
          id="btn-view-timetable"
          onClick={onViewTimetable}
          className="text-xs font-semibold text-[#7c3aed] dark:text-purple-400 hover:text-[#6d28d9] dark:hover:text-purple-300 transition cursor-pointer"
        >
          View Timetable
        </button>
      </div>

      {/* Schedule Items with Smooth Internal Scroll */}
      <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
        {TODAY_SCHEDULE.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => onSelectClass?.(item)}
              className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50/90 dark:hover:bg-[#181818] p-2 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-[#262626] transition"
            >
              {/* Colored Indicator Line */}
              <div
                className={`w-1.5 h-8 rounded-full shrink-0 ${getColorBar(
                  item.color
                )}`}
              />

              {/* Time Column */}
              <div className="w-16 shrink-0 text-xs font-semibold text-slate-800 dark:text-neutral-200 font-mono">
                {item.time}
              </div>

              {/* Subject & Location Column */}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-neutral-100 truncate group-hover:text-purple-700 dark:group-hover:text-purple-300 transition">
                  {item.subject}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-neutral-500 mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0 text-slate-400 dark:text-neutral-500" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
