import React, { useEffect, useState } from 'react';
import { ShoppingBag, HelpCircle, BookOpen, Briefcase, Bell, ArrowRight } from 'lucide-react';
import { METRIC_CARDS } from '../data/mockData';
import { api } from '../api/client';

export const MetricCards = ({ onCardClick }) => {
  const [cards, setCards] = useState(METRIC_CARDS);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      api.get('/api/v1/notices'),
      api.get('/api/v1/complaints'),
      api.get('/api/v1/events'),
      api.get('/api/v1/library'),
      api.get('/api/v1/placements'),
      api.get('/api/v1/orders/me'),
    ]).then(([notices, complaints, events, library, placements, orders]) => {
      if (!active) return;
      setCards((prev) => prev.map((card) => {
        if (card.id === 'metric-4' && notices.status === 'fulfilled') {
          return { ...card, value: Array.isArray(notices.value) ? notices.value.length : card.value };
        }
        if ((card.id === 'metric-2' || card.id === 'metric-complaints') && complaints.status === 'fulfilled') {
          return { ...card, value: Array.isArray(complaints.value) ? complaints.value.length : card.value };
        }
        if (card.id === 'metric-3' && events.status === 'fulfilled') {
          return { ...card, value: Array.isArray(events.value) ? events.value.length : card.value };
        }
        if (card.id === 'metric-library' && library.status === 'fulfilled') {
          return { ...card, value: Array.isArray(library.value) ? library.value.length : card.value };
        }
        if (card.id === 'metric-placements' && placements.status === 'fulfilled') {
          const companyCount = Array.isArray(placements.value?.companies) ? placements.value.companies.length : card.value;
          return { ...card, value: companyCount };
        }
        if ((card.id === 'metric-1' || card.id === 'metric-food') && orders.status === 'fulfilled') {
          return { ...card, value: Array.isArray(orders.value) ? orders.value.length : card.value };
        }
        return card;
      }));
    }).catch(() => {});
    return () => { active = false; };
  }, []);

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
      {cards.map((card) => (
        <div
          key={card.id}
          id={`metric-card-${card.id}`}
          onClick={() => onCardClick(card.id)}
          className="bg-white dark:bg-[#111111] border border-slate-200/90 dark:border-[#222222] rounded-3xl p-4 sm:p-5 flex items-center gap-4 hover:border-slate-300 dark:hover:border-[#333333] transition shadow-xs cursor-pointer group"
        >
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-[#282828] shrink-0 group-hover:scale-105 transition-transform">
            {getMetricIcon(card.icon, card.color)}
          </div>

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
      ))}
    </div>
  );
};
