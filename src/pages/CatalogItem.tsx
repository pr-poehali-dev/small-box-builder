import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/shared/Header";

// ─── Типы (дублируются из Catalog.tsx для изолированности страницы) ───────────

type BuildingTag = "Склад" | "Производство" | "Логистика";

interface GateSpec { count: number; size: string; wicket?: boolean; }
interface DoorSpec  { count: number; size: string; }
interface WindowSpec{ count: number; size: string; }

export interface CatalogItemData {
  id: string;
  tag: BuildingTag;
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
  popular?: boolean;
}

// ─── Константы расчёта ────────────────────────────────────────────────────────

const FRAME_RATIO    = 0.45;
const OK_RATIO       = 0.40;
const OPENINGS_RATIO = 0.15;

const EXTRA_OPTIONS = [
  { key: "del_mk",     label: "Доставка МК",                         base: "frame",    pct: 0.05 },
  { key: "del_ok",     label: "Доставка ОК",                         base: "ok",       pct: 0.05 },
  { key: "del_ezp",    label: "Доставка ЭЗП",                        base: "query",    pct: 0 },
  { key: "light",      label: "Расчёт освещения от ЭТМ",             base: "query",    pct: 0 },
  { key: "found_calc", label: "Расчёт фундамента",                   base: "query",    pct: 0 },
  { key: "ar_print",   label: "Печатная форма АР",                   base: "query",    pct: 0 },
  { key: "shelves",    label: "Расчёт стоимости стеллажей",          base: "query",    pct: 0 },
  { key: "found_work", label: "Устройство фундаментов",              base: "frame",    pct: 0.12 },
  { key: "mount_mk",   label: "Монтаж МК",                           base: "frame",    pct: 0.15 },
  { key: "mount_ok",   label: "Монтаж ОК",                           base: "ok",       pct: 0.12 },
  { key: "mount_ezp",  label: "Монтаж ЭЗП",                          base: "openings", pct: 0.15 },
  { key: "floor",      label: "Устройство ж/б плиты пола по грунту", base: "frame",    pct: 0.20 },
] as const;

type OptionKey = (typeof EXTRA_OPTIONS)[number]["key"];

const RUB = (n: number) =>
  n.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 });

// ─── Вспомогательный счётчик ──────────────────────────────────────────────────

function Counter({ value, onChange, min = 0, max = 20 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-6 h-6 flex items-center justify-center border border-gray-300 text-gray-600 hover:border-evraz-red hover:text-evraz-red transition-colors text-sm font-bold"
      >−</button>
      <span className="w-6 text-center font-ibm text-sm text-evraz-dark">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-6 h-6 flex items-center justify-center border border-gray-300 text-gray-600 hover:border-evraz-red hover:text-evraz-red transition-colors text-sm font-bold"
      >+</button>
    </div>
  );
}

// ─── Компонент ────────────────────────────────────────────────────────────────

interface Props {
  catalog: CatalogItemData[];
}

export default function CatalogItemPage({ catalog }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const item = catalog.find(c => c.id === id);

  const editing = searchParams.get("edit") === "1";

  const [width,        setWidth]        = useState(0);
  const [length,       setLength]       = useState(0);
  const [height,       setHeight]       = useState(0);
  const [gatesCount,   setGatesCount]   = useState(0);
  const [doorsCount,   setDoorsCount]   = useState(0);
  const [windowsCount, setWindowsCount] = useState(0);
  const [checked,      setChecked]      = useState<Set<OptionKey>>(new Set());
  const [extraOpen,    setExtraOpen]    = useState(false);

  const startEditing = () => setSearchParams({ edit: "1" });
  const stopEditing  = () => setSearchParams({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  useEffect(() => {
    if (item) {
      setWidth(item.width);
      setLength(item.length);
      setHeight(item.height);
      setGatesCount(item.gates?.count ?? 0);
      setDoorsCount(item.doors.reduce((a, d) => a + d.count, 0));
      setWindowsCount(item.windows.reduce((a, w) => a + w.count, 0));
      setChecked(new Set());
    }
  }, [item]);

  if (!item) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-oswald text-2xl text-evraz-dark mb-4">Здание не найдено</p>
          <button onClick={() => navigate("/catalog")} className="btn-primary">← Вернуться в каталог</button>
        </div>
      </div>
    );
  }

  // Пересчёт цены: габариты + количество проёмов
  const origArea  = item.width * item.length;
  const newArea   = width * length;
  const areaScale = origArea > 0 ? newArea / origArea : 1;

  const origOpenings = (item.gates?.count ?? 0) + item.doors.reduce((a,d)=>a+d.count,0) + item.windows.reduce((a,w)=>a+w.count,0);
  const newOpenings  = gatesCount + doorsCount + windowsCount;
  const openingsScale = origOpenings > 0 ? newOpenings / origOpenings : 1;

  const basePrice     = Math.round(item.price * areaScale);
  const openingsBase  = Math.round(item.price * OPENINGS_RATIO * areaScale);
  const adjustedOpeningsPrice = Math.round(openingsBase * (origOpenings > 0 ? openingsScale : 1));
  const framePrice    = Math.round(basePrice * FRAME_RATIO);
  const okPrice       = Math.round(basePrice * OK_RATIO);
  const openingsPrice = adjustedOpeningsPrice;
  const scaledPrice   = framePrice + okPrice + openingsPrice;
  const pricePerM2    = newArea > 0 ? Math.round(scaledPrice / newArea) : 0;

  const toggleOption = (key: OptionKey) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); } else { next.add(key); }
      return next;
    });
  };

  const getOptPrice = (opt: (typeof EXTRA_OPTIONS)[number]) => {
    if (opt.base === "query") return "По запросу";
    const base = opt.base === "frame" ? framePrice : opt.base === "ok" ? okPrice : openingsPrice;
    return RUB(Math.round(base * opt.pct));
  };

  const extraTotal = EXTRA_OPTIONS.reduce((sum, opt) => {
    if (!checked.has(opt.key) || opt.base === "query") return sum;
    const base = opt.base === "frame" ? framePrice : opt.base === "ok" ? okPrice : openingsPrice;
    return sum + Math.round(base * opt.pct);
  }, 0);

  const hasExtra = checked.size > 0;
  const total    = scaledPrice + extraTotal;

  return (
    <div className="min-h-screen bg-white font-ibm">
      <Header backButton={{ label: "Каталог", onClick: () => navigate("/catalog") }} />

      {/* ── Шапка страницы ── */}
      <div className="bg-evraz-dark px-6 py-4 flex items-center gap-4">
        <span className="font-oswald text-xs tracking-widest text-evraz-red uppercase">#{item.sku}</span>
        <span className="font-oswald text-white text-base uppercase tracking-wider">{item.name}</span>
        {item.popular && (
          <span className="font-oswald text-xs text-white bg-evraz-red px-2 py-0.5 uppercase tracking-wider">Популярный</span>
        )}
      </div>

      {/* ── Три колонки ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[calc(100vh-120px)]">

        {/* ─── Колонка 1: Фото + общая инфо ─── */}
        <div className="border-r border-gray-200 p-5 flex flex-col gap-4">
          <img src={item.image} alt={item.name} className="w-full aspect-video object-cover" />

          <div className="space-y-2">
            {[
              { label: "Назначение", val: item.tag, accent: false },
              { label: "Регион",     val: item.region, accent: false },
              { label: "Площадь",    val: `${(item.width * item.length).toLocaleString("ru-RU")} м²`, accent: false },
              { label: "Кран-балка", val: item.crane, accent: item.crane !== "Нет" },
            ].map(({ label, val, accent }) => (
              <div key={label} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                <span className="text-gray-500">{label}</span>
                <span className={`font-medium ${accent ? "text-evraz-red" : "text-evraz-dark"}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Колонка 2: Характеристики ─── */}
        <div className="border-r border-gray-200 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-oswald text-xs uppercase tracking-wider text-gray-500">Характеристики</span>
            {editing ? (
              <button
                onClick={stopEditing}
                className="font-oswald text-xs uppercase tracking-wider border border-evraz-red text-evraz-red px-2 py-1 hover:bg-evraz-red hover:text-white transition-all"
              >
                Готово
              </button>
            ) : (
              <button
                onClick={startEditing}
                className="font-oswald text-xs uppercase tracking-wider border border-evraz-dark text-evraz-dark px-2 py-1 hover:bg-evraz-dark hover:text-white transition-all"
              >
                Изменить размер
              </button>
            )}
          </div>

          {/* Габариты */}
          {editing ? (
            <div className="space-y-2">
              <p className="font-ibm text-xs text-gray-400">Цена пересчитывается пропорционально площади</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Ширина, м", val: width,  set: setWidth,  min: 6,   max: 48,  step: 3   },
                  { label: "Длина, м",  val: length, set: setLength, min: 6,   max: 120, step: 6   },
                  { label: "Высота, м", val: height, set: setHeight, min: 3,   max: 12,  step: 0.5 },
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
                      className="border border-gray-300 px-2 py-1.5 text-sm w-full focus:border-evraz-red focus:outline-none"
                    />
                  </div>
                ))}
              </div>
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

          {/* Ворота / Двери / Окна */}
          <div className="space-y-3 border-t border-gray-100 pt-3">
            <span className="font-oswald text-xs uppercase tracking-wider text-gray-500">Проёмы</span>

            {[
              {
                label: "Ворота",
                count: gatesCount,
                setCount: setGatesCount,
                detail: item.gates ? `${item.gates.size}${item.gates.wicket ? ", с калиткой" : ""}` : null,
              },
              {
                label: "Двери",
                count: doorsCount,
                setCount: setDoorsCount,
                detail: item.doors[0]?.size ?? null,
              },
              {
                label: "Окна",
                count: windowsCount,
                setCount: setWindowsCount,
                detail: item.windows[0]?.size ?? null,
              },
            ].map(({ label, count, setCount, detail }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-700 font-medium">{label}</span>
                  {detail && <span className="text-gray-400 text-xs ml-1">({detail})</span>}
                </div>
                {editing
                  ? <Counter value={count} onChange={setCount} />
                  : <span className="font-medium text-evraz-dark">{count} шт.</span>
                }
              </div>
            ))}

            {item.stripGlazing && (
              <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                <span className="text-gray-500">Лент. остекление</span>
                <span className="text-evraz-dark font-medium">{item.stripGlazing}</span>
              </div>
            )}
          </div>

          {!editing && (
            <button
              onClick={startEditing}
              className="mt-auto font-oswald text-xs uppercase tracking-wider py-2.5 bg-evraz-dark text-white hover:bg-evraz-red transition-colors text-center"
            >
              Изменить размер
            </button>
          )}
        </div>

        {/* ─── Колонка 3: Стоимость ─── */}
        <div className="p-5 flex flex-col gap-4">
          <span className="font-oswald text-xs uppercase tracking-wider text-gray-500">Стоимость</span>

          {/* Базовая разбивка */}
          <div className="space-y-2">
            {[
              { label: "Каркас МК",              val: framePrice },
              { label: "Ограждающие конструкции", val: okPrice },
              { label: "Окна, двери, ворота",     val: openingsPrice },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-evraz-dark">{RUB(val)}</span>
              </div>
            ))}
          </div>

          {/* Доп опции — спойлер */}
          <div className="border border-gray-200">
            <button
              onClick={() => setExtraOpen(o => !o)}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <span className="font-oswald text-xs uppercase tracking-wider text-gray-600">Доп. опции</span>
              <Icon name={extraOpen ? "ChevronUp" : "ChevronDown"} size={16} className="text-gray-400" />
            </button>

            {extraOpen && (
              <div className="px-3 pb-3 space-y-2 border-t border-gray-100">
                {EXTRA_OPTIONS.map(opt => (
                  <label key={opt.key} className="flex items-start gap-2 cursor-pointer group pt-2">
                    <input
                      type="checkbox"
                      className="mt-0.5 accent-evraz-red shrink-0"
                      checked={checked.has(opt.key)}
                      onChange={() => toggleOption(opt.key)}
                    />
                    <div className="flex flex-1 justify-between gap-2 min-w-0">
                      <span className="font-ibm text-xs text-gray-700 group-hover:text-evraz-dark leading-tight">{opt.label}</span>
                      <span className="font-ibm text-xs text-gray-500 shrink-0 whitespace-nowrap">{getOptPrice(opt)}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Итог доп опций — только если выбрано */}
          {hasExtra && extraTotal > 0 && (
            <div className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2">
              <span className="text-gray-500">Итого доп. опций</span>
              <span className="font-medium text-evraz-dark">{RUB(extraTotal)}</span>
            </div>
          )}

          {/* Итог */}
          <div className="mt-auto border-t-2 border-evraz-red pt-4">
            <div className="flex justify-between items-baseline">
              <span className="font-oswald text-xs uppercase tracking-wider text-gray-500">Итого</span>
              <div className="text-right">
                <div className="font-oswald text-3xl text-evraz-red font-bold">{RUB(total)}</div>
                {newArea > 0 && (
                  <div className="font-ibm text-xs text-gray-400 mt-0.5">{pricePerM2.toLocaleString("ru-RU")} ₽/м²</div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/catalog")}
            className="btn-primary font-oswald text-sm uppercase tracking-wider py-3 w-full text-center"
          >
            Получить расчёт
          </button>
        </div>
      </div>
    </div>
  );
}