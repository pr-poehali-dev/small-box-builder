import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/shared/Header";

// ─── Типы ─────────────────────────────────────────────────────────────────────

type BuildingTag = "Склад" | "Производство" | "Логистика";

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

const FRAME_RATIO = 0.45;
const OK_RATIO = 0.4;
const OPENINGS_RATIO = 0.15;

const EXTRA_OPTIONS = [
  { key: "del_mk", label: "Доставка МК", base: "frame", pct: 0.05 },
  { key: "del_ok", label: "Доставка ОК", base: "ok", pct: 0.05 },
  { key: "del_ezp", label: "Доставка ЭЗП", base: "query", pct: 0 },
  { key: "light", label: "Расчёт освещения от ЭТМ", base: "query", pct: 0 },
  { key: "found_calc", label: "Расчёт фундамента", base: "query", pct: 0 },
  { key: "ar_print", label: "Печатная форма АР", base: "query", pct: 0 },
  {
    key: "shelves",
    label: "Расчёт стоимости стеллажей",
    base: "query",
    pct: 0,
  },
  {
    key: "found_work",
    label: "Устройство фундаментов",
    base: "frame",
    pct: 0.12,
  },
  { key: "mount_mk", label: "Монтаж МК", base: "frame", pct: 0.15 },
  { key: "mount_ok", label: "Монтаж ОК", base: "ok", pct: 0.12 },
  { key: "mount_ezp", label: "Монтаж ЭЗП", base: "openings", pct: 0.15 },
  {
    key: "floor",
    label: "Устройство ж/б плиты пола по грунту",
    base: "frame",
    pct: 0.2,
  },
] as const;

type OptionKey = (typeof EXTRA_OPTIONS)[number]["key"];

const RUB = (n: number) =>
  n.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  });

const LEASING_ADVANCE = 0.2;
const LEASING_RATE    = 0.165;
const LEASING_MONTHS  = 36;

function calcLeasing(price: number) {
  const advance    = price * LEASING_ADVANCE;
  const body       = price - advance;
  const monthlyRate = LEASING_RATE / 12;
  const payment    = (body * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -LEASING_MONTHS));
  return { advance, payment };
}

// ─── Описания по тегу ─────────────────────────────────────────────────────────

const TAG_DESC: Record<BuildingTag, string> = {
  Склад:
    "Типовое складское здание из стали EVRAZ с утеплёнными стеновыми панелями. Оптимально для хранения товаров, сырья и готовой продукции. Соответствует нормам противопожарной безопасности и санитарным требованиям.",
  Производство:
    "Производственное здание с усиленным каркасом, рассчитанным на технологические нагрузки. Возможна установка кран-балки, антресольного этажа и промышленной вентиляции. Подходит для большинства видов производств.",
  Логистика:
    "Логистический комплекс с высокими воротами и увеличенным шагом колонн для свободного манёвра погрузчиков. Предусмотрены доковые узлы и рампы. Оптимальная планировка для складской логистики и кросс-докинга.",
};

// ─── Этапы работы ─────────────────────────────────────────────────────────────

const STAGES = [
  {
    icon: "FileText",
    title: "Заявка и КП",
    desc: "Получаем заявку, за 1 день формируем коммерческое предложение с детализацией",
  },
  {
    icon: "PenTool",
    title: "Проектирование",
    desc: "Разрабатываем АР и КМД, согласовываем с заказчиком за 5–7 рабочих дней",
  },
  {
    icon: "Factory",
    title: "Производство МК",
    desc: "Изготавливаем металлоконструкции на собственном заводе EVRAZ — 20–30 дней",
  },
  {
    icon: "Truck",
    title: "Доставка",
    desc: "Комплектуем и доставляем МК и ограждающие конструкции на объект",
  },
  {
    icon: "HardHat",
    title: "Монтаж",
    desc: "Аккредитованная бригада выполняет сборку здания под ключ за 10–20 дней",
  },
  {
    icon: "ClipboardCheck",
    title: "Сдача объекта",
    desc: "Подписываем акты, передаём паспорт здания и гарантийные документы",
  },
];

// ─── Счётчик ──────────────────────────────────────────────────────────────────

function Counter({
  value,
  onChange,
  min = 0,
  max = 20,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-6 h-6 flex items-center justify-center border border-gray-300 text-gray-600 hover:border-evraz-red hover:text-evraz-red transition-colors text-sm font-bold"
      >
        −
      </button>
      <span className="w-6 text-center font-ibm text-sm text-evraz-dark">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-6 h-6 flex items-center justify-center border border-gray-300 text-gray-600 hover:border-evraz-red hover:text-evraz-red transition-colors text-sm font-bold"
      >
        +
      </button>
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
  const item = catalog.find((c) => c.id === id);

  const editing = searchParams.get("edit") === "1";

  const [width, setWidth] = useState(0);
  const [length, setLength] = useState(0);
  const [height, setHeight] = useState(0);
  const [gatesCount, setGatesCount] = useState(0);
  const [doorsCount, setDoorsCount] = useState(0);
  const [windowsCount, setWindowsCount] = useState(0);
  const [checked, setChecked] = useState<Set<OptionKey>>(new Set());
  const [extraOpen, setExtraOpen] = useState(false);

  // Форма заявки
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formComment, setFormComment] = useState("");
  const [formSent, setFormSent] = useState(false);

  const startEditing = () => setSearchParams({ edit: "1" });
  const stopEditing = () => setSearchParams({});

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
          <p className="font-oswald text-2xl text-evraz-dark mb-4">
            Здание не найдено
          </p>
          <button onClick={() => navigate("/catalog")} className="btn-primary">
            ← Вернуться в каталог
          </button>
        </div>
      </div>
    );
  }

  // Пересчёт цены
  const origArea = item.width * item.length;
  const newArea = width * length;
  const areaScale = origArea > 0 ? newArea / origArea : 1;
  const origOpenings =
    (item.gates?.count ?? 0) +
    item.doors.reduce((a, d) => a + d.count, 0) +
    item.windows.reduce((a, w) => a + w.count, 0);
  const newOpenings = gatesCount + doorsCount + windowsCount;
  const openingsScale = origOpenings > 0 ? newOpenings / origOpenings : 1;
  const basePrice = Math.round(item.price * areaScale);
  const openingsBase = Math.round(item.price * OPENINGS_RATIO * areaScale);
  const framePrice = Math.round(basePrice * FRAME_RATIO);
  const okPrice = Math.round(basePrice * OK_RATIO);
  const openingsPrice = Math.round(
    openingsBase * (origOpenings > 0 ? openingsScale : 1),
  );
  const scaledPrice = framePrice + okPrice + openingsPrice;
  const pricePerM2 = newArea > 0 ? Math.round(scaledPrice / newArea) : 0;

  const toggleOption = (key: OptionKey) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const getOptPrice = (opt: (typeof EXTRA_OPTIONS)[number]) => {
    if (opt.base === "query") return "По запросу";
    const base =
      opt.base === "frame"
        ? framePrice
        : opt.base === "ok"
          ? okPrice
          : openingsPrice;
    return RUB(Math.round(base * opt.pct));
  };

  const extraTotal = EXTRA_OPTIONS.reduce((sum, opt) => {
    if (!checked.has(opt.key) || opt.base === "query") return sum;
    const base =
      opt.base === "frame"
        ? framePrice
        : opt.base === "ok"
          ? okPrice
          : openingsPrice;
    return sum + Math.round(base * opt.pct);
  }, 0);

  const hasExtra = checked.size > 0;
  const total = scaledPrice + extraTotal;

  // Похожие здания — того же тега, исключая текущее
  const similar = catalog
    .filter((c) => c.tag === item.tag && c.id !== item.id)
    .slice(0, 3);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="min-h-screen bg-white font-ibm">
      <Header
        backButton={{ label: "Каталог", onClick: () => navigate("/catalog") }}
      />

      {/* ── Шапка ── */}
      <div className="bg-evraz-dark px-6 py-4 flex items-center gap-4 flex-wrap">
        <span className="font-oswald text-xs tracking-widest text-evraz-red uppercase">
          #{item.sku}
        </span>
        <span className="font-oswald text-white text-base uppercase tracking-wider">
          {item.name}
        </span>
        {item.popular && (
          <span className="font-oswald text-xs text-white bg-evraz-red px-2 py-0.5 uppercase tracking-wider">
            Популярный
          </span>
        )}
      </div>

      {/* ── Три колонки ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 border-b border-gray-200">
        {/* ─── Колонка 1: Фото + инфо + описание ─── */}
        <div className="border-r border-gray-200 p-5 flex flex-col gap-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-full aspect-video object-cover"
          />

          {/* Базовые параметры */}
          <div className="space-y-2">
            {[
              { label: "Назначение", val: item.tag, accent: false },
              { label: "Регион", val: item.region, accent: false },
              {
                label: "Площадь",
                val: `${(item.width * item.length).toLocaleString("ru-RU")} м²`,
                accent: false,
              },
              {
                label: "Кран-балка",
                val: item.crane,
                accent: item.crane !== "Нет",
              },
            ].map(({ label, val, accent }) => (
              <div
                key={label}
                className="flex justify-between items-center text-sm border-b border-gray-100 pb-2"
              >
                <span className="text-gray-500">{label}</span>
                <span
                  className={`font-medium ${accent ? "text-evraz-red" : "text-evraz-dark"}`}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Описание */}
          <div className="border-t border-gray-100 pt-3">
            <p className="font-ibm text-sm text-gray-600 leading-relaxed">
              {TAG_DESC[item.tag]}
            </p>
          </div>

          {/* Срок + Гарантия */}
          <div className="grid grid-cols-2 gap-2 mt-auto">
            {[
              { icon: "Clock", label: "Срок изготовления", val: "30 дней" },
              { icon: "Shield", label: "Гарантия", val: "2 года" },
            ].map(({ icon, label, val }) => (
              <div
                key={label}
                className="border border-gray-200 p-3 text-center"
              >
                <Icon
                  name={icon}
                  size={18}
                  className="text-evraz-red mx-auto mb-1"
                />
                <div className="font-oswald text-base text-evraz-dark">
                  {val}
                </div>
                <div className="font-ibm text-xs text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Колонка 2: Характеристики + нагрузки + материалы ─── */}
        <div className="border-r border-gray-200 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-oswald text-xs uppercase tracking-wider text-gray-500">
              Характеристики
            </span>
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
              <p className="font-ibm text-xs text-gray-400">
                Цена пересчитывается пропорционально площади
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: "Ширина, м",
                    val: width,
                    set: setWidth,
                    min: 6,
                    max: 48,
                    step: 3,
                  },
                  {
                    label: "Длина, м",
                    val: length,
                    set: setLength,
                    min: 6,
                    max: 120,
                    step: 6,
                  },
                  {
                    label: "Высота, м",
                    val: height,
                    set: setHeight,
                    min: 3,
                    max: 12,
                    step: 0.5,
                  },
                ].map(({ label, val, set, min, max, step }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="font-ibm text-xs text-gray-500">
                      {label}
                    </span>
                    <input
                      type="number"
                      value={val}
                      min={min}
                      max={max}
                      step={step}
                      onChange={(e) => set(Number(e.target.value))}
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
                { label: "Длина", val: `${length} м` },
                { label: "Высота", val: `${height} м` },
              ].map(({ label, val }) => (
                <div
                  key={label}
                  className="border border-gray-200 p-2 text-center"
                >
                  <div className="font-oswald text-base text-evraz-dark">
                    {val}
                  </div>
                  <div className="font-ibm text-xs text-gray-400">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Проёмы */}
          <div className="space-y-3 border-t border-gray-100 pt-3">
            <span className="font-oswald text-xs uppercase tracking-wider text-gray-500">
              Проёмы
            </span>
            {[
              {
                label: "Ворота",
                count: gatesCount,
                setCount: setGatesCount,
                detail: item.gates
                  ? `${item.gates.size}${item.gates.wicket ? ", с калиткой" : ""}`
                  : null,
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
              <div
                key={label}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <span className="text-gray-700 font-medium">{label}</span>
                  {detail && (
                    <span className="text-gray-400 text-xs ml-1">
                      ({detail})
                    </span>
                  )}
                </div>
                {editing ? (
                  <Counter value={count} onChange={setCount} />
                ) : (
                  <span className="font-medium text-evraz-dark">
                    {count} шт.
                  </span>
                )}
              </div>
            ))}
            {item.stripGlazing && (
              <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                <span className="text-gray-500">Лент. остекление</span>
                <span className="text-evraz-dark font-medium">
                  {item.stripGlazing}
                </span>
              </div>
            )}
          </div>

          {/* Нагрузки */}
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <span className="font-oswald text-xs uppercase tracking-wider text-gray-500">
              Нагрузки
            </span>
            {[
              { label: "Снеговой район", val: "III (1,8 кПа)" },
              { label: "Ветровой район", val: "II (0,30 кПа)" },
              { label: "Сейсмика", val: "до 6 баллов" },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="text-evraz-dark font-medium">{val}</span>
              </div>
            ))}
          </div>

          {/* Материалы */}
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <span className="font-oswald text-xs uppercase tracking-wider text-gray-500">
              Материалы
            </span>
            {[
              { label: "Каркас", val: "Сталь EVRAZ, С255/С345" },
              { label: "Стены", val: "Сэндвич-панели 100 мм" },
              { label: "Кровля", val: "Профлист Н60 + утеплитель" },
              { label: "Фундамент", val: "Свайный (по ТЗ)" },
            ].map(({ label, val }) => (
              <div
                key={label}
                className="flex justify-between text-sm border-b border-gray-50 pb-1.5"
              >
                <span className="text-gray-500">{label}</span>
                <span className="text-evraz-dark font-medium text-right max-w-[55%]">
                  {val}
                </span>
              </div>
            ))}
          </div>

          {editing ? (
            <button
              onClick={stopEditing}
              className="mt-auto font-oswald text-xs uppercase tracking-wider py-2.5 bg-evraz-red text-white hover:bg-evraz-dark transition-colors text-center"
            >
              Готово
            </button>
          ) : (
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
          <span className="font-oswald text-xs uppercase tracking-wider text-gray-500">
            Стоимость
          </span>

          <div className="space-y-2">
            {[
              { label: "Каркас МК", val: framePrice },
              { label: "Ограждающие конструкции", val: okPrice },
              { label: "Окна, двери, ворота", val: openingsPrice },
            ].map(({ label, val }) => (
              <div
                key={label}
                className="flex justify-between items-center text-sm border-b border-gray-100 pb-2"
              >
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-evraz-dark">{RUB(val)}</span>
              </div>
            ))}
          </div>

          {/* Доп. опции — спойлер */}
          <div className="border border-gray-200">
            <button
              onClick={() => setExtraOpen((o) => !o)}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <span className="font-oswald text-xs uppercase tracking-wider text-gray-600">
                Доп. опции
              </span>
              <Icon
                name={extraOpen ? "ChevronUp" : "ChevronDown"}
                size={16}
                className="text-gray-400"
              />
            </button>
            {extraOpen && (
              <div className="px-3 pb-3 space-y-2 border-t border-gray-100">
                {EXTRA_OPTIONS.map((opt) => (
                  <label
                    key={opt.key}
                    className="flex items-start gap-2 cursor-pointer group pt-2"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 accent-evraz-red shrink-0"
                      checked={checked.has(opt.key)}
                      onChange={() => toggleOption(opt.key)}
                    />
                    <div className="flex flex-1 justify-between gap-2 min-w-0">
                      <span className="font-ibm text-xs text-gray-700 group-hover:text-evraz-dark leading-tight">
                        {opt.label}
                      </span>
                      <span className="font-ibm text-xs text-gray-500 shrink-0 whitespace-nowrap">
                        {getOptPrice(opt)}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {hasExtra && extraTotal > 0 && (
            <div className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2">
              <span className="text-gray-500">Итого доп. опций</span>
              <span className="font-medium text-evraz-dark">
                {RUB(extraTotal)}
              </span>
            </div>
          )}

          {/* Лизинг */}
          {(() => {
            const { advance, payment } = calcLeasing(total);
            return (
              <div className="border border-evraz-red/20 bg-evraz-red/5 px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon name="CreditCard" size={13} className="text-evraz-red shrink-0" />
                  <span className="font-oswald text-xs tracking-widest uppercase text-evraz-red">Лизинг от банка-партнера</span>
                </div>
                <div className="font-oswald text-lg text-evraz-dark font-bold leading-none">{RUB(Math.round(payment))}/мес.</div>
                <div className="font-ibm text-xs text-evraz-gray mt-1">Аванс {RUB(Math.round(advance))} · 36 мес.</div>
              </div>
            );
          })()}

          <div className="mt-auto border-t-2 border-evraz-red pt-4">
            <div className="flex justify-between items-baseline">
              <span className="font-oswald text-xs uppercase tracking-wider text-gray-500">
                Итого
              </span>
              <div className="text-right">
                <div className="font-oswald text-3xl text-evraz-red font-bold">
                  {RUB(total)}
                </div>
                {newArea > 0 && (
                  <div className="font-ibm text-xs text-gray-400 mt-0.5">
                    {pricePerM2.toLocaleString("ru-RU")} ₽/м²
                  </div>
                )}
              </div>
            </div>
          </div>

          <a
            href="#form-section"
            className="btn-primary font-oswald text-sm uppercase tracking-wider py-3 w-full text-center block"
          >
            Получить расчёт
          </a>
        </div>
      </div>

      {/* ── Этапы работы ── */}
      <section className="bg-evraz-dark py-12 px-6">
        <div className="container mx-auto">
          <div className="mb-8">
            <div className="w-8 h-0.5 bg-evraz-red mb-3" />
            <h2 className="font-oswald text-2xl text-white uppercase tracking-wide">
              Этапы работы
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STAGES.map((stage, i) => (
              <div key={stage.title} className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-oswald text-evraz-red text-xl font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon name={stage.icon} size={16} className="text-gray-400" />
                </div>
                <div className="font-oswald text-sm text-white uppercase tracking-wide mb-1">
                  {stage.title}
                </div>
                <p className="font-ibm text-xs text-gray-400 leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Форма заявки ── */}
      <section
        id="form-section"
        className="py-12 px-6 bg-white border-t border-gray-100"
      >
        <div className="container mx-auto max-w-2xl">
          <div className="mb-6">
            <div className="w-8 h-0.5 bg-evraz-red mb-3" />
            <h2 className="font-oswald text-2xl text-evraz-dark uppercase tracking-wide">
              Получить расчёт
            </h2>
            <p className="font-ibm text-sm text-gray-500 mt-1">
              Ответим в течение 1 рабочего дня. Расчёт бесплатный.
            </p>
          </div>

          {formSent ? (
            <div className="border-2 border-evraz-red p-8 text-center">
              <Icon
                name="CheckCircle"
                size={40}
                className="text-evraz-red mx-auto mb-3"
              />
              <p className="font-oswald text-xl text-evraz-dark uppercase">
                Заявка принята
              </p>
              <p className="font-ibm text-sm text-gray-500 mt-2">
                Наш менеджер свяжется с вами в течение 1 рабочего дня
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-ibm text-xs text-gray-500 mb-1 block">
                    Ваше имя *
                  </label>
                  <input
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Иван Петров"
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-evraz-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-ibm text-xs text-gray-500 mb-1 block">
                    Телефон *
                  </label>
                  <input
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-evraz-red focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-ibm text-xs text-gray-500 mb-1 block">
                  Комментарий
                </label>
                <textarea
                  rows={3}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder={`Интересует ${item.name}, ${item.width}×${item.length} м...`}
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:border-evraz-red focus:outline-none resize-none"
                />
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-1 font-ibm text-xs text-gray-400 leading-relaxed">
                  Нажимая кнопку, вы соглашаетесь на обработку персональных
                  данных
                </div>
                <button
                  type="submit"
                  className="btn-primary font-oswald text-sm uppercase tracking-wider px-8 py-3 whitespace-nowrap"
                >
                  Отправить заявку
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── Похожие здания ── */}
      {similar.length > 0 && (
        <section className="py-12 px-6 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto">
            <div className="mb-6">
              <div className="w-8 h-0.5 bg-evraz-red mb-3" />
              <h2 className="font-oswald text-2xl text-evraz-dark uppercase tracking-wide">
                Похожие здания
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {similar.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    navigate(`/catalog/${s.id}`);
                    window.scrollTo({ top: 0 });
                  }}
                  className="bg-white border border-gray-200 cursor-pointer hover:border-evraz-red transition-colors group"
                >
                  <div className="overflow-hidden h-36">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="font-oswald text-xs text-evraz-red tracking-widest uppercase mb-1">
                      #{s.sku}
                    </div>
                    <div className="font-oswald text-sm text-evraz-dark uppercase tracking-wide mb-2 leading-tight">
                      {s.name}
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="font-ibm text-xs text-gray-400">
                        {s.width}×{s.length} м, h{s.height} м
                      </div>
                      <div className="font-oswald text-base text-evraz-red font-bold">
                        {s.price.toLocaleString("ru-RU", {
                          style: "currency",
                          currency: "RUB",
                          maximumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}