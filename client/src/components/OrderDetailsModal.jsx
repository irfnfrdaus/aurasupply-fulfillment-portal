import React from 'react';
import { X, Package, Truck, Clock, Building2, MapPin, CheckCircle2 } from 'lucide-react';

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-bold text-sky-400">{order.id}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                Stage: {order.status}
              </span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">{order.customer_name}</div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">Priority</span>
              <span className="text-xs font-bold text-white">{order.priority}</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">Carrier</span>
              <span className="text-xs font-bold text-white">{order.carrier || 'Unassigned'}</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">SLA Deadline</span>
              <span className="text-xs font-mono font-bold text-sky-400">{order.sla_delivery_date}</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">Tracking No</span>
              <span className="text-[11px] font-mono font-bold text-slate-200">{order.tracking_number}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-[#0A0F1D] px-4 py-2 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
              Order Line Items
            </div>
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">SKU</th>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Unit Price</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {(order.items || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-4 font-mono font-bold text-sky-400">{item.sku}</td>
                    <td className="py-2.5 px-4 text-white">{item.item_name}</td>
                    <td className="py-2.5 px-4 text-center font-mono">{item.quantity}</td>
                    <td className="py-2.5 px-4 text-right font-mono">RM {item.unit_price.toFixed(2)}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-200">
                      RM {item.total_price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono">RM {(order.subtotal || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>SST Compliance Tax (8%):</span>
              <span className="font-mono">RM {(order.tax_amount || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
              <span>Total Invoice Amount:</span>
              <span className="font-mono text-emerald-400">
                RM {(order.total_amount || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Operational Notes */}
          {order.notes && (
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-slate-400 block mb-0.5 text-[10px] uppercase">Fulfillment Notes</span>
              {order.notes}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
