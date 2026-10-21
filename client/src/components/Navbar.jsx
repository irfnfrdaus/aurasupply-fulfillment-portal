import React from 'react';
import { Package, Warehouse, ShieldCheck, BarChart3, Plus, RefreshCw, Cpu, Sun, Moon } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenNewOrder, onRefresh, loading, isDarkMode, toggleTheme }) {
  const navItems = [
    { id: 'orders', label: 'Order Fulfillment Kanban', icon: Package },
    { id: 'inventory', label: 'Inventory & Warehouses', icon: Warehouse },
    { id: 'qa', label: 'QA Test Automation Engine', icon: ShieldCheck, badge: 'Hilti Model' },
    { id: 'analytics', label: 'Executive Analytics', icon: BarChart3 }
  ];

  return (
    <header className="bg-white dark:bg-[#121316] border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-40 transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#0F2C59] dark:bg-sky-600 flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">AuraSupply</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 dark:bg-sky-950/60 text-[#0F2C59] dark:text-sky-400 border border-blue-200 dark:border-sky-800">
                  Enterprise ERP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">B2B Supply Chain & Automated QA Cockpit</p>
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
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-[#0F2C59] border border-blue-200 shadow-xs dark:bg-zinc-800 dark:text-white dark:border-zinc-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-850'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0F2C59] dark:text-sky-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons, Theme Switcher & Tenant Badge */}
          <div className="flex items-center space-x-2.5">
            
            {/* Multi-Tenant Indicator */}
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-[11px] text-slate-700 dark:text-zinc-300">
              <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Multi-Tenant: <b className="text-slate-900 dark:text-white font-bold">Tenant 01 (APAC)</b></span>
            </div>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to Enterprise Light Theme (SAP Fiori)' : 'Switch to Developer Dark Theme (Linear)'}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 transition"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={loading}
              title="Refresh Real-time Data"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0F2C59] dark:text-sky-400' : ''}`} />
            </button>

            {/* New Order Primary Button */}
            <button
              onClick={onOpenNewOrder}
              className="flex items-center space-x-1.5 bg-[#0F2C59] hover:bg-[#1E3A8A] dark:bg-sky-600 dark:hover:bg-sky-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm transition-all transform active:scale-95"
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
