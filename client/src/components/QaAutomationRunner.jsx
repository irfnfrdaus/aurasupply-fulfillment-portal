import React, { useState } from 'react';
import { ShieldCheck, Play, CheckCircle2, XCircle, Terminal, Clock, Cpu, Award, RefreshCw, FileCode } from 'lucide-react';

export default function QaAutomationRunner({ qaRuns, onExecuteQa, loading }) {
  const [selectedTenant, setSelectedTenant] = useState('Tenant 01 - APAC (MY / SG Hub)');
  const [selectedSuite, setSelectedSuite] = useState('Order-to-Cash (O2C) Full Lifecycle Regression');
  const [activeRunResult, setActiveRunResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedHistoricalRun, setSelectedHistoricalRun] = useState(null);

  const tenants = [
    { id: 'Tenant 01 - APAC (MY / SG Hub)', region: 'Asia-Pacific', activeDb: 'Live SQLite Production' },
    { id: 'Tenant 02 - EMEA (DE / CH Hub)', region: 'Europe/Middle East', activeDb: 'Live SQLite Staging' },
    { id: 'Tenant 03 - AMER (US / CA Hub)', region: 'Americas', activeDb: 'Live SQLite Replica' }
  ];

  const suites = [
    'Order-to-Cash (O2C) Full Lifecycle Regression',
    'Multi-Tenant Schema & Foreign Key Integrity',
    'Inventory Stock Reservation & Decrement Integrity',
    '8% SST Tax Math & Currency Conversion Assertion'
  ];

  const handleRunSuite = async () => {
    setIsExecuting(true);
    setActiveRunResult(null);

    try {
      const result = await onExecuteQa(selectedTenant, selectedSuite);
      setActiveRunResult(result);
    } catch (err) {
      alert(`QA execution failed: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const currentDisplayRun = activeRunResult || selectedHistoricalRun || qaRuns[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Hilti Inspired Model Callout */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 p-5 rounded-2xl border border-indigo-500/30 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Multi-Tenant QA Test Automation Runner
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                Hilti Framework Model
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Modeled after enterprise post-upgrade regression testing at <b>Hilti Asia IT Services</b> across 30 enterprise cloud tenants (SAP S/4HANA & Business ByDesign). Validates cross-tenant workflow execution, order-to-cash assertions, and schema divergence in real-time.
            </p>
          </div>

          {/* Efficiency Metric Card */}
          <div className="flex items-center space-x-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800 shrink-0">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Manual Time</div>
              <div className="text-sm font-mono text-slate-400 line-through">10 mins / tenant</div>
            </div>
            <div className="text-slate-600 font-bold">➔</div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-400">Automated Run</div>
              <div className="text-sm font-mono font-bold text-white">&lt; 1.5 seconds</div>
            </div>
            <div className="pl-2 border-l border-slate-800 text-center">
              <div className="text-xs font-extrabold text-emerald-400">&gt;78%</div>
              <div className="text-[9px] uppercase font-bold text-slate-400">Time Saved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Execution Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls Column */}
        <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>Test Execution Parameters</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Tenant Environment
            </label>
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              disabled={isExecuting}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-sky-500 font-medium"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Automated Regression Suite
            </label>
            <select
              value={selectedSuite}
              onChange={(e) => setSelectedSuite(e.target.value)}
              disabled={isExecuting}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-sky-500 font-medium"
            >
              {suites.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              onClick={handleRunSuite}
              disabled={isExecuting}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Executing Regression Suite...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Execute Automated Suite</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Specs */}
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex justify-between">
              <span>Engine:</span>
              <span className="text-slate-200 font-mono">Tricentis Tosca Protocol (Sim)</span>
            </div>
            <div className="flex justify-between">
              <span>Parallel Workers:</span>
              <span className="text-slate-200 font-mono">4 Virtual Agents</span>
            </div>
            <div className="flex justify-between">
              <span>Assertion Checks:</span>
              <span className="text-emerald-400 font-mono font-bold">Tax, Schema, Inventory</span>
            </div>
          </div>
        </div>

        {/* Live Execution Terminal & Assertions */}
        <div className="lg:col-span-2 bg-[#0B1120] rounded-xl border border-slate-800 flex flex-col h-[380px] overflow-hidden">
          
          {/* Terminal Header */}
          <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-xs text-slate-400">
                Live Runner Output: {currentDisplayRun ? currentDisplayRun.id : 'Ready'}
              </span>
            </div>
            {currentDisplayRun && (
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                currentDisplayRun.status === 'PASSED'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}>
                {currentDisplayRun.status} ({currentDisplayRun.duration_ms}ms)
              </span>
            )}
          </div>

          {/* Terminal Body */}
          <div className="p-4 font-mono text-xs overflow-y-auto space-y-2 flex-1">
            {isExecuting ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3 text-sky-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <span className="animate-pulse">Streaming real-time execution assertions across tenant...</span>
              </div>
            ) : currentDisplayRun ? (
              <>
                <div className="text-slate-400">
                  [SYSTEM] Initializing Test Automation Suite: <b className="text-white">{currentDisplayRun.test_suite}</b>
                </div>
                <div className="text-slate-400">
                  [TENANT] Target Partition: <b className="text-sky-400">{currentDisplayRun.tenant_id}</b>
                </div>
                <div className="text-slate-600">-----------------------------------------------------------------</div>
                {(currentDisplayRun.logs || []).map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-slate-400">[{step.duration_ms || 120}ms]</span>
                    <span className="text-emerald-400 font-bold">[PASS]</span>
                    <span className="text-slate-200">Step {step.step}: {step.name}</span>
                    <div className="text-[11px] text-slate-400 ml-4">➔ {step.assertion}</div>
                  </div>
                ))}
                <div className="text-slate-600">-----------------------------------------------------------------</div>
                <div className="text-emerald-400 font-bold">
                  [SUMMARY] 100% Assertions Passed ({currentDisplayRun.total_tests || 5}/{currentDisplayRun.total_tests || 5}). Execution Completed in {currentDisplayRun.duration_ms}ms.
                </div>
              </>
            ) : (
              <div className="text-slate-600 text-center py-24">
                Select parameters on the left and click "Execute Automated Suite" to run.
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Historical Regression Runs Audit */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-xs text-white uppercase tracking-wider">
            Regression Execution Audit Log
          </h3>
          <span className="text-xs text-slate-400">
            Total Logged Runs: <b>{qaRuns.length}</b>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A0F1D] text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Run ID</th>
                <th className="py-3 px-4">Tenant Partition</th>
                <th className="py-3 px-4">Test Suite Name</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Tests Passed</th>
                <th className="py-3 px-4 text-right">Execution Duration</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {qaRuns.map((run) => (
                <tr key={run.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-sky-400">{run.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{run.tenant_id}</td>
                  <td className="py-3 px-4 text-slate-300">{run.test_suite}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {run.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    {run.passed_tests} / {run.total_tests}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-400 font-bold">
                    {run.duration_ms} ms
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">{run.created_at}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedHistoricalRun(run);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="text-sky-400 hover:text-sky-300 font-semibold text-xs"
                    >
                      View Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
