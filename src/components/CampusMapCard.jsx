import React, { useState } from 'react';
import { Plus, Minus, Crosshair } from 'lucide-react';
import { CAMPUS_BUILDINGS } from '../data/mockData';

export const CampusMapCard = ({
  onExploreFullMap,
  onSelectBuilding,
  selectedFloor: propFloor,
  onFloorChange,
}) => {
  const [localFloor, setLocalFloor] = useState('3');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredBuilding, setHoveredBuilding] = useState(null);

  const activeFloor = propFloor || localFloor;

  const handleFloorClick = (floor) => {
    setLocalFloor(floor);
    onFloorChange?.(floor);
  };

  const handleZoom = (delta) => {
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 0.8), 1.5));
  };

  return (
    <div className="bg-white dark:bg-[#111111] rounded-3xl p-5 border border-slate-200/80 dark:border-[#222222] shadow-xs flex flex-col justify-between h-full relative overflow-hidden transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 z-10">
        <h2 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
          Campus Map
        </h2>
        <button
          id="btn-explore-full-map"
          onClick={onExploreFullMap}
          className="text-xs font-semibold text-[#7c3aed] dark:text-purple-400 hover:text-[#6d28d9] dark:hover:text-purple-300 transition cursor-pointer"
        >
          Explore Full Map
        </button>
      </div>

      {/* Map Canvas Area */}
      <div className="relative w-full h-[220px] rounded-2xl overflow-hidden bg-[#e2ece0] dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-[#222222] shadow-inner group">
        {/* Isometric SVG Map Graphics */}
        <div
          className="w-full h-full transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 500 320"
            className="w-full h-full object-cover select-none"
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="grassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d5e8cf" />
                <stop offset="100%" stopColor="#b9dcae" />
              </linearGradient>

              <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>

              <linearGradient id="roofGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c8926a" />
                <stop offset="100%" stopColor="#a36e47" />
              </linearGradient>

              <linearGradient id="roofGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#b8835e" />
                <stop offset="100%" stopColor="#96613c" />
              </linearGradient>

              <linearGradient id="wallGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e8dfd8" />
                <stop offset="100%" stopColor="#c5beb8" />
              </linearGradient>

              <linearGradient id="wallGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f3eee9" />
                <stop offset="100%" stopColor="#ded7d0" />
              </linearGradient>

              <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6d28d9" />
              </linearGradient>

              <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Grass & Terrain */}
            <rect width="500" height="320" fill="url(#grassGrad)" />

            {/* Trees & Landscaping details */}
            <g opacity="0.8">
              <circle cx="60" cy="80" r="14" fill="#69a657" />
              <circle cx="75" cy="70" r="12" fill="#528e41" />
              <circle cx="50" cy="95" r="10" fill="#7cb669" />

              <circle cx="210" cy="40" r="16" fill="#69a657" />
              <circle cx="230" cy="35" r="12" fill="#528e41" />

              <circle cx="430" cy="110" r="18" fill="#69a657" />
              <circle cx="450" cy="130" r="14" fill="#528e41" />
              <circle cx="420" cy="140" r="12" fill="#7cb669" />

              <circle cx="380" cy="270" r="16" fill="#69a657" />
              <circle cx="400" cy="285" r="14" fill="#528e41" />

              <circle cx="160" cy="280" r="18" fill="#69a657" />
              <circle cx="180" cy="265" r="15" fill="#528e41" />
            </g>

            {/* Campus Pathways and Roads */}
            <g fill="none" stroke="url(#roadGrad)" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 0 160 Q 150 140 260 170 T 500 130" strokeWidth="26" />
              <path d="M 170 30 Q 190 120 220 220 T 260 320" strokeWidth="20" />
              <path d="M 330 40 Q 340 140 370 200 T 450 320" strokeWidth="18" />
              <path d="M 230 180 Q 280 190 340 180" strokeWidth="14" />
            </g>

            {/* Road Dash Lines */}
            <path
              d="M 10 160 Q 150 140 260 170 T 490 130"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="6 6"
              opacity="0.8"
            />

            {/* Active Navigation Route to CSE Block */}
            <path
              d="M 245 200 C 260 195, 275 190, 290 160 C 300 145, 315 130, 325 110"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="3.5"
              strokeDasharray="5 5"
              className="animate-pulse"
            />

            {/* 1. Admin Block */}
            <g
              className="cursor-pointer transition-transform hover:-translate-y-1"
              onClick={() => onSelectBuilding?.(CAMPUS_BUILDINGS[0])}
              onMouseEnter={() => setHoveredBuilding('Admin Block')}
              onMouseLeave={() => setHoveredBuilding(null)}
            >
              <polygon points="120,60 190,40 210,65 140,85" fill="rgba(0,0,0,0.15)" />
              <polygon points="120,60 140,85 140,65 120,40" fill="url(#wallGrad1)" />
              <polygon points="140,85 210,65 210,45 140,65" fill="url(#wallGrad2)" />
              <polygon points="120,40 190,20 210,45 140,65" fill="url(#roofGrad1)" />
              <polygon points="135,36 175,25 185,38 145,50" fill="url(#roofGrad2)" />
            </g>

            {/* 2. Library */}
            <g
              className="cursor-pointer transition-transform hover:-translate-y-1"
              onClick={() => onSelectBuilding?.(CAMPUS_BUILDINGS[1])}
              onMouseEnter={() => setHoveredBuilding('Library')}
              onMouseLeave={() => setHoveredBuilding(null)}
            >
              <polygon points="320,55 380,40 400,60 340,75" fill="rgba(0,0,0,0.15)" />
              <polygon points="320,55 340,75 340,55 320,35" fill="url(#wallGrad1)" />
              <polygon points="340,75 400,60 400,40 340,55" fill="url(#wallGrad2)" />
              <polygon points="320,35 380,20 400,40 340,55" fill="url(#roofGrad1)" />
            </g>

            {/* 3. Canteen */}
            <g
              className="cursor-pointer transition-transform hover:-translate-y-1"
              onClick={() => onSelectBuilding?.(CAMPUS_BUILDINGS[2])}
              onMouseEnter={() => setHoveredBuilding('Canteen')}
              onMouseLeave={() => setHoveredBuilding(null)}
            >
              <polygon points="40,110 100,95 120,115 60,130" fill="rgba(0,0,0,0.15)" />
              <polygon points="40,110 60,130 60,110 40,90" fill="url(#wallGrad1)" />
              <polygon points="60,130 120,115 120,95 60,110" fill="url(#wallGrad2)" />
              <polygon points="40,90 100,75 120,95 60,110" fill="url(#roofGrad1)" />
            </g>

            {/* 4. CSE Block */}
            <g
              className="cursor-pointer transition-transform hover:-translate-y-1"
              onClick={() => onSelectBuilding?.(CAMPUS_BUILDINGS[3])}
              onMouseEnter={() => setHoveredBuilding('CSE Block')}
              onMouseLeave={() => setHoveredBuilding(null)}
            >
              <polygon points="290,115 380,90 405,120 315,145" fill="rgba(124,58,237,0.25)" />
              <polygon points="290,115 315,145 315,115 290,85" fill="url(#wallGrad1)" />
              <polygon points="315,145 405,120 405,90 315,115" fill="url(#wallGrad2)" />
              <polygon points="290,85 380,60 405,90 315,115" fill="url(#roofGrad1)" />
              <polygon points="310,80 365,65 380,82 325,98" fill="url(#roofGrad2)" />
            </g>

            {/* 5. IT Block */}
            <g
              className="cursor-pointer transition-transform hover:-translate-y-1"
              onClick={() => onSelectBuilding?.(CAMPUS_BUILDINGS[4])}
              onMouseEnter={() => setHoveredBuilding('IT Block')}
              onMouseLeave={() => setHoveredBuilding(null)}
            >
              <polygon points="50,195 130,175 150,205 70,225" fill="rgba(0,0,0,0.15)" />
              <polygon points="50,195 70,225 70,195 50,165" fill="url(#wallGrad1)" />
              <polygon points="70,225 150,205 150,175 70,195" fill="url(#wallGrad2)" />
              <polygon points="50,165 130,145 150,175 70,195" fill="url(#roofGrad1)" />
            </g>

            {/* 6. Seminar Hall */}
            <g
              className="cursor-pointer transition-transform hover:-translate-y-1"
              onClick={() => onSelectBuilding?.(CAMPUS_BUILDINGS[5])}
              onMouseEnter={() => setHoveredBuilding('Seminar Hall')}
              onMouseLeave={() => setHoveredBuilding(null)}
            >
              <polygon points="190,225 250,210 270,230 210,245" fill="rgba(0,0,0,0.15)" />
              <polygon points="190,225 210,245 210,225 190,205" fill="url(#wallGrad1)" />
              <polygon points="210,245 270,230 270,210 210,225" fill="url(#wallGrad2)" />
              <polygon points="190,205 250,190 270,210 210,225" fill="url(#roofGrad1)" />
            </g>

            {/* 7. ECE Block */}
            <g
              className="cursor-pointer transition-transform hover:-translate-y-1"
              onClick={() => onSelectBuilding?.(CAMPUS_BUILDINGS[6])}
              onMouseEnter={() => setHoveredBuilding('ECE Block')}
              onMouseLeave={() => setHoveredBuilding(null)}
            >
              <polygon points="340,190 400,175 420,195 360,210" fill="rgba(0,0,0,0.15)" />
              <polygon points="340,190 360,210 360,190 340,170" fill="url(#wallGrad1)" />
              <polygon points="360,210 420,195 420,175 360,190" fill="url(#wallGrad2)" />
              <polygon points="340,170 400,155 420,175 360,190" fill="url(#roofGrad1)" />
            </g>

            {/* 8. Sports Complex */}
            <g
              className="cursor-pointer transition-transform hover:-translate-y-1"
              onClick={() => onSelectBuilding?.(CAMPUS_BUILDINGS[7])}
              onMouseEnter={() => setHoveredBuilding('Sports Complex')}
              onMouseLeave={() => setHoveredBuilding(null)}
            >
              <polygon points="320,260 400,240 420,270 340,290" fill="rgba(0,0,0,0.15)" />
              <polygon points="320,260 340,290 340,260 320,230" fill="url(#wallGrad1)" />
              <polygon points="340,290 420,270 420,240 340,260" fill="url(#wallGrad2)" />
              <polygon points="320,230 400,210 420,240 340,260" fill="url(#roofGrad1)" />
            </g>

            {/* User Blue Location Beacon */}
            <g transform="translate(245, 200)">
              <circle r="12" fill="#3b82f6" opacity="0.3" className="animate-ping" />
              <circle r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" filter="url(#shadow)" />
            </g>

            {/* UI Building Labels */}
            <g transform="translate(160, 48)">
              <rect x="-35" y="-10" width="70" height="20" rx="6" fill="#ffffff" filter="url(#shadow)" />
              <text x="0" y="3" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b">Admin Block</text>
            </g>

            <g transform="translate(360, 42)">
              <rect x="-24" y="-10" width="48" height="20" rx="6" fill="#ffffff" filter="url(#shadow)" />
              <text x="0" y="3" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b">Library</text>
            </g>

            <g transform="translate(80, 115)">
              <rect x="-24" y="-10" width="48" height="20" rx="6" fill="#ffffff" filter="url(#shadow)" />
              <text x="0" y="3" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b">Canteen</text>
            </g>

            <g transform="translate(350, 110)">
              <rect x="-38" y="-13" width="76" height="26" rx="8" fill="url(#purpleGlow)" filter="url(#shadow)" />
              <text x="0" y="3" textAnchor="middle" fontSize="11" fontWeight="800" fill="#ffffff">CSE Block</text>
            </g>

            <g transform="translate(95, 195)">
              <rect x="-26" y="-10" width="52" height="20" rx="6" fill="#ffffff" filter="url(#shadow)" />
              <text x="0" y="3" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b">IT Block</text>
            </g>

            <g transform="translate(235, 225)">
              <rect x="-36" y="-10" width="72" height="20" rx="6" fill="#ffffff" filter="url(#shadow)" />
              <text x="0" y="3" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b">Seminar Hall</text>
            </g>

            <g transform="translate(385, 185)">
              <rect x="-28" y="-10" width="56" height="20" rx="6" fill="#ffffff" filter="url(#shadow)" />
              <text x="0" y="3" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b">ECE Block</text>
            </g>

            <g transform="translate(370, 265)">
              <rect x="-38" y="-10" width="76" height="20" rx="6" fill="#ffffff" filter="url(#shadow)" />
              <text x="0" y="3" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b">Sports Complex</text>
            </g>
          </svg>
        </div>

        {/* Floating Floor Selector on Right Side */}
        <div className="absolute right-3 top-3 bg-white/95 dark:bg-[#141414]/95 backdrop-blur-sm rounded-xl p-1 shadow-md border border-slate-200/80 dark:border-[#262626] flex flex-col gap-1 z-20">
          {['3', '2', '1', 'G'].map((floor) => {
            const isSelected = activeFloor === floor;
            return (
              <button
                key={floor}
                id={`btn-floor-${floor}`}
                onClick={() => handleFloorClick(floor)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-[#7c3aed] text-white shadow-sm shadow-purple-500/30'
                    : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-[#202020]'
                }`}
              >
                {floor}
              </button>
            );
          })}
        </div>

        {/* Floating Map Zoom / Center Controls */}
        <div className="absolute right-3 bottom-3 flex flex-col gap-1 z-20">
          <div className="bg-white/95 dark:bg-[#141414]/95 backdrop-blur-sm rounded-xl p-1 shadow-md border border-slate-200/80 dark:border-[#262626] flex flex-col gap-1">
            <button
              id="btn-map-zoom-in"
              onClick={() => handleZoom(0.15)}
              className="w-7 h-7 rounded-lg text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-[#202020] flex items-center justify-center transition cursor-pointer"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <div className="h-[1px] bg-slate-200 dark:bg-[#262626] w-full" />
            <button
              id="btn-map-zoom-out"
              onClick={() => handleZoom(-0.15)}
              className="w-7 h-7 rounded-lg text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-[#202020] flex items-center justify-center transition cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="btn-map-recenter"
            onClick={() => setZoomLevel(1)}
            className="w-9 h-9 bg-white/95 dark:bg-[#141414]/95 backdrop-blur-sm rounded-xl p-1 shadow-md border border-slate-200/80 dark:border-[#262626] flex items-center justify-center text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-[#202020] transition cursor-pointer mt-1"
            title="Recenter"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
