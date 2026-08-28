import React, { useEffect, useState } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  BookOpen,
  LayoutGrid,
  List,
  CheckCircle2,
  FileText,
  Building2,
} from 'lucide-react';
import { OFFICIAL_TIMETABLE } from '../data/mockData';

const getTodayScheduleDay = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  return today === 'Sunday' ? 'Monday' : today;
};

export const TimetableModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'master_grid' | 'subjects'
  const [selectedDay, setSelectedDay] = useState(getTodayScheduleDay);
  const [selectedBatch, setSelectedBatch] = useState('B1'); // 'B1' | 'B2'

  useEffect(() => {
    if (isOpen) {
      setSelectedDay(getTodayScheduleDay());
      setActiveTab('timeline');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentList = OFFICIAL_TIMETABLE.days[selectedDay] || [];
  const meta = OFFICIAL_TIMETABLE.metadata;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#101010] rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-[#222222] shadow-2xl overflow-hidden text-slate-800 dark:text-neutral-100 flex flex-col max-h-[92vh] transition-colors">
        {/* Close Button */}
        <button
          id="btn-close-timetable-modal"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1c1c1c] hover:bg-slate-200 dark:hover:bg-[#282828] text-slate-500 dark:text-neutral-400 flex items-center justify-center transition cursor-pointer z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Official College Timetable Metadata */}
        <div className="border-b border-slate-200 dark:border-[#222222] pb-4 mb-4 pr-10">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#7c3aed] text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
                    Vasavi College of Engineering (Autonomous)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-950/70 text-[#7c3aed] dark:text-purple-300">
                    {meta.branchSection}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium mt-0.5">
                  COURSE: <strong className="text-slate-700 dark:text-neutral-200">{meta.course}</strong> • SEMESTER: <strong className="text-slate-700 dark:text-neutral-200">{meta.semester}</strong> • ROOM NO: <strong className="text-slate-700 dark:text-neutral-200">{meta.roomNo}</strong> • Effective from: <strong className="text-slate-700 dark:text-neutral-200">{meta.effectiveFrom}</strong>
                </p>
              </div>
            </div>

            {/* Batch Selector */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#181818] p-1 rounded-2xl border border-slate-200/80 dark:border-[#2a2a2a] shrink-0">
              <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 pl-2">Lab Batch:</span>
              <button
                onClick={() => setSelectedBatch('B1')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedBatch === 'B1'
                    ? 'bg-[#7c3aed] text-white shadow-xs'
                    : 'text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Batch B1 (Roll 129-162)
              </button>
              <button
                onClick={() => setSelectedBatch('B2')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedBatch === 'B2'
                    ? 'bg-[#7c3aed] text-white shadow-xs'
                    : 'text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Batch B2 (Roll 163-193)
              </button>
            </div>
          </div>

          {/* Quick Details Strip */}
          <div className="flex items-center gap-4 mt-3 pt-2 text-[11px] text-slate-500 dark:text-neutral-400 border-t border-dashed border-slate-100 dark:border-[#222222] flex-wrap">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Class Coordinator: <strong className="text-slate-700 dark:text-neutral-200">{meta.classCoordinator}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Department: <strong className="text-slate-700 dark:text-neutral-200">Information Technology</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>College Timings: <strong className="text-slate-700 dark:text-neutral-200">09:40 AM - 04:20 PM</strong></span>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-100 dark:border-[#222222] flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-slate-900 dark:bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-[#262626]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Daily Schedule</span>
            </button>
            <button
              onClick={() => setActiveTab('master_grid')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'master_grid'
                  ? 'bg-slate-900 dark:bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-[#262626]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Master Weekly Matrix</span>
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'subjects'
                  ? 'bg-slate-900 dark:bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-[#262626]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Courses & Faculty Directory</span>
            </button>
          </div>

          {activeTab === 'timeline' && (
            <div className="flex gap-1.5 overflow-x-auto">
              {days.map((day) => {
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#7c3aed] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-[#262626]'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* TAB 1: DAILY TIMELINE VIEW */}
        {activeTab === 'timeline' && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">
                {selectedDay} Schedule — Batch {selectedBatch}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-neutral-500">
                {currentList.length} Sessions Total
              </span>
            </div>

            {currentList.map((item, idx) => {
              const isBreak = item.type === 'Break';
              const isLab = item.type === 'Lab';
              const batchLab = isLab && item.batchDetails ? item.batchDetails[selectedBatch] : null;

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    isBreak
                      ? 'bg-amber-50/80 dark:bg-[#19140c] border-amber-200/90 dark:border-amber-900/40 text-amber-950 dark:text-amber-200'
                      : 'bg-white dark:bg-[#151515] border-slate-200 dark:border-[#262626] hover:border-purple-300 dark:hover:border-[#383838] hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 font-mono ${
                      isBreak
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200'
                        : 'bg-slate-100 dark:bg-[#1f1f1f] text-slate-700 dark:text-neutral-200'
                    }`}>
                      <Clock className={`w-3.5 h-3.5 ${isBreak ? 'text-amber-700 dark:text-amber-400' : 'text-purple-600 dark:text-purple-400'}`} />
                      <span>{item.time}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {batchLab ? `${batchLab.lab} (Batch ${selectedBatch})` : item.subject}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#202020] text-slate-600 dark:text-neutral-300 font-bold">
                          {item.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-neutral-400 flex items-center gap-2 mt-0.5 flex-wrap">
                        <span>Faculty: <strong className="text-slate-700 dark:text-neutral-200">{batchLab ? batchLab.faculty : item.faculty}</strong></span>
                        {item.short && (
                          <span className="text-purple-600 dark:text-purple-400 font-semibold">• {item.short}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:self-center shrink-0">
                    <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-neutral-300 bg-slate-50 dark:bg-[#1c1c1c] px-2.5 py-1 rounded-lg border border-slate-100 dark:border-[#2c2c2c]">
                      <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span className="font-semibold">{batchLab ? batchLab.room : item.room}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.type === 'Lab'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : item.type === 'Lecture'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          : item.type === 'Break'
                          ? 'bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold'
                          : item.type === 'Project'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                </div>
              );
            })}

            {meta.note && (
              <div className="p-3 bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#262626] rounded-2xl text-[11px] text-slate-600 dark:text-neutral-400 mt-3 flex items-start gap-2">
                <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{meta.note}</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MASTER WEEKLY MATRIX */}
        {activeTab === 'master_grid' && (
          <div className="flex-1 overflow-auto border border-slate-200 dark:border-[#262626] rounded-2xl">
            <table className="w-full text-xs text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-[#181818] text-slate-700 dark:text-neutral-200 font-bold border-b border-slate-200 dark:border-[#262626] text-[11px]">
                  <th className="p-2.5 border-r border-slate-200 dark:border-[#262626] w-16 text-center">DAY / TIME</th>
                  <th className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center">09:40–10:40</th>
                  <th className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center">10:40–11:40</th>
                  <th className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center">11:40–12:40</th>
                  <th className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 w-20">12:40–01:20 LUNCH</th>
                  <th className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center">01:20–02:20</th>
                  <th className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center">02:20–03:20</th>
                  <th className="p-2.5 text-center">03:20–04:20</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#262626]">
                {/* MON */}
                <tr className="hover:bg-slate-50/80 dark:hover:bg-[#161616]">
                  <td className="p-2.5 font-bold bg-slate-50 dark:bg-[#141414] border-r border-slate-200 dark:border-[#262626] text-center text-purple-700 dark:text-purple-400">MON</td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold col-span-2" colSpan={2}>
                    <div className="font-bold text-slate-800 dark:text-neutral-100">SDC-V: CSE-II</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Lucy Sapan</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-slate-800 dark:text-neutral-100">CN / Mentoring*</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Dr. Sreelakshmi</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center bg-amber-50/70 dark:bg-amber-950/30 font-bold text-amber-900 dark:text-amber-200" rowSpan={6}>
                    <div className="rotate-0 sm:rotate-90 tracking-widest text-[11px]">LUNCH</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">OE-III</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold bg-rose-50/40 dark:bg-rose-950/20" colSpan={2}>
                    <div className="font-bold text-rose-700 dark:text-rose-400">OS LAB (B1) / CN LAB (B2)</div>
                    <div className="text-[10px] text-slate-500 dark:text-neutral-400">IT Lab-I / IT Lab-VIII (R-108)</div>
                  </td>
                </tr>

                {/* TUE */}
                <tr className="hover:bg-slate-50/80 dark:hover:bg-[#161616]">
                  <td className="p-2.5 font-bold bg-slate-50 dark:bg-[#141414] border-r border-slate-200 dark:border-[#262626] text-center text-purple-700 dark:text-purple-400">TUE</td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-slate-800 dark:text-neutral-100">OS</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Dr. Kezia Rani</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-slate-800 dark:text-neutral-100">OS</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Dr. Kezia Rani</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-purple-700 dark:text-purple-400">AI&ML</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Dr. Prashanth</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">OE-III</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold bg-rose-50/40 dark:bg-rose-950/20" colSpan={2}>
                    <div className="font-bold text-rose-700 dark:text-rose-400">SE LAB (B1) / AI&ML LAB (B2)</div>
                    <div className="text-[10px] text-slate-500 dark:text-neutral-400">IT Lab-VIII (R-108) / IT Lab-VI</div>
                  </td>
                </tr>

                {/* WED */}
                <tr className="hover:bg-slate-50/80 dark:hover:bg-[#161616]">
                  <td className="p-2.5 font-bold bg-slate-50 dark:bg-[#141414] border-r border-slate-200 dark:border-[#262626] text-center text-purple-700 dark:text-purple-400">WED</td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-blue-700 dark:text-blue-400">CN</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Dr. Sreelakshmi</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-slate-800 dark:text-neutral-100">SDC-VI: TS</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">External Expert</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-slate-800 dark:text-neutral-100">OS</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Dr. Kezia Rani</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">OE-III</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-indigo-700 dark:text-indigo-400">SE</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Soumya Sanyal</div>
                  </td>
                  <td className="p-2.5 text-center font-semibold">
                    <div className="font-bold text-purple-700 dark:text-purple-400">AI&ML</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Dr. Prashanth</div>
                  </td>
                </tr>

                {/* THU */}
                <tr className="hover:bg-slate-50/80 dark:hover:bg-[#161616]">
                  <td className="p-2.5 font-bold bg-slate-50 dark:bg-[#141414] border-r border-slate-200 dark:border-[#262626] text-center text-purple-700 dark:text-purple-400">THU</td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-indigo-700 dark:text-indigo-400">SE</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Soumya Sanyal</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold bg-rose-50/40 dark:bg-rose-950/20" colSpan={2}>
                    <div className="font-bold text-rose-700 dark:text-rose-400">OS LAB (B2) / AI&ML LAB (B1)</div>
                    <div className="text-[10px] text-slate-500 dark:text-neutral-400">IT Lab-I / IT Lab-VIII (R-108)</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-purple-700 dark:text-purple-400">AI&ML</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Dr. Prashanth</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-blue-700 dark:text-blue-400">CN</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Dr. Sreelakshmi</div>
                  </td>
                  <td className="p-2.5 text-center font-semibold">
                    <div className="font-bold text-slate-800 dark:text-neutral-100">SDC-VI: TS</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">External Expert</div>
                  </td>
                </tr>

                {/* FRI */}
                <tr className="hover:bg-slate-50/80 dark:hover:bg-[#161616]">
                  <td className="p-2.5 font-bold bg-slate-50 dark:bg-[#141414] border-r border-slate-200 dark:border-[#262626] text-center text-purple-700 dark:text-purple-400">FRI</td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-slate-800 dark:text-neutral-100">OS</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Dr. Kezia Rani</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold bg-rose-50/40 dark:bg-rose-950/20" colSpan={2}>
                    <div className="font-bold text-rose-700 dark:text-rose-400">CN LAB (B1) / SE LAB (B2)</div>
                    <div className="text-[10px] text-slate-500 dark:text-neutral-400">IT Lab-III / IT Lab-VIII (R-108)</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold bg-emerald-50/40 dark:bg-emerald-950/20" colSpan={3}>
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">TBP (Theme Based Project) (R-104)</div>
                    <div className="text-[10px] text-slate-500 dark:text-neutral-400">L. Divya / Dr. Arun Kumar Silveru / B.A. Farooqui</div>
                  </td>
                </tr>

                {/* SAT */}
                <tr className="hover:bg-slate-50/80 dark:hover:bg-[#161616]">
                  <td className="p-2.5 font-bold bg-slate-50 dark:bg-[#141414] border-r border-slate-200 dark:border-[#262626] text-center text-purple-700 dark:text-purple-400">SAT</td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-indigo-700 dark:text-indigo-400">SE</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Soumya Sanyal</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-blue-700 dark:text-blue-400">CN</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Dr. Sreelakshmi</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-purple-700 dark:text-purple-400">AI&ML</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">Dr. Prashanth</div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 dark:border-[#262626] text-center font-semibold">
                    <div className="font-bold text-slate-800 dark:text-neutral-100">ECA-II</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-400">G. Radha</div>
                  </td>
                  <td className="p-2.5 text-center font-semibold bg-blue-50/40 dark:bg-blue-950/20" colSpan={2}>
                    <div className="font-bold text-blue-700 dark:text-blue-400">LIBRARY / SPORTS</div>
                    <div className="text-[10px] text-slate-500 dark:text-neutral-400">Central Library / Sports Arena</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: SUBJECTS & FACULTY DIRECTORY */}
        {activeTab === 'subjects' && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {OFFICIAL_TIMETABLE.subjectsList.map((sub, i) => (
                <div
                  key={i}
                  className="p-3 bg-white dark:bg-[#151515] border border-slate-200 dark:border-[#262626] rounded-2xl hover:border-purple-300 dark:hover:border-[#383838] transition-all flex items-start justify-between gap-2.5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40">
                        {sub.code}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {sub.short}
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 dark:text-neutral-200 font-medium mt-1">
                      {sub.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
                      <span className="font-semibold text-slate-600 dark:text-neutral-300">Faculty:</span> {sub.faculty}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    sub.type === 'Lab'
                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                      : sub.type === 'Elective'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : sub.type === 'Skill Course'
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                      : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                  }`}>
                    {sub.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#222222] flex flex-wrap justify-between items-center gap-2">
          <div className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Official VCE Timetable • Verified by HOD, IT & Principal</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-purple-600 hover:bg-slate-800 dark:hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
