import { useState } from "react";
import { formatOrderValue, formatPrice, timeAgo } from "../utils/formatters";

const PAGE_SIZE = 5;

export default function LargeOrdersSection({ orders, loading }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [expanded, setExpanded] = useState({});

  function toggleRow(key) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const shown = (orders || []).slice(0, visible);
  const hasMore = visible < (orders || []).length;

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden mb-4 border-l-4 border-red-500">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
        <span className="text-sm">🔴</span>
        <h2 className="text-slate-100 font-bold text-sm">Large Orders</h2>
        <span className="text-red-400 text-xs">&gt;30% Market Cap · Last 10 days</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Stock</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Order Value</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Mkt %</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">CMP</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-500">Loading...</td></tr>
            ) : orders?.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-500">No large orders found</td></tr>
            ) : (
              shown.map((item, i) => {
                const rowKey = item._id?.toString() || i;
                const isOpen = !!expanded[rowKey];
                return (
                  <>
                    <tr
                      key={rowKey}
                      onClick={() => toggleRow(rowKey)}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-100 truncate max-w-[200px]">{item.SECNAME || "—"}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{item.SHORTNAME || ""}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-100 font-medium">{formatOrderValue(item.ORDER_VALUE)}</td>
                      <td className="px-4 py-3">
                        <span className="text-red-400 font-bold">{item.ORDER_PERCENTAGE ? `${parseFloat(item.ORDER_PERCENTAGE).toFixed(1)}%` : "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{formatPrice(item.CMP || item.LTP)}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{timeAgo(item.CREATED_TIME)}</td>
                    </tr>
                    {isOpen && item.ONE_LINE_OUTPUT && (
                      <tr key={`${rowKey}-expand`} className="bg-slate-900/50 border-b border-slate-700/50">
                        <td colSpan={5} className="px-6 py-3">
                          <p className="text-slate-400 text-xs leading-relaxed">{item.ONE_LINE_OUTPUT}</p>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="px-4 py-3 text-center border-t border-slate-700">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
          >
            Show more ({orders.length - visible} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
