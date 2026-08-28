import React, { useEffect, useState } from 'react';
import {
  X,
  Search,
  Navigation,
  Building,
  Compass,
  MapPin,
  Layers,
  Sparkles,
  ArrowRight,
  Footprints,
  Clock,
  Accessibility,
  Droplets,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CAMPUS_BUILDINGS } from '../data/mockData';
import { api } from '../api/client';

export const FullMapModal = ({
  isOpen,
  onClose,
  selectedBuildingId,
}) => {
  const [buildings, setBuildings] = useState(CAMPUS_BUILDINGS);
  const [activeBuilding, setActiveBuilding] = useState(
    CAMPUS_BUILDINGS.find((b) => b.id === (selectedBuildingId || 'ramanujan')) || CAMPUS_BUILDINGS[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('3');
  const [mode, setMode] = useState('explore'); // 'explore' | 'navigate'

  // Navigation Route State (REQ-4.3.3)
  const [navOrigin, setNavOrigin] = useState('main-gate');
  const [navDestination, setNavDestination] = useState('room-304');
  const [navStarted, setNavStarted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    api.get('/api/v1/campus/buildings')
      .then((items) => {
        if (!Array.isArray(items) || !items.length) return;
        const normalized = items.map((item, index) => ({
          id: item.id || item.code || item.name || `building-${index}`,
          name: item.name,
          code: item.code || item.blockName || item.block_name || item.name?.slice(0, 3).toUpperCase(),
          departments: item.departments || [item.category || 'Campus'],
          floors: item.floorCount || item.floor_number || item.floorCount || 1,
          facilities: item.facilities || [],
          description: item.description || '',
        }));
        setBuildings(normalized);
      })
      .catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !buildings.length) return;
    setActiveBuilding(buildings.find((b) => b.id === selectedBuildingId) || buildings[0]);
  }, [isOpen, selectedBuildingId, buildings]);

  if (!isOpen) return null;

  const filteredBuildings = buildings.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.departments.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const routeSteps = [
    {
      step: 1,
      instruction: 'Start at Vasavi Main Entrance / Security Gate',
      distance: '0m',
      desc: 'Head north along the Central Boulevard towards Ramanujan Block.',
    },
    {
      step: 2,
      instruction: 'Enter Ramanujan Block via West Portico Entrance',
      distance: '85m',
      desc: 'Pass through the main foyer and turn right towards Elevator Bay B.',
    },
    {
      step: 3,
      instruction: 'Take Elevator or Central Stairs to 3rd Floor',
      distance: '110m',
      desc: 'Exit on Level 3. Turn left down the IT Department corridor.',
    },
    {
      step: 4,
      instruction: 'Arrive at Room 304 (IT Department Lab / Classroom)',
      distance: '145m',
      desc: 'Destination is on your left, adjacent to the Network Systems Lab.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row text-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition cursor-pointer z-30 shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Directory & Building Info Panel */}
        <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-outfit">
                  Campus Navigator (SCAM)
                </h3>
                <p className="text-[11px] text-slate-500">Vasavi 3D Map & Indoor Routing</p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-slate-200/70 p-1 rounded-xl mb-3 gap-1">
              <button
                onClick={() => {
                  setMode('explore');
                  setNavStarted(false);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                  mode === 'explore'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Explore</span>
              </button>

              <button
                onClick={() => setMode('navigate')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                  mode === 'navigate'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate</span>
              </button>
            </div>

            {mode === 'explore' ? (
              <>
                {/* Search Input */}
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search blocks, rooms, labs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Building Selector List */}
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 mb-4">
                  {filteredBuildings.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setActiveBuilding(b)}
                      className={`w-full p-2.5 rounded-xl text-left text-xs transition flex items-center justify-between cursor-pointer ${
                        activeBuilding.id === b.id
                          ? 'bg-indigo-50 text-indigo-950 font-bold border border-indigo-200'
                          : 'hover:bg-slate-200/60 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                        <span className="truncate">{b.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 uppercase">
                        {b.code}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Selected Building Details */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                      {activeBuilding.code}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {activeBuilding.floorsCount} Floors
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {activeBuilding.name}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {activeBuilding.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Departments:</div>
                    <div className="flex flex-wrap gap-1">
                      {activeBuilding.departments.map((dept) => (
                        <span
                          key={dept}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Turn-by-Turn Navigation Config Panel (REQ-4.3.3) */
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Start Location (Origin)
                    </label>
                    <select
                      value={navOrigin}
                      onChange={(e) => setNavOrigin(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="main-gate">Vasavi Main Entrance Gate</option>
                      <option value="canteen">Central Canteen Foyer</option>
                      <option value="library">Library Complex Ground</option>
                      <option value="admin">Admin Block Portico</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Destination Room / Lab
                    </label>
                    <select
                      value={navDestination}
                      onChange={(e) => setNavDestination(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="room-304">Room 304 - IT Dept (Ramanujan 3rd Floor)</option>
                      <option value="ai-lab">AI Research Lab (Aryabhata 2nd Floor)</option>
                      <option value="ece-vlsi">VLSI Design Lab (Visvesvaraya 1st Floor)</option>
                      <option value="placement-cell">TPO Placement Cell (Admin 2nd Floor)</option>
                      <option value="central-library">Reading Hall (Library 1st Floor)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setNavStarted(true)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Calculate Walking Route (REQ-4.3.3)</span>
                  </button>
                </div>

                {navStarted && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                      <span className="flex items-center gap-1">
                        <Footprints className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Walk Distance: 145m</span>
                      </span>
                      <span className="font-mono text-emerald-700">~2.5 Mins</span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Route optimized via Ramanujan West Elevator Bay.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Facility Indicators */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-around text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">🛗 Elevator</span>
            <span className="flex items-center gap-1">🚻 Washrooms</span>
            <span className="flex items-center gap-1">💧 Water Point</span>
          </div>
        </div>

        {/* Right Interactive Map / Floor Plan Stage */}
        <div className="flex-1 bg-slate-900 p-6 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Grid Canvas Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

          {/* Floor Level Tabs */}
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 p-1.5 rounded-2xl backdrop-blur-md">
              <span className="text-[11px] font-mono font-bold text-slate-400 px-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>FLOOR:</span>
              </span>
              {['G', '1', '2', '3', '4'].map((fl) => (
                <button
                  key={fl}
                  onClick={() => setSelectedFloor(fl)}
                  className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                    selectedFloor === fl
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {fl}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-2xl backdrop-blur-md text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE SENSORS ACTIVE</span>
            </div>
          </div>

          {/* Map Stage / Visual Schematic */}
          {mode === 'explore' ? (
            <div className="relative z-10 my-auto p-6 rounded-3xl bg-slate-800/70 border border-slate-700/80 backdrop-blur-md max-w-2xl mx-auto w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3 text-white">
                <div>
                  <h4 className="text-base font-bold font-outfit flex items-center gap-2">
                    <span>{activeBuilding.name}</span>
                    <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-400/30">
                      Floor {selectedFloor}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Viewing floor layout, room assignments, and facility hotspots
                  </p>
                </div>
                <div className="text-right font-mono text-xs text-emerald-400">
                  Status: All Labs Open
                </div>
              </div>

              {/* Schematic Room Blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-indigo-900/40 border border-indigo-500/40 text-white space-y-1">
                  <div className="text-[10px] font-mono text-indigo-300 font-bold">ROOM {selectedFloor}01</div>
                  <div className="text-xs font-bold">Theory Lecture Hall</div>
                  <div className="text-[10px] text-slate-400">Capacity: 75 Seats • Smart Board</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-900/40 border border-purple-500/40 text-white space-y-1">
                  <div className="text-[10px] font-mono text-purple-300 font-bold">ROOM {selectedFloor}02</div>
                  <div className="text-xs font-bold">Algorithms Lab</div>
                  <div className="text-[10px] text-slate-400">35 Workstations • Gigabit LAN</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-cyan-900/40 border border-cyan-500/40 text-white space-y-1">
                  <div className="text-[10px] font-mono text-cyan-300 font-bold">ROOM {selectedFloor}03</div>
                  <div className="text-xs font-bold">Staff Cabin / HOD</div>
                  <div className="text-[10px] text-slate-400">Office Hours: 10AM - 4PM</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-500/40 text-white space-y-1 relative ring-2 ring-emerald-400">
                  <div className="text-[10px] font-mono text-emerald-300 font-bold flex items-center justify-between">
                    <span>ROOM {selectedFloor}04</span>
                    <span className="bg-emerald-500 text-slate-950 font-bold text-[9px] px-1.5 rounded">MY CLASS</span>
                  </div>
                  <div className="text-xs font-bold">IT Dept Classroom (Section A)</div>
                  <div className="text-[10px] text-emerald-300 font-mono">Current: DBMS Lecture</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white space-y-1">
                  <div className="text-[10px] font-mono text-amber-300 font-bold">FACILITY BAY</div>
                  <div className="text-xs font-bold">Elevator & Water Cooler</div>
                  <div className="text-[10px] text-slate-400">Restrooms adjacent to West Exit</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white space-y-1">
                  <div className="text-[10px] font-mono text-rose-300 font-bold">FIRE EXIT</div>
                  <div className="text-xs font-bold">Emergency Staircase</div>
                  <div className="text-[10px] text-slate-400">Clear path to Assembly Ground</div>
                </div>
              </div>
            </div>
          ) : (
            /* Navigation Turn-by-Turn Guide Stage (REQ-4.3.3) */
            <div className="relative z-10 my-auto p-6 rounded-3xl bg-slate-800/80 border border-slate-700 backdrop-blur-md max-w-2xl mx-auto w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3 text-white">
                <div>
                  <h4 className="text-base font-bold font-outfit flex items-center gap-2">
                    <Footprints className="w-5 h-5 text-indigo-400" />
                    <span>Turn-by-Turn Navigation (REQ-4.3.3)</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    From Main Entrance to Room 304 • Ramanujan Block (Floor 3)
                  </p>
                </div>
                <div className="text-right font-mono text-xs text-[#c4f428]">
                  Total: 145 Meters
                </div>
              </div>

              <div className="space-y-2.5">
                {routeSteps.map((s) => (
                  <div
                    key={s.step}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700 text-white flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold font-mono flex items-center justify-center shrink-0">
                      {s.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-100">{s.instruction}</div>
                        <span className="text-[10px] font-mono text-indigo-300">{s.distance}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Bar Controls */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Vasavi Campus Coordinates: 17.3820° N, 78.3826° E</span>
            <span>Elevation: 512m MSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
