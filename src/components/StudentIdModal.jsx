import React, { useState } from 'react';
import { X, QrCode, ShieldCheck, Sparkles, Copy, Check } from 'lucide-react';
import { USER_PROFILE } from '../data/mockData';

export const StudentIdModal = ({ isOpen, onClose, currentUser = USER_PROFILE }) => {
  const [copied, setCopied] = useState(false);
  const profile = currentUser || USER_PROFILE;

  if (!isOpen) return null;

  const handleCopyRoll = () => {
    navigator.clipboard.writeText(profile.rollNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0c1421] text-white rounded-3xl p-6 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Card Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#c4f428] flex items-center justify-center text-[#0c1421] font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-outfit text-white">
              Smart Student ID Card
            </h3>
            <p className="text-xs text-[#c4f428] font-semibold font-mono">
              CAMPUS OS • 1602 PREFIX SYSTEM
            </p>
          </div>
        </div>

        {/* ID Card Visual */}
        <div className="bg-gradient-to-br from-[#162338] via-[#101927] to-[#0a101a] rounded-2xl p-5 border border-slate-700/80 shadow-lg relative overflow-hidden mb-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c4f428]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3.5">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#c4f428]/80 shadow"
              />
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Active Student
                </span>
                <h4 className="text-base font-bold text-white mt-1">
                  {profile.name}
                </h4>
                <p className="text-xs text-slate-300">
                  {profile.department}
                </p>
              </div>
            </div>

            <div className="w-9 h-7 rounded-md bg-amber-400/90 border border-amber-300/60 flex items-center justify-center text-[8px] font-mono text-amber-950 font-bold shadow-xs">
              CHIP
            </div>
          </div>

          {/* Student Information Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-[#0a101a]/70 p-3.5 rounded-xl border border-slate-800 mb-4">
            <div>
              <div className="text-[10px] text-slate-400">Roll Number</div>
              <div className="font-bold text-white font-mono flex items-center gap-1.5 mt-0.5">
                <span>{profile.rollNo}</span>
                <button
                  onClick={handleCopyRoll}
                  className="text-slate-400 hover:text-white transition cursor-pointer"
                  title="Copy Roll No"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400">Blood Group</div>
              <div className="font-bold text-white font-mono mt-0.5">
                {profile.bloodGroup || 'O+'}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400">Valid Through</div>
              <div className="font-bold text-white font-mono mt-0.5">
                {profile.validThru || '2028'}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400">Campus Points</div>
              <div className="font-bold text-[#c4f428] font-mono mt-0.5">
                {(profile.campusPoints || 1250).toLocaleString()} PTS
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex items-center justify-between bg-white rounded-xl p-3 text-slate-900">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-900">
                Gate & Library Scan QR
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {profile.libraryCardNo || `LIB-${profile.rollNo}`}
              </div>
              <div className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> NFC Tap Enabled
              </div>
            </div>

            {/* Generated QR Graphic */}
            <div className="w-16 h-16 bg-slate-900 rounded-lg p-1.5 flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-white" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
