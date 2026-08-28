import React from 'react';
import {
  UtensilsCrossed,
  Map,
  HelpCircle,
  Bell,
  BookOpen,
  MessageSquare,
  Briefcase,
  QrCode,
} from 'lucide-react';

export const QuickActionsCard = ({
  onActionClick,
}) => {
  const actions = [
    {
      id: 'food',
      title: 'Order Food',
      subtitle: 'Advance pickup slots',
      icon: UtensilsCrossed,
      bgStyle: 'bg-[#fef9ee] dark:bg-[#171510]',
      iconBg: 'bg-white dark:bg-[#201d16]',
      iconColor: 'text-[#f59e0b] dark:text-amber-400',
      hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-600/60',
    },
    {
      id: 'map',
      title: 'Campus Map',
      subtitle: 'Indoor turn-by-turn',
      icon: Map,
      bgStyle: 'bg-[#f0fdf4] dark:bg-[#0f1712]',
      iconBg: 'bg-white dark:bg-[#16221a]',
      iconColor: 'text-[#10b981] dark:text-emerald-400',
      hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-600/60',
    },
    {
      id: 'library',
      title: 'Library',
      subtitle: 'Catalog & book dues',
      icon: BookOpen,
      bgStyle: 'bg-[#eff6ff] dark:bg-[#10151c]',
      iconBg: 'bg-white dark:bg-[#171f2b]',
      iconColor: 'text-[#2563eb] dark:text-blue-400',
      hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-600/60',
    },
    {
      id: 'placements',
      title: 'Placements',
      subtitle: 'Companies & Q-Bank',
      icon: Briefcase,
      bgStyle: 'bg-[#f5f3ff] dark:bg-[#16121f]',
      iconBg: 'bg-white dark:bg-[#221b30]',
      iconColor: 'text-[#7c3aed] dark:text-purple-400',
      hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-600/60',
    },
    {
      id: 'community',
      title: 'Seniors',
      subtitle: 'Verified peer advice',
      icon: MessageSquare,
      bgStyle: 'bg-[#fdf2f8] dark:bg-[#1a1117]',
      iconBg: 'bg-white dark:bg-[#261821]',
      iconColor: 'text-[#db2777] dark:text-pink-400',
      hoverBorder: 'hover:border-pink-300 dark:hover:border-pink-600/60',
    },
    {
      id: 'complaints',
      title: 'Helpdesk & FAQ',
      subtitle: '4-stage resolution',
      icon: HelpCircle,
      bgStyle: 'bg-[#fff1f2] dark:bg-[#1a1012]',
      iconBg: 'bg-white dark:bg-[#26171a]',
      iconColor: 'text-[#e11d48] dark:text-rose-400',
      hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-600/60',
    },
    {
      id: 'notices',
      title: 'Notices',
      subtitle: 'Targeted broadcasts',
      icon: Bell,
      bgStyle: 'bg-[#faf5ff] dark:bg-[#16121f]',
      iconBg: 'bg-white dark:bg-[#221b30]',
      iconColor: 'text-[#9333ea] dark:text-purple-400',
      hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-600/60',
    },
    {
      id: 'student-id',
      title: 'Smart ID',
      subtitle: 'Digital NFC pass',
      icon: QrCode,
      bgStyle: 'bg-[#ecfdf5] dark:bg-[#0f1712]',
      iconBg: 'bg-white dark:bg-[#16221a]',
      iconColor: 'text-[#059669] dark:text-emerald-400',
      hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-600/60',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#111111] rounded-3xl p-5 border border-slate-200/90 dark:border-[#222222] shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">Quick Campus Modules</h3>
          <p className="text-xs text-slate-400 dark:text-neutral-400">1-Tap access to core SCAM services</p>
        </div>
        <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-[#1c1c1c] text-slate-600 dark:text-neutral-300 px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-[#2a2a2a]">
          8 SERVICES
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              id={`quick-action-${action.id}`}
              onClick={() => onActionClick(action.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl border border-slate-100/90 dark:border-[#222222] ${action.bgStyle} ${action.hoverBorder} transition-all duration-150 active:scale-95 text-left cursor-pointer group hover:shadow-xs`}
            >
              <div className={`w-8 h-8 rounded-xl ${action.iconBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform border border-slate-100/80 dark:border-[#2a2a2a]`}>
                <Icon className={`w-4 h-4 ${action.iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-neutral-100 leading-tight truncate">
                  {action.title}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-neutral-400 truncate mt-0.5 font-medium">
                  {action.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
