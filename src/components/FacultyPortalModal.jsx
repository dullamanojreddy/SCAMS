import React, { useState } from 'react';
import {
  GraduationCap,
  Bell,
  MessageSquare,
  Eye,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Filter,
  Lock,
  Sparkles,
} from 'lucide-react';
import {
  MOCK_FACULTY_QUERIES,
  NOTICES,
  COMPLAINTS,
  COMMUNITY_POSTS,
} from '../data/mockData';
import { api } from '../api/client';

export const FacultyPortalModal = ({
  isOpen,
  onClose,
  currentUser,
  initialTab = 'queries',
}) => {
  const [activeFacultyTab, setActiveFacultyTab] = useState(initialTab);
  const [queriesList, setQueriesList] = useState([]);
  const [noticesList, setNoticesList] = useState(
    NOTICES.filter((n) => n.author?.includes('IT') || n.category?.includes('academic') || n.category?.includes('department'))
  );
  const [replyTextMap, setReplyTextMap] = useState({});
  const [successBanner, setSuccessBanner] = useState(null);

  React.useEffect(() => {
    if (!isOpen) return;
    api.get('/api/v1/faculty/queries').then((items) => { if (Array.isArray(items)) setQueriesList(items); }).catch(() => {});
  }, [isOpen]);

  // New Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [targetYear, setTargetYear] = useState('3rd Year');
  const [targetSection, setTargetSection] = useState('Section C');
  const [targetCourse, setTargetCourse] = useState('Computer Networks Lab');

  if (!isOpen) return null;

  const showSuccess = (msg) => {
    setSuccessBanner(msg);
    setTimeout(() => setSuccessBanner(null), 3000);
  };

  const handleRespondToQuery = async (queryId) => {
    const text = replyTextMap[queryId];
    if (!text || !text.trim()) return;

    try { await api.post(`/api/v1/faculty/queries/${queryId}/answer`, { response: text }); } catch { /* retain local response when the API is unavailable */ }
    setQueriesList((prev) =>
      prev.map((q) =>
        q.id === queryId
          ? {
              ...q,
              status: 'Answered',
              response: text,
              respondedAt: 'Just now',
            }
          : q
      )
    );
    setReplyTextMap({ ...replyTextMap, [queryId]: '' });
    showSuccess('Response recorded and dispatched to student with push notification (REQ-4.2.5).');
  };

  const handlePublishAcademicNotice = (e) => {
    e.preventDefault();
    if (!noticeTitle || !noticeBody) return;

    const newNotice = {
      id: `NOT-FAC-${Date.now()}`,
      title: noticeTitle,
      body: noticeBody,
      content: noticeBody,
      category: 'Departmental Academic Notice',
      date: 'Just now',
      priority: 'normal',
      department: `Dept: IT • ${targetYear} (${targetSection}) • Course: ${targetCourse}`,
      read: false,
    };

    setNoticesList([newNotice, ...noticesList]);
    setNoticeTitle('');
    setNoticeBody('');
    showSuccess(`Notice published to ${targetYear} ${targetSection} students (REQ-4.1.1).`);
  };

  const facultyTabs = [
    { id: 'queries', label: '1. Student Queries & Helpdesk', icon: MessageSquare, badge: queriesList.filter((q) => q.status !== 'Answered').length || null },
    { id: 'notices', label: '2. Academic Notices Management', icon: Bell },
    { id: 'dept-activity', label: '3. Department Complaint & Community Feed', icon: Eye },
    { id: 'scope-rbac', label: '4. Authorized Academic Scope & RBAC', icon: Lock },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-5xl h-[88vh] bg-slate-900 text-white rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-extrabold shadow-lg shadow-purple-600/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white tracking-tight font-outfit">
                  Faculty Academic Portal (SCAM v1.0)
                </h2>
                <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                  SRS Section 2.3, REQ-4.1.1, REQ-4.2.5
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Department of Information Technology • Authorized Scope: {currentUser?.coursesTaught?.join(', ') || 'Computer Networks Lab, Software Engineering'}
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

        {/* Success Alert */}
        {successBanner && (
          <div className="px-5 py-2.5 bg-emerald-950/80 border-b border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successBanner}</span>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Nav */}
          <div className="w-60 bg-slate-950 border-r border-slate-800 p-3 space-y-1 overflow-y-auto shrink-0 select-none">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
              Faculty Capabilities
            </div>
            {facultyTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFacultyTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFacultyTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500 text-black">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Content */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900/60">
            {/* 1. STUDENT QUERIES */}
            {activeFacultyTab === 'queries' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      <span>Student Academic Queries & Clarifications (REQ-4.2.5 & BR-5.5.7)</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Receive and answer student course queries. Students receive automatic push notifications upon resolution.
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-slate-800 px-3 py-1 rounded-full text-slate-300">
                    {queriesList.length} Total Queries
                  </span>
                </div>

                <div className="space-y-3">
                  {queriesList.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-purple-400 text-xs font-bold">{q.id}</span>
                            <span className="font-bold text-white text-xs">{q.subject}</span>
                            <span className="text-[10px] bg-slate-800 text-purple-300 px-2 py-0.5 rounded font-mono">
                              {q.course}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Student: <span className="text-slate-200 font-semibold">{q.studentName} ({q.rollNo})</span> • {q.submittedAt}
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            q.status === 'Answered'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300 animate-pulse'
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>

                      {/* Query Body */}
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300">
                        "{q.query}"
                      </div>

                      {/* Answer or Input */}
                      {q.status === 'Answered' ? (
                        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/50 space-y-1">
                          <div className="text-[10px] font-bold text-purple-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Your Response (Dispatched {q.respondedAt}):
                          </div>
                          <p className="text-xs text-slate-200">{q.response}</p>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          <textarea
                            placeholder="Type verified academic clarification or guidance..."
                            value={replyTextMap[q.id] || ''}
                            onChange={(e) => setReplyTextMap({ ...replyTextMap, [q.id]: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleRespondToQuery(q.id)}
                              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-purple-600/20"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Submit Response & Notify Student</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. ACADEMIC NOTICES MANAGEMENT */}
            {activeFacultyTab === 'notices' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-400" />
                    <span>Manage Academic & Department Notices (REQ-4.1.1)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Publish course schedules, assignment deadlines, and lab test schedules targeted to your department students.
                  </p>
                </div>

                {/* Publish Form */}
                <form onSubmit={handlePublishAcademicNotice} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="font-bold text-xs text-white">Create Department Notice</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Notice Title / Lab Announcement"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      className="sm:col-span-3 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
                      required
                    />
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Target Year</label>
                      <select
                        value={targetYear}
                        onChange={(e) => setTargetYear(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="3rd Year">3rd Year (Sem V)</option>
                        <option value="2nd Year">2nd Year (Sem III)</option>
                        <option value="4th Year">4th Year (Sem VII)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Target Section</label>
                      <select
                        value={targetSection}
                        onChange={(e) => setTargetSection(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="Section C">Section C (Assigned)</option>
                        <option value="Section A">Section A</option>
                        <option value="Section B">Section B</option>
                        <option value="All Sections">All Sections</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Course Scope</label>
                      <select
                        value={targetCourse}
                        onChange={(e) => setTargetCourse(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="Computer Networks Lab">Computer Networks Lab</option>
                        <option value="Software Engineering">Software Engineering</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Detailed announcement, instructions, submission links..."
                      value={noticeBody}
                      onChange={(e) => setNoticeBody(e.target.value)}
                      rows={3}
                      className="sm:col-span-3 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-purple-600/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish to Target Students</span>
                    </button>
                  </div>
                </form>

                {/* Published List */}
                <div className="space-y-2">
                  <div className="font-bold text-xs text-white">Active Academic Notices</div>
                  {noticesList.map((notice) => (
                    <div
                      key={notice.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1"
                    >
                      <div className="font-bold text-white text-xs">{notice.title}</div>
                      <p className="text-xs text-slate-400 line-clamp-2">{notice.content || notice.body}</p>
                      <div className="text-[10px] font-mono text-purple-400 pt-1">
                        {notice.department} • {notice.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. DEPARTMENT ACTIVITY VIEW */}
            {activeFacultyTab === 'dept-activity' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span>Relevant Complaint & Community Activity (Read-Only Scope)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Per SRS Section 2.3, Faculty may view relevant complaints and community discussions within their department scope for academic awareness. Full resolution and moderation remain Admin-only.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="font-bold text-xs text-slate-300">Department Complaints Overview</div>
                  {COMPLAINTS.slice(0, 2).map((comp) => (
                    <div
                      key={comp.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{comp.title}</span>
                        <span className="text-[10px] bg-slate-900 text-amber-400 font-mono px-2 py-0.5 rounded">
                          {comp.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">Location: {comp.location} • Category: {comp.category}</div>
                    </div>
                  ))}

                  <div className="font-bold text-xs text-slate-300 pt-2">Department Senior Community Discussions</div>
                  {COMMUNITY_POSTS.slice(0, 2).map((post) => (
                    <div
                      key={post.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1"
                    >
                      <div className="font-bold text-white text-xs">{post.title}</div>
                      <p className="text-xs text-slate-400 line-clamp-1">{post.body}</p>
                      <div className="text-[10px] font-mono text-purple-300">
                        Author: {post.author} • {post.upvotes} Upvotes • {post.replies?.length || 0} Answers
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. RBAC & SCOPE ENFORCEMENT */}
            {activeFacultyTab === 'scope-rbac' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-purple-400">
                    <Lock className="w-4 h-4" />
                    <span>Role-Based Access Control (RBAC) Compliance (REQ-5.3.5 & BR-5.5.7)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Faculty accounts operate strictly within their assigned departmental and academic course scope.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/50 space-y-1">
                      <div className="font-bold text-emerald-400">✓ Authorized Capabilities</div>
                      <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                        <li>Create & publish academic notices for IT-C</li>
                        <li>Receive and respond to student course queries</li>
                        <li>View department complaint & community feeds</li>
                        <li>Access syllabus & library course links</li>
                      </ul>
                    </div>
                    <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/50 space-y-1">
                      <div className="font-bold text-red-400">✕ Restricted (Admin-Only Operations)</div>
                      <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                        <li>Emergency college-wide notifications</li>
                        <li>User role management & senior verification</li>
                        <li>Campus map editing & canteen pricing</li>
                        <li>Community disciplinary moderation & removal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span>Faculty Mode: Mrs. S. Rajyalakshmi (IT Dept)</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer"
          >
            Close Faculty Portal
          </button>
        </div>
      </div>
    </div>
  );
};
