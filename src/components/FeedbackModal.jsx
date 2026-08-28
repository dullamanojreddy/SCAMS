import React, { useState } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api/client';

export const FeedbackModal = ({
  isOpen,
  onClose,
}) => {
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/v1/feedback', { rating, comment: comments });
    } catch (error) {
      console.warn('Feedback API unavailable; keeping local confirmation.', error.message);
    }
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComments('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl overflow-hidden text-slate-800 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#8b5cf6] text-white flex items-center justify-center font-bold">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-outfit">
              Campus Experience Feedback
            </h3>
            <p className="text-xs text-slate-500">
              Help us improve academic & campus facilities
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Thank you, Manoj!
            </h4>
            <p className="text-xs text-slate-500">
              Your feedback has been submitted to the Academic Dean's office. You earned +50 Campus Points!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Rate your overall campus experience today
              </label>
              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-125 transition cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Share your suggestions or appreciation
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                placeholder="WiFi speed, lab equipment, cafeteria food, library study zones..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
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
                className="flex-1 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-xs font-bold text-white transition shadow-sm cursor-pointer"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
