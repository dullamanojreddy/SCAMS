import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Scan,
  CloudSun,
  Menu,
  UserCheck,
  Shield,
  GraduationCap,
  Sun,
  Moon,
  FileText,
} from 'lucide-react';
import { USER_ROLES } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import { LiveClock } from './LiveClock';

export const Header = ({
  currentUser,
  onSearchChange,
  onOpenNotifications,
  onOpenScanner,
  onOpenSRS,
  onToggleSidebar,
  onSwitchRole,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const [greeting, setGreeting] = useState('Good morning');
  const [greetingEmoji, setGreetingEmoji] = useState('👋');

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Manoj';

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Good morning');
        setGreetingEmoji('🌅');
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good afternoon');
        setGreetingEmoji('☀️');
      } else if (hour >= 17 && hour < 21) {
        setGreeting('Good evening');
        setGreetingEmoji('🌇');
      } else {
        setGreeting('Good night');
        setGreetingEmoji('🌙');
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const roles = [
    {
      key: 'student',
      role: 'Student (Manoj Reddy)',
      icon: GraduationCap,
      roll: '1602-24-737-152',
      desc: 'Author 1 • IT 3rd Year',
    },
    {
      key: 'student_bhavesh',
      role: 'Student (Bhavesh Dharewa)',
      icon: GraduationCap,
      roll: '1602-24-737-134',
      desc: 'Author 2 • IT 3rd Year',
    },
    {
      key: 'faculty',
      role: 'Faculty (Mrs. S. Rajyalakshmi)',
      icon: UserCheck,
      roll: 'FAC-IT-108',
      desc: 'Asst. Prof & Class Coordinator',
    },
    {
      key: 'admin',
      role: 'Campus Admin (Dean)',
      icon: Shield,
      roll: 'ADM-VCE-001',
      desc: 'Academic & Admin Control',
    },
  ];

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      {/* Greeting Title & Mobile Menu Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Hamburger */}
          <button
            id="btn-mobile-sidebar-toggle"
            onClick={onToggleSidebar}
            className="lg:hidden w-10 h-10 rounded-xl bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-[#222222] flex items-center justify-center text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-[#1c1c1c] active:scale-95 shadow-sm transition cursor-pointer shrink-0"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white font-outfit tracking-tight flex items-center gap-2">
                <span>
                  {greeting}, {firstName}!
                </span>
                <span className="inline-block animate-wave origin-[70%_70%]">
                  {greetingEmoji}
                </span>
              </h1>
              <button
                onClick={onOpenSRS}
                className="text-[10px] font-mono font-bold bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-600 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/40 transition flex items-center gap-1 cursor-pointer"
                title="View Full SRS v1.0 Spec & Compliance Matrix"
              >
                <FileText className="w-3 h-3" />
                <span>SRS v1.0 (100% REQ PASS)</span>
              </button>
            </div>

            <p className="text-xs font-medium text-slate-500 dark:text-neutral-400 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>Vasavi College of Engineering</span>
              <span className="text-slate-300 dark:text-neutral-600">•</span>
              <span className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-100 dark:border-purple-900/40">
                {currentUser?.rollNo || currentUser?.facultyId || currentUser?.adminId || '1602-24-737-152'}
              </span>
            </p>
          </div>
        </div>

        {/* Mobile-only Quick Controls: Theme + Scanner */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            id="btn-theme-toggle-mobile"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-[#222222] flex items-center justify-center text-slate-700 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-[#1c1c1c] active:scale-95 shadow-sm transition cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            id="btn-header-scanner-mobile"
            onClick={onOpenScanner}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-[#222222] flex items-center justify-center text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-[#1c1c1c] active:scale-95 shadow-sm transition cursor-pointer"
            title="Scan QR / Student ID"
          >
            <Scan className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header Utilities */}
      <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
        {/* Live Clock Widget */}
        <LiveClock />

        {/* Dark / Light Mode Toggle Button */}
        <button
          id="btn-theme-toggle"
          onClick={toggleTheme}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-[#222222] text-xs font-bold text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-[#1c1c1c] shadow-sm transition active:scale-95 cursor-pointer shrink-0"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span className="hidden md:inline text-amber-300">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline text-slate-700">Dark</span>
            </>
          )}
        </button>

        {/* Role Switcher for Perspective Evaluation */}
        <div className="relative">
          <button
            id="btn-role-switcher"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="px-3 py-2 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-[#222222] flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-[#1c1c1c] shadow-sm transition cursor-pointer"
            title="Switch Perspective"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Role: {currentUser?.role || 'Student'}</span>
            <span className="text-slate-400 dark:text-neutral-500 text-[10px]">▼</span>
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#262626] rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-fadeIn">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 px-2 py-1 flex items-center justify-between">
                <span>Switch Perspective</span>
                <span className="text-[9px] font-mono text-emerald-500">RBAC ACTIVE</span>
              </div>
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected =
                  (r.key === 'student' && currentUser?.rollNo === '1602-24-737-152') ||
                  (r.key === 'student_bhavesh' && currentUser?.rollNo === '1602-24-737-134') ||
                  (r.key === 'faculty' && currentUser?.role === 'Faculty') ||
                  (r.key === 'admin' && currentUser?.role === 'Admin');

                return (
                  <button
                    key={r.key}
                    onClick={() => {
                      if (onSwitchRole) onSwitchRole(r.key);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl text-left text-xs transition flex items-start gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200 font-bold border border-purple-200/50 dark:border-purple-800/40'
                        : 'hover:bg-slate-100 dark:hover:bg-[#1e1e1e] text-slate-700 dark:text-neutral-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 mt-0.5 text-purple-600 dark:text-purple-400 shrink-0" />
                    <div>
                      <div className="font-bold">{r.role}</div>
                      <div className="text-[10px] text-slate-400 dark:text-neutral-400 font-mono">{r.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 min-w-[160px] sm:w-52 md:w-60">
          <Search className="w-4 h-4 text-slate-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="campus-search-input"
            type="text"
            placeholder="Search notices, labs, books..."
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-[#222222] text-xs sm:text-sm text-slate-800 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm transition-all"
          />
        </div>

        {/* Notification Bell Button */}
        <button
          id="btn-header-notifications"
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-[#222222] flex items-center justify-center text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-[#1c1c1c] active:scale-95 shadow-sm transition cursor-pointer shrink-0"
          title="Notifications & Notices"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#7c3aed] text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
            3
          </span>
        </button>

        {/* QR / ID Scanner Button */}
        <button
          id="btn-header-scanner"
          onClick={onOpenScanner}
          className="hidden md:flex w-10 h-10 rounded-full bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-[#222222] items-center justify-center text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-[#1c1c1c] active:scale-95 shadow-sm transition cursor-pointer shrink-0"
          title="Scan QR / Smart ID"
        >
          <Scan className="w-4 h-4" />
        </button>

        {/* Weather Widget */}
        <div className="hidden xl:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-[#121212] border border-slate-200/90 dark:border-[#222222] shadow-sm shrink-0">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-500">
            <CloudSun className="w-4 h-4" />
          </div>
          <div className="leading-tight pr-1">
            <div className="text-xs font-bold text-slate-900 dark:text-neutral-100">28°C</div>
            <div className="text-[10px] font-medium text-slate-400 dark:text-neutral-400">Hyderabad</div>
          </div>
        </div>
      </div>
    </header>
  );
};
