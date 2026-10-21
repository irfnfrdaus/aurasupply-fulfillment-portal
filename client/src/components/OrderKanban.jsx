import React, { useState } from 'react';
import {
  Clock, CheckCircle, Truck, Package, FileText, ArrowRight,
  Search, Filter, ChevronRight, AlertCircle, Building2, MapPin
} from 'lucide-react';

export default function OrderKanban({ orders, onUpdateStatus, onViewDetails }) {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'

  const stages = [
    { key: 'Quote', label: '1. Quote Draft', color: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800', next: 'PO Approved', nextBtn: 'Approve PO' },
    { key: 'PO Approved', label: '2. PO Approved', color: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800', next: 'Pick & Pack', nextBtn: 'Start Picking' },
    { key: 'Pick & Pack', label: '3. Pick & Pack', color: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800', next: 'In Transit', nextBtn: 'Dispatch Order' },
    { key: 'In Transit', label: '4. In Transit', color: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800', next: 'Delivered', nextBtn: 'Confirm Delivery' },
    { key: 'Delivered', label: '5. Delivered', color: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800', next: 'Invoiced', nextBtn: 'Generate Invoice' },
    { key: 'Invoiced', label: '6. Invoiced', color: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700', next: null, nextBtn: null }
  ];

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      (o.carrier && o.carrier.toLowerCase().includes(q))
    );
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800';
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & View Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#121316] p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs transition-colors duration-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order ID, corporate customer, carrier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0F2C59] dark:focus:border-sky-500 transition"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <div className="flex rounded-lg bg-slate-100 dark:bg-zinc-900 p-1 border border-slate-200 dark:border-zinc-800 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Enterprise Table
            </button>
          </div>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
          {stages.map((stage) => {
            const stageOrders = filteredOrders.filter((o) => o.status === stage.key);
            return (
              <div
                key={stage.key}
                className="bg-slate-100/70 dark:bg-[#121316] border border-slate-200 dark:border-zinc-800 rounded-xl p-3 flex flex-col min-h-[480px] transition-colors duration-200"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-zinc-800">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${stage.color}`}>
                    {stage.label}
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-zinc-700">
                    {stageOrders.length}
                  </span>
                </div>

                {/* Stage Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[640px] pr-1">
                  {stageOrders.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-slate-200 dark:border-zinc-800 rounded-lg text-slate-400 dark:text-zinc-600 text-xs">
                      No orders
                    </div>
                  ) : (
                    stageOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 rounded-lg p-3 hover:border-slate-400 dark:hover:border-zinc-600 transition-all duration-150 shadow-xs relative group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[11px] font-bold text-[#0F2C59] dark:text-sky-400">{order.id}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getPriorityBadge(order.priority)}`}>
                            {order.priority}
                          </span>
                        </div>

                        <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 mb-1">
                          {order.customer_name}
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 mb-2 flex items-center justify-between">
                          <span>Items: {(order.items || []).length}</span>
                          <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                            RM {(order.total_amount || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="text-[10px] text-slate-500 dark:text-zinc-400 flex items-center space-x-1 mb-2.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>SLA: {order.sla_delivery_date}</span>
                        </div>

                        {/* Transition Button */}
                        {stage.next && (
                          <button
                            onClick={() => onUpdateStatus(order.id, stage.next)}
                            className="w-full mt-1 flex items-center justify-center space-x-1 py-1.5 px-2 rounded-md bg-slate-50 hover:bg-[#0F2C59] text-slate-700 hover:text-white dark:bg-zinc-800 dark:hover:bg-sky-600 dark:text-zinc-200 text-[11px] font-bold transition border border-slate-200 dark:border-zinc-700"
                          >
                            <span>{stage.nextBtn}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ENTERPRISE TABLE VIEW (SAP / Excel Master Style) */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs transition-colors duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0F2C59] dark:bg-zinc-900 text-white dark:text-zinc-200 uppercase font-bold text-[10.5px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Corporate Customer</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">SLA Deadline</th>
                  <th className="py-3 px-4">Stage Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Carrier & Tracking</th>
                  <th className="py-3 px-4 text-right">Total (8% SST)</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-zinc-800 font-medium text-slate-700 dark:text-zinc-300">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F2C59] dark:text-sky-400">{order.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{order.customer_name}</td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400 font-mono text-[11px]">{order.order_date}</td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400 font-mono text-[11px]">{order.sla_delivery_date}</td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                        className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-[#0F2C59] font-semibold"
                      >
                        {stages.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.key}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityBadge(order.priority)}`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-zinc-400 text-[11px]">
                      <div>{order.carrier || 'Unassigned'}</div>
                      <div className="font-mono text-[10px] text-slate-400">{order.tracking_number}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      RM {order.total_amount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onViewDetails(order)}
                        className="text-[#0F2C59] hover:underline dark:text-sky-400 dark:hover:text-sky-300 font-bold text-xs"
                      >
                        View Items
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
