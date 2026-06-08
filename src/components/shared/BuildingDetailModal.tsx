import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface GateSpec {
  count: number;
  size: string;
  wicket?: boolean;
}

interface DoorSpec {
  count: number;
  size: string;
}

interface WindowSpec {
  count: number;
  size: string;
}

export interface BuildingModalItem {
  id: string;
  tag: string;
  name: string;
  image: string;
  sku: string;
  width: number;
  length: number;
  height: number;
  price: number;
  crane: string;
  region: string;
  gates: GateSpec | null;
  doors: DoorSpec[];
  windows: WindowSpec[];
  stripGlazing?: string;
}

interface Props {
  item: BuildingModalItem | null;
  onClose: () => void;
  onResize: (item: BuildingModalItem) => void;
}

const RUB = (n: number) =>
  n.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 });

// Коэффициенты разбивки цены по блокам (от общей цены)
const FRAME_RATIO = 0.45;
const OK_RATIO = 0.40;
const OPENINGS_RATIO = 0.15;

// Доп опции: [label, база ("frame"|"ok"|"openings"|"query"), процент]
const EXTRA_OPTIONS = [
  { key: "del_mk",    label: "Доставка МК",                         base: "frame",    pct: 0.05 },
  { key: "del_ok",    label: "Доставка ОК",                         base: "ok",       pct: 0.05 },
  { key: "del_ezp",   label: "Доставка ЭЗП",                        base: "query",    pct: 0 },
  { key: "light",     label: "Расчёт освещения от ЭТМ",             base: "query",    pct: 0 },
  { key: "found_calc",label: "Расчёт фундамента",                   base: "query",    pct: 0 },
  { key: "ar_print",  label: "Печатная форма АР",                   base: "query",    pct: 0 },
  { key: "shelves",   label: "Расчёт стоимости стеллажей",          base: "query",    pct: 0 },
  { key: "found_work",label: "Устройство фундаментов",              base: "frame",    pct: 0.12 },
  { key: "mount_mk",  label: "Монтаж МК",                           base: "frame",    pct: 0.15 },
  { key: "mount_ok",  label: "Монтаж ОК",                           base: "ok",       pct: 0.12 },
  { key: "mount_ezp", label: "Монтаж ЭЗП",                          base: "openings", pct: 0.15 },
  { key: "floor",     label: "Устройство ж/б плиты пола по грунту", base: "frame",    pct: 0.20 },
] as const;

type OptionKey = (typeof EXTRA_OPTIONS)[number]["key"];

export default function BuildingDetailModal({ item, onClose, onResize }: Props) {
  const [width, setWidth] = useState(0);
  const [length, setLength] = useState(0);
  const [height, setHeight] = useState(0);
  const [editing, setEditing] = useState(false);
  const [checked, setChecked] = useState<Set<OptionKey>>(new Set());

  useEffect(() => {
    if (item) {
      setWidth(item.width);
      setLength(item.length);
      setHeight(item.height);
      setEditing(false);
      setChecked(new Set());
    }
  }, [item]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!item) return null;

  // Пересчёт цены при изменении размеров (пропорционально площади)
  const origArea = item.width * item.length;
  const newArea = width * length;
  const scaledPrice = origArea > 0 ? Math.round(item.price * (newArea / origArea)) : item.price;
  const pricePerM2 = newArea > 0 ? Math.round(scaledPrice / newArea) : 0;

  const framePrice    = Math.round(scaledPrice * FRAME_RATIO);
  const okPrice       = Math.round(scaledPrice * OK_RATIO);
  const openingsPrice = Math.round(scaledPrice * OPENINGS_RATIO);

  const toggleOption = (key: OptionKey) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); } else { next.add(key); }
      return next;
    });
  };

  const extraTotal = EXTRA_OPTIONS.reduce((sum, opt) => {
    if (!checked.has(opt.key)) return sum;
    if (opt.base === "query") return sum;
    const base = opt.base === "frame" ? framePrice : opt.base === "ok" ? okPrice : openingsPrice;
    return sum + Math.round(base * opt.pct);
  }, 0);

  const total = scaledPrice + extraTotal;

  const getOptPrice = (opt: (typeof EXTRA_OPTIONS)[number]) => {
    if (opt.base === "query") return "По запросу";
    const base = opt.base === "frame" ? framePrice : opt.base === "ok" ? okPrice : openingsPrice;
    return RUB(Math.round(base * opt.pct));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-evraz-dark">
          <div className="flex items-center gap-3">
            <span className="font-oswald text-xs tracking-widest text-evraz-red uppercase">#{item.sku}</span>
            <span className="font-oswald text-white text-sm uppercase tracking-wider truncate max-w-xs">{item.name}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Основной контент — три колонки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">

          {/* ── Блок 1: Фото + общая инфо ── */}
          <div className="p-4 flex flex-col gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-full aspect-video object-cover"
            />
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-ibm">Назначение</span>
                <span className="font-oswald uppercase tracking-wider text-evraz-dark">{item.tag}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-ibm">Регион</span>
                <span className="font-ibm text-evraz-dark">{item.region}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-ibm">Площадь</span>
                <span className="font-ibm text-evraz-dark">{(item.width * item.length).toLocaleString("ru-RU")} м²</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-ibm">Кран-балка</span>
                <span className={`font-ibm ${item.crane !== "Нет" ? "text-evraz-red font-semibold" : "text-evraz-dark"}`}>{item.crane}</span>
              </div>
            </div>
          </div>

          {/* ── Блок 2: Характеристики ── */}
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-oswald text-xs uppercase tracking-wider text-gray-500">Характеристики</span>
              <button
                onClick={() => setEditing(e => !e)}
                className="font-oswald text-xs uppercase tracking-wider border border-evraz-dark text-evraz-dark px-2 py-1 hover:bg-evraz-dark hover:text-white transition-all"
              >
                {editing ? "Готово" : "Изменить размер"}
              </button>
            </div>

            {/* Габариты */}
            {editing ? (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Ширина, м", val: width, set: setWidth, min: 6, max: 48, step: 3 },
                  { label: "Длина, м",  val: length, set: setLength, min: 6, max: 120, step: 6 },
                  { label: "Высота, м", val: height, set: setHeight, min: 3, max: 12, step: 0.5 },
                ].map(({ label, val, set, min, max, step }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="font-ibm text-xs text-gray-500">{label}</span>
                    <input
                      type="number"
                      value={val}
                      min={min}
                      max={max}
                      step={step}
                      onChange={e => set(Number(e.target.value))}
                      className="border border-gray-300 px-2 py-1.5 text-sm font-ibm w-full focus:border-evraz-red focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Ширина", val: `${width} м` },
                  { label: "Длина",  val: `${length} м` },
                  { label: "Высота", val: `${height} м` },
                ].map(({ label, val }) => (
                  <div key={label} className="border border-gray-200 p-2 text-center">
                    <div className="font-oswald text-base text-evraz-dark">{val}</div>
                    <div className="font-ibm text-xs text-gray-400">{label}</div>
                  </div>
                ))}
              </div>
            )}

            {editing && (
              <p className="text-xs text-gray-400 font-ibm">Цена пересчитывается пропорционально площади</p>
            )}

            {/* Ворота / Двери / Окна */}
            <div className="space-y-1.5 text-xs border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-500 font-ibm">Ворота</span>
                <span className="font-ibm text-evraz-dark text-right max-w-[55%]">
                  {item.gates
                    ? `${item.gates.count} шт. (${item.gates.size}${item.gates.wicket ? ", с калиткой" : ""})`
                    : "Нет"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-ibm">Двери</span>
                <span className="font-ibm text-evraz-dark text-right max-w-[55%]">
                  {item.doors.length
                    ? item.doors.map(d => `${d.count} шт. (${d.size})`).join(", ")
                    : "Нет"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-ibm">Окна</span>
                <span className="font-ibm text-evraz-dark text-right max-w-[55%]">
                  {item.windows.length
                    ? item.windows.map(w => `${w.count} шт. (${w.size})`).join(", ")
                    : "Нет"}
                </span>
              </div>
              {item.stripGlazing && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-ibm">Лент. остекление</span>
                  <span className="font-ibm text-evraz-dark">{item.stripGlazing}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => onResize(item)}
              className="mt-auto font-oswald text-xs uppercase tracking-wider py-2 bg-evraz-dark text-white hover:bg-evraz-red transition-colors"
            >
              Открыть калькулятор
            </button>
          </div>

          {/* ── Блок 3: Цена + доп опции ── */}
          <div className="p-4 flex flex-col gap-3">
            <span className="font-oswald text-xs uppercase tracking-wider text-gray-500">Стоимость</span>

            {/* Базовые блоки цены */}
            <div className="space-y-1.5">
              {[
                { label: "Каркас МК",             val: framePrice },
                { label: "Ограждающие конструкции", val: okPrice },
                { label: "Окна, двери, ворота",    val: openingsPrice },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between text-xs border-b border-gray-100 pb-1.5">
                  <span className="text-gray-500 font-ibm">{label}</span>
                  <span className="font-ibm text-evraz-dark font-medium">{RUB(val)}</span>
                </div>
              ))}
            </div>

            {/* Доп опции */}
            <div>
              <span className="font-oswald text-xs uppercase tracking-wider text-gray-400">Доп. опции</span>
              <div className="mt-1.5 space-y-1 max-h-44 overflow-y-auto pr-1">
                {EXTRA_OPTIONS.map(opt => (
                  <label key={opt.key} className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="mt-0.5 accent-evraz-red shrink-0"
                      checked={checked.has(opt.key)}
                      onChange={() => toggleOption(opt.key)}
                    />
                    <div className="flex flex-1 justify-between items-start gap-1 min-w-0">
                      <span className="font-ibm text-xs text-gray-700 group-hover:text-evraz-dark leading-tight">{opt.label}</span>
                      <span className="font-ibm text-xs text-gray-500 shrink-0 whitespace-nowrap">{getOptPrice(opt)}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Итог */}
            <div className="mt-auto border-t-2 border-evraz-red pt-3">
              <div className="flex justify-between items-baseline">
                <span className="font-oswald text-xs uppercase tracking-wider text-gray-500">Итого</span>
                <div className="text-right">
                  <div className="font-oswald text-2xl text-evraz-red font-bold">{RUB(total)}</div>
                  {newArea > 0 && (
                    <div className="font-ibm text-xs text-gray-400">{pricePerM2.toLocaleString("ru-RU")} ₽/м²</div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                setTimeout(() => {
                  document.getElementById("contacts-section")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="btn-primary font-oswald text-sm uppercase tracking-wider py-3 w-full text-center"
            >
              Получить расчёт
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}