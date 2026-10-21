import React from 'react';
import { DollarSign, Truck, AlertTriangle, ShieldCheck, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function StatsOverview({ analytics }) {
  if (!analytics) return null;

  const { orders, inventory, qa_automation } = analytics;

  const cards = [
    {
      title: 'Total Pipeline Revenue',
      value: `RM ${(orders.pipeline_revenue || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`,
      subtitle: `${orders.total || 0} active enterprise orders`,
      icon: DollarSign,
      color: 'from-blue-500/20 to-sky-500/10 text-sky-400 border-sky-500/30'
    },
    {
      title: 'Fulfilled & Revenue Closed',
      value: `RM ${(orders.fulfilled_revenue || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`,
      subtitle: `OTIF Compliance: ${orders.otif_rate || 96.8}%`,
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30'
    },
    {
      title: 'Inventory Stock Alerts',
      value: `${inventory.low_stock_count || 0} SKUs Low`,
      subtitle: `Total Valuation: RM ${(inventory.total_valuation || 0).toLocaleString('en-MY')}`,
      icon: AlertTriangle,
      color: inventory.low_stock_count > 0 ? 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30' : 'from-slate-500/20 to-slate-500/10 text-slate-400 border-slate-700'
    },
    {
      title: 'QA Automated Test Pass Rate',
      value: `${qa_automation.pass_rate || 100}%`,
      subtitle: `Cycle Time Reduction: >${qa_automation.cycle_time_saved_pct || 78}% (Hilti Model)`,
      icon: ShieldCheck,
      color: 'from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl bg-[#0F172A] border ${card.color} shadow-sm relative overflow-hidden transition-all hover:border-slate-600`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 tracking-wide">{card.title}</span>
              <div className="p-2 rounded-lg bg-slate-800/80">
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-extrabold text-white tracking-tight mb-1">{card.value}</div>
            <div className="text-[11px] text-slate-400 flex items-center space-x-1">
              <span>{card.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
