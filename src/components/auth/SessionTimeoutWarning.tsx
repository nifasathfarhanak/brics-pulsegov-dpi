import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, ShieldAlert, RefreshCw, LogOut } from 'lucide-react';

export const SessionTimeoutWarning: React.FC = () => {
  const { authState, sessionRemainingSeconds, extendSession, logout } = useAuth();

  if (!authState.isAuthenticated || sessionRemainingSeconds > 180) {
    return null;
  }

  const mins = Math.floor(sessionRemainingSeconds / 60);
  const secs = sessionRemainingSeconds % 60;
  const timeFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0A192F] border-2 border-amber-500 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto animate-pulse">
          <Clock className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">
            Session Expiring Due to Inactivity
          </h3>
          <p className="text-xs text-[#CBD5E1]">
            For sovereign security, idle sessions are automatically terminated after 30 minutes of inactivity.
          </p>
        </div>

        <div className="bg-[#0A192F] p-4 rounded-xl border border-[#334155]">
          <span className="text-xs text-[#94A3B8] uppercase tracking-wider block mb-1">
            Auto-Logout In:
          </span>
          <span className="font-mono text-3xl font-extrabold text-amber-400">
            {timeFormatted}
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={logout}
            className="w-1/2 bg-[#0A192F] hover:bg-[#0F223D] text-[#CBD5E1] text-xs font-bold py-3 rounded-xl border border-[#334155] flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Now</span>
          </button>

          <button
            type="button"
            onClick={extendSession}
            className="w-1/2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Extend Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
