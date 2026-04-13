import { useState } from "react";

interface PriceCalculatorProps {
  onGetQuote: () => void;
}

const FORMAT_RUB = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

export function PriceCalculator({ onGetQuote }: PriceCalculatorProps) {
  const [width, setWidth] = useState(24);
  const [length, setLength] = useState(48);
  const [height, setHeight] = useState(6);
  const [buildingType, setBuildingType] = useState("warehouse");
  const [gates, setGates] = useState(1);
  const [windows, setWindows] = useState(0);
  const [hasCrane, setHasCrane] = useState(false);

  const calcPrice = () => {
    const area = width * length;
    const basePricePerSqm: Record<string, number> = {
      warehouse: 12500,
      production: 16000,
      trade: 18500,
      agro: 10800,
      sport: 22000,
    };
    const base = basePricePerSqm[buildingType] || 12500;
    const heightCoef = height > 8 ? 1.15 : height > 6 ? 1.08 : 1;
    const gatesCount = gates === 5 ? 6 : gates;
    const windowsCount = windows === 5 ? 8 : windows;
    const gatesCost = gatesCount * 185000;
    const windowsCost = windowsCount * 42000;
    const craneCost = hasCrane ? area * 3200 : 0;
    return Math.round((area * base * heightCoef + gatesCost + windowsCost + craneCost) / 1000) * 1000;
  };

  return (
    <div className="bg-white/5 border border-white/10 p-8 md:p-12">
      {/* Тип здания */}
      <div className="mb-10">
        <label className="font-oswald text-sm tracking-widest text-gray-300 uppercase mb-4 block">
          Тип здания
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { key: "warehouse", label: "Склад" },
            { key: "production", label: "Производство" },
            { key: "trade", label: "Торговля" },
            { key: "agro", label: "Агро" },
            { key: "sport", label: "Спорт" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setBuildingType(t.key); if (t.key !== "production") setHasCrane(false); }}
              className={`font-oswald text-sm tracking-wider uppercase py-3 px-4 border transition-all ${
                buildingType === t.key
                  ? "bg-evraz-red border-evraz-red text-white"
                  : "border-white/20 text-gray-300 hover:border-evraz-red hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Слайдеры */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {[
          { label: "Ширина", val: width, set: setWidth, min: 12, max: 60 },
          { label: "Длина", val: length, set: setLength, min: 18, max: 200 },
          { label: "Высота", val: height, set: setHeight, min: 4, max: 20 },
        ].map((s) => (
          <div key={s.label}>
            <div className="flex justify-between mb-3">
              <label className="font-oswald text-sm tracking-widest text-gray-300 uppercase">{s.label}</label>
              <span className="font-oswald text-evraz-red font-semibold">{s.val} м</span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              value={s.val}
              onChange={(e) => s.set(+e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between font-ibm text-xs text-gray-500 mt-1">
              <span>{s.min} м</span>
              <span>{s.max} м</span>
            </div>
          </div>
        ))}
      </div>

      {/* Опции */}
      <div className={`grid grid-cols-1 gap-6 mb-10 pt-8 border-t border-white/10 ${buildingType === "production" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {/* Ворота */}
        <div>
          <label className="font-oswald text-sm tracking-widest text-gray-300 uppercase mb-4 block">
            Ворота
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onClick={() => setGates(v)}
                className={`flex-1 py-2.5 font-oswald text-sm border transition-all ${
                  gates === v
                    ? "bg-evraz-red border-evraz-red text-white"
                    : "border-white/20 text-gray-300 hover:border-evraz-red hover:text-white"
                }`}
              >
                {v === 5 ? "5+" : v}
              </button>
            ))}
          </div>
          <div className="font-ibm text-xs text-gray-500 mt-2">
            +{((gates === 5 ? 6 : gates) * 185000).toLocaleString("ru-RU")} ₽
          </div>
        </div>

        {/* Окна */}
        <div>
          <label className="font-oswald text-sm tracking-widest text-gray-300 uppercase mb-4 block">
            Оконные блоки
          </label>
          <div className="flex gap-2">
            {[0, 2, 4, 6, 5].map((v, idx) => (
              <button
                key={idx}
                onClick={() => setWindows(v === 5 ? 5 : v)}
                className={`flex-1 py-2.5 font-oswald text-sm border transition-all ${
                  windows === (v === 5 ? 5 : v)
                    ? "bg-evraz-red border-evraz-red text-white"
                    : "border-white/20 text-gray-300 hover:border-evraz-red hover:text-white"
                }`}
              >
                {idx === 4 ? "8+" : v}
              </button>
            ))}
          </div>
          <div className="font-ibm text-xs text-gray-500 mt-2">
            +{((windows === 5 ? 8 : windows) * 42000).toLocaleString("ru-RU")} ₽
          </div>
        </div>

        {/* Кран — только для производства */}
        {buildingType === "production" && (
          <div>
            <label className="font-oswald text-sm tracking-widest text-gray-300 uppercase mb-4 block">
              Мостовой кран
            </label>
            <div className="flex gap-2">
              {[
                { val: false, label: "Нет" },
                { val: true, label: "Да" },
              ].map((opt) => (
                <button
                  key={String(opt.val)}
                  onClick={() => setHasCrane(opt.val)}
                  className={`flex-1 py-2.5 font-oswald text-sm border transition-all ${
                    hasCrane === opt.val
                      ? "bg-evraz-red border-evraz-red text-white"
                      : "border-white/20 text-gray-300 hover:border-evraz-red hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="font-ibm text-xs text-gray-500 mt-2">
              {hasCrane ? `+${(width * length * 3200).toLocaleString("ru-RU")} ₽` : "Без доплаты"}
            </div>
          </div>
        )}
      </div>

      {/* Итог */}
      <div className="bg-evraz-red/10 border border-evraz-red/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="font-ibm text-xs text-gray-400 uppercase tracking-wider mb-1">Площадь здания</div>
          <div className="font-oswald text-2xl text-white">{(width * length).toLocaleString("ru-RU")} м²</div>
        </div>
        <div className="text-center md:text-right">
          <div className="font-ibm text-xs text-gray-400 uppercase tracking-wider mb-1">
            Ориентировочная стоимость
          </div>
          <div className="font-oswald text-4xl text-evraz-red font-bold">{FORMAT_RUB(calcPrice())}</div>
          <div className="font-ibm text-xs text-gray-500 mt-1">*без учёта инженерных сетей и фундамента</div>
        </div>
        <button onClick={onGetQuote} className="btn-primary whitespace-nowrap">
          Получить смету
        </button>
      </div>
    </div>
  );
}
