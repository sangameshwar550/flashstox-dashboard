import { useState } from "react";
import { formatOrderValue, timeAgo } from "../utils/formatters";

const PAGE_SIZE = 5;

function orderValueDisplay(val) {
  const n = parseFloat(val);
  if (!val || isNaN(n) || n === 0) return "NA";
  return formatOrderValue(n);
}

function PriceChange({ pct }) {
  if (pct == null) return <span className="text-slate-500 text-xs">—</span>;
  const n = parseFloat(pct);
  const color = n >= 0 ? "text-green-400" : "text-red-400";
  return <span className={`text-xs font-semibold ${color}`}>{n >= 0 ? "+" : ""}{n.toFixed(2)}%</span>;
}

export default function RepeatOrdersWidget({ data, loading }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [expanded, setExpanded] = useState({});
  const maxCount = data?.length ? Math.max(...data.map((d) => d.count)) : 1;
  const shown = (data || []).slice(0, visible);
  const hasMore = visible < (data || []).length;

  function toggleRow(key) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border-l-4 border-yellow-500 h-fit">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <h2 className="text-slate-100 font-bold text-sm">🔁 Repeat Orders</h2>
        <span className="text-slate-500 text-xs">Last 3 months</span>
      </div>

      <div className="px-2 py-1">
        <div className="grid grid-cols-[minmax(0,140px)_auto_auto_auto_auto] px-2 py-1.5 text-xs text-slate-500 uppercase font-semibold border-b border-slate-700 mb-1 gap-3">
          <span>Stock</span>
          <span className="text-right">Mkt Cap</span>
          <span className="text-right">Total Value</span>
          <span className="text-right">% Chg</span>
          <span className="text-right">Last</span>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-500 text-sm">Loading...</div>
        ) : data?.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No repeat orders</div>
        ) : (
          <>
            {shown.map((item, i) => {
              const rowKey = item._id || i;
              const barPct = Math.round((item.count / maxCount) * 100);
              const totalValue = item.totalOrderValue || item.orders?.reduce((s, o) => s + (parseFloat(o.orderValue) || 0), 0);
              const isOpen = !!expanded[rowKey];
              const orders = [...(item.orders || [])].sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

              return (
                <div key={rowKey} className="border-b border-slate-700/50">
                  <button
                    onClick={() => toggleRow(rowKey)}
                    className="grid grid-cols-[minmax(0,140px)_auto_auto_auto_auto] items-center px-2 py-2.5 hover:bg-slate-700/30 gap-3 w-full text-left"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-100 text-sm truncate">{item._id || "—"}</div>
                      {item.shortName && <div className="text-slate-500 text-xs truncate">{item.shortName}</div>}
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-16 bg-slate-700 rounded-full h-1">
                          <div className="bg-yellow-500 h-1 rounded-full" style={{ width: `${barPct}%` }} />
                        </div>
                        <span className="text-yellow-400 text-xs font-semibold">{item.count} orders</span>
                      </div>
                    </div>
                    <span className="text-slate-400 text-xs text-right whitespace-nowrap">{item.marketCap} Cr</span>
                    <span className="text-slate-300 text-xs text-right whitespace-nowrap">{orderValueDisplay(totalValue)}</span>
                    <div className="text-right whitespace-nowrap"><PriceChange pct={item.priceChangePct} /></div>
                    <span className="text-slate-500 text-xs text-right whitespace-nowrap">{timeAgo(item.lastOrder)}</span>
                  </button>

                  {isOpen && (
                    <div className="bg-slate-900/50 px-3 pb-3 pt-1 space-y-2">
                      {orders.map((o, j) => (
                        <div key={j} className="border border-slate-700/60 rounded-lg p-2.5 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-400 text-xs">
                              {o.createdTime
                                ? new Date(o.createdTime).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                                : "—"}
                            </span>
                            <span className="text-slate-300 text-xs font-semibold">{orderValueDisplay(o.orderValue)}</span>
                          </div>
                          {o.oneLineOutput && (
                            <p className="text-slate-400 text-xs leading-relaxed">{o.oneLineOutput}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {hasMore && (
              <div className="px-2 py-3 text-center">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
                >
                  Show more ({data.length - visible} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
