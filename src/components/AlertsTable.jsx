import { useEffect, useRef, useState } from "react";
import { searchOrders } from "../config/api";
import AlertRow from "./AlertRow";

const PAGE_SIZE = 5;

function filterAnalysed(orders) {
  return (orders || []).filter(
    (o) =>
      (o.ONE_LINE_OUTPUT && String(o.ONE_LINE_OUTPUT).trim() !== "") ||
      (o.ORDER_VALUE && parseFloat(o.ORDER_VALUE) > 0)
  );
}

export default function AlertsTable({ orders, loading }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(1);
  const debounceRef = useRef(null);

  // reset page when orders or search changes
  useEffect(() => { setPage(1); }, [orders, query]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchOrders(query.trim());
        setSearchResults(filterAnalysed(data.orders));
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const isSearching = query.trim().length > 0;
  const allFiltered = filterAnalysed(searchResults !== null ? searchResults : orders);
  const visible = allFiltered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < allFiltered.length;

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 gap-3">
        <h2 className="text-slate-100 font-bold text-sm shrink-0">Latest Alerts</h2>
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company or ticker..."
            className="w-full bg-slate-700 text-slate-100 placeholder-slate-400 text-xs rounded-lg pl-8 pr-8 py-2 outline-none focus:ring-1 focus:ring-blue-500"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-sm"
            >
              ✕
            </button>
          )}
        </div>
        <span className="text-slate-500 text-xs shrink-0">
          {searching ? "Searching..." : `${visible.length} of ${allFiltered.length}`}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Stock</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Order Val / %</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">CMP / PE</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {loading || searching ? (
              <tr><td colSpan={4} className="text-center py-8 text-slate-500">
                {searching ? "Searching..." : "Loading..."}
              </td></tr>
            ) : visible.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-slate-500">
                {isSearching ? `No results for "${query}"` : "No alerts found"}
              </td></tr>
            ) : (
              visible.map((item, i) => (
                <AlertRow key={item._id?.toString() || i} item={item} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Load More */}
      {hasMore && !loading && !searching && (
        <div className="px-4 py-3 border-t border-slate-700 text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Show more ({allFiltered.length - visible.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
