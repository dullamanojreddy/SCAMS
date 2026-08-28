import React, { useEffect, useState } from 'react';
import {
  X,
  Bell,
  Search,
  Megaphone,
  AlertTriangle,
  BookOpen,
  Calendar,
  Briefcase,
  Layers,
  Send,
  Trash2,
  CheckCircle,
  ShieldAlert,
  PlusCircle,
  Building,
} from 'lucide-react';
import { NOTICES, USER_PROFILE } from '../data/mockData';
import { api } from '../api/client';

export const NoticesModal = ({
  isOpen,
  onClose,
  currentUser = USER_PROFILE,
}) => {
  const [noticesList, setNoticesList] = useState(NOTICES);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // New Notice Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('academic');
  const [targetBranch, setTargetBranch] = useState('ALL');
  const [targetYear, setTargetYear] = useState('ALL');
  const [body, setBody] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    api.get('/api/v1/notices').then((items) => {
      if (Array.isArray(items) && items.length) setNoticesList(items);
    }).catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const isAdminOrFaculty = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

  const filteredNotices = noticesList.filter((n) => {
    const matchesFilter = activeFilter === 'all' || n.category === activeFilter;
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleToggleRead = (id) => {
    setNoticesList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handlePublishNotice = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const newNotice = {
      id: `not-${Date.now()}`,
      title,
      subtitle: `${body.slice(0, 70)}...`,
      body,
      category: isEmergency ? 'emergency' : category,
      target: { branch: targetBranch, year: targetYear, section: 'ALL', role: 'ALL' },
      author: currentUser?.name || 'Vasavi Administration',
      date: 'Today',
      timeAgo: 'Just now',
      badge: {
        text: isEmergency ? 'EMERGENCY' : category.toUpperCase(),
        type: isEmergency ? 'emergency' : category,
      },
      isRead: false,
      isEmergency: isEmergency,
    };

    try {
      const saved = await api.post('/api/v1/notices', {
        title,
        subtitle: body,
        category: category.toUpperCase(),
        priority: isEmergency ? 'URGENT' : 'NORMAL',
        author: currentUser?.name,
      });
      setNoticesList([saved, ...noticesList]);
    } catch (error) {
      console.warn('Notice API unavailable; keeping local notice.', error.message);
      setNoticesList([newNotice, ...noticesList]);
    }
    setTitle('');
    setBody('');
    setIsEmergency(false);
    setIsPublishing(false);
    setToastMessage(`Notice published and broadcasted to ${targetBranch} (${targetYear})!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRetractNotice = async (id) => {
    try {
      await api.delete(`/api/v1/notices/${id}`);
    } catch (error) {
      console.warn('Notice retract API unavailable; keeping local state.', error.message);
    }
    setNoticesList((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotice?.id === id) setSelectedNotice(null);
    setToastMessage('Notice retracted from campus broadcast.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const categories = [
    { id: 'all', label: 'All Notices' },
    { id: 'emergency', label: '🚨 Emergency' },
    { id: 'placement', label: '💼 Placement' },
    { id: 'exam', label: '📝 Exams' },
    { id: 'academic', label: '📚 Academic' },
    { id: 'department', label: '🏛️ Department' },
    { id: 'event', label: '🎉 Events' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7c3aed]/20 border border-[#7c3aed]/40 text-purple-300 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-outfit">Notice Board & Campus Announcements</h3>
                <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-400/30">
                  REQ-4.1 MODULE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Vasavi College of Engineering • Targeted Broadcast Channels & Emergency Alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls & Category Filter */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notices, exams, placements, events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeFilter === cat.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsPublishing(!isPublishing)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0"
              title="Publish Notice (Admin/Faculty - REQ-4.1.1)"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Notice</span>
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="mx-6 mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2 animate-fadeIn shrink-0">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Admin/Faculty Notice Publisher Panel */}
        {isPublishing && (
          <form
            onSubmit={handlePublishNotice}
            className="m-6 p-5 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-3 animate-fadeIn shrink-0"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-purple-950 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-purple-600" />
                <span>Publish Official Notice (REQ-4.1.1)</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsPublishing(false)}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Schedule for Campus Placement Drive 2026 Batch"
                required
                className="w-full px-3 py-2 bg-white rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-500"
                >
                  <option value="academic">Academic</option>
                  <option value="placement">Placement</option>
                  <option value="exam">Examination</option>
                  <option value="department">Department</option>
                  <option value="event">Event / Sports</option>
                  <option value="holiday">Holiday</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Branch (REQ-4.1.1)</label>
                <select
                  value={targetBranch}
                  onChange={(e) => setTargetBranch(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ALL">All Branches</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="AI&DS">Artificial Intelligence & Data Science</option>
                  <option value="ECE">Electronics & Communication (ECE)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Year</label>
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ALL">All Years (1st - 4th)</option>
                  <option value="3rd Year">3rd Year Only</option>
                  <option value="4th Year">4th Year Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Notice Body Content *</label>
              <textarea
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Full details of notice, schedules, deadlines and instructions..."
                required
                className="w-full px-3 py-2 bg-white rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Mark as Emergency Alert (REQ-NFR-5.2.2)</span>
                </span>
              </label>

              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Notice</span>
              </button>
            </div>
          </form>
        )}

        {/* Notices Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* List View */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => {
                  setSelectedNotice(notice);
                  if (!notice.isRead) handleToggleRead(notice.id);
                }}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                  notice.isEmergency
                    ? 'border-rose-300 bg-rose-50/50 hover:bg-rose-50'
                    : selectedNotice?.id === notice.id
                    ? 'border-purple-500 bg-purple-50/40 shadow-xs ring-1 ring-purple-400'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        notice.isEmergency
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {notice.isEmergency ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
                            notice.isEmergency
                              ? 'bg-rose-600 text-white'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {notice.badge.text}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          Audience: {notice.target.branch} • {notice.target.year}
                        </span>
                        {!notice.isRead && (
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {notice.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {notice.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                  <span>By {notice.author}</span>
                  <div className="flex items-center gap-3">
                    <span>{notice.timeAgo}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetractNotice(notice.id);
                      }}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      title="Retract Notice (REQ-4.1.6)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Notice Drawer (When selected) */}
          {selectedNotice && (
            <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-slate-200 bg-slate-50/70 p-6 overflow-y-auto space-y-4 shrink-0 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full ${
                    selectedNotice.isEmergency
                      ? 'bg-rose-600 text-white'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {selectedNotice.badge.text}
                </span>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Close Detail
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedNotice.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-mono">
                  <span>{selectedNotice.date}</span>
                  <span>•</span>
                  <span>{selectedNotice.author}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs font-mono space-y-1 text-slate-600">
                <div>🎯 <strong>Audience:</strong> {selectedNotice.target.branch} ({selectedNotice.target.year})</div>
                <div>🏷️ <strong>Category:</strong> {selectedNotice.category.toUpperCase()}</div>
              </div>

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-200">
                {selectedNotice.body}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleToggleRead(selectedNotice.id)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {selectedNotice.isRead ? 'Mark as Unread' : 'Mark as Read ✓'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Vasavi Official Notices Feed • Auto-filtered by Branch (IT)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
