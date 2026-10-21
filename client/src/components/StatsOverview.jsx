import React from 'react';
import { DollarSign, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function StatsOverview({ analytics }) {
  if (!analytics) return null;

  const { orders, inventory, qa_automation } = analytics;

  const cards = [
    {
      title: 'Total Pipeline Revenue',
      value: `RM ${(orders.pipeline_revenue || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`,
      subtitle: `${orders.total || 0} active enterprise orders`,
      icon: DollarSign,
      iconBg: 'bg-blue-50 text-[#0F2C59] dark:bg-sky-950 dark:text-sky-400',
      border: 'border-slate-200 dark:border-zinc-800'
    },
    {
      title: 'Fulfilled & Revenue Closed',
      value: `RM ${(orders.fulfilled_revenue || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`,
      subtitle: `OTIF Compliance: ${orders.otif_rate || 96.8}%`,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
      border: 'border-slate-200 dark:border-zinc-800'
    },
    {
      title: 'Inventory Stock Alerts',
      value: `${inventory.low_stock_count || 0} SKUs Low`,
      subtitle: `Total Valuation: RM ${(inventory.total_valuation || 0).toLocaleString('en-MY')}`,
      icon: AlertTriangle,
      iconBg: inventory.low_stock_count > 0 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400' : 'bg-slate-50 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
      border: inventory.low_stock_count > 0 ? 'border-amber-200 dark:border-amber-900/50' : 'border-slate-200 dark:border-zinc-800'
    },
    {
      title: 'QA Automated Test Pass Rate',
      value: `${qa_automation.pass_rate || 100}%`,
      subtitle: `Cycle Time Reduction: >${qa_automation.cycle_time_saved_pct || 78}% (Hilti Model)`,
      icon: ShieldCheck,
      iconBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400',
      border: 'border-slate-200 dark:border-zinc-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl bg-white dark:bg-[#121316] border ${card.border} shadow-xs transition-colors duration-200`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 tracking-wide uppercase">{card.title}</span>
              <div className={`p-2 rounded-lg ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">{card.value}</div>
            <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center space-x-1">
              <span>{card.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
