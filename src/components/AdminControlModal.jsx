import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Bell,
  AlertTriangle,
  HelpCircle,
  MapPin,
  Utensils,
  BookOpen,
  MessageSquare,
  UserCheck,
  Briefcase,
  Database,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Filter,
  Send,
  RefreshCw,
  Clock,
  QrCode,
  Sparkles,
} from 'lucide-react';
import {
  MOCK_ALL_USERS,
  MOCK_EMERGENCY_BROADCASTS,
  MOCK_REPORTED_COMMUNITY_CONTENT,
  MOCK_ADMIN_AUDIT_LOGS,
  NOTICES,
  COMPLAINTS,
  FOOD_ITEMS,
  LIBRARY_BOOKS,
  PLACEMENT_COMPANIES,
  INTERVIEW_QUESTIONS,
  CAMPUS_BUILDINGS,
  FAQS,
} from '../data/mockData';

export const AdminControlModal = ({ isOpen, onClose, initialTab = 'users' }) => {
  const [activeAdminTab, setActiveAdminTab] = useState(initialTab);
  const [usersList, setUsersList] = useState(MOCK_ALL_USERS);
  const [noticesList, setNoticesList] = useState(NOTICES);
  const [emergencyList, setEmergencyList] = useState(MOCK_EMERGENCY_BROADCASTS);
  const [complaintsList, setComplaintsList] = useState(COMPLAINTS);
  const [faqList, setFaqList] = useState(FAQS);
  const [menuList, setMenuList] = useState(FOOD_ITEMS);
  const [booksList, setBooksList] = useState(LIBRARY_BOOKS);
  const [reportedList, setReportedList] = useState(MOCK_REPORTED_COMMUNITY_CONTENT);
  const [companiesList, setCompaniesList] = useState(PLACEMENT_COMPANIES);
  const [interviewQuestionsList, setInterviewQuestionsList] = useState(INTERVIEW_QUESTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationSuccess, setNotificationSuccess] = useState(null);

  // Forms / Input States
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeBody, setNewNoticeBody] = useState('');
  const [newNoticeTarget, setNewNoticeTarget] = useState('All Students');
  const [newNoticeBranch, setNewNoticeBranch] = useState('All');
  const [newNoticeYear, setNewNoticeYear] = useState('All');

  const [newEmergTitle, setNewEmergTitle] = useState('');
  const [newEmergMsg, setNewEmergMsg] = useState('');

  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [newFaqCat, setNewFaqCat] = useState('Academic');

  if (!isOpen) return null;

  const showSuccess = (msg) => {
    setNotificationSuccess(msg);
    setTimeout(() => setNotificationSuccess(null), 3000);
  };

  // 1. User Management Actions
  const handleToggleSenior = (userId) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isVerifiedSenior: !u.isVerifiedSenior } : u))
    );
    showSuccess('Senior verification status updated successfully.');
  };

  const handleToggleUserStatus = (userId) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
      )
    );
    showSuccess('User account status updated.');
  };

  // 2. Notice Management Actions
  const handleCreateNotice = (e) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeBody) return;
    const item = {
      id: `NOTICE-ADM-${Date.now()}`,
      title: newNoticeTitle,
      body: newNoticeBody,
      content: newNoticeBody,
      category: 'Official Admin Notice',
      date: 'Just now',
      priority: 'high',
      department: `Target: ${newNoticeBranch} - ${newNoticeYear}`,
      read: false,
    };
    setNoticesList([item, ...noticesList]);
    setNewNoticeTitle('');
    setNewNoticeBody('');
    showSuccess('Notice published & targeted to students.');
  };

  const handleRetractNotice = (noticeId) => {
    setNoticesList((prev) => prev.filter((n) => n.id !== noticeId));
    showSuccess('Notice retracted from student feed.');
  };

  // 3. Emergency Notifications Actions
  const handleCreateEmergency = (e) => {
    e.preventDefault();
    if (!newEmergTitle || !newEmergMsg) return;
    const em = {
      id: `EMERG-${Date.now()}`,
      title: newEmergTitle,
      message: newEmergMsg,
      publishedBy: 'Campus Administrator (Dean Office)',
      publishedAt: 'Just now',
      priority: 'CRITICAL EMERGENCY',
      status: 'Active Broadcast',
      target: 'All Students, Faculty & Staff',
      channels: 'FCM Push, App Banner, SMS Gateway',
    };
    setEmergencyList([em, ...emergencyList]);
    setNewEmergTitle('');
    setNewEmergMsg('');
    showSuccess('🚨 Emergency Broadcast Dispatched across FCM & App Banners!');
  };

  const handleRetractEmergency = (emergId) => {
    setEmergencyList((prev) => prev.filter((e) => e.id !== emergId));
    showSuccess('Emergency broadcast retracted.');
  };

  // 4. Complaints Management Actions
  const handleUpdateComplaintStatus = (ticketId, nextStatus) => {
    setComplaintsList((prev) =>
      prev.map((c) => (c.id === ticketId ? { ...c, status: nextStatus } : c))
    );
    showSuccess(`Complaint ${ticketId} transitioned to ${nextStatus}.`);
  };

  const handleAssignTechnician = (ticketId, techName) => {
    setComplaintsList((prev) =>
      prev.map((c) =>
        c.id === ticketId ? { ...c, assignedTo: techName, status: 'In Progress' } : c
      )
    );
    showSuccess(`Technician ${techName} assigned to ticket.`);
  };

  // 5. FAQ Management Actions
  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newFaqQ || !newFaqA) return;
    const faq = {
      id: `faq-${Date.now()}`,
      category: newFaqCat,
      question: newFaqQ,
      answer: newFaqA,
    };
    setFaqList([faq, ...faqList]);
    setNewFaqQ('');
    setNewFaqA('');
    showSuccess('FAQ entry saved to campus knowledge base.');
  };

  const handleDeleteFaq = (faqId) => {
    setFaqList((prev) => prev.filter((f) => f.id !== faqId));
    showSuccess('FAQ entry deleted.');
  };

  // 7. Food / Canteen Management Actions
  const handleToggleMenuAvailability = (itemId) => {
    setMenuList((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    );
    showSuccess('Canteen item availability updated.');
  };

  // 8. Library Management Actions
  const handleToggleBookStock = (bookId) => {
    setBooksList((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? {
              ...b,
              availableCopies: b.availableCopies > 0 ? 0 : 3,
              status: b.availableCopies > 0 ? 'Checked Out' : 'Available',
            }
          : b
      )
    );
    showSuccess('Book catalog availability updated.');
  };

  // 9. Community Moderation Actions
  const handleModerateReport = (reportId, action) => {
    setReportedList((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: action === 'remove' ? 'Removed' : 'Dismissed' } : r
      )
    );
    showSuccess(`Reported content marked as ${action === 'remove' ? 'Removed & Redacted' : 'Dismissed'}.`);
  };

  const adminTabs = [
    { id: 'users', label: '1. User Management', icon: Users },
    { id: 'notices', label: '2. Notices & Bulletins', icon: Bell },
    { id: 'emergency', label: '3. Emergency Alerts', icon: AlertTriangle, badge: 'Admin Only' },
    { id: 'complaints', label: '4. Complaints Lifecycle', icon: HelpCircle },
    { id: 'faqs', label: '5. FAQ Knowledge Base', icon: MessageSquare },
    { id: 'map', label: '6. Campus Map Locations', icon: MapPin },
    { id: 'canteen', label: '7. Canteen & Food Orders', icon: Utensils },
    { id: 'library', label: '8. Central Library Catalog', icon: BookOpen },
    { id: 'moderation', label: '9. Community Moderation', icon: ShieldAlert },
    { id: 'seniors', label: '10. Verified Seniors', icon: UserCheck },
    { id: 'placements', label: '11. Placements & Q-Bank', icon: Briefcase },
    { id: 'audit', label: '12. Student Data Audit', icon: Database },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-6xl h-[90vh] bg-slate-900 text-white rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-extrabold shadow-lg shadow-amber-500/20">
              <ShieldAlert className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white tracking-tight font-outfit">
                  Campus Administrator Control Center (SCAM v1.0)
                </h2>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  SRS Section 2.3 & 4.1-4.8
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Authorized Central Administration for Vasavi College of Engineering.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Success Alert Banner */}
        {notificationSuccess && (
          <div className="px-5 py-2.5 bg-emerald-950/80 border-b border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notificationSuccess}</span>
          </div>
        )}

        {/* Main Body with Sidebar Tabs */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Admin Tab Navigation */}
          <div className="w-64 bg-slate-950 border-r border-slate-800 p-3 space-y-1 overflow-y-auto shrink-0 select-none">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
              Admin Modules (SRS v1.0)
            </div>
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeAdminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${isActive ? 'bg-black text-amber-400' : 'bg-red-950 text-red-400'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Tab Content View */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900/60">
            {/* 1. USER MANAGEMENT */}
            {activeAdminTab === 'users' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>User Management & Verification Status (SRS 2.3 & 5.3)</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Manage Student, Faculty, and Admin accounts, verify senior badges, and control permissions.
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-slate-800 px-3 py-1 rounded-full text-slate-300">
                    Total: {usersList.length} Accounts
                  </span>
                </div>

                <div className="space-y-2.5">
                  {usersList.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{user.name}</span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                user.role === 'Admin'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : user.role === 'Faculty'
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : 'bg-blue-500/20 text-blue-300'
                              }`}
                            >
                              {user.role}
                            </span>
                            {user.isVerifiedSenior && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Verified Senior
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {user.rollNo || user.facultyId || user.adminId} • {user.department} • {user.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {user.role === 'Student' && (
                          <button
                            onClick={() => handleToggleSenior(user.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                              user.isVerifiedSenior
                                ? 'bg-slate-800 text-amber-400 hover:bg-slate-700'
                                : 'bg-emerald-600 text-white hover:bg-emerald-500'
                            }`}
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{user.isVerifiedSenior ? 'Revoke Senior Badge' : 'Verify as Senior'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            user.status === 'Active'
                              ? 'bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-800'
                              : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900 border border-emerald-800'
                          }`}
                        >
                          {user.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. NOTICES MANAGEMENT */}
            {activeAdminTab === 'notices' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>Create & Target Official Bulletins (SRS 4.1)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Publish targeted notices by Branch, Year, Section, or Role with immediate distribution.
                  </p>
                </div>

                {/* Create Form */}
                <form onSubmit={handleCreateNotice} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="font-bold text-xs text-white">Publish New Bulletin</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Notice Headline / Subject"
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                      className="sm:col-span-3 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      required
                    />
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Target Branch</label>
                      <select
                        value={newNoticeBranch}
                        onChange={(e) => setNewNoticeBranch(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="All">All Branches</option>
                        <option value="IT">Information Technology (IT)</option>
                        <option value="CSE">Computer Science (CSE)</option>
                        <option value="ECE">Electronics (ECE)</option>
                        <option value="EEE">Electrical (EEE)</option>
                        <option value="Mech">Mechanical (ME)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Target Academic Year</label>
                      <select
                        value={newNoticeYear}
                        onChange={(e) => setNewNoticeYear(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="All">All Years (1st - 4th)</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Target Section</label>
                      <select
                        value={newNoticeTarget}
                        onChange={(e) => setNewNoticeTarget(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="All Sections">All Sections (A, B, C)</option>
                        <option value="Section A">Section A</option>
                        <option value="Section B">Section B</option>
                        <option value="Section C">Section C</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Detailed notice body, instructions, dates, and venue..."
                      value={newNoticeBody}
                      onChange={(e) => setNewNoticeBody(e.target.value)}
                      rows={3}
                      className="sm:col-span-3 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish & Broadcast</span>
                    </button>
                  </div>
                </form>

                {/* Published List */}
                <div className="space-y-2">
                  <div className="font-bold text-xs text-white">Active Notices ({noticesList.length})</div>
                  {noticesList.map((notice) => (
                    <div
                      key={notice.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-white text-xs">{notice.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {notice.content || notice.body}
                        </div>
                        <div className="text-[10px] font-mono text-amber-400 mt-1">
                          {notice.department} • {notice.date}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRetractNotice(notice.id)}
                        className="px-3 py-1.5 rounded-xl bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Retract</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. EMERGENCY NOTIFICATIONS */}
            {activeAdminTab === 'emergency' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800 text-red-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Emergency Notification Dispatcher (Admin Exclusive Privilege)</span>
                  </div>
                  <p className="text-xs text-red-300/80">
                    Per SRS BR-5.5.5, only Admin users may broadcast emergency alerts. These display prominent visual alert styling on student devices and trigger immediate FCM push notifications.
                  </p>
                </div>

                <form onSubmit={handleCreateEmergency} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="font-bold text-xs text-white">Dispatch Emergency College Broadcast</div>
                  <input
                    type="text"
                    placeholder="Emergency Alert Headline (e.g., Severe Weather / Campus Closure / Urgent Drill)"
                    value={newEmergTitle}
                    onChange={(e) => setNewEmergTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-red-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                    required
                  />
                  <textarea
                    placeholder="Emergency instructions, evacuation details, transport schedules..."
                    value={newEmergMsg}
                    onChange={(e) => setNewEmergMsg(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
                    required
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-extrabold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-red-600/30"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Dispatch College Emergency Alert</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  <div className="font-bold text-xs text-white">Broadcast History</div>
                  {emergencyList.map((em) => (
                    <div
                      key={em.id}
                      className="p-4 rounded-2xl bg-red-950/20 border border-red-900/60 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 font-extrabold text-xs">{em.title}</span>
                          <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                            {em.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{em.message}</p>
                        <div className="text-[10px] font-mono text-slate-400 mt-1.5">
                          Published by: {em.publishedBy} • {em.publishedAt} • Channels: {em.channels}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRetractEmergency(em.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer shrink-0"
                      >
                        Retract Alert
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. COMPLAINTS MANAGEMENT */}
            {activeAdminTab === 'complaints' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Complaints Management & 4-Stage Lifecycle (SRS 4.2)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Oversee ticket lifecycle: Submitted → Assigned → In Progress → Resolved.
                  </p>
                </div>

                <div className="space-y-3">
                  {complaintsList.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-400 text-xs">{ticket.id}</span>
                            <span className="font-bold text-white text-xs">{ticket.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                              {ticket.category}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Location: <span className="text-slate-200 font-semibold">{ticket.location}</span> • Reported: {ticket.submittedAt}
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-bold self-start sm:self-auto ${
                            ticket.status === 'Resolved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : ticket.status === 'In Progress'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          Status: {ticket.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-900">
                        <div className="text-[11px] text-slate-400 mr-2">Assign Technician:</div>
                        {['Rajesh (Electrical)', 'Suresh (Plumbing)', 'Kiran (Network)', 'Mahesh (Civil)'].map(
                          (tech) => (
                            <button
                              key={tech}
                              onClick={() => handleAssignTechnician(ticket.id, tech)}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 transition cursor-pointer"
                            >
                              {tech}
                            </button>
                          )
                        )}

                        <div className="ml-auto flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateComplaintStatus(ticket.id, 'In Progress')}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
                          >
                            Mark In Progress
                          </button>
                          <button
                            onClick={() => handleUpdateComplaintStatus(ticket.id, 'Resolved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. FAQ MANAGEMENT */}
            {activeAdminTab === 'faqs' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <span>Campus FAQ Knowledge Base Management (SRS 4.2.4)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add, edit, and organize frequently asked questions indexed by category.
                  </p>
                </div>

                <form onSubmit={handleAddFaq} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="font-bold text-xs text-white">Add New FAQ Entry</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Question prompt"
                      value={newFaqQ}
                      onChange={(e) => setNewFaqQ(e.target.value)}
                      className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500"
                      required
                    />
                    <select
                      value={newFaqCat}
                      onChange={(e) => setNewFaqCat(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Campus Facilities">Campus Facilities</option>
                      <option value="Library">Library</option>
                      <option value="Placements">Placements</option>
                      <option value="Canteen">Canteen</option>
                    </select>
                    <textarea
                      placeholder="Verified comprehensive answer..."
                      value={newFaqA}
                      onChange={(e) => setNewFaqA(e.target.value)}
                      rows={2}
                      className="sm:col-span-3 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Knowledge Base</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  {faqList.map((faq) => (
                    <div
                      key={faq.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-slate-800 text-amber-400 font-mono px-2 py-0.5 rounded">
                            {faq.category}
                          </span>
                          <span className="font-bold text-white text-xs">{faq.question}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{faq.answer}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 transition cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. CAMPUS MAP MANAGEMENT */}
            {activeAdminTab === 'map' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Campus Map Locations & Facilities Management (SRS 4.3)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage block details, floor directories, room allocations, and faculty cabin coordinates.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(CAMPUS_BUILDINGS).map(([key, bldg]) => (
                    <div key={key} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{bldg.name}</span>
                        <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded">
                          {bldg.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Floors: <span className="text-slate-200">{bldg.floors}</span> • Departments: {bldg.departments?.join(', ')}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        Facilities: {bldg.facilities?.join(' • ')}
                      </div>
                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          onClick={() => showSuccess(`Editing coordinates for ${bldg.name}`)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 transition cursor-pointer"
                        >
                          Edit Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. CANTEEN & FOOD ORDERS */}
            {activeAdminTab === 'canteen' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <span>Canteen Menu Items, Pricing & Stock Availability (SRS 4.4)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage food menu, prices, real-time stock toggles, and live counter order pickups.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {menuList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{item.name}</div>
                          <div className="text-xs text-amber-400 font-bold mt-0.5">₹{item.price}</div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              item.available ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {item.available ? 'In Stock' : 'Sold Out'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleMenuAvailability(item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          item.available
                            ? 'bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-800'
                            : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900 border border-emerald-800'
                        }`}
                      >
                        {item.available ? 'Mark Sold Out' : 'Restock Item'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. LIBRARY MANAGEMENT */}
            {activeAdminTab === 'library' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>Central Library Catalog & Availability (SRS 4.5)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage book inventory, ISBN catalog, shelf coordinates, and borrow limits.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {booksList.map((book) => (
                    <div
                      key={book.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-white text-xs">{book.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Author: {book.author} • ISBN: {book.isbn} • Shelf: <span className="text-amber-400 font-mono">{book.shelfLocation}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-1">
                          Available: {book.availableCopies} of {book.totalCopies} copies
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleBookStock(book.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 transition cursor-pointer"
                      >
                        Update Copies
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. COMMUNITY MODERATION */}
            {activeAdminTab === 'moderation' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Senior Community Moderation & Reports (SRS 4.6 & BR-5.5.3)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Review flagged discussion threads, take disciplinary actions, and enforce code of conduct.
                  </p>
                </div>

                <div className="space-y-3">
                  {reportedList.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{rep.title}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            rep.status === 'Pending Admin Review'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{rep.contentSnippet}</p>
                      <div className="text-[10px] font-mono text-slate-500">
                        Reported by: {rep.reportedBy} • Reason: <span className="text-red-400">{rep.reason}</span> • {rep.reportedAt}
                      </div>
                      {rep.status === 'Pending Admin Review' && (
                        <div className="flex gap-2 pt-2 border-t border-slate-900">
                          <button
                            onClick={() => handleModerateReport(rep.id, 'remove')}
                            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition cursor-pointer"
                          >
                            Remove Inappropriate Content
                          </button>
                          <button
                            onClick={() => handleModerateReport(rep.id, 'dismiss')}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                          >
                            Dismiss Report
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. VERIFIED SENIORS */}
            {activeAdminTab === 'seniors' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    <span>Verified Senior Status Administration (SRS 4.6.4 & BR-5.5.4)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Verify eligible 3rd & 4th year students with official Verified Senior badge for authentic career & course mentoring.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {usersList
                    .filter((u) => u.role === 'Student')
                    .map((stu) => (
                      <div
                        key={stu.id}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={stu.avatarUrl}
                            alt={stu.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">{stu.name}</span>
                              {stu.isVerifiedSenior && (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                                  ✓ Verified
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {stu.rollNo} • {stu.department} • {stu.year}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleSenior(stu.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            stu.isVerifiedSenior
                              ? 'bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-800'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          {stu.isVerifiedSenior ? 'Revoke Senior Status' : 'Approve & Verify'}
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 11. PLACEMENTS & Q-BANK */}
            {activeAdminTab === 'placements' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-400" />
                    <span>Placement Database & Interview Question Bank (SRS 4.7)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage recruiting company packages, eligibility criteria, interview rounds, and ATS guidance.
                  </p>
                </div>

                <div className="space-y-3">
                  {companiesList.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-white text-xs">{comp.name}</div>
                        <span className="text-xs font-bold text-emerald-400 font-mono">{comp.package}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Eligible Branches: {comp.eligibleBranches?.join(', ')} • Tier: {comp.tier}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Rounds: {comp.rounds?.join(' → ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 12. STUDENT DATA AUDIT */}
            {activeAdminTab === 'audit' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800 text-indigo-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-indigo-300">
                    <Database className="w-4 h-4" />
                    <span>Authorized Administrative Access to Student Data (SRS 4.2 & 4.4)</span>
                  </div>
                  <p className="text-xs text-indigo-300/80">
                    Authorized dean & administrative logging for operational resolution of student complaints, canteen fulfillments, and audit trails.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-xs text-white">Recent System Audit Logs</div>
                  {MOCK_ADMIN_AUDIT_LOGS.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-amber-400 font-mono">{log.id}</span> •{' '}
                        <span className="font-semibold text-white">{log.action}</span>:{' '}
                        <span className="text-slate-400">{log.target}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        Admin: {log.admin} • {log.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Admin Privileges Active • Vasavi College of Engineering</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition cursor-pointer"
          >
            Close Admin Console
          </button>
        </div>
      </div>
    </div>
  );
};
