import React from 'react';
import {
  Home,
  Map,
  Bot,
  Utensils,
  MessageSquare,
  ShieldCheck,
  Bell,
  HelpCircle,
  UserCheck,
} from 'lucide-react';
import { canAccessFeature } from '../data/roleAccess';

export const MobileBottomNav = ({
  activeTab,
  currentUser,
  onSelectTab,
  onOpenAction,
}) => {
  const role = currentUser?.role || 'Student';
  const tabs = role === 'Admin'
    ? [
        { id: 'admin-console', label: 'Admin Center', icon: ShieldCheck, action: () => onOpenAction('admin-console') },
        { id: 'admin-emergency', label: 'Emergency', icon: Bell, action: () => onOpenAction('admin-emergency') },
        { id: 'admin-complaints', label: 'Complaints', icon: HelpCircle, action: () => onOpenAction('admin-complaints') },
      ]
    : role === 'Faculty'
      ? [
          { id: 'faculty-portal', label: 'Faculty Portal', icon: UserCheck, action: () => onOpenAction('faculty-portal') },
          { id: 'faculty-queries', label: 'Queries', icon: MessageSquare, action: () => onOpenAction('faculty-queries') },
          { id: 'faculty-notices', label: 'Notices', icon: Bell, action: () => onOpenAction('faculty-notices') },
        ]
      : [
          { id: 'home', label: 'Home', icon: Home, action: () => onSelectTab('home') },
          { id: 'map', label: 'Campus Map', icon: Map, action: () => onOpenAction('map') },
          { id: 'ai-assistant', label: 'Ask AI', icon: Bot, isCenter: true, action: () => onOpenAction('ai-assistant') },
          { id: 'food', label: 'Food', icon: Utensils, action: () => onOpenAction('food') },
          { id: 'community', label: 'Community', icon: MessageSquare, action: () => onOpenAction('community') },
        ];

  const visibleTabs = tabs.filter((tab) => tab.id === 'home' || canAccessFeature(role, tab.id));

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c0c0c]/95 backdrop-blur-md border-t border-slate-200/90 dark:border-[#222222] px-3 py-2 shadow-lg transition-colors">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                id="mobile-nav-ai"
                onClick={tab.action}
                className="relative -top-4 flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7c3aed] to-[#9061f9] text-white flex items-center justify-center shadow-lg shadow-purple-500/30 active:scale-95 transition-transform">
                  <Bot className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 mt-0.5">
                  Ask AI
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              id={`mobile-nav-${tab.id}`}
              onClick={tab.action}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#7c3aed] dark:text-[#c4f428] font-bold'
                  : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
