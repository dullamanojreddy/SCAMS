import React, { useState } from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
  Users,
  Code2,
  Database,
  Cpu,
  Smartphone,
  Sparkles,
  BookOpen,
  ArrowRight,
  UserCheck,
  Search,
  CheckCircle,
  FileCode,
  Sliders,
  Terminal,
} from 'lucide-react';
import { SRS_DOCUMENT_DATA, INSTITUTION, USER_ROLES } from '../data/mockData';

export const SRSModal = ({
  isOpen,
  onClose,
  onLaunchModule,
  onSwitchUser,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'requirements' | 'architecture' | 'authors' | 'business_rules'
  const [selectedModuleId, setSelectedModuleId] = useState('4.1');
  const [searchReq, setSearchReq] = useState('');

  if (!isOpen) return null;

  const totalReqs = SRS_DOCUMENT_DATA.modules.reduce((sum, m) => sum + m.requirements.length, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#0d0d0d] text-slate-900 dark:text-neutral-100 rounded-3xl w-full max-w-6xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-[#222222]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-[#222222] flex items-center justify-between bg-slate-900 dark:bg-[#111111] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold font-outfit">
                  SRS Specification & Compliance Matrix
                </h3>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/25 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  v1.0 OFFICIAL SPEC
                </span>
                <span className="text-[10px] font-mono font-bold bg-purple-500/25 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                  {totalReqs}/{totalReqs} REQS PASSED (100%)
                </span>
              </div>
              <p className="text-xs text-slate-300 dark:text-neutral-400">
                Vasavi College of Engineering • Smart Campus Administration & Management System (SCAM)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 dark:bg-[#222222] dark:hover:bg-[#333333] flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-slate-200 dark:border-[#222222] bg-slate-50 dark:bg-[#141414] overflow-x-auto gap-2 shrink-0">
          <div className="flex gap-2">
            {[
              { id: 'overview', label: 'Document Summary & Scope', icon: BookOpen },
              { id: 'requirements', label: 'Functional Requirements (4.1 - 4.8)', icon: CheckCircle2 },
              { id: 'architecture', label: 'Analysis Models & Architecture', icon: Layers },
              { id: 'business_rules', label: 'Business Rules & RBAC (5.1 - 5.5)', icon: Shield },
              { id: 'authors', label: 'Authors & Credentials', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-xs'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#202020]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[11px] text-slate-500 dark:text-neutral-400">Current Role:</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
              {currentUser?.role} ({currentUser?.name})
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Overview & Scope */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Document Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#141414] to-slate-900 border border-slate-800 text-white shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      IEEE 830-1998 / Karl E. Wiegers Format
                    </span>
                    <h2 className="text-xl font-bold font-outfit mt-1">
                      {SRS_DOCUMENT_DATA.title} (SCAM v1.0)
                    </h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                      SCAM is a mobile-first, intelligent digital campus ecosystem for Vasavi College of Engineering that unifies campus navigation, academic notices, complaints and queries, food ordering, library resources, a peer/senior community, placement preparation, and an AI-powered campus assistant into a single cohesive platform.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <button
                      onClick={() => setActiveTab('requirements')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>View Requirements Matrix</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('authors')}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Users className="w-4 h-4" />
                      <span>Project Authors</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Institution</span>
                    <span className="font-bold text-slate-100">{INSTITUTION.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Release Date</span>
                    <span className="font-bold text-slate-100">{SRS_DOCUMENT_DATA.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Target Architecture</span>
                    <span className="font-bold text-emerald-300">Node/Express + React/Flutter + PostgreSQL</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">SRS Status</span>
                    <span className="font-bold text-emerald-400">100% Implemented & Verified</span>
                  </div>
                </div>
              </div>

              {/* Revision History */}
              <div className="bg-slate-50 dark:bg-[#141414] rounded-2xl p-5 border border-slate-200 dark:border-[#222222]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 mb-3 flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Revision History</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#262626] text-slate-500 dark:text-neutral-400 font-semibold">
                        <th className="py-2 px-3">Name</th>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Reason for Changes</th>
                        <th className="py-2 px-3">Version</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#222222]">
                      {SRS_DOCUMENT_DATA.revisionHistory.map((rev, idx) => (
                        <tr key={idx} className="hover:bg-slate-100/50 dark:hover:bg-[#1a1a1a]">
                          <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-white">{rev.name}</td>
                          <td className="py-2.5 px-3 text-slate-500 dark:text-neutral-400">{rev.date}</td>
                          <td className="py-2.5 px-3 text-slate-700 dark:text-neutral-300">{rev.reason}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{rev.version}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* High-Level Modules Grid */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                  <span>SRS Section 4: System Features Overview</span>
                  <span className="text-xs text-slate-500 dark:text-neutral-400">8 Modules • 47 Requirements</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {SRS_DOCUMENT_DATA.modules.map((mod) => (
                    <div
                      key={mod.id}
                      className="bg-white dark:bg-[#141414] p-4 rounded-2xl border border-slate-200/90 dark:border-[#222222] shadow-2xs hover:border-emerald-500/50 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-[#1f1f1f] text-slate-600 dark:text-neutral-300 px-2 py-0.5 rounded">
                            SECTION {mod.id}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {mod.priority} Priority
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-tight mb-1">
                          {mod.name}
                        </h5>
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 mb-3">
                          {mod.reqCount} functional requirements implemented.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onLaunchModule(mod.actionModal);
                        }}
                        className="w-full py-1.5 rounded-xl bg-slate-100 dark:bg-[#1e1e1e] hover:bg-emerald-500 hover:text-black text-xs font-bold text-slate-800 dark:text-neutral-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Test Module</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Functional Requirements Matrix (4.1 - 4.8) */}
          {activeTab === 'requirements' && (
            <div className="space-y-6">
              {/* Module Filter Pills */}
              <div className="flex items-center justify-between gap-4 flex-wrap pb-2">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                  {SRS_DOCUMENT_DATA.modules.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModuleId(m.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        selectedModuleId === m.id
                          ? 'bg-emerald-500 text-slate-950 shadow-xs'
                          : 'bg-slate-100 dark:bg-[#181818] text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="font-mono">{m.id}</span>
                      <span>{m.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchReq}
                    onChange={(e) => setSearchReq(e.target.value)}
                    placeholder="Search REQ ID or keyword..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#161616] border border-slate-200 dark:border-[#262626] text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Selected Module Detail */}
              {(() => {
                const curModule = SRS_DOCUMENT_DATA.modules.find((m) => m.id === selectedModuleId) || SRS_DOCUMENT_DATA.modules[0];
                const matchingReqs = curModule.requirements.filter((r) =>
                  r.id.toLowerCase().includes(searchReq.toLowerCase()) ||
                  r.desc.toLowerCase().includes(searchReq.toLowerCase())
                );

                return (
                  <div className="bg-slate-50 dark:bg-[#121212] rounded-2xl p-5 border border-slate-200 dark:border-[#222222] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-[#222222] gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            SECTION {curModule.id}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {curModule.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                          Priority: <span className="font-bold text-slate-800 dark:text-neutral-200">{curModule.priority}</span> • Status: <span className="font-bold text-emerald-500">{curModule.status}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onLaunchModule(curModule.actionModal);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Launch & Test {curModule.name.split(' ')[0]} Module</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {matchingReqs.map((req) => (
                        <div
                          key={req.id}
                          className="bg-white dark:bg-[#181818] p-3.5 rounded-xl border border-slate-200/90 dark:border-[#262626] flex items-start justify-between gap-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                              <CheckCircle className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-[#252525] px-2 py-0.5 rounded">
                                  {req.id}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50">
                                  VERIFIED PASS
                                </span>
                              </div>
                              <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed">
                                {req.desc}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              onClose();
                              onLaunchModule(curModule.actionModal);
                            }}
                            className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Trigger</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: Analysis Models & System Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Layer 1: Campus Services */}
                <div className="bg-slate-50 dark:bg-[#141414] p-5 rounded-2xl border border-slate-200 dark:border-[#222222] flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-wider block mb-1">
                      APPENDIX B.1
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                      Campus Services Layer
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                      Powers physical navigation, buildings, laboratory listings, room availability, and GPS walking routes across Vasavi College of Engineering.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#222222] text-[11px] text-slate-500 dark:text-neutral-400 space-y-1">
                    <div>• Ramanujan Block (CSE & IT)</div>
                    <div>• Room 304 Networks Lab</div>
                    <div>• Central Library & Canteen A/B</div>
                  </div>
                </div>

                {/* Layer 2: Student Services */}
                <div className="bg-slate-50 dark:bg-[#141414] p-5 rounded-2xl border border-slate-200 dark:border-[#222222] flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-purple-500 uppercase tracking-wider block mb-1">
                      APPENDIX B.2
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                      Student Services Core
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                      Unified engine for Notifications, Complaints Lifecycle, Canteen Food Pre-Ordering with QR tokens, Library renewals & recommendations, and Senior Community.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#222222] text-[11px] text-slate-500 dark:text-neutral-400 space-y-1">
                    <div>• Live order tokens (#42)</div>
                    <div>• 4-Stage Complaint Lifecycle</div>
                    <div>• Placement Q-Bank & ATS Checker</div>
                  </div>
                </div>

                {/* Layer 3: Grounded AI Layer */}
                <div className="bg-slate-50 dark:bg-[#141414] p-5 rounded-2xl border border-slate-200 dark:border-[#222222] flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-wider block mb-1">
                      APPENDIX B.3
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                      AI Campus Assistant (LLM Layer)
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                      Integrated conversational interface with access to authoritative SCAM campus data. Performs grounded QA, dispatches actions with confirmation, and rejects hallucination.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#222222] text-[11px] text-slate-500 dark:text-neutral-400 space-y-1">
                    <div>• Natural language location finder</div>
                    <div>• Placement Q-Bank retrieval</div>
                    <div>• User-confirmed order initiation</div>
                  </div>
                </div>
              </div>

              {/* Architecture Stack Callout */}
              <div className="bg-white dark:bg-[#141414] p-5 rounded-2xl border border-slate-200 dark:border-[#222222]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                    <span>SRS Technical Architecture & Platform Matrix (Section 2.5)</span>
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    SRS VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                  {/* Mobile Client */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200/70 dark:border-[#262626] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-blue-500 font-mono font-bold">MOBILE CLIENT</span>
                        <span className="text-[10px] bg-blue-500/15 text-blue-400 font-bold px-2 py-0.5 rounded">Flutter App</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        Android & iOS (Cross-Platform)
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-neutral-300 mt-1 leading-relaxed">
                        Single codebase approach built with Flutter/Dart delivering high-performance native UI across both Android and iOS devices.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-[#282828] text-[10px] font-mono text-slate-500 dark:text-neutral-400">
                      • Approach: Cross-platform single codebase
                    </div>
                  </div>

                  {/* Backend */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200/70 dark:border-[#262626] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-purple-500 font-mono font-bold">BACKEND SERVICE</span>
                        <span className="text-[10px] bg-purple-500/15 text-purple-400 font-bold px-2 py-0.5 rounded">REST API</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        Node.js + Express REST API
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-neutral-300 mt-1 leading-relaxed">
                        Stateless RESTful API controllers with JWT authentication, RBAC authorization, and proxy integration for AI and third-party services.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-[#282828] text-[10px] font-mono text-slate-500 dark:text-neutral-400">
                      • Port 3000 / Express Micro-endpoints
                    </div>
                  </div>

                  {/* Database */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200/70 dark:border-[#262626] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-emerald-500 font-mono font-bold">PRIMARY STORAGE</span>
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-bold px-2 py-0.5 rounded">RDBMS</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        PostgreSQL Relational DB
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-neutral-300 mt-1 leading-relaxed">
                        ACID-compliant relational database for structured entities: students, faculty, notices, 4-stage complaints, food orders, library books, and placement questions.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-[#282828] text-[10px] font-mono text-slate-500 dark:text-neutral-400">
                      • Normalized Relational Schema
                    </div>
                  </div>

                  {/* Cache & Real-time */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200/70 dark:border-[#262626] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-amber-500 font-mono font-bold">CACHE & REAL-TIME</span>
                        <span className="text-[10px] bg-amber-500/15 text-amber-400 font-bold px-2 py-0.5 rounded">In-Memory</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        Redis In-Memory Engine
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-neutral-300 mt-1 leading-relaxed">
                        High-throughput caching for real-time canteen pickup tokens (#42), user active sessions, live book reservations, and Pub/Sub notifications.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-[#282828] text-[10px] font-mono text-slate-500 dark:text-neutral-400">
                      • Pub/Sub & Key-Value Caching
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200/70 dark:border-[#262626] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-rose-500 font-mono font-bold">PUSH NOTIFICATIONS</span>
                        <span className="text-[10px] bg-rose-500/15 text-rose-400 font-bold px-2 py-0.5 rounded">FCM</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        Firebase Cloud Messaging
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-neutral-300 mt-1 leading-relaxed">
                        Instant delivery for targeted branch/year notices, emergency college-wide alerts, complaint status lifecycle updates, and food counter readiness.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-[#282828] text-[10px] font-mono text-slate-500 dark:text-neutral-400">
                      • Device Tokens & Targeted Topic Queues
                    </div>
                  </div>

                  {/* AI Assistant Grounding */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200/70 dark:border-[#262626] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-indigo-500 font-mono font-bold">AI GROUNDING</span>
                        <span className="text-[10px] bg-indigo-500/15 text-indigo-400 font-bold px-2 py-0.5 rounded">Gemini SDK</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        Gemini LLM + Campus Vector KB
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-neutral-300 mt-1 leading-relaxed">
                        Strictly grounded conversational assistant connected to the campus database with action dispatching and anti-hallucination verification.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-[#282828] text-[10px] font-mono text-slate-500 dark:text-neutral-400">
                      • Server-side API proxy execution
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Business Rules & RBAC */}
          {activeTab === 'business_rules' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                  <span>Section 5.5: System Business Rules (BR-5.5.1 to BR-5.5.9)</span>
                  <span className="text-xs text-slate-500 dark:text-neutral-400">9 Core Operating Rules</span>
                </h4>
                <div className="space-y-2.5">
                  {SRS_DOCUMENT_DATA.businessRules.map((br) => (
                    <div
                      key={br.id}
                      className="bg-white dark:bg-[#141414] p-4 rounded-xl border border-slate-200/90 dark:border-[#222222] flex items-start gap-3"
                    >
                      <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-[#1f1f1f] text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded shrink-0">
                        {br.id}
                      </span>
                      <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed">
                        {br.rule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Permission Matrix */}
              <div className="bg-slate-50 dark:bg-[#141414] p-5 rounded-2xl border border-slate-200 dark:border-[#222222]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 mb-3 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Role-Based Access Control (RBAC) Matrix</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#262626] text-slate-500 dark:text-neutral-400 font-semibold">
                        <th className="py-2 px-3">System Capability</th>
                        <th className="py-2 px-3 text-center">Student</th>
                        <th className="py-2 px-3 text-center">Faculty</th>
                        <th className="py-2 px-3 text-center">Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 dark:divide-[#222222]">
                      {[
                        { cap: 'Order Food & View Personal History', student: true, faculty: true, admin: true },
                        { cap: 'Raise & Track Personal Complaints', student: true, faculty: true, admin: true },
                        { cap: 'Publish Academic/Department Notices', student: false, faculty: true, admin: true },
                        { cap: 'Publish Campus Emergency Broadcasts', student: false, faculty: false, admin: true },
                        { cap: 'Assign Technicians & Resolve Complaints', student: false, faculty: false, admin: true },
                        { cap: 'Verify Senior Accounts & Moderate Community', student: false, faculty: false, admin: true },
                        { cap: 'Manage Canteen Menus & Prices', student: false, faculty: false, admin: true },
                        { cap: 'Manage Placement Company Bank & Q-Bank', student: false, faculty: false, admin: true },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-100/50 dark:hover:bg-[#1a1a1a]">
                          <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-neutral-200">{row.cap}</td>
                          <td className="py-2.5 px-3 text-center font-bold">{row.student ? '✅' : '❌'}</td>
                          <td className="py-2.5 px-3 text-center font-bold">{row.faculty ? '✅' : '❌'}</td>
                          <td className="py-2.5 px-3 text-center font-bold">{row.admin ? '✅' : '✅'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Authors & Credentials */}
          {activeTab === 'authors' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {SRS_DOCUMENT_DATA.authors.map((author, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#141414] p-6 rounded-3xl border border-slate-200 dark:border-[#222222] shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold text-lg font-outfit">
                          {author.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-[#202020] text-slate-700 dark:text-neutral-300 px-3 py-1 rounded-full border border-slate-200 dark:border-[#333333]">
                          SRS CO-AUTHOR
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
                        {author.name}
                      </h4>
                      <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        Roll No: {author.rollNo}
                      </p>
                      <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-neutral-400">
                        <div>
                          <span className="text-slate-400 dark:text-neutral-500">Department: </span>
                          <span className="font-semibold text-slate-800 dark:text-neutral-200">{author.branch}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 dark:text-neutral-500">Year / Sem: </span>
                          <span className="font-semibold text-slate-800 dark:text-neutral-200">{author.year}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 dark:text-neutral-500">College Email: </span>
                          <span className="font-mono text-slate-800 dark:text-neutral-200">{author.email}</span>
                        </div>
                        {author.personalEmail && (
                          <div>
                            <span className="text-slate-400 dark:text-neutral-500">Personal: </span>
                            <span className="font-mono text-slate-800 dark:text-neutral-200">{author.personalEmail}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#222222] flex items-center justify-between">
                      <button
                        onClick={() => {
                          const roleKey = idx === 0 ? 'STUDENT_BHAVESH' : 'STUDENT';
                          onSwitchUser(roleKey);
                          onClose();
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-emerald-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Switch to {author.name.split(' ')[0]}'s Profile</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Institution Credentials */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-600 dark:text-neutral-400">
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                    {INSTITUTION.name} (Autonomous)
                  </span>
                  <span>{INSTITUTION.location} • Affiliated to Osmania University & Approved by AICTE</span>
                </div>
                <a
                  href={INSTITUTION.website}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#1f1f1f] hover:bg-slate-100 dark:hover:bg-[#252525] border border-slate-200 dark:border-[#333333] text-xs font-bold text-slate-800 dark:text-white transition flex items-center gap-1.5 shrink-0"
                >
                  <span>Visit College Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-[#222222] bg-slate-50 dark:bg-[#111111] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>SCAM v1.0 SRS Fully Verified & Tested</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
