import React, { useMemo, useState } from 'react';
import { Ticket, Wallet } from 'lucide-react';

export default function Checkout({ selected, vouchers, balances, onPay }) {
  const [voucherCode, setVoucherCode] = useState('');

  const currentVoucher = useMemo(() => {
    const v = vouchers.find(v => v.code.toLowerCase() === voucherCode.trim().toLowerCase());
    return v && !v.used && new Date(v.expiresAt) > new Date() ? v : null;
  }, [voucherCode, vouchers]);

  const discounted = useMemo(() => {
    if (!selected) return null;
    const amount = selected.price.amount;
    const discount = currentVoucher ? Math.round(amount * (currentVoucher.percent / 100)) : 0;
    return { amount, discount, pay: amount - discount, currency: selected.price.currency };
  }, [selected, currentVoucher]);

  if (!selected) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-4">Checkout</h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span>Barang</span>
          <span className="font-medium">{selected.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Harga</span>
          <span className="font-medium">{selected.price.amount} {selected.price.currency.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Ticket size={16}/>
          <input
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            className="flex-1 border rounded-md px-3 py-2"
            placeholder="Kode voucher"
          />
          {currentVoucher ? (
            <span className="text-emerald-600 text-xs">Voucher {currentVoucher.percent}% digunakan</span>
          ) : voucherCode ? (
            <span className="text-rose-600 text-xs">Voucher tidak valid</span>
          ) : null}
        </div>
        {discounted && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span>Potongan</span>
              <span className="font-medium">{discounted.discount} {discounted.currency.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between text-base mt-1">
              <span className="font-medium">Total Bayar</span>
              <span className="font-semibold">{discounted.pay} {discounted.currency.toUpperCase()}</span>
            </div>
          </div>
        )}
        <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
          <Wallet size={14}/> Saldo: Gold {balances.gold} · Gems {balances.gems} · Diamond {balances.diamond}
        </div>
        <button
          onClick={() => onPay(selected, currentVoucher || undefined)}
          className="w-full mt-3 rounded-md bg-indigo-600 text-white py-2 hover:bg-indigo-700"
        >
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
}
