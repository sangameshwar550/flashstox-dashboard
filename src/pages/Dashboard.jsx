import { useCallback, useEffect, useState } from "react";
import AlertsTable from "../components/AlertsTable";
import ImpactTable from "../components/ImpactTable";
import LargeOrdersSection from "../components/LargeOrdersSection";
import RepeatOrdersWidget from "../components/RepeatOrdersWidget";
import SummaryCards from "../components/SummaryCards";
import {
  fetchLargeOrders,
  fetchRepeatOrders,
  fetchRecentOrders,
  fetchSummary,
  fetchTopGainers,
} from "../config/api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [largeOrders, setLargeOrders] = useState([]);
  const [gainers, setGainers] = useState([]);
  const [repeatOrders, setRepeatOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      setError(null);
      const [summaryData, ordersData, largeData, gainersData, repeatData] = await Promise.all([
        fetchSummary(),
        fetchRecentOrders(5, 50),
        fetchLargeOrders(),
        fetchTopGainers(),
        fetchRepeatOrders(),
      ]);
      setSummary(summaryData);
      setOrders(ordersData.orders || []);
      setLargeOrders(largeData.orders || []);
      setGainers(gainersData.gainers || []);
      setRepeatOrders(repeatData.stocks || []);
      setLastUpdated(new Date());
    } catch {
      setError("Failed to load data. Is the backend running on port 8081?");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadAll();
  }, [loadAll]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-slate-100">⚡ FlashStox</h1>
          <span className="text-slate-500 text-sm hidden sm:block">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-slate-500 text-xs hidden md:block">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => { setRefreshing(true); loadAll(); }}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            {refreshing ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>
      </header>

      <main className="p-4 max-w-screen-2xl mx-auto">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
            Loading dashboard...
          </div>
        ) : (
          <>
            <SummaryCards data={summary} />

            {/* Main 2-column layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* Left: Alerts + Large Orders */}
              <div className="xl:col-span-2 space-y-4">
                <div id="alerts-table"><AlertsTable orders={orders} loading={false} /></div>
                <div id="large-orders"><LargeOrdersSection orders={largeOrders} loading={false} /></div>
              </div>

              {/* Right: Repeat Orders Widget */}
              <div className="xl:col-span-1">
                <RepeatOrdersWidget data={repeatOrders} loading={false} />
              </div>
            </div>

            {/* Full width: Impact Table */}
            <div id="impact-table">
              <ImpactTable
                largeOrders={largeOrders}
                repeatStocks={repeatOrders}
                gainers={gainers}
              />
            </div>

          </>
        )}
      </main>
    </div>
  );
}
