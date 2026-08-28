import React from 'react';
import { UtensilsCrossed, Clock, RotateCcw, ArrowRight } from 'lucide-react';
import { CURRENT_FOOD_ORDER, USUAL_FOOD_ORDER } from '../data/mockData';

export const FoodOrdersCard = ({
  onViewAll,
  onTrackOrder,
  onReorder,
}) => {
  return (
    <div className="bg-white dark:bg-[#111111] rounded-3xl p-5 border border-slate-200/80 dark:border-[#222222] shadow-xs flex flex-col justify-between h-full overflow-hidden transition-colors">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <UtensilsCrossed className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
              Canteen & Food Orders
            </h2>
          </div>
          <button
            id="btn-view-all-food"
            onClick={onViewAll}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 transition cursor-pointer"
          >
            Menu & Cart
          </button>
        </div>

        {/* Current Active Order */}
        <div className="mb-3.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
            <span>Active Live Order</span>
            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{CURRENT_FOOD_ORDER.token}</span>
          </div>

          <div
            onClick={onTrackOrder}
            className="bg-amber-50/70 dark:bg-[#19150e] border border-amber-200 dark:border-amber-900/50 rounded-2xl p-3 cursor-pointer hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-xs transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={CURRENT_FOOD_ORDER.image}
                alt={CURRENT_FOOD_ORDER.itemName}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-2xs border border-amber-200 dark:border-amber-900/60"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-neutral-100 truncate">
                    {CURRENT_FOOD_ORDER.itemName}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 shrink-0 font-mono">
                    {CURRENT_FOOD_ORDER.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                  {CURRENT_FOOD_ORDER.canteen} • {CURRENT_FOOD_ORDER.counter}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-amber-200/80 dark:border-amber-900/30 mt-2 text-xs">
              <div className="text-slate-600 dark:text-neutral-300 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Slot: <strong>{CURRENT_FOOD_ORDER.slot}</strong></span>
              </div>
              <span className="font-bold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 flex items-center gap-0.5">
                Track Live →
              </span>
            </div>
          </div>
        </div>

        {/* Quick Reorder Frequent Item */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider mb-1.5">
            Frequent Favorite
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-[#161616] border border-slate-100 dark:border-[#222222]">
            <div className="flex items-center gap-2.5 truncate">
              <img
                src={USUAL_FOOD_ORDER.image}
                alt={USUAL_FOOD_ORDER.itemName}
                className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-[#2a2a2a]"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-slate-800 dark:text-neutral-100 truncate">
                  {USUAL_FOOD_ORDER.itemName}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
                  {USUAL_FOOD_ORDER.canteen} • ₹{USUAL_FOOD_ORDER.price}
                </div>
              </div>
            </div>

            <button
              onClick={() => onReorder ? onReorder(USUAL_FOOD_ORDER) : onViewAll()}
              className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-purple-600 hover:bg-slate-800 dark:hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reorder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-[#222222] flex items-center justify-between text-xs text-slate-400 dark:text-neutral-500">
        <span className="text-[11px] font-mono">Advance slot booking enabled</span>
        <button
          onClick={onViewAll}
          className="font-bold text-slate-700 dark:text-neutral-300 hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1 cursor-pointer"
        >
          <span>Open Food Menu</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
