import { formatPChange, formatPrice, formatVolume } from "../utils/formatters";

export default function TopGainersTable({ gainers, loading, largeOrderSymbols = [] }) {
  const symbolSet = new Set(largeOrderSymbols.map((s) => s?.toUpperCase()));

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden mb-4 border-l-4 border-green-500">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <h2 className="text-slate-100 font-bold text-sm">📈 Top Gainers</h2>
        <span className="text-slate-500 text-xs">⚡ = also has large order</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Stock</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Price</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Today %</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">30d %</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">Volume</th>
              <th className="px-4 py-2 text-left text-xs text-slate-500 uppercase font-semibold">52W</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500">Loading...</td></tr>
            ) : gainers?.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500">No gainers data</td></tr>
            ) : (
              gainers.map((item, i) => {
                const hasLargeOrder = symbolSet.has(item.symbol?.toUpperCase());
                const isPositive = parseFloat(item.pChange) >= 0;
                const pChange30 = parseFloat(item.perChange30d);
                return (
                  <tr key={item.symbol || i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-100">{item.symbol || "—"}</span>
                        {hasLargeOrder && <span title="Has large order" className="text-yellow-400">⚡</span>}
                      </div>
                      {item.nearWKH && <div className="text-yellow-400 text-xs mt-0.5">📍 Near 52W High</div>}
                      {item.nearWKL && <div className="text-yellow-400 text-xs mt-0.5">📍 Near 52W Low</div>}
                    </td>
                    <td className="px-4 py-3 text-slate-100">{formatPrice(item.lastPrice)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                        {formatPChange(item.pChange)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm ${pChange30 >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {item.perChange30d ? `${pChange30 > 0 ? "+" : ""}${pChange30.toFixed(1)}%` : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{formatVolume(item.totalTradedVolume)}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-slate-400">
                        <span className="text-green-400">{formatPrice(item.yearHigh)}</span>
                        <span className="text-slate-600 mx-1">/</span>
                        <span className="text-red-400">{formatPrice(item.yearLow)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
