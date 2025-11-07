import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';

export default function ProductList({ products, onBuy, role }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Katalog Alat Musik</h2>
        <div className="text-xs text-slate-500">Harga telah disesuaikan dengan status akun</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-medium flex items-center gap-2">
                {p.name}
                {p.vipOnly && (
                  <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                    <Star size={14}/> VIP
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-500">Harga: {p.price.amount} {p.price.currency.toUpperCase()}</div>
            </div>
            <button
              onClick={() => onBuy(p)}
              disabled={p.vipOnly && role !== 'vip'}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 text-white px-3 py-2 hover:bg-emerald-700 disabled:opacity-50"
            >
              <ShoppingCart size={16}/> Beli
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
