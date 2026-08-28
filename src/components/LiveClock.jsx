import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

export const LiveClock = ({ variant = 'full', className = '' }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  if (variant === 'compact') {
    return (
      <div
        id="live-clock-compact"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-[#222222] text-slate-800 dark:text-neutral-100 shadow-sm ${className}`}
        title={`Live Campus Clock: ${time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-mono text-xs font-bold tracking-tight">
          {formatTime(time)}
        </span>
      </div>
    );
  }

  return (
    <div
      id="live-clock-widget"
      className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-[#222222] shadow-sm text-slate-800 dark:text-neutral-100 transition-colors ${className}`}
      title={`Live Campus Clock: ${time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
    >
      <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-[#1c1c1c] border border-purple-100 dark:border-[#2a2a2a] flex items-center justify-center text-[#7c3aed] dark:text-purple-400 shrink-0">
        <Clock className="w-4 h-4" />
      </div>

      <div className="leading-tight pr-1">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-extrabold tracking-tight text-slate-900 dark:text-white">
            {formatTime(time)}
          </span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
        </div>

        <div className="text-[10px] font-medium text-slate-400 dark:text-neutral-400 flex items-center gap-1">
          <Calendar className="w-2.5 h-2.5 inline" />
          <span>{formatDate(time)}</span>
        </div>
      </div>
    </div>
  );
};
