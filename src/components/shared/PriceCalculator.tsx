import { useState } from "react";

export interface PriceCalculatorInitial {
  width?: number;
  length?: number;
  height?: number;
  buildingType?: string;
  gates?: number;
  windows?: number;
  region?: string;
}

interface PriceCalculatorProps {
  onGetQuote: () => void;
  initialValues?: PriceCalculatorInitial;
  regions?: string[];
}

const FORMAT_RUB = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

export function PriceCalculator({ onGetQuote, initialValues, regions = [] }: PriceCalculatorProps) {
  const [width, setWidth] = useState(initialValues?.width ?? 24);
  const [length, setLength] = useState(initialValues?.length ?? 48);
  const [height, setHeight] = useState(initialValues?.height ?? 6);
  const [buildingType, setBuildingType] = useState(initialValues?.buildingType ?? "warehouse");
  const [gates, setGates] = useState(initialValues?.gates ?? 1);
  const [windows, setWindows] = useState(initialValues?.windows ?? 0);
  const [hasCrane, setHasCrane] = useState(false);
  const [isWarm, setIsWarm] = useState(false);
  const [hasVitrage, setHasVitrage] = useState(false);
  const [hasStripGlazingOption, setHasStripGlazingOption] = useState(false);
  const [region, setRegion] = useState(initialValues?.region ?? "");

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
    const gatesCost = gates * 185000;
    const windowsCost = windows * 42000;
    const craneCost = hasCrane ? area * 3200 : 0;
    const warmCost = isWarm ? area * 2800 : 0;
    const vitrageCost = hasVitrage ? area * 1500 : 0;
    const stripGlazingCost = hasStripGlazingOption ? area * 900 : 0;
    return Math.round((area * base * heightCoef + gatesCost + windowsCost + craneCost + warmCost + vitrageCost + stripGlazingCost) / 1000) * 1000;
  };

  return (
    <div className="bg-white border border-evraz-border p-8 md:p-12">
      {/* Тип здания */}
      <div className="mb-10">
        <label className="font-oswald text-sm tracking-widest text-evraz-dark uppercase mb-4 block">
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
                  : "border-evraz-border text-evraz-dark hover:border-evraz-red hover:text-evraz-red"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Регион */}
      <div className="mb-10">
        <label className="font-oswald text-sm tracking-widest text-evraz-dark uppercase mb-4 block">
          Регион строительства
        </label>
        <div className="relative max-w-xs">
          <input
            list="calc-regions-list"
            type="text"
            placeholder="Начните вводить город..."
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full h-11 px-4 font-ibm text-sm border border-evraz-border text-evraz-dark focus:outline-none focus:border-evraz-red bg-white placeholder-evraz-gray/60 pr-10"
          />
          <datalist id="calc-regions-list">
            {regions.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
          {region && (
            <button
              onClick={() => setRegion("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-evraz-gray hover:text-evraz-dark transition-colors font-ibm text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>
        {region && (
          <div className="font-ibm text-xs text-evraz-gray mt-2">
            Регион: <span className="text-evraz-dark font-semibold">{region}</span>
          </div>
        )}
      </div>

      {/* Холодное / Тёплое */}
      <div className="mb-10">
        <label className="font-oswald text-sm tracking-widest text-evraz-dark uppercase mb-4 block">
          Исполнение
        </label>
        <div className="flex gap-3 max-w-xs">
          {[
            { val: false, label: "Холодное" },
            { val: true, label: "Тёплое" },
          ].map((opt) => (
            <button
              key={String(opt.val)}
              onClick={() => setIsWarm(opt.val)}
              className={`flex-1 py-3 font-oswald text-sm tracking-wider uppercase border transition-all ${
                isWarm === opt.val
                  ? "bg-evraz-red border-evraz-red text-white"
                  : "border-evraz-border text-evraz-dark hover:border-evraz-red hover:text-evraz-red"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {isWarm && (
          <div className="font-ibm text-xs text-evraz-gray mt-2">+{(width * length * 2800).toLocaleString("ru-RU")} ₽</div>
        )}
      </div>

      {/* Слайдеры */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {[
          { label: "Ширина", val: width, set: setWidth, min: 12, max: 24 },
          { label: "Длина", val: length, set: setLength, min: 18, max: 96 },
          { label: "Высота", val: height, set: setHeight, min: 4, max: 12 },
        ].map((s) => (
          <div key={s.label}>
            <div className="flex justify-between mb-3">
              <label className="font-oswald text-sm tracking-widest text-evraz-dark uppercase">{s.label}</label>
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
            <div className="flex justify-between font-ibm text-xs text-evraz-gray mt-1">
              <span>{s.min} м</span>
              <span>{s.max} м</span>
            </div>
          </div>
        ))}
      </div>

      {/* Опции */}
      <div className={`grid grid-cols-1 gap-6 mb-10 pt-8 border-t border-evraz-border ${buildingType === "production" || buildingType === "trade" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {/* Ворота */}
        <div>
          <label className="font-oswald text-sm tracking-widest text-evraz-dark uppercase mb-4 block">
            Ворота
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGates(Math.max(0, gates - 1))}
              className="w-10 h-10 flex items-center justify-center border border-evraz-border text-evraz-dark font-oswald text-xl hover:border-evraz-red hover:text-evraz-red transition-all"
            >−</button>
            <input
              type="number"
              min={0}
              value={gates}
              onChange={(e) => setGates(Math.max(0, +e.target.value))}
              className="flex-1 h-10 text-center font-oswald text-lg border border-evraz-border text-evraz-dark focus:outline-none focus:border-evraz-red"
            />
            <button
              onClick={() => setGates(gates + 1)}
              className="w-10 h-10 flex items-center justify-center border border-evraz-border text-evraz-dark font-oswald text-xl hover:border-evraz-red hover:text-evraz-red transition-all"
            >+</button>
          </div>
          <div className="font-ibm text-xs text-evraz-gray mt-2">
            +{(gates * 185000).toLocaleString("ru-RU")} ₽
          </div>
        </div>

        {/* Окна */}
        <div>
          <label className="font-oswald text-sm tracking-widest text-evraz-dark uppercase mb-4 block">
            Оконные блоки
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWindows(Math.max(0, windows - 1))}
              className="w-10 h-10 flex items-center justify-center border border-evraz-border text-evraz-dark font-oswald text-xl hover:border-evraz-red hover:text-evraz-red transition-all"
            >−</button>
            <input
              type="number"
              min={0}
              value={windows}
              onChange={(e) => setWindows(Math.max(0, +e.target.value))}
              className="flex-1 h-10 text-center font-oswald text-lg border border-evraz-border text-evraz-dark focus:outline-none focus:border-evraz-red"
            />
            <button
              onClick={() => setWindows(windows + 1)}
              className="w-10 h-10 flex items-center justify-center border border-evraz-border text-evraz-dark font-oswald text-xl hover:border-evraz-red hover:text-evraz-red transition-all"
            >+</button>
          </div>
          <div className="font-ibm text-xs text-evraz-gray mt-2">
            +{(windows * 42000).toLocaleString("ru-RU")} ₽
          </div>
        </div>

        {/* Витраж и ленточное остекление — только для торговли */}
        {buildingType === "trade" && (
          <div>
            <label className="font-oswald text-sm tracking-widest text-evraz-dark uppercase mb-4 block">
              Остекление фасада
            </label>
            <div className="flex flex-col gap-3">
              {[
                { val: hasVitrage, set: setHasVitrage, label: "Витраж", cost: width * length * 1500 },
                { val: hasStripGlazingOption, set: setHasStripGlazingOption, label: "Ленточное остекление", cost: width * length * 900 },
              ].map((opt) => (
                <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => opt.set(!opt.val)}
                    className={`w-5 h-5 border-2 flex items-center justify-center transition-all cursor-pointer ${
                      opt.val ? "bg-evraz-red border-evraz-red" : "border-evraz-border group-hover:border-evraz-red"
                    }`}
                  >
                    {opt.val && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span
                    onClick={() => opt.set(!opt.val)}
                    className="font-oswald text-sm text-evraz-dark uppercase tracking-wider"
                  >
                    {opt.label}
                  </span>
                  {opt.val && (
                    <span className="font-ibm text-xs text-evraz-gray ml-auto">+{opt.cost.toLocaleString("ru-RU")} ₽</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Кран — только для производства */}
        {buildingType === "production" && (
          <div>
            <label className="font-oswald text-sm tracking-widest text-evraz-dark uppercase mb-4 block">
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
                      : "border-evraz-border text-evraz-dark hover:border-evraz-red hover:text-evraz-red"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="font-ibm text-xs text-evraz-gray mt-2">
              {hasCrane ? `+${(width * length * 3200).toLocaleString("ru-RU")} ₽` : "Без доплаты"}
            </div>
          </div>
        )}
      </div>

      {/* Справочные характеристики */}
      {(() => {
        const wallThickness = buildingType === "sport" || buildingType === "trade" ? 150 : 100;
        const roofThickness = buildingType === "agro" ? 100 : 150;
        const roofType = height > 8 ? "Скатная двускатная" : "Скатная однопролётная";
        const roofPanel = buildingType === "agro" ? "Профнастил" : "Сэндвич-панель";
        const wallPanel = buildingType === "agro" ? "Профнастил" : "Сэндвич-панель";
        const hasStripGlazing = buildingType === "sport" || (buildingType === "trade" && hasStripGlazingOption);
        const doorsCount = buildingType === "production" ? 4 : 2;

        const specs = [
          { label: "Стены", value: `${wallPanel}, ${wallThickness} мм` },
          { label: "Кровля", value: `${roofType}, ${roofPanel} ${roofThickness} мм` },
          { label: "Ленточное остекление", value: hasStripGlazing ? "Да" : "Нет" },
          { label: "Двери", value: `${doorsCount} шт.` },
        ];

        return (
          <div className="border border-evraz-border bg-evraz-light px-6 py-5 mb-0">
            <div className="font-ibm text-xs text-evraz-gray uppercase tracking-widest mb-4">
              Характеристики здания
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
              {specs.map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="font-ibm text-xs text-evraz-gray">{s.label}</span>
                  <span className="font-oswald text-sm text-evraz-dark font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Итог */}
      <div className="bg-evraz-charcoal border border-t-0 border-evraz-border p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="font-ibm text-xs text-evraz-gray uppercase tracking-wider mb-1">Площадь здания</div>
          <div className="font-oswald text-2xl text-evraz-dark">{(width * length).toLocaleString("ru-RU")} м²</div>
        </div>
        <div className="text-center md:text-right">
          <div className="font-ibm text-xs text-evraz-gray uppercase tracking-wider mb-1">
            Ориентировочная стоимость
          </div>
          <div className="font-oswald text-4xl text-evraz-red font-bold">{FORMAT_RUB(calcPrice())}</div>
          <div className="font-ibm text-xs text-evraz-gray mt-1">*без учёта инженерных сетей и фундамента</div>
        </div>
        <button onClick={onGetQuote} className="btn-primary whitespace-nowrap">
          Получить смету
        </button>
      </div>
    </div>
  );
}
