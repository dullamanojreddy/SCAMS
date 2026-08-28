import React, { useState } from 'react';
import { X, Megaphone, CheckCircle2 } from 'lucide-react';

export const ReportIssueModal = ({
  isOpen,
  onClose,
}) => {
  const [category, setCategory] = useState('Classroom Projector / AC');
  const [location, setLocation] = useState('CSE Block - Room 304');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const categories = [
    'Classroom Projector / AC',
    'WiFi & Network Connectivity',
    'Laboratory Equipment',
    'Hostel / Water Supply',
    'Canteen & Hygiene',
    'Electrical & Lighting',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl overflow-hidden text-slate-800 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-outfit">
              Report Campus Issue
            </h3>
            <p className="text-xs text-slate-500">
              Campus Facilities & Maintenance Helpdesk
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Issue Ticket Raised (#TKT-9842)
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              The Campus Maintenance team has been notified. Expected resolution within 4 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Issue Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Location on Campus
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. CSE Block 3rd Floor Room 304"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Description of Issue
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe what's wrong (e.g. HDMI cable missing, projector display flickering)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                required
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition shadow-sm cursor-pointer"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
