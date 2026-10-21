import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import OrderKanban from './components/OrderKanban';
import InventoryTable from './components/InventoryTable';
import QaAutomationRunner from './components/QaAutomationRunner';
import AnalyticsView from './components/AnalyticsView';
import NewOrderModal from './components/NewOrderModal';
import OrderDetailsModal from './components/OrderDetailsModal';

import {
  fetchOrders,
  fetchInventory,
  fetchQaRuns,
  fetchAnalytics,
  updateOrderStatus,
  createOrder,
  restockInventory,
  executeQaSuite
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [qaRuns, setQaRuns] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Enterprise Dual Theme State (Light = SAP Fiori / B2B; Dark = Obsidian / Linear)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('aura_theme');
    if (saved) return saved === 'dark';
    return false; // Default to clean corporate Enterprise Light mode
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('aura_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('aura_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [ordersData, invData, qaData, analyticsData] = await Promise.all([
        fetchOrders(),
        fetchInventory(),
        fetchQaRuns(),
        fetchAnalytics()
      ]);
      setOrders(ordersData);
      setInventory(invData);
      setQaRuns(qaData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`Order ${orderId} transitioned to '${newStatus}'!`);
      loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCreateOrder = async (orderPayload) => {
    try {
      const newOrder = await createOrder(orderPayload);
      showToast(`Order ${newOrder.id} generated in Quote stage!`);
      loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRestock = async (sku, qty) => {
    try {
      const updated = await restockInventory(sku, qty);
      showToast(`Restocked ${qty} units for SKU ${sku}!`);
      loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleExecuteQa = async (tenantId, suiteName) => {
    try {
      const result = await executeQaSuite(tenantId, suiteName);
      showToast(`QA Suite finished across [${tenantId}] with status: ${result.status}!`);
      loadAllData();
      return result;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090B] text-slate-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold border transition-all animate-in slide-in-from-bottom-5 duration-200 flex items-center space-x-2 ${
            toast.type === 'error'
              ? 'bg-red-500/20 text-red-700 dark:text-red-200 border-red-500/40'
              : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-500/40 backdrop-blur-md'
          }`}
        >
          <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
        onRefresh={loadAllData}
        loading={loading}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      {/* Main Body */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
        
        {/* Real-time KPI Stats Banner */}
        <StatsOverview analytics={analytics} />

        {/* Tab Views */}
        {activeTab === 'orders' && (
          <OrderKanban
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onViewDetails={(order) => setSelectedOrderForDetails(order)}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryTable
            inventory={inventory}
            onRestock={handleRestock}
            onAddSku={() => alert('New SKU modal: Select from supplier catalogue.')}
          />
        )}

        {activeTab === 'qa' && (
          <QaAutomationRunner
            qaRuns={qaRuns}
            onExecuteQa={handleExecuteQa}
            loading={loading}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            analytics={analytics}
            orders={orders}
            inventory={inventory}
          />
        )}

      </main>

      {/* Modals */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        inventory={inventory}
        onSubmitOrder={handleCreateOrder}
      />

      <OrderDetailsModal
        order={selectedOrderForDetails}
        onClose={() => setSelectedOrderForDetails(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0E0F12] py-4 text-center text-xs text-slate-500 dark:text-zinc-500 transition-colors duration-200">
        <p>AuraSupply Fulfillment Portal • Developed by <b>Muhammad Irfan Firdaus</b> • Modeled after Hilti Enterprise IT QA</p>
      </footer>

    </div>
  );
}
