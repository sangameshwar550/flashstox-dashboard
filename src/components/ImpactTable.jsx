import { useState } from "react";
import { formatOrderValue, formatPrice } from "../utils/formatters";

function buildImpactRows(largeOrders, repeatStocks, gainers) {
  const largeMap = {};
  for (const o of largeOrders || []) {
    const sym = o.SHORTNAME;
    if (!sym) continue;
    if (!largeMap[sym] || parseFloat(o.ORDER_PERCENTAGE) > parseFloat(largeMap[sym].ORDER_PERCENTAGE)) {
      largeMap[sym] = o;
    }
  }

  const repeatMap = {};
  for (const r of repeatStocks || []) {
    const key = r.shortName || r._id;
    if (key) repeatMap[key] = r;
  }

  const gainerMap = {};
  for (const g of gainers || []) {
    if (g.symbol) gainerMap[g.symbol] = g;
  }

  const allSymbols = new Set([...Object.keys(largeMap), ...Object.keys(repeatMap)]);

  const rows = [];
  for (const sym of allSymbols) {
    const lo = largeMap[sym];
    const ro = repeatMap[sym];
    const g = gainerMap[sym];

    const priceChange = lo?.PcChg ?? g?.pChange ?? null;

    rows.push({
      symbol: sym,
      secname: lo?.SECNAME || ro?._id || sym,
      isLarge: !!lo,
      isRepeat: !!ro,
      repeatCount: ro?.count,
      orderValue: lo?.ORDER_VALUE,
      orderPct: lo?.ORDER_PERCENTAGE,
      cmp: lo?.CMP || lo?.LTP || g?.lastPrice,
      priceChange,
      lastDate: lo?.CREATED_TIME || ro?.lastOrder,
      oneLineOutput: lo?.ONE_LINE_OUTPUT || null,
    });
  }

  return rows.sort((a, b) => {
    const scoreA = (a.isLarge && a.isRepeat ? 3 : a.isLarge ? 2 : 1);
    const scoreB = (b.isLarge && b.isRepeat ? 3 : b.isLarge ? 2 : 1);
    return scoreB - scoreA || parseFloat(b.priceChange || 0) - parseFloat(a.priceChange || 0);
  });
}

function TypeBadge({ isLarge, isRepeat }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {isLarge && <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold">🔴 Large</span>}
      {isRepeat && <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-semibold">🔁 Repeat</span>}
    </div>
  );
}

export default function ImpactTable({ largeOrders, repeatStocks, gainers }) {
  const [expanded, setExpanded] = useState({});
  const rows = buildImpactRows(largeOrders, repeatStocks, gainers);

  if (!rows.length) return null;

  function toggleRow(key) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden mb-4 border-l-4 border-purple-500">
      <div className="px-4 py-3 border-b border-slate-700">
        <h2 className="text-slate-100 font-bold text-sm">📊 Order Impact</h2>
        <p className="text-slate-400 text-xs mt-0.5">Price movement for stocks with large or repeat orders</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">SECNAME</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Type</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Order Value</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Order %</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Price Change</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">CMP</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Repeat Count</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const rowKey = row.symbol || i;
              const isOpen = !!expanded[rowKey];
              const pc = parseFloat(row.priceChange);
              const isPositive = pc > 0;
              const isNeutral = isNaN(pc);
              return (
                <>
                  <tr
                    key={rowKey}
                    onClick={() => toggleRow(rowKey)}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-100 text-sm truncate max-w-[160px]">{row.secname}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{row.symbol}</div>
                    </td>
                    <td className="px-4 py-3">
                      <TypeBadge isLarge={row.isLarge} isRepeat={row.isRepeat} />
                    </td>
                    <td className="px-4 py-3 text-slate-300">{row.orderValue ? formatOrderValue(row.orderValue) : "—"}</td>
                    <td className="px-4 py-3">
                      {row.orderPct ? (
                        <span className="text-red-400 font-bold">{parseFloat(row.orderPct).toFixed(1)}%</span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {isNeutral ? (
                        <span className="text-slate-500">—</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
                            {isPositive ? "+" : ""}{pc.toFixed(2)}%
                          </span>
                          <div className="w-16 bg-slate-700 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${isPositive ? "bg-green-500" : "bg-red-500"}`}
                              style={{ width: `${Math.min(Math.abs(pc) * 5, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{formatPrice(row.cmp)}</td>
                    <td className="px-4 py-3">
                      {row.repeatCount ? (
                        <span className="text-yellow-400 font-semibold">{row.repeatCount}×</span>
                      ) : "—"}
                    </td>
                  </tr>
                  {isOpen && row.oneLineOutput && (
                    <tr key={`${rowKey}-expand`} className="bg-slate-900/50 border-b border-slate-700/50">
                      <td colSpan={7} className="px-6 py-3">
                        <p className="text-slate-400 text-xs leading-relaxed">{row.oneLineOutput}</p>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
