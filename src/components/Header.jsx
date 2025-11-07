import React from 'react';
import { Music, User, LogOut } from 'lucide-react';

export default function Header({ user, onLogout }) {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="text-indigo-600" />
          <h1 className="text-xl font-bold">VibeSound Store</h1>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <div className="font-medium flex items-center gap-1">
                  <User size={16} /> {user.username}
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    user.role === 'vip' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex gap-3">
                  <span>Gold: {user.balances.gold}</span>
                  <span>Gems: {user.balances.gems}</span>
                  <span>Diamond: {user.balances.diamond}</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="text-sm text-slate-600">Masuk untuk mulai belanja</div>
          )}
        </div>
      </div>
    </header>
  );
}
