import React, { useEffect, useState } from 'react';
import {
  X,
  Briefcase,
  Search,
  Building2,
  HelpCircle,
  FileText,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Layers,
  Sparkles,
  Award,
  BookOpen,
  Terminal,
  Filter,
} from 'lucide-react';
import {
  PLACEMENT_COMPANIES,
  INTERVIEW_QUESTIONS,
  RESUME_GUIDANCE,
  USER_PROFILE,
} from '../data/mockData';
import { api } from '../api/client';

export const PlacementsModal = ({ isOpen, onClose, currentUser = USER_PROFILE }) => {
  const [activeTab, setActiveTab] = useState('companies'); // 'companies' | 'questions' | 'resume'
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    api.get('/api/v1/placements').then((payload) => {
      if (Array.isArray(payload?.companies)) {
        const normalizedCompanies = payload.companies.map((company) => ({
          id: company.id,
          name: company.company_name || company.name,
          logo: company.logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=240&auto=format&fit=crop&q=80',
          ctc: company.package_lpa ? `₹${company.package_lpa} LPA` : company.ctc || 'TBD',
          type: company.tier || company.type || 'LPA',
          driveDate: company.drive_date || company.driveDate || 'Upcoming',
          role: (company.roles || [company.role || 'Software Engineer']).join(', '),
          baseSalary: company.base_salary || company.baseSalary || '',
          eligibleBranches: company.eligible_branches || company.eligibleBranches || [],
          minCgpa: company.min_cgpa || company.minCgpa || 0,
          backlogsAllowed: company.backlogs_allowed ?? company.backlogsAllowed ?? 0,
          pastHires: company.past_hires || company.pastHires || 'Varies',
          rounds: (company.selection_rounds || company.rounds || []).map((round) => ({
            name: round.name || round,
            desc: round.desc || round.description || '',
          })),
          interviewQuestionsCount: company.interviewQuestionsCount || 0,
        }));
        setCompanies(normalizedCompanies);
        setSelectedCompanyId(normalizedCompanies[0]?.id || '');
      }
      if (Array.isArray(payload?.questions)) {
        setQuestions(payload.questions.map((question) => ({
          id: question.id,
          company: question.company_name || question.company || 'Company',
          role: question.role || 'Role',
          topic: question.topic,
          difficulty: question.difficulty || 'Medium',
          round: question.round || 'Interview',
          question: question.question,
          answerGuide: question.answer_tip || question.answerGuide || '',
          tags: question.tags || [],
        })));
      }
    }).catch(() => {});
  }, [isOpen]);

  // Resume Checklist State
  const [resumeChecklist, setResumeChecklist] = useState({
    singleColumn: true,
    quantifiableMetrics: true,
    actionVerbs: true,
    skillsDemonstrated: false,
    noTypos: true,
    onePageFresher: true,
  });

  if (!isOpen) return null;

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  const topics = ['All', 'DSA - Trees & Graphs', 'System Design & OS', 'DBMS & SQL', 'Operating Systems', 'DSA - Arrays', 'HR & Behavioral'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.company.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(questionSearch.toLowerCase()));
    const matchesTopic = selectedTopic === 'All' || q.topic === selectedTopic;
    const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  const checklistScore = Math.round(
    (Object.values(resumeChecklist).filter(Boolean).length / Object.keys(resumeChecklist).length) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-outfit">Placement Database & Resume Preparation</h3>
                <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">
                  REQ-4.7 MODULE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Vasavi Training & Placement Cell (TPO) • Company Archives, Interview Questions & ATS Guidance
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
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'companies'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Company Profiles ({companies.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'questions'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>Interview Questions Bank ({questions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'resume'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Resume Preparation & ATS Tips</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
                Score: {checklistScore}%
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Logged as: <strong>{currentUser?.name}</strong></span>
          </div>
        </div>

        {/* Tab 1: Companies */}
        {activeTab === 'companies' && (
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left Company List */}
            <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50/70 overflow-y-auto p-4 space-y-2 shrink-0">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                Visiting Companies
              </div>
              {companies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => setSelectedCompanyId(company.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    selectedCompanyId === company.id
                      ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{company.name}</h4>
                      <p className="text-xs text-blue-600 font-bold font-mono">{company.ctc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                    {company.type}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Company Details */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Top Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedCompany.logo}
                    alt={selectedCompany.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold font-outfit">{selectedCompany.name}</h3>
                      <span className="text-xs font-mono font-bold bg-blue-400/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-300/30">
                        Drive Date: {selectedCompany.driveDate}
                      </span>
                    </div>
                    <p className="text-xs text-blue-200 mt-1">{selectedCompany.role}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-blue-300">Package (CTC)</div>
                  <div className="text-2xl font-black font-mono text-[#c4f428]">
                    {selectedCompany.ctc}
                  </div>
                  <div className="text-[11px] text-blue-200 font-mono">{selectedCompany.baseSalary}</div>
                </div>
              </div>

              {/* Eligibility & Criteria Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-400 font-medium">Eligible Branches</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {selectedCompany.eligibleBranches.join(', ')}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-400 font-medium">Min CGPA & Backlogs</div>
                  <div className="text-xs font-bold text-slate-900 mt-1 font-mono">
                    {selectedCompany.minCgpa} CGPA • Max {selectedCompany.backlogsAllowed} Backlogs
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-400 font-medium">Vasavi Alumni Hired</div>
                  <div className="text-xs font-bold text-emerald-600 mt-1 font-mono">
                    {selectedCompany.pastHires}
                  </div>
                </div>
              </div>

              {/* Selection Process Stages */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Selection Process & Interview Stages</span>
                </h4>
                <div className="space-y-2.5">
                  {selectedCompany.rounds.map((round, idx) => (
                    <div
                      key={round.name}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3 shadow-xs"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{round.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{round.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Launch to Questions */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-blue-950 font-bold">
                  <Terminal className="w-4 h-4 text-blue-600" />
                  <span>View {selectedCompany.interviewQuestionsCount} Past Interview Questions for {selectedCompany.name}</span>
                </div>
                <button
                  onClick={() => {
                    setQuestionSearch(selectedCompany.name);
                    setActiveTab('questions');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  Explore Questions →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interview Questions Bank */}
        {activeTab === 'questions' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions (e.g. LRU Cache, Deadlock, B+ Tree, Microsoft)..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                      selectedDifficulty === diff
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3 pt-2">
              {filteredQuestions.map((q) => {
                const isExpanded = expandedQuestionId === q.id;
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-[10px] font-bold font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
                            {q.company} • {q.role}
                          </span>
                          <span className="text-[10px] font-bold font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
                            {q.topic}
                          </span>
                          <span
                            className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                              q.difficulty === 'Easy'
                                ? 'bg-emerald-50 text-emerald-700'
                                : q.difficulty === 'Medium'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{q.round}</span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {q.question}
                        </h4>
                      </div>

                      <button
                        onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition shrink-0 cursor-pointer"
                      >
                        {isExpanded ? 'Hide Solution' : 'View Guide'}
                      </button>
                    </div>

                    {/* Expandable Solution / Guide */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/70 -mx-4 -mb-4 p-4 rounded-b-2xl animate-fadeIn space-y-2">
                        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Official Vasavi Placement Cell Solution Blueprint:</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-mono bg-white p-3 rounded-xl border border-slate-200">
                          {q.answerGuide}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {q.tags.map((t) => (
                            <span key={t} className="text-[10px] text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md font-mono">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Resume Preparation & Tips */}
        {activeTab === 'resume' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {/* Top Checklist Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 to-teal-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold font-outfit flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#c4f428]" />
                  <span>Interactive ATS Resume Checklist</span>
                </h4>
                <p className="text-xs text-emerald-200 mt-1">
                  Vasavi TPO Approved Standard • Ensure high parse-rate across Workday, Greenhouse & Taleo ATS.
                </p>
              </div>
              <div className="text-center sm:text-right shrink-0">
                <div className="text-3xl font-black font-mono text-[#c4f428]">{checklistScore}%</div>
                <div className="text-[11px] text-emerald-200">ATS Readiness Score</div>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries({
                singleColumn: 'Strict single-column layout (no tables or split columns)',
                quantifiableMetrics: 'Every project bullet has measurable metrics (% or scale)',
                actionVerbs: 'Starts with high-impact power verbs (Engineered, Architected)',
                skillsDemonstrated: 'Skills mentioned are reflected in concrete project descriptions',
                noTypos: 'Consistent date formats (e.g. Aug 2024 - Present)',
                onePageFresher: 'Strict 1-page length for undergraduate campus resumes',
              }).map(([key, label]) => (
                <label
                  key={key}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={resumeChecklist[key]}
                    onChange={(e) =>
                      setResumeChecklist({ ...resumeChecklist, [key]: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-800 font-medium">{label}</span>
                </label>
              ))}
            </div>

            {/* Action Verbs Word Bank */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Recommended Power Action Verbs for Software Roles:
              </h5>
              <div className="flex flex-wrap gap-2">
                {RESUME_GUIDANCE.actionVerbs.map((verb) => (
                  <span
                    key={verb}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700 shadow-2xs"
                  >
                    {verb}
                  </span>
                ))}
              </div>
            </div>

            {/* Common Mistakes to Avoid */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <h5 className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                <span>⚠️ Common Red Flags Highlighted by Vasavi Recruiters:</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-rose-900">
                {RESUME_GUIDANCE.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Vasavi Placement Cell (TPO) • Contact: tpo@vce.ac.in</span>
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
