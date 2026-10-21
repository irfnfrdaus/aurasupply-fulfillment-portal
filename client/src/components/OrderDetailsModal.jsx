import React from 'react';
import { X, Package, Truck, Clock, Building2, MapPin, CheckCircle2 } from 'lucide-react';

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-bold text-[#0F2C59] dark:text-sky-400">{order.id}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-zinc-800 text-[#0F2C59] dark:text-zinc-300 font-semibold border border-blue-200 dark:border-zinc-700">
                Stage: {order.status}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{order.customer_name}</div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-zinc-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-zinc-800">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-semibold">Priority</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{order.priority}</span>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-zinc-800">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-semibold">Carrier</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{order.carrier || 'Unassigned'}</span>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-zinc-800">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-semibold">SLA Deadline</span>
              <span className="text-xs font-mono font-bold text-[#0F2C59] dark:text-sky-400">{order.sla_delivery_date}</span>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-zinc-800">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-semibold">Tracking No</span>
              <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-zinc-200">{order.tracking_number}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <div className="bg-[#0F2C59] dark:bg-zinc-900 text-white dark:text-zinc-200 px-4 py-2 border-b border-slate-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider">
              Order Line Items
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-zinc-800 text-[10px] uppercase font-bold text-slate-600 dark:text-zinc-400 border-b border-slate-200 dark:border-zinc-700">
                <tr>
                  <th className="py-2.5 px-4">SKU</th>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Unit Price</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-zinc-800 font-medium text-slate-700 dark:text-zinc-300">
                {(order.items || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-zinc-800/30">
                    <td className="py-2.5 px-4 font-mono font-bold text-[#0F2C59] dark:text-sky-400">{item.sku}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{item.item_name}</td>
                    <td className="py-2.5 px-4 text-center font-mono font-semibold">{item.quantity}</td>
                    <td className="py-2.5 px-4 text-right font-mono">RM {item.unit_price.toFixed(2)}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-zinc-200">
                      RM {item.total_price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="bg-slate-50 dark:bg-zinc-900/80 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-zinc-400">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">RM {(order.subtotal || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-zinc-400">
              <span>SST Compliance Tax (8%):</span>
              <span className="font-mono font-medium">RM {(order.tax_amount || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-zinc-800">
              <span>Total Invoice Amount:</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400">
                RM {(order.total_amount || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Operational Notes */}
          {order.notes && (
            <div className="p-3 bg-slate-50 dark:bg-zinc-900/60 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-300">
              <span className="font-bold text-slate-600 dark:text-zinc-400 block mb-0.5 text-[10px] uppercase">Fulfillment Notes</span>
              {order.notes}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white text-xs font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
