import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, Clock, ShieldCheck, Warehouse, DollarSign } from 'lucide-react';

export default function AnalyticsView({ analytics, orders, inventory }) {
  if (!analytics) return null;

  const { orders: orderStats, inventory: invStats, qa_automation: qaStats } = analytics;

  const statusList = [
    { name: 'Quote Draft', count: orderStats.status_counts['Quote'] || 0, color: 'bg-sky-500' },
    { name: 'PO Approved', count: orderStats.status_counts['PO Approved'] || 0, color: 'bg-indigo-500' },
    { name: 'Pick & Pack', count: orderStats.status_counts['Pick & Pack'] || 0, color: 'bg-amber-500' },
    { name: 'In Transit', count: orderStats.status_counts['In Transit'] || 0, color: 'bg-purple-500' },
    { name: 'Delivered', count: orderStats.status_counts['Delivered'] || 0, color: 'bg-emerald-500' },
    { name: 'Invoiced & Paid', count: orderStats.status_counts['Invoiced'] || 0, color: 'bg-teal-500' }
  ];

  const totalCount = orderStats.total || 1;

  return (
    <div className="space-y-6">
      
      {/* Top Summary Banner */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            <span>Executive Supply Chain & QA Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise KPIs: On-Time In-Full (OTIF) Fulfillment, Inventory Velocity, and Automated QA Acceleration.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">OTIF Compliance</div>
            <div className="text-lg font-mono font-extrabold text-emerald-400">96.8%</div>
          </div>
          <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">QA Pass Rate</div>
            <div className="text-lg font-mono font-extrabold text-sky-400">100%</div>
          </div>
        </div>
      </div>

      {/* Grid of Visual Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Order Lifecycle Distribution */}
        <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between">
            <span>Fulfillment Pipeline by Stage</span>
            <span className="text-slate-400 font-mono text-[11px]">{orderStats.total} Total Orders</span>
          </h3>

          <div className="space-y-3 pt-2">
            {statusList.map((st) => {
              const pct = Math.round((st.count / totalCount) * 100);
              return (
                <div key={st.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{st.name}</span>
                    <span className="text-slate-400 font-mono">{st.count} orders ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${st.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* QA Automation Acceleration Impact (Hilti Inspired) */}
        <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between">
            <span>QA Test Automation Acceleration (Hilti Model)</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30">
              -78% Cycle Time
            </span>
          </h3>

          <div className="p-4 bg-slate-900/90 rounded-lg border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400">Manual Test Execution Time:</span>
              <span className="font-mono text-red-400 font-semibold">~10.0 minutes / tenant</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400">AuraSupply Automated Runner:</span>
              <span className="font-mono text-emerald-400 font-bold">&lt; 1.4 seconds / tenant</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400">Multi-Tenant Test Coverage:</span>
              <span className="font-mono text-white font-semibold">30 Cloud Tenants Supported</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Regression Error Catch Rate:</span>
              <span className="font-mono text-sky-400 font-bold">100% Zero-Leakage</span>
            </div>
          </div>

          <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-[11px] text-indigo-300">
            💡 <b>Engineering Insight:</b> Automated regression suites run in parallel across multi-tenant partitions, decoupling verification from manual bottlenecks and enabling continuous deployment.
          </div>
        </div>

      </div>

    </div>
  );
}
