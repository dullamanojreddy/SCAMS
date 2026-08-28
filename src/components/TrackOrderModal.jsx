import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  QrCode,
  Clock,
  RotateCcw,
  Store,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { CURRENT_FOOD_ORDER, PAST_FOOD_ORDERS } from '../data/mockData';

export const TrackOrderModal = ({
  isOpen,
  onClose,
  activeOrder = CURRENT_FOOD_ORDER,
  onReorder,
}) => {
  const [currentOrder, setCurrentOrder] = useState(activeOrder);
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'history'

  if (!isOpen) return null;

  const stages = [
    { key: 'Placed', label: 'Order Placed', desc: 'Received by kitchen', icon: CheckCircle2 },
    { key: 'Preparing', label: 'Preparing', desc: 'Freshly cooking by chef', icon: ChefHat },
    { key: 'Ready for Pickup', label: 'Ready for Pickup', desc: 'Collect at counter', icon: PackageCheck },
    { key: 'Completed', label: 'Picked Up', desc: 'Order fulfilled', icon: CheckCircle2 },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === currentOrder.status);

  const handleAdminStep = (stageKey) => {
    setCurrentOrder({ ...currentOrder, status: stageKey });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-outfit">Campus Order Tracker</h3>
              <p className="text-[11px] text-slate-300">Vasavi Canteen • Real-Time Kitchen Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-6 pt-2 pb-1.5 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'live'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Active Order ({currentOrder.token})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Past Orders ({PAST_FOOD_ORDERS.length})
          </button>
        </div>

        {/* Tab 1: Live Order Tracking */}
        {activeTab === 'live' && (
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Top Order Card */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <img
                src={currentOrder.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80'}
                alt={currentOrder.itemName}
                className="w-16 h-16 rounded-xl object-cover shadow-xs border border-amber-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-800 uppercase">
                    {currentOrder.canteen}
                  </span>
                  <span className="text-base font-black font-mono text-amber-950">
                    {currentOrder.token}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {currentOrder.itemName}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-mono">
                  <span>Slot: {currentOrder.slot}</span>
                  <span>•</span>
                  <span>{currentOrder.counter}</span>
                </div>
              </div>
            </div>

            {/* 4-Stage Vertical Timeline (REQ-4.4.4) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kitchen Dispatch Lifecycle
              </div>

              <div className="space-y-4">
                {stages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isCompleted = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const isPending = idx > currentStageIndex;

                  return (
                    <div key={stage.key} className="flex items-start gap-3.5 relative">
                      {idx < stages.length - 1 && (
                        <div
                          className={`absolute left-4 top-8 bottom-[-16px] w-0.5 ${
                            idx < currentStageIndex ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                        />
                      )}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-amber-500 text-white animate-bounce ring-4 ring-amber-100'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="flex items-center justify-between">
                          <h5
                            className={`text-xs font-bold ${
                              isCurrent ? 'text-amber-950 font-outfit text-sm' : 'text-slate-800'
                            }`}
                          >
                            {stage.label}
                          </h5>
                          {isCurrent && (
                            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{stage.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QR Code Verification Box */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900">Show QR for Express Pickup</div>
                <p className="text-[11px] text-slate-500">
                  Scan at Canteen Counter to claim food without queuing
                </p>
                <div className="text-xs font-mono font-bold text-indigo-600">
                  Token: {currentOrder.token}
                </div>
              </div>
              <div className="p-2 bg-slate-900 rounded-xl text-white">
                <QrCode className="w-10 h-10" />
              </div>
            </div>

            {/* Admin / Canteen Simulator Buttons */}
            <div className="p-3.5 rounded-2xl bg-slate-100 text-slate-600 text-xs space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Staff Order Status Override (Demo Testing):
              </div>
              <div className="flex gap-2 flex-wrap">
                {stages.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => handleAdminStep(s.key)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      currentOrder.status === s.key
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Mark {s.key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Past Orders History */}
        {activeTab === 'history' && (
          <div className="p-6 overflow-y-auto space-y-3">
            {PAST_FOOD_ORDERS.map((past) => (
              <div
                key={past.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {past.canteen}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{past.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{past.itemName}</h4>
                  <div className="text-xs font-mono font-bold text-slate-700 mt-0.5">
                    ₹{past.total} • {past.status}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onReorder) onReorder(past);
                    setActiveTab('live');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Vasavi Canteen In-charge: 040-23146000</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
