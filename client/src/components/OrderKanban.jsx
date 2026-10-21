import React, { useState } from 'react';
import {
  Clock, CheckCircle, Truck, Package, FileText, ArrowRight,
  Search, Filter, ChevronRight, AlertCircle, Building2, MapPin
} from 'lucide-react';

export default function OrderKanban({ orders, onUpdateStatus, onViewDetails }) {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'

  const stages = [
    { key: 'Quote', label: '1. Quote Draft', color: 'border-sky-500/40 text-sky-400 bg-sky-500/10', next: 'PO Approved', nextBtn: 'Approve PO' },
    { key: 'PO Approved', label: '2. PO Approved', color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10', next: 'Pick & Pack', nextBtn: 'Start Picking' },
    { key: 'Pick & Pack', label: '3. Pick & Pack', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10', next: 'In Transit', nextBtn: 'Dispatch Order' },
    { key: 'In Transit', label: '4. In Transit', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10', next: 'Delivered', nextBtn: 'Confirm Delivery' },
    { key: 'Delivered', label: '5. Delivered', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10', next: 'Invoiced', nextBtn: 'Generate Invoice' },
    { key: 'Invoiced', label: '6. Invoiced', color: 'border-slate-500/40 text-slate-300 bg-slate-500/10', next: null, nextBtn: null }
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
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'High':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & View Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0F172A] p-3.5 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order ID, corporate customer, carrier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                viewMode === 'kanban' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                viewMode === 'table' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'
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
                className="bg-[#0F172A] border border-slate-800 rounded-xl p-3 flex flex-col min-h-[480px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${stage.color}`}>
                    {stage.label}
                  </span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                    {stageOrders.length}
                  </span>
                </div>

                {/* Stage Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[640px] pr-1">
                  {stageOrders.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-slate-800/80 rounded-lg text-slate-600 text-xs">
                      No orders
                    </div>
                  ) : (
                    stageOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-3 hover:border-sky-500/50 transition-all duration-150 shadow-sm relative group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[11px] font-bold text-sky-400">{order.id}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getPriorityBadge(order.priority)}`}>
                            {order.priority}
                          </span>
                        </div>

                        <div className="font-semibold text-xs text-white line-clamp-1 mb-1">
                          {order.customer_name}
                        </div>

                        <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
                          <span>Items: {(order.items || []).length}</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            RM {(order.total_amount || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="text-[10px] text-slate-400 flex items-center space-x-1 mb-2.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>SLA: {order.sla_delivery_date}</span>
                        </div>

                        {/* Transition Button */}
                        {stage.next && (
                          <button
                            onClick={() => onUpdateStatus(order.id, stage.next)}
                            className="w-full mt-1 flex items-center justify-center space-x-1 py-1 px-2 rounded bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white text-[11px] font-semibold transition border border-slate-700/60 hover:border-sky-500"
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

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0A0F1D] text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">SLA Deadline</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Carrier & Tracking</th>
                  <th className="py-3 px-4 text-right">Total (8% SST)</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-sky-400">{order.id}</td>
                    <td className="py-3 px-4 font-semibold text-white">{order.customer_name}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{order.order_date}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{order.sla_delivery_date}</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-sky-500"
                      >
                        {stages.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.key}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityBadge(order.priority)}`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      <div>{order.carrier || 'Unassigned'}</div>
                      <div className="font-mono text-[10px] text-slate-400">{order.tracking_number}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                      RM {order.total_amount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onViewDetails(order)}
                        className="text-sky-400 hover:text-sky-300 font-semibold text-xs"
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
