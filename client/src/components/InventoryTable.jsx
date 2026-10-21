import React, { useState } from 'react';
import { Warehouse, AlertTriangle, Plus, RefreshCw, Search, CheckCircle2, PackageCheck } from 'lucide-react';

export default function InventoryTable({ inventory, onRestock, onAddSku }) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [restockingSku, setRestockingSku] = useState(null);

  const categories = ['ALL', 'Mechanical Valves', 'Hydraulic Pumps', 'IoT Telemetry Sensors', 'Industrial Flanges', 'Safety Gaskets'];

  const filteredInventory = inventory.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch =
      item.sku.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.warehouse_name.toLowerCase().includes(q);
    const matchCat = filterCategory === 'ALL' || item.category === filterCategory;
    return matchSearch && matchCat;
  });

  const handleRestockClick = async (sku) => {
    setRestockingSku(sku);
    try {
      await onRestock(sku, 50);
    } finally {
      setRestockingSku(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Critical Depletion':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'Low Stock Alert':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0F172A] p-4 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SKU, component name, warehouse..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onAddSku}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 font-semibold text-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New SKU</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A0F1D] text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Item & Category</th>
                <th className="py-3 px-4">Warehouse Location</th>
                <th className="py-3 px-4 text-center">Stock / Capacity</th>
                <th className="py-3 px-4">Status Alert</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-center">Auto-Requisition Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredInventory.map((item) => {
                const available = item.stock_on_hand - item.stock_reserved;
                const capacityPct = Math.min(100, Math.round((item.stock_on_hand / item.max_capacity) * 100));

                return (
                  <tr key={item.sku} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-400">{item.sku}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-[11px] text-slate-400">{item.category}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{item.warehouse_name}</div>
                      <div className="font-mono text-[10px] text-slate-400">{item.warehouse_id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                        <span className="text-white font-bold">{item.stock_on_hand} on-hand</span>
                        <span className="text-slate-400">({available} avail)</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.stock_on_hand < item.min_threshold
                              ? 'bg-red-500'
                              : item.stock_on_hand <= item.min_threshold * 1.5
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${capacityPct}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 text-right mt-0.5 font-mono">
                        Min Threshold: {item.min_threshold} units
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                      RM {item.unit_price.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleRestockClick(item.sku)}
                        disabled={restockingSku === item.sku}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          item.status !== 'In Stock'
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${restockingSku === item.sku ? 'animate-spin' : ''}`} />
                        <span>{restockingSku === item.sku ? 'Ordering...' : '+50 Restock PO'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
