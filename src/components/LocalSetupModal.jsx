import React, { useState } from 'react';
import {
  Database,
  Terminal,
  Copy,
  Check,
  Server,
  Play,
  Layers,
  Cpu,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Code2,
} from 'lucide-react';

export const LocalSetupModal = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState(null);
  const [testStatus, setTestStatus] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleTestDbConnection = async () => {
    setIsTesting(true);
    setTestStatus(null);
    try {
      const res = await fetch('/api/v1/db/status');
      const data = await res.json();
      setTestStatus(data.data || { connected: false, error: 'Failed to query db status' });
    } catch (err) {
      setTestStatus({ connected: false, error: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  const terminalSteps = [
    {
      step: '1',
      title: 'Clone / Extract & Install Dependencies',
      desc: 'Navigate to project root directory on your laptop and install all required node modules.',
      command: `npm install`,
    },
    {
      step: '2',
      title: 'Create PostgreSQL Database & Run Schema',
      desc: 'Use psql or pgAdmin to create the `scam_db` database and execute our schema script.',
      command: `# In your terminal or pgAdmin Query Tool:
psql -U postgres -c "CREATE DATABASE scam_db;"
psql -U postgres -d scam_db -f src/db/postgres_schema.sql`,
    },
    {
      step: '3',
      title: 'Configure Local Environment (.env)',
      desc: 'Set your PostgreSQL credentials and optional Gemini API key in `.env` file.',
      command: `# Create .env from template:
cp .env.example .env

# Configure your connection string in .env:
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/scam_db"
PORT=3000
GEMINI_API_KEY="your-gemini-api-key-here"`,
    },
    {
      step: '4',
      title: 'Start Full-Stack Local Server (Frontend + Backend)',
      desc: 'Runs the Node.js Express backend and Vite React SPA concurrently on port 3000.',
      command: `npm run dev`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 text-white rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#c4f428] text-black flex items-center justify-center font-bold shadow-lg shadow-[#c4f428]/20">
              <Database className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight font-outfit">
                  Run SCAM v1.0 Locally with PostgreSQL
                </h2>
                <span className="text-[10px] font-mono font-bold bg-[#c4f428]/20 text-[#c4f428] px-2 py-0.5 rounded border border-[#c4f428]/30">
                  PostgreSQL Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete setup guide for running on your laptop with your downloaded PostgreSQL instance.
              </p>
            </div>
          </div>

          <button
            id="btn-close-local-setup"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-slate-300 text-xs flex-1">
          {/* Quick Architecture Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/70">
              <div className="text-[10px] text-slate-400 font-mono">DATABASE</div>
              <div className="text-sm font-bold text-white mt-0.5">PostgreSQL 14+</div>
              <div className="text-[10px] text-emerald-400 mt-1">Port 5432 • scam_db</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/70">
              <div className="text-[10px] text-slate-400 font-mono">BACKEND API</div>
              <div className="text-sm font-bold text-white mt-0.5">Node.js + Express</div>
              <div className="text-[10px] text-purple-400 mt-1">Port 3000 • RESTful</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/70">
              <div className="text-[10px] text-slate-400 font-mono">MOBILE / WEB</div>
              <div className="text-sm font-bold text-white mt-0.5">Flutter & React SPA</div>
              <div className="text-[10px] text-blue-400 mt-1">Vite + Tailwind v4</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/70">
              <div className="text-[10px] text-slate-400 font-mono">CACHE & PUBSUB</div>
              <div className="text-sm font-bold text-white mt-0.5">Redis / In-Memory</div>
              <div className="text-[10px] text-amber-400 mt-1">Live Canteen Tokens</div>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#c4f428]" />
              <span>Step-by-Step Terminal Commands</span>
            </h3>

            <div className="space-y-3">
              {terminalSteps.map((step) => (
                <div
                  key={step.step}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#c4f428] text-black text-[11px] font-bold flex items-center justify-center">
                        {step.step}
                      </span>
                      <span className="font-bold text-white text-xs">{step.title}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(step.command, step.step)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedSection === step.step ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Command</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">{step.desc}</p>
                  <pre className="p-3 rounded-xl bg-slate-900 text-[#c4f428] font-mono text-[11px] overflow-x-auto whitespace-pre-wrap select-all border border-slate-800">
                    {step.command}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Database Schema Details */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white text-xs">Included PostgreSQL Schema File</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">src/db/postgres_schema.sql</span>
            </div>
            <p className="text-[11px] text-slate-400">
              The SQL file automatically creates all tables required by the SRS: <code className="text-purple-300 font-mono">users</code>, <code className="text-purple-300 font-mono">notices</code>, <code className="text-purple-300 font-mono">complaints</code> (with 4-stage lifecycle), <code className="text-purple-300 font-mono">faculty_queries</code>, <code className="text-purple-300 font-mono">campus_locations</code>, <code className="text-purple-300 font-mono">canteen_menu_items</code>, <code className="text-purple-300 font-mono">canteen_orders</code>, <code className="text-purple-300 font-mono">library_books</code>, <code className="text-purple-300 font-mono">community_threads</code>, <code className="text-purple-300 font-mono">reported_content</code>, and <code className="text-purple-300 font-mono">placement_companies</code>.
            </p>
          </div>

          {/* Test Live DB Endpoint */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-xs">Test Live Database Health Endpoint</span>
              </div>
              <button
                id="btn-test-db-connection"
                onClick={handleTestDbConnection}
                disabled={isTesting}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Ping Database</span>
                  </>
                )}
              </button>
            </div>

            {testStatus && (
              <div className={`p-3 rounded-xl border text-xs font-mono ${testStatus.connected ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-amber-950/40 border-amber-800 text-amber-300'}`}>
                <div className="font-bold mb-1">
                  {testStatus.connected ? '✓ Database Connected Successfully!' : '⚠ Local Database Standby / Mock Store Active'}
                </div>
                {testStatus.connected ? (
                  <div className="text-[11px] space-y-0.5 text-slate-300">
                    <div>Connected DB: <span className="text-emerald-400 font-bold">{testStatus.database}</span></div>
                    <div>PostgreSQL Time: <span className="text-white">{testStatus.time}</span></div>
                    <div>Version: <span className="text-slate-400">{testStatus.version}</span></div>
                  </div>
                ) : (
                  <div className="text-[11px] space-y-0.5 text-slate-300">
                    <div>Notice: {testStatus.error || 'Running in self-contained cloud sandbox mode.'}</div>
                    <div className="text-amber-400 mt-1">{testStatus.instructions}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c4f428]" />
            <span>SCAM v1.0 • Vasavi College of Engineering</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#c4f428] text-black font-bold text-xs hover:bg-[#b2e022] transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
