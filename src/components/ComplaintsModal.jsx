import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  Camera,
  Search,
  ChevronRight,
  UserCheck,
  Building,
  Sparkles,
  FileCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { COMPLAINTS, FAQS, USER_PROFILE } from '../data/mockData';

export const ComplaintsModal = ({ isOpen, onClose, currentUser = USER_PROFILE }) => {
  const [activeTab, setActiveTab] = useState('track'); // 'track' | 'submit' | 'queries' | 'faq' | 'admin'
  const [complaintsList, setComplaintsList] = useState(COMPLAINTS);
  const [faqSearch, setFaqSearch] = useState('');
  const [selectedFaqCategory, setSelectedFaqCategory] = useState('All');

  // Submit Complaint Form State
  const [category, setCategory] = useState('WiFi & Network');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Ramanujan Block - 3rd Floor, Room 304');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Free text query state
  const [queryText, setQueryText] = useState('');
  const [suggestedFaq, setSuggestedFaq] = useState(null);
  const [submittedQueries, setSubmittedQueries] = useState([
    {
      id: 'q-1',
      question: 'When will the bus passes be renewed for Semester 5?',
      timestamp: '17 Aug 2025, 02:00 PM',
      status: 'Answered',
      reply: 'Transport desk in Admin Block (Counter 4) will renew passes between 20-25 August from 10:00 AM - 3:00 PM.',
      repliedBy: 'Campus Transport In-charge',
    },
  ]);

  if (!isOpen) return null;

  const categories = [
    'WiFi & Network',
    'Lab Equipment',
    'Cleanliness & Water',
    'Infrastructure',
    'Library Facilities',
    'Canteen & Mess',
    'Academic Query',
    'Other',
  ];

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newComplaint = {
      id: `cmp-${Date.now().toString().slice(-4)}`,
      category,
      title,
      description,
      location,
      status: 'Submitted',
      statusHistory: [
        {
          status: 'Submitted',
          timestamp: 'Just now',
          note: `Complaint logged by ${currentUser?.name || 'Manoj Reddy'}`,
        },
      ],
      assignedTo: 'Pending Assignment',
      submittedBy: `${currentUser?.name || 'Manoj Reddy'} (${currentUser?.rollNo || '1602-24-737-152'})`,
      date: 'Today',
      priority,
      resolvedDate: null,
    };

    setComplaintsList([newComplaint, ...complaintsList]);
    setTitle('');
    setDescription('');
    setHasPhoto(false);
    setActiveTab('track');
    setToastMessage(`Complaint #${newComplaint.id} submitted successfully! Admin will assign shortly.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleQueryInput = (val) => {
    setQueryText(val);
    if (val.length > 3) {
      const match = FAQS.find(
        (f) =>
          f.question.toLowerCase().includes(val.toLowerCase()) ||
          f.tags.some((t) => val.toLowerCase().includes(t))
      );
      setSuggestedFaq(match || null);
    } else {
      setSuggestedFaq(null);
    }
  };

  const handleSendQuery = (e) => {
    e.preventDefault();
    if (!queryText.trim()) return;

    const newQ = {
      id: `q-${Date.now()}`,
      question: queryText,
      timestamp: 'Just now',
      status: 'Submitted to Faculty/Admin',
      reply: suggestedFaq
        ? `[Auto-Suggested FAQ]: ${suggestedFaq.answer}`
        : 'Query routed to Department Faculty advisor. Expected response within 24 hours.',
      repliedBy: suggestedFaq ? 'SCAM Automated System' : 'Pending Faculty Review',
    };

    setSubmittedQueries([newQ, ...submittedQueries]);
    setQueryText('');
    setSuggestedFaq(null);
    setToastMessage('Query submitted successfully! Check responses below.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAdminStatusChange = (complaintId, nextStatus) => {
    setComplaintsList((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            status: nextStatus,
            statusHistory: [
              ...c.statusHistory,
              {
                status: nextStatus,
                timestamp: 'Just now',
                note: `Status updated to ${nextStatus} by Admin`,
              },
            ],
            assignedTo: nextStatus === 'Assigned' ? 'Mr. Rajesh K. (Network Tech)' : c.assignedTo,
          };
        }
        return c;
      })
    );
  };

  const filteredFaqs = FAQS.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(faqSearch.toLowerCase()));
    const matchesCategory = selectedFaqCategory === 'All' || f.category === selectedFaqCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-outfit">Complaints, Queries & FAQ Knowledge Base</h3>
                <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-400/30">
                  REQ-4.2 MODULE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Vasavi Student Helpdesk • 4-Stage Complaint Tracking & Auto-FAQ Resolution
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

        {/* Tab Selection */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('track')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'track'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Track Complaints ({complaintsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('submit')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'submit'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>Submit New Complaint</span>
            </button>

            <button
              onClick={() => setActiveTab('queries')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'queries'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span>Ask Query ({submittedQueries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-500" />
              <span>Search FAQ ({FAQS.length})</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>Roll: {currentUser?.rollNo || '1602-24-737-152'}</span>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="mx-6 mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-800 flex items-center gap-2 shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab 1: Track Complaints */}
        {activeTab === 'track' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                <div className="text-[11px] font-bold text-amber-700 uppercase">In Progress</div>
                <div className="text-xl font-bold font-mono mt-0.5">
                  {complaintsList.filter((c) => c.status === 'In Progress').length} Active
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950">
                <div className="text-[11px] font-bold text-blue-700 uppercase">Assigned</div>
                <div className="text-xl font-bold font-mono mt-0.5">
                  {complaintsList.filter((c) => c.status === 'Assigned' || c.status === 'Submitted').length} Pending
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <div className="text-[11px] font-bold text-emerald-700 uppercase">Resolved</div>
                <div className="text-xl font-bold font-mono mt-0.5">
                  {complaintsList.filter((c) => c.status === 'Resolved').length} Closed
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {complaintsList.map((complaint) => (
                <div
                  key={complaint.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        #{complaint.id}
                      </span>
                      <span className="text-[10px] font-bold font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md">
                        {complaint.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full ${
                          complaint.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : complaint.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        ● {complaint.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      Logged: {complaint.date}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{complaint.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {complaint.description}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-mono">
                      <Building className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{complaint.location}</span>
                    </div>
                  </div>

                  {/* 4-Stage Lifecycle Progress Bar */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      {['Submitted', 'Assigned', 'In Progress', 'Resolved'].map((stage, idx) => {
                        const stages = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];
                        const currentIdx = stages.indexOf(complaint.status);
                        const isDone = idx <= currentIdx;
                        return (
                          <div
                            key={stage}
                            className={`flex items-center gap-1 ${
                              isDone ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${
                                isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="hidden sm:inline">{stage}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/80 flex items-center justify-between">
                      <span>Assigned: <strong>{complaint.assignedTo}</strong></span>
                      <span className="font-mono text-[10px]">Priority: {complaint.priority}</span>
                    </div>
                  </div>

                  {/* Role-based status controller (For testing SRS REQ-4.2.4) */}
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] font-mono">Admin Override Test:</span>
                    <div className="flex gap-1.5">
                      {['Assigned', 'In Progress', 'Resolved'].map((st) => (
                        <button
                          key={st}
                          onClick={() => handleAdminStatusChange(complaint.id, st)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Mark {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Submit New Complaint */}
        {activeTab === 'submit' && (
          <form onSubmit={handleSubmitComplaint} className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                Official Vasavi Grievance & Infrastructure Redressal
              </h4>
              <p className="text-xs text-rose-800 mt-1">
                Submissions are recorded in the central maintenance ledger and routed to the corresponding department technician within 4 business hours.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-rose-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Low">Low (General Maintenance)</option>
                  <option value="Medium">Medium (Classroom / Lab Impact)</option>
                  <option value="High">High (Immediate Urgent Redressal)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specific Location / Room *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Ramanujan Block - 3rd Floor, Room 304"
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Complaint Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the issue..."
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description *</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is malfunctioning, when it started, and impact on lectures/lab work..."
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Photo Attachment Simulator */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Attach Photo (Optional)</label>
              <div
                onClick={() => setHasPhoto(!hasPhoto)}
                className={`p-4 rounded-2xl border-2 border-dashed transition cursor-pointer flex items-center justify-center gap-2 ${
                  hasPhoto
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50 text-slate-600'
                }`}
              >
                <Camera className="w-5 h-5" />
                <span className="text-xs font-bold">
                  {hasPhoto ? 'Photo Attached: lab_equipment_issue.jpg ✓' : 'Click to Upload / Capture Photo from Camera'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Complaint (REQ-4.2.1)</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Ask Free-Text Query */}
        {activeTab === 'queries' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
              <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                Ask Official College Queries (REQ-4.2.5)
              </h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                Type your question below. If an official FAQ matches your question, SCAM will suggest an automatic instant answer. Otherwise, it is directly routed to your Faculty Advisor / Admin.
              </p>
            </div>

            {/* Input Box */}
            <form onSubmit={handleSendQuery} className="space-y-3">
              <div className="relative">
                <textarea
                  rows={2}
                  placeholder="Ask anything about fees, bus routes, mid-term marks, hall tickets, lab access..."
                  value={queryText}
                  onChange={(e) => handleQueryInput(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-xs focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-3 bottom-3 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>

              {/* Instant Auto-Suggested FAQ Box */}
              {suggestedFaq && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instant Suggested FAQ Match:</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800">{suggestedFaq.question}</div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{suggestedFaq.answer}</p>
                </div>
              )}
            </form>

            {/* Queries History */}
            <div className="space-y-3 pt-3">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                My Query History
              </h5>
              {submittedQueries.map((q) => (
                <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-bold text-slate-900">Q: {q.question}</div>
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md shrink-0">
                      {q.status}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <strong>Response ({q.repliedBy}):</strong> {q.reply}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Searchable FAQ Knowledge Base */}
        {activeTab === 'faq' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search official FAQ knowledge base..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-3 pt-1">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2 hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {faq.category}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{faq.question}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Vasavi Administration Helpdesk • Ext: 104 / 105</span>
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
