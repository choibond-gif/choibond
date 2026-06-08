"use client";

import { useEffect, useState } from "react";

type RateItem = { value: string; change?: string | null; up?: boolean };
type ApiData = {
  fx:    { usdkrw: RateItem; jpykrw: RateItem; eurkrw: RateItem; cnykrw: RateItem };
  rates: { baserate: RateItem; bond3y: RateItem; bond5y: RateItem; bond10y: RateItem; corpAA: RateItem };
};

export default function FxRateCard() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fx-rates")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const fmtFx = (v: string) =>
    v === "-" ? "-" : Number(v).toLocaleString("ko-KR", { minimumFractionDigits: 2 });

  const FX_ROWS = data ? [
    { label: "USD / KRW", item: data.fx.usdkrw,  fmt: fmtFx },
    { label: "JPY / KRW (100엔)", item: data.fx.jpykrw, fmt: fmtFx },
    { label: "EUR / KRW", item: data.fx.eurkrw,  fmt: fmtFx },
    { label: "CNY / KRW", item: data.fx.cnykrw,  fmt: fmtFx },
  ] : [];

  const RATE_ROWS = data ? [
    { label: "한은 기준금리",    item: data.rates.baserate, pct: true },
    { label: "국고 3년",        item: data.rates.bond3y,   pct: true },
    { label: "국고 5년",        item: data.rates.bond5y,   pct: true },
    { label: "국고 10년",       item: data.rates.bond10y,  pct: true },
    { label: "회사채 AA- (3년)", item: data.rates.corpAA,   pct: true },
  ] : [];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">환율 · 금리</h3>
        <span className="text-xs text-gray-400">한국은행 ECOS</span>
      </div>

      <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">환율</p>
      <div className="space-y-2 mb-5">
        {FX_ROWS.map(({ label, item, fmt }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{label}</span>
            <span className="text-sm font-medium text-gray-900">{fmt(item.value)}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">금리</p>
      <div className="space-y-2">
        {RATE_ROWS.map(({ label, item }) => {
          const changeNum = parseFloat(item.change ?? "0");
          return (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {item.value !== "-" ? `${item.value}%` : "-"}
                </span>
                {item.change && (
                  <span className={`text-xs w-14 text-right ${changeNum > 0 ? "text-red-500" : changeNum < 0 ? "text-blue-500" : "text-gray-400"}`}>
                    {item.change}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
