import React, { useMemo, useState } from 'react';
import { Calculator, AlertCircle, Info } from 'lucide-react';

// Illustrative, configurable example rate (₹ per overdue day). The borrowing
// banner in LibraryModal uses ₹5.00/day, so we keep that as the default.
// This is NOT an official college fine policy.
export const DEFAULT_LIBRARY_FINE_RATE = 5;
export const MAX_OVERDUE_DAYS = 365;

function parseOverdueDays(raw, maxDays) {
  const value = raw.trim();
  if (value === '') return { days: null, error: null };

  if (value.startsWith('-')) {
    return { days: null, error: 'Overdue days cannot be negative.' };
  }
  if (!/^\d+$/.test(value)) {
    return { days: null, error: 'Enter overdue days as a whole number (no decimals or symbols).' };
  }

  const days = Number(value);
  if (!Number.isSafeInteger(days)) {
    return { days: null, error: 'Enter a valid number of days.' };
  }
  if (days > maxDays) {
    return { days: null, error: `Enter ${maxDays} days or fewer.` };
  }
  return { days, error: null };
}

export const LibraryFineCalculator = ({
  dailyRate = DEFAULT_LIBRARY_FINE_RATE,
  maxDays = MAX_OVERDUE_DAYS,
}) => {
  const [daysInput, setDaysInput] = useState('');

  const { days, error } = useMemo(
    () => parseOverdueDays(daysInput, maxDays),
    [daysInput, maxDays]
  );

  const hasInput = daysInput.trim() !== '';
  const isValid = days !== null && !error;
  const totalFine = isValid ? days * dailyRate : 0;

  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
          <Calculator className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">Library Fine Calculator</h4>
          <p className="text-[11px] text-slate-500">Estimate the fine for an overdue borrowed book</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Daily fine rate (fixed, configurable) */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="text-[11px] text-slate-500 font-medium">Daily fine rate</div>
          <div className="text-base font-bold text-slate-900 font-mono">
            ₹{dailyRate.toFixed(2)}
            <span className="text-xs font-medium text-slate-500"> / day</span>
          </div>
        </div>

        {/* Overdue days input */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <label htmlFor="library-overdue-days" className="text-[11px] text-slate-500 font-medium">
            Overdue days
          </label>
          <input
            id="library-overdue-days"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            placeholder="e.g. 3"
            value={daysInput}
            onChange={(e) => setDaysInput(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'library-overdue-error' : undefined}
            className={`mt-1 w-full px-3 py-1.5 bg-white border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 transition ${
              error
                ? 'border-rose-300 focus:ring-rose-400'
                : 'border-slate-200 focus:ring-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Validation error */}
      {error && (
        <div
          id="library-overdue-error"
          role="alert"
          className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result */}
      <div className="mt-3 p-3 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-cyan-800 font-medium">Total fine</div>
          <div className="text-[11px] text-cyan-700 font-mono">
            {isValid
              ? `${days} day${days === 1 ? '' : 's'} × ₹${dailyRate.toFixed(2)}`
              : hasInput
              ? 'Fix the value above to calculate'
              : 'Enter overdue days to calculate'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold font-mono text-cyan-900">
            ₹{totalFine.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Rate disclaimer */}
      <div className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-500">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>
          Configurable example rate of ₹{dailyRate.toFixed(2)}/day for demonstration. This is not
          the college's official fine policy.
        </span>
      </div>
    </div>
  );
};
