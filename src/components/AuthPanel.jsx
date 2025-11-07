import React, { useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';

export default function AuthPanel({ onLogin, onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Lock size={18}/> Login / Register</h2>
      <div className="space-y-3">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex gap-2">
          <button
            onClick={() => onLogin(username, password)}
            className="flex-1 rounded-md bg-indigo-600 text-white py-2 hover:bg-indigo-700"
          >
            Masuk
          </button>
          <button
            onClick={() => onRegister(username, password)}
            className="flex-1 rounded-md border py-2 hover:bg-slate-50"
          >
            Daftar <Sparkles className="inline ml-1" size={16} />
          </button>
        </div>
        <p className="text-xs text-slate-500">Akun baru langsung mendapatkan voucher gratis 20% yang hanya bisa dipakai sekali.</p>
      </div>
    </div>
  );
}
