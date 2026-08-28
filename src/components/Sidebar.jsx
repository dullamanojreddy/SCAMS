import React from 'react';
import {
  Home,
  Utensils,
  Map,
  Bell,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Briefcase,
  QrCode,
  LogOut,
  ShieldCheck,
  UserCheck,
  Building2,
  Sun,
  Moon,
  FileText,
} from 'lucide-react';
import { USER_PROFILE, INSTITUTION } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export const Sidebar = ({
  activeTab,
  onSelectTab,
  onOpenIdModal,
  onOpenActionModal,
  onOpenSRS,
  onLogout,
  currentUser = USER_PROFILE,
  isOpen = false,
  onClose,
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const profile = currentUser || USER_PROFILE;

  const getNavItems = () => {
    if (profile?.role === 'Admin') {
      return [
        { id: 'admin-console', label: 'Admin Control Center', icon: ShieldCheck, badge: 'Full Access' },
        { id: 'admin-users', label: '1. User & Senior Verification', icon: UserCheck },
        { id: 'admin-emergency', label: '2. Emergency Broadcast', icon: Bell, badge: 'Admin Only' },
        { id: 'admin-complaints', label: '3. Complaints Lifecycle', icon: HelpCircle },
        { id: 'admin-canteen', label: '4. Canteen & Menu Pricing', icon: Utensils },
        { id: 'admin-library', label: '5. Library Catalog Stock', icon: BookOpen },
        { id: 'admin-moderation', label: '6. Community Moderation', icon: ShieldCheck },
        { id: 'admin-placements', label: '7. Placements & Q-Bank', icon: Briefcase },
        { id: 'admin-audit', label: '8. Student Data & Audit', icon: FileText },
      ];
    } else if (profile?.role === 'Faculty') {
      return [
        { id: 'faculty-portal', label: 'Faculty Academic Portal', icon: UserCheck, badge: 'Dept IT' },
        { id: 'faculty-queries', label: 'Student Course Queries', icon: MessageSquare, badge: '2 Pending' },
        { id: 'faculty-notices', label: 'Academic & Lab Notices', icon: Bell },
      ];
    }

    return [
      { id: 'home', label: 'Home Dashboard', icon: Home },
      { id: 'notices', label: 'Notices & Bulletins', icon: Bell, badge: 3 },
      { id: 'map', label: 'Smart Campus Map', icon: Map },
      { id: 'food', label: 'Canteen & Food', icon: Utensils },
      { id: 'library', label: 'Central Library', icon: BookOpen },
      { id: 'community', label: 'Senior Community', icon: MessageSquare, badge: 'New' },
      { id: 'placements', label: 'Placements & Resumes', icon: Briefcase },
      { id: 'complaints', label: 'Complaints & FAQ', icon: HelpCircle },
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-10 h-screen w-64 bg-[#0a0a0a] text-white flex flex-col justify-between shrink-0 px-4 py-5 select-none border-r border-[#1e1e1e] transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } overflow-y-auto`}
      >
        {/* Brand Header */}
        <div>
          <div
            className="flex items-center gap-3 px-2 mb-6 cursor-pointer"
            onClick={() => onSelectTab('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-[#c4f428] flex items-center justify-center shadow-lg shadow-[#c4f428]/20 shrink-0">
              <Building2 className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="font-extrabold tracking-wider text-base text-white leading-tight font-outfit">
                SCAM v1.0
              </div>
              <div className="text-[10px] font-bold text-[#c4f428] tracking-widest uppercase">
                VASAVI CAMPUS
              </div>
            </div>
          </div>

          {/* Navigation List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (item.id === 'srs') {
                      onOpenSRS();
                    } else if (item.id !== 'home') {
                      onOpenActionModal(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer ${
                    isActive
                      ? 'bg-[#c4f428] text-black font-bold shadow-md shadow-[#c4f428]/15'
                      : 'text-neutral-300 hover:text-white hover:bg-[#161616]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition ${
                        isActive
                          ? 'text-black'
                          : 'text-neutral-400 group-hover:text-white'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-black text-[#c4f428]'
                          : 'bg-[#1a1a1a] text-neutral-300 group-hover:bg-[#c4f428]/20 group-hover:text-[#c4f428]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Smart ID Action */}
        <div className="space-y-2.5 pt-4 border-t border-[#1e1e1e]">
          {/* Quick Theme Toggle Strip */}
          <button
            id="btn-sidebar-theme-toggle"
            onClick={toggleTheme}
            className="w-full px-3 py-2 rounded-xl bg-[#121212] hover:bg-[#1a1a1a] border border-[#222222] text-xs font-medium text-neutral-300 hover:text-white flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {isDark ? (
                <Moon className="w-3.5 h-3.5 text-purple-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>Theme: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#1f1f1f] text-neutral-300">
              {isDark ? 'ON' : 'OFF'}
            </span>
          </button>

          <div
            id="sidebar-user-card"
            onClick={profile.role === 'Student' ? onOpenIdModal : undefined}
            className="p-3 rounded-2xl bg-[#121212] border border-[#222222] hover:border-[#333333] transition cursor-pointer flex items-center gap-3 group"
          >
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'}
              alt={profile.name}
              className="w-10 h-10 rounded-xl object-cover border border-[#262626] shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                <span>{profile.name}</span>
                {profile.isVerifiedSenior && (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )}
              </div>
              <div className="text-[10px] font-mono text-neutral-400 truncate">
                {profile.rollNo || '1602-24-737-152'}
              </div>
              <div className="text-[10px] text-[#c4f428] font-mono font-bold mt-0.5 flex items-center justify-between">
                <span>{profile.role || 'Student'}</span>
                <span>{profile.campusPoints || 450} Pts</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
              {profile.role === 'Student' && (
                <button
                  id="btn-sidebar-view-id"
                  onClick={onOpenIdModal}
                  className="flex-1 py-2 rounded-xl bg-[#161616] hover:bg-[#222222] border border-[#262626] text-neutral-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#c4f428]" />
                  <span>Smart ID</span>
                </button>
              )}

            <button
              id="btn-sidebar-logout"
              onClick={onLogout}
              className="p-2 rounded-xl bg-[#161616] hover:bg-rose-950/60 hover:text-rose-400 border border-[#262626] text-neutral-400 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
