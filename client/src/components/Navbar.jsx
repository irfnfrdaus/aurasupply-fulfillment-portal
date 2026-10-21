import React from 'react';
import { Package, Warehouse, ShieldCheck, BarChart3, Plus, RefreshCw, Cpu } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenNewOrder, onRefresh, loading }) {
  const navItems = [
    { id: 'orders', label: 'Order Fulfillment Kanban', icon: Package },
    { id: 'inventory', label: 'Inventory & Warehouses', icon: Warehouse },
    { id: 'qa', label: 'QA Test Automation Engine', icon: ShieldCheck, badge: 'Hilti Model' },
    { id: 'analytics', label: 'Executive Analytics', icon: BarChart3 }
  ];

  return (
    <header className="bg-[#0F172A] border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">AuraSupply</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  v1.0 ERP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Enterprise Supply Chain & QA Cockpit</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 relative ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm shadow-sky-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & Tenant Badge */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Multi-Tenant: <b className="text-white">Tenant 01 (APAC)</b></span>
            </div>

            <button
              onClick={onRefresh}
              disabled={loading}
              title="Refresh Real-time Data"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            <button
              onClick={onOpenNewOrder}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-md shadow-sky-500/20 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Order</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
