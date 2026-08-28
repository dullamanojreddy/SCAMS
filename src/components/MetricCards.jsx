import React from 'react';
import { ShoppingBag, HelpCircle, BookOpen, Briefcase, Bell, ArrowRight } from 'lucide-react';
import { METRIC_CARDS } from '../data/mockData';

export const MetricCards = ({ onCardClick }) => {
  const getMetricIcon = (iconName, color) => {
    switch (iconName) {
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5" style={{ color }} />;
      case 'Wrench':
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5" style={{ color }} />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" style={{ color }} />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5" style={{ color }} />;
      case 'Bell':
      default:
        return <Bell className="w-5 h-5" style={{ color }} />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {METRIC_CARDS.map((card) => {
        return (
          <div
            key={card.id}
            id={`metric-card-${card.id}`}
            onClick={() => onCardClick(card.id)}
            className="bg-white dark:bg-[#111111] border border-slate-200/90 dark:border-[#222222] rounded-3xl p-4 sm:p-5 flex items-center gap-4 hover:border-slate-300 dark:hover:border-[#333333] transition shadow-xs cursor-pointer group"
          >
            {/* Icon Container */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-[#282828] shrink-0 group-hover:scale-105 transition-transform">
              {getMetricIcon(card.icon, card.color)}
            </div>

            {/* Metric Content */}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-slate-500 dark:text-neutral-400 truncate">
                {card.title}
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-outfit mt-0.5 tracking-tight">
                {card.value}
              </div>
              <div
                className="text-xs font-semibold mt-0.5 flex items-center gap-1 transition-transform group-hover:translate-x-0.5"
                style={{ color: card.color }}
              >
                <span>{card.linkText}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
