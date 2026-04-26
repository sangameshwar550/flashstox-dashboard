import { useState } from "react";
import { formatOrderValue, formatPE, formatPrice, orderPctColor, timeAgo } from "../utils/formatters";

export default function AlertRow({ item }) {
  const [expanded, setExpanded] = useState(false);
  const pct = parseFloat(item.ORDER_PERCENTAGE);
  const colors = orderPctColor(pct, 30);

  return (
    <>
      <tr
        className="border-b border-slate-700/50 hover:bg-slate-700/30 cursor-pointer transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-4 py-3">
          <div className="font-bold text-slate-100 text-sm truncate max-w-[200px]">{item.SECNAME || "—"}</div>
          <div className="text-slate-400 text-xs mt-0.5">{item.SHORTNAME || ""}</div>
        </td>

        <td className="px-4 py-3">
          <div className="text-slate-100 text-sm font-medium">{formatOrderValue(item.ORDER_VALUE)}</div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded border mt-1 inline-block ${colors.text} ${colors.bg} ${colors.border}`}>
            {pct ? `${pct.toFixed(1)}%` : "—"}
          </span>
        </td>

        <td className="px-4 py-3">
          <div className="text-slate-100 text-sm">{formatPrice(item.CMP || item.LTP)}</div>
          <div className="text-slate-400 text-xs mt-0.5">{formatPE(item.PE)}</div>
        </td>

        <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
          {timeAgo(item.CREATED_TIME)}
        </td>
      </tr>

      {expanded && (
        <tr className="bg-slate-900/60">
          <td colSpan={4} className="px-4 py-3">
            <div className="border-l-4 border-blue-500 pl-3">
              {item.ONE_LINE_OUTPUT ? (
                <p className="text-slate-300 text-sm leading-relaxed">{item.ONE_LINE_OUTPUT}</p>
              ) : (
                <p className="text-slate-500 text-sm italic">No summary available</p>
              )}
              {(item.HEADLINE || item.TITLE) && (
                <p className="text-slate-500 text-xs mt-2 italic">{item.HEADLINE || item.TITLE}</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
