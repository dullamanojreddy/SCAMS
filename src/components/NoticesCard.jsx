import React, { useEffect, useState } from 'react';
import { Megaphone, AlertTriangle, ArrowRight, Bell } from 'lucide-react';
import { NOTICES } from '../data/mockData';
import { api } from '../api/client';

export const NoticesCard = ({
  onViewAll,
  onSelectNotice,
}) => {
  const [displayNotices, setDisplayNotices] = useState(NOTICES.slice(0, 3));

  useEffect(() => {
    let active = true;
    api.get('/api/v1/notices')
      .then((items) => {
        if (!active || !Array.isArray(items) || !items.length) return;
        setDisplayNotices(items.slice(0, 3).map((item) => ({
          ...item,
          subtitle: item.subtitle || item.body || item.content || '',
          target: item.target || {
            branch: item.targetBranch || 'ALL',
            year: item.targetYear || 'ALL',
          },
          badge: item.badge || {
            text: item.badgeText || item.category || 'NOTICE',
            type: item.badgeType || item.category?.toLowerCase() || 'general',
          },
        })));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <div className="bg-white dark:bg-[#111111] rounded-3xl p-5 border border-slate-200/80 dark:border-[#222222] shadow-xs flex flex-col justify-between h-full overflow-hidden transition-colors">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
              Notices & Bulletins
            </h2>
          </div>
          <button
            id="btn-view-all-notices"
            onClick={onViewAll}
            className="text-xs font-bold text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 transition cursor-pointer"
          >
            View All ({displayNotices.length})
          </button>
        </div>

        {/* Notices List */}
        <div className="space-y-2.5">
          {displayNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => onSelectNotice ? onSelectNotice(notice) : onViewAll()}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group ${
                notice.isEmergency
                  ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/60 dark:bg-[#1a0f11] hover:bg-rose-50 dark:hover:bg-[#221316]'
                  : 'border-slate-100 dark:border-[#222222] hover:border-purple-200 dark:hover:border-[#333333] bg-slate-50/70 dark:bg-[#161616] hover:bg-white dark:hover:bg-[#1c1c1c]'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  notice.isEmergency
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-purple-100 dark:bg-[#221733] text-purple-700 dark:text-purple-300'
                }`}
              >
                {notice.isEmergency ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Megaphone className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span
                    className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded ${
                      notice.isEmergency
                        ? 'bg-rose-600 text-white'
                        : 'bg-purple-200 dark:bg-purple-950/70 text-purple-900 dark:text-purple-200'
                    }`}
                  >
                    {notice.badge.text}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
                    {notice.target.branch}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-neutral-100 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition truncate">
                  {notice.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                  {notice.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-[#222222] flex items-center justify-between text-xs text-slate-400 dark:text-neutral-500">
        <span className="text-[11px] font-mono">Channel: IT Dept & Placements</span>
        <button
          onClick={onViewAll}
          className="font-bold text-slate-700 dark:text-neutral-300 hover:text-purple-700 dark:hover:text-purple-400 flex items-center gap-1 cursor-pointer"
        >
          <span>Open Board</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
