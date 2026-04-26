const CARDS = [
  { key: "totalOrders",      label: "Last 5 days",   icon: "📋", color: "border-blue-500 text-blue-400",   target: "alerts-table" },
  { key: "largeOrdersCount", label: "Large Orders",   icon: "🔴", color: "border-red-500 text-red-400",     target: "large-orders" },
  { key: "topGainersCount",  label: "Top Gainers",    icon: "📈", color: "border-green-500 text-green-400", target: "top-gainers"  },
  { key: "stocksInBoth",     label: "Large + Gainer", icon: "⚡", color: "border-yellow-500 text-yellow-400", target: "impact-table" },
];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function SummaryCards({ data }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {CARDS.map((card) => {
        const value = data?.[card.key];
        const display = Array.isArray(value) ? value.length : (value ?? "—");
        const isTotal = card.key === "totalOrders";
        const [borderColor, textColor] = card.color.split(" ");

        return (
          <button
            key={card.key}
            onClick={() => scrollTo(card.target)}
            className={`bg-slate-800 rounded-xl p-4 border-l-4 ${borderColor} text-left w-full transition-colors hover:bg-slate-700/70 cursor-pointer`}
          >
            <div className="text-xl mb-1">{card.icon}</div>
            <div className={`text-3xl font-bold ${textColor}`}>{display}</div>
            <div className="text-slate-400 text-xs mt-1">{card.label}</div>
            {isTotal && data?.todayOrders != null && (
              <div className="mt-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                <span className="text-green-400 text-xs font-semibold">{data.todayOrders} today</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
