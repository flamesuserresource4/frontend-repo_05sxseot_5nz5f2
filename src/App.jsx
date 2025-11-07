import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import AuthPanel from './components/AuthPanel';
import ProductList from './components/ProductList';
import Checkout from './components/Checkout';

// Simple client-only demo that mirrors the requested features in UI.
// Note: In a full app this would be backed by an API and CSV persistence in the backend.

const VIP_MULTIPLIER = 0.9; // VIP gets 10% cheaper base price example

const BASE_PRODUCTS = [
  { id: 'guitar', name: 'Gitar Akustik', base: { amount: 120, currency: 'gold' } },
  { id: 'piano', name: 'Keyboard Digital', base: { amount: 250, currency: 'gems' } },
  { id: 'drum', name: 'Drum Elektrik', base: { amount: 400, currency: 'diamond' }, vipOnly: true },
  { id: 'violin', name: 'Biola', base: { amount: 180, currency: 'gold' } },
];

function computePrices(role) {
  return BASE_PRODUCTS.map(p => ({
    ...p,
    price: { amount: Math.round(p.base.amount * (role === 'vip' && !p.vipOnly ? VIP_MULTIPLIER : 1)), currency: p.base.currency },
  }));
}

const initialVoucher = (username) => [{
  code: `WELCOME-${username.toUpperCase()}`,
  percent: 20,
  used: false,
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days
}];

export default function App() {
  const [user, setUser] = useState(null);
  const [failedLogins, setFailedLogins] = useState({});
  const [selected, setSelected] = useState(null);

  const [accounts, setAccounts] = useState({
    // demo preseed
    alice: {
      password: '1234',
      role: 'member',
      balances: { gold: 300, gems: 300, diamond: 300 },
      vouchers: initialVoucher('alice'),
      locked: false,
    },
    bob: {
      password: '4321',
      role: 'vip',
      balances: { gold: 500, gems: 500, diamond: 500 },
      vouchers: initialVoucher('bob'),
      locked: false,
    },
  });

  const products = useMemo(() => computePrices(user?.role || 'member'), [user]);

  const handleLogin = (username, password) => {
    const acc = accounts[username];
    if (!acc) {
      setFailedLogins((m) => ({ ...m, [username]: (m[username] || 0) + 1 }));
      alert('Akun tidak ditemukan');
      return;
    }
    if (acc.locked) {
      alert('Akun terkunci karena salah 3x');
      return;
    }
    if (acc.password !== password) {
      const count = (failedLogins[username] || 0) + 1;
      const locked = count >= 3;
      setFailedLogins((m) => ({ ...m, [username]: count }));
      if (locked) {
        setAccounts((prev) => ({ ...prev, [username]: { ...prev[username], locked: true } }));
        alert('Salah password 3x, akun terkunci.');
      } else {
        alert(`Password salah (${count}/3)`);
      }
      return;
    }
    setFailedLogins((m) => ({ ...m, [username]: 0 }));
    setUser({ username, role: acc.role, balances: acc.balances });
  };

  const handleRegister = (username, password) => {
    if (!username || !password) return alert('Isi username dan password');
    if (accounts[username]) return alert('Username sudah terpakai');
    const newAcc = {
      password,
      role: 'member',
      balances: { gold: 200, gems: 200, diamond: 100 },
      vouchers: initialVoucher(username),
      locked: false,
    };
    setAccounts((prev) => ({ ...prev, [username]: newAcc }));
    alert('Registrasi berhasil! Anda mendapatkan voucher 20% (WELCOME-USERNAME)');
  };

  const handleLogout = () => {
    setUser(null);
    setSelected(null);
  };

  const handleBuy = (product) => {
    setSelected(product);
  };

  const applyVoucherIfAny = (username, voucher) => {
    if (!voucher) return;
    setAccounts((prev) => {
      const list = prev[username].vouchers.map((v) =>
        v.code.toLowerCase() === voucher.code.toLowerCase() ? { ...v, used: true } : v
      );
      return { ...prev, [username]: { ...prev[username], vouchers: list } };
    });
  };

  const handlePay = (product, voucher) => {
    if (!user) return;
    const currency = product.price.currency;
    const amount = product.price.amount;
    const discount = voucher ? Math.round(amount * (voucher.percent / 100)) : 0;
    const pay = amount - discount;

    const balance = user.balances[currency];
    if (balance < pay) {
      alert('Saldo tidak mencukupi');
      return;
    }

    // deduct
    setAccounts((prev) => ({
      ...prev,
      [user.username]: {
        ...prev[user.username],
        balances: { ...prev[user.username].balances, [currency]: balance - pay },
      },
    }));
    setUser((u) => ({ ...u, balances: { ...u.balances, [currency]: balance - pay } }));

    applyVoucherIfAny(user.username, voucher);

    alert('Pembelian berhasil!');
    setSelected(null);
  };

  // Simple redeem codes examples
  const handleRedeem = () => {
    if (!user) return;
    const code = prompt('Masukkan kode redeem:');
    if (!code) return;
    // Demo rules: CODE20 -> 20% voucher 3 hari, GEM50 -> +50 gems, VIPPASS -> upgrade VIP
    if (code.toUpperCase() === 'CODE20') {
      setAccounts((prev) => {
        const arr = prev[user.username].vouchers.concat({
          code: `BONUS20-${Date.now()}`,
          percent: 20,
          used: false,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
        });
        return { ...prev, [user.username]: { ...prev[user.username], vouchers: arr } };
      });
      alert('Voucher 20% ditambahkan!');
    } else if (code.toUpperCase() === 'GEM50') {
      setAccounts((prev) => ({
        ...prev,
        [user.username]: {
          ...prev[user.username],
          balances: { ...prev[user.username].balances, gems: prev[user.username].balances.gems + 50 },
        },
      }));
      setUser((u) => ({ ...u, balances: { ...u.balances, gems: u.balances.gems + 50 } }));
      alert('+50 Gems berhasil ditambahkan');
    } else if (code.toUpperCase() === 'VIPPASS') {
      setAccounts((prev) => ({ ...prev, [user.username]: { ...prev[user.username], role: 'vip' } }));
      setUser((u) => ({ ...u, role: 'vip' }));
      alert('Status akun menjadi VIP!');
    } else {
      alert('Kode redeem tidak dikenal');
    }
  };

  const vouchers = useMemo(() => (user ? accounts[user.username].vouchers : []), [user, accounts]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header user={user} onLogout={handleLogout} />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {!user ? (
          <AuthPanel onLogin={handleLogin} onRegister={handleRegister} />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Selamat datang, {user.username} {user.role === 'vip' && '✨'}
              </h2>
              <button onClick={handleRedeem} className="text-sm rounded-md border px-3 py-1.5 hover:bg-slate-50">
                Redeem Kode
              </button>
            </div>
            <ProductList products={products} role={user.role} onBuy={handleBuy} />
            <Checkout
              selected={selected}
              vouchers={vouchers}
              balances={user.balances}
              onPay={handlePay}
            />
          </>
        )}
      </main>
    </div>
  );
}
