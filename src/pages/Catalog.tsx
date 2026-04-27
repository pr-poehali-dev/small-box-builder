import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { PriceCalculator } from "@/components/shared/PriceCalculator";

// ─── Данные каталога ────────────────────────────────────────────────────────

type BuildingTag =
  | "Склад"
  | "Производство"
  | "Агро"
  | "Торговля"
  | "Спорт"
  | "Паркинг";

type AreaRange = "до 1000 м²" | "1000–3000 м²" | "свыше 3000 м²";

interface CatalogItem {
  id: string;
  tag: BuildingTag;
  name: string;
  width: number;
  length: number;
  height: number;
  price: number;
  pricePerSqm: number;
  days: number;
  features: string[];
  popular?: boolean;
  designers?: string[];
  city: string;
  capital: boolean;
}

const CATALOG: CatalogItem[] = [
  {
    id: "s-18-36-6",
    tag: "Склад",
    name: "Склад S-18",
    width: 18, length: 36, height: 6,
    price: 8_100_000, pricePerSqm: 12_500, days: 30,
    features: ["2 ворот", "Утеплённые сэндвич-панели", "Рулонная кровля"],
    designers: ["СтальПроект", "ГрупПром"],
    city: "Москва", capital: false,
  },
  {
    id: "s-24-48-7",
    tag: "Склад",
    name: "Склад S-24",
    width: 24, length: 48, height: 7,
    price: 14_400_000, pricePerSqm: 12_500, days: 35,
    features: ["2 ворот", "4 окна", "Антикор покрытие"],
    popular: true,
    designers: ["МеталлДизайн", "СтальПроект"],
    city: "Екатеринбург", capital: true,
  },
  {
    id: "s-36-72-8",
    tag: "Склад",
    name: "Склад S-36",
    width: 36, length: 72, height: 8,
    price: 32_400_000, pricePerSqm: 12_500, days: 45,
    features: ["4 ворот", "6 окон", "Дымовые люки"],
    designers: ["ПромАрхитектура"],
    city: "Новосибирск", capital: true,
  },
  {
    id: "p-24-48-10",
    tag: "Производство",
    name: "Цех P-24",
    width: 24, length: 48, height: 10,
    price: 20_160_000, pricePerSqm: 17_500, days: 40,
    features: ["2 ворот", "Мостовой кран 10т", "Усиленный каркас"],
    popular: true,
    designers: ["ИндустриалПроект", "ТехноСталь"],
    city: "Челябинск", capital: true,
  },
  {
    id: "p-36-72-12",
    tag: "Производство",
    name: "Цех P-36",
    width: 36, length: 72, height: 12,
    price: 45_360_000, pricePerSqm: 17_500, days: 55,
    features: ["4 ворот", "Мостовой кран 20т", "Технические галереи"],
    designers: ["ИндустриалПроект", "МеталлДизайн", "ПромАрхитектура"],
    city: "Москва", capital: true,
  },
  {
    id: "a-18-36-5",
    tag: "Агро",
    name: "Агро A-18",
    width: 18, length: 36, height: 5,
    price: 7_000_000, pricePerSqm: 10_800, days: 28,
    features: ["1 ворота", "Вентиляционные решётки", "Антикор каркас"],
    designers: ["АгроСтрой"],
    city: "Краснодар", capital: false,
  },
  {
    id: "a-24-60-6",
    tag: "Агро",
    name: "Агро A-24",
    width: 24, length: 60, height: 6,
    price: 15_552_000, pricePerSqm: 10_800, days: 35,
    features: ["2 ворот", "Принудительная вентиляция", "Аттестован под зерно"],
    popular: true,
    designers: ["АгроСтрой", "ГрупПром"],
    city: "Ростов-на-Дону", capital: false,
  },
  {
    id: "t-30-60-8",
    tag: "Торговля",
    name: "ТЦ T-30",
    width: 30, length: 60, height: 8,
    price: 33_300_000, pricePerSqm: 18_500, days: 50,
    features: ["6 входных групп", "Витражное остекление", "Фасадные кассеты"],
    popular: true,
    designers: ["АрхибюроПлюс", "МеталлДизайн"],
    city: "Екатеринбург", capital: true,
  },
  {
    id: "sp-48-72-14",
    tag: "Спорт",
    name: "Арена SP-48",
    width: 48, length: 72, height: 14,
    price: 76_204_800, pricePerSqm: 22_000, days: 70,
    features: ["Пролёт 48 м без опор", "Естественное освещение", "Трибуны 500 мест"],
    designers: ["СпортАрхПроект", "ПромАрхитектура"],
    city: "Челябинск", capital: true,
  },
  {
    id: "pk-18-54-3",
    tag: "Паркинг",
    name: "Паркинг PK-18",
    width: 18, length: 54, height: 3,
    price: 9_450_000, pricePerSqm: 9_700, days: 30,
    features: ["54 машиноместа", "Открытый тип", "Быстрый монтаж"],
    designers: ["ГрупПром"],
    city: "Новосибирск", capital: false,
  },
  {
    id: "pk-24-72-6",
    tag: "Паркинг",
    name: "Паркинг PK-24 (2 уровня)",
    width: 24, length: 72, height: 6,
    price: 21_600_000, pricePerSqm: 12_500, days: 45,
    features: ["144 машиноместа", "2 уровня", "Антикор покрытие"],
    popular: true,
    designers: ["ГрупПром", "АрхибюроПлюс"],
    city: "Москва", capital: false,
  },
];

const TAGS: BuildingTag[] = ["Склад", "Производство", "Агро", "Торговля", "Спорт", "Паркинг"];

const CITIES = [...new Set(CATALOG.map((c) => c.city))].sort();

const AREA_RANGES: { label: AreaRange; test: (a: number) => boolean }[] = [
  { label: "до 1000 м²", test: (a) => a < 1000 },
  { label: "1000–3000 м²", test: (a) => a >= 1000 && a <= 3000 },
  { label: "свыше 3000 м²", test: (a) => a > 3000 },
];

const FORMAT_RUB = (n: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(n);

const LEASING_ADVANCE = 0.20;
const LEASING_MONTHS = 36;
const LEASING_RATE = 0.165;

function calcLeasing(price: number) {
  const advance = price * LEASING_ADVANCE;
  const body = price - advance;
  const monthlyRate = LEASING_RATE / 12;
  const payment = (body * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -LEASING_MONTHS));
  return { advance, payment };
}

// ─── Компонент ──────────────────────────────────────────────────────────────

export default function Catalog() {
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState<BuildingTag | "Все">("Все");
  const [activeCity, setActiveCity] = useState<string>("Все");
  const [activeArea, setActiveArea] = useState<AreaRange | "Все">("Все");
  const [capitalFilter, setCapitalFilter] = useState<"all" | "capital" | "noncapital">("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered = CATALOG
    .filter((item) => activeTag === "Все" || item.tag === activeTag)
    .filter((item) => activeCity === "Все" || item.city === activeCity)
    .filter((item) => {
      if (activeArea === "Все") return true;
      const range = AREA_RANGES.find((r) => r.label === activeArea);
      return range ? range.test(item.width * item.length) : true;
    })
    .filter((item) => {
      if (capitalFilter === "capital") return item.capital;
      if (capitalFilter === "noncapital") return !item.capital;
      return true;
    })
    .sort((a, b) => a.price - b.price);

  const faqs = [
    {
      q: "У конкурентов дешевле — почему EVRAZ дороже?",
      a: "Цена конкурента — это часто цена металлокаркаса без ограждающих конструкций, фундамента и монтажа. Мы указываем полную стоимость здания под ключ. Сравните позиции в смете — и картина изменится. Плюс: сталь EVRAZ производится нами самими, а не закупается на рынке с наценкой.",
    },
    {
      q: "Как выбрать подрядчика по монтажу?",
      a: "Работайте только с аккредитованными партнёрами EVRAZ — они прошли обучение, имеют допуски и застрахованы. Список партнёров по вашему региону мы предоставим бесплатно. Неаккредитованный подрядчик лишает вас гарантии на конструкции.",
    },
    {
      q: "Что требуется от заказчика на этапе строительства?",
      a: "От вас нужно: согласованный проект с привязкой к участку, готовый фундамент (по нашему ТЗ), подведённое электричество 380В для монтажного оборудования, и назначенный ответственный со стороны заказчика. Мы выдаём чёткое ТЗ на подготовку — ничего лишнего.",
    },
    {
      q: "Входит ли фундамент в цену?",
      a: "Нет. Фундамент рассчитывается отдельно после геологии участка. Ориентировочно — 15–25% от стоимости здания. Мы можем порекомендовать проверенного геологического подрядчика.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-ibm">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-evraz-dark shadow-xl py-4">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-evraz-red flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rotate-45" />
            </div>
            <div className="text-left">
              <div className="font-oswald font-bold text-white text-lg leading-none tracking-widest">
                EVRAZ
              </div>
              <div className="font-ibm text-xs text-gray-400 tracking-wider uppercase">
                SteelBox
              </div>
            </div>
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-ibm text-sm text-gray-300 hover:text-white transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            На главную
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-evraz-dark relative overflow-hidden py-16 md:py-20">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-evraz-red" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)",
          }}
        />
        <div className="container mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">
              Серийные здания
            </span>
          </div>
          <h1 className="font-oswald text-4xl md:text-6xl text-white font-bold mb-4 leading-tight">
            КАТАЛОГ ГОТОВЫХ
            <br />
            <span className="text-evraz-red">РЕШЕНИЙ</span>
          </h1>
          <p className="font-ibm text-gray-300 max-w-2xl text-base leading-relaxed mb-8">
            Типовые здания с фиксированной ценой — рассчитаны заранее, запущены
            в производство за 5 рабочих дней. Нужен нестандартный размер?
            Воспользуйтесь калькулятором ниже.
          </p>
          {/* Quick stats */}
          <div className="flex flex-wrap gap-8">
            {[
              { v: "до 45 дн.", l: "Срок монтажа" },
              { v: "25 лет", l: "Гарантия" },
              { v: "Фикс. цена", l: "Без скрытых доплат" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-oswald text-2xl text-white font-bold">
                  {s.v}
                </div>
                <div className="font-ibm text-xs text-gray-400 uppercase tracking-wider mt-0.5">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="bg-evraz-light border-b border-evraz-border py-5 sticky top-16 z-40">
        <div className="container mx-auto space-y-4">

          {/* Строка 1: Назначение здания */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-ibm text-xs text-evraz-gray w-36 shrink-0">Назначение:</span>
            <div className="flex flex-wrap gap-1.5">
              {(["Все", ...TAGS] as (BuildingTag | "Все")[]).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`font-oswald text-xs tracking-widest uppercase px-3 py-1.5 border transition-all ${
                    activeTag === tag
                      ? "bg-evraz-red border-evraz-red text-white"
                      : "border-evraz-border text-evraz-steel hover:border-evraz-red hover:text-evraz-red bg-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Строка 2: Город */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-ibm text-xs text-evraz-gray w-36 shrink-0">Город строительства:</span>
            <div className="flex flex-wrap gap-1.5">
              {(["Все", ...CITIES]).map((city) => (
                <button
                  key={city}
                  onClick={() => setActiveCity(city)}
                  className={`font-ibm text-xs px-3 py-1.5 border transition-all ${
                    activeCity === city
                      ? "bg-evraz-dark border-evraz-dark text-white"
                      : "border-evraz-border text-evraz-steel hover:border-evraz-dark bg-white"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Строка 3: Площадь + Капитальность */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Площадь */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-ibm text-xs text-evraz-gray w-36 shrink-0">Площадь здания:</span>
              <div className="flex gap-1.5">
                {(["Все", ...AREA_RANGES.map((r) => r.label)] as (AreaRange | "Все")[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => setActiveArea(a)}
                    className={`font-ibm text-xs px-3 py-1.5 border transition-all whitespace-nowrap ${
                      activeArea === a
                        ? "bg-evraz-dark border-evraz-dark text-white"
                        : "border-evraz-border text-evraz-steel hover:border-evraz-dark bg-white"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Капитальность */}
            <div className="flex items-center gap-2">
              <span className="font-ibm text-xs text-evraz-gray shrink-0">Тип:</span>
              <div className="flex border border-evraz-border overflow-hidden">
                {([
                  { key: "all", label: "Все" },
                  { key: "capital", label: "Капитальное" },
                  { key: "noncapital", label: "Не капитальное" },
                ] as { key: "all" | "capital" | "noncapital"; label: string }[]).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setCapitalFilter(opt.key)}
                    className={`font-ibm text-xs px-3 py-1.5 transition-all border-r border-evraz-border last:border-r-0 ${
                      capitalFilter === opt.key
                        ? "bg-evraz-dark text-white"
                        : "bg-white text-evraz-steel hover:bg-evraz-light"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Счётчик */}
            <span className="font-ibm text-xs text-evraz-gray ml-auto">
              {filtered.length} проектов
            </span>
          </div>

        </div>
      </section>

      {/* CATALOG GRID */}
      <section className="py-12 bg-white">
        <div className="container mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <Icon
                name="SearchX"
                size={40}
                className="text-evraz-gray mx-auto mb-4"
              />
              <p className="font-oswald text-xl text-evraz-steel">
                Нет проектов по заданным параметрам
              </p>
              <button
                onClick={() => {
                  setActiveTag("Все");
                  setMaxPrice(100_000_000);
                }}
                className="mt-4 font-ibm text-sm text-evraz-red underline"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="steel-card bg-white border border-evraz-border flex flex-col group cursor-pointer"
                >
                  {/* Header */}
                  <div className="bg-evraz-dark px-6 py-5 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-oswald text-xs tracking-widest text-evraz-red uppercase bg-white/5 px-2 py-0.5">
                          {item.tag}
                        </span>
                        {item.popular && (
                          <span className="font-oswald text-xs text-white tracking-widest uppercase bg-evraz-red px-2 py-0.5">
                            Популярный
                          </span>
                        )}
                      </div>
                      <h3 className="font-oswald text-xl text-white font-semibold mt-2">
                        {item.name}
                      </h3>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="font-oswald text-2xl text-evraz-red font-bold">
                        {FORMAT_RUB(item.price)}
                      </div>
                      <div className="font-ibm text-xs text-gray-400 mt-0.5">
                        {item.pricePerSqm.toLocaleString("ru-RU")} ₽/м²
                      </div>
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="grid grid-cols-4 divide-x divide-evraz-border border-b border-evraz-border">
                    {[
                      { label: "Ширина", value: `${item.width} м` },
                      { label: "Длина", value: `${item.length} м` },
                      { label: "Высота", value: `${item.height} м` },
                      {
                        label: "Площадь",
                        value: `${(item.width * item.length).toLocaleString("ru-RU")} м²`,
                      },
                    ].map((d) => (
                      <div key={d.label} className="py-3 px-3 text-center">
                        <div className="font-oswald text-sm text-evraz-dark font-semibold">
                          {d.value}
                        </div>
                        <div className="font-ibm text-xs text-evraz-gray mt-0.5">
                          {d.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Features + срок */}
                  <div className="p-6 flex flex-col flex-1">
                    <ul className="space-y-2 mb-5 flex-1">
                      {item.features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-evraz-red shrink-0 rotate-45" />
                          <span className="font-ibm text-sm text-evraz-steel">
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Срок */}
                    <div className="flex items-center gap-2 bg-evraz-light px-4 py-2.5 mb-3">
                      <Icon
                        name="Clock"
                        size={14}
                        className="text-evraz-red shrink-0"
                      />
                      <span className="font-ibm text-xs text-evraz-gray">
                        Монтаж под ключ:
                      </span>
                      <span className="font-oswald text-sm text-evraz-dark font-semibold">
                        {item.days} дней
                      </span>
                    </div>

                    {/* Лизинг */}
                    {(() => {
                      const { advance, payment } = calcLeasing(item.price);
                      return (
                        <div className="border border-evraz-red/20 bg-evraz-red/5 px-4 py-3 mb-5">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Icon name="CreditCard" size={13} className="text-evraz-red shrink-0" />
                            <span className="font-oswald text-xs tracking-widest uppercase text-evraz-red">
                              Лизинг
                            </span>
                          </div>
                          <div className="flex items-end justify-between gap-2">
                            <div>
                              <div className="font-oswald text-lg text-evraz-dark font-bold leading-none">
                                {FORMAT_RUB(Math.round(payment))}/мес.
                              </div>
                              <div className="font-ibm text-xs text-evraz-gray mt-1">
                                Аванс {FORMAT_RUB(Math.round(advance))} · 36 мес. · 16,5%
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Подрядчики проектирования */}
                    {item.designers && item.designers.length > 0 && (
                      <div className="mb-5">
                        <div className="font-ibm text-xs text-evraz-gray uppercase tracking-widest mb-2">
                          Проектирование
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.designers.map((d) => (
                            <span
                              key={d}
                              className="font-ibm text-xs text-evraz-dark bg-evraz-light border border-evraz-border px-2.5 py-1"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex gap-3">
                      <a
                        href="#calc"
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById("calc-section")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="flex-1 text-center font-oswald text-sm tracking-wider uppercase py-3 border-2 border-evraz-dark text-evraz-dark hover:bg-evraz-dark hover:text-white transition-all"
                      >
                        Изменить размер
                      </a>
                      <button
                        onClick={() =>
                          document
                            .getElementById("contacts-section")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="flex-1 btn-primary text-sm text-center"
                      >
                        Получить КП
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MINI CALCULATOR */}
      <section
        id="calc-section"
        className="py-16 bg-evraz-dark relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-evraz-red" />
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-0.5 bg-evraz-red" />
            </div>
            <h2 className="font-oswald text-3xl md:text-4xl text-white font-semibold">
              НЕТ НУЖНОГО РАЗМЕРА?
            </h2>
            <p className="font-ibm text-gray-400 mt-3 text-sm leading-relaxed">
              Введите свои параметры — получите мгновенную оценку стоимости.
            </p>
          </div>
          <PriceCalculator
            onGetQuote={() =>
              document
                .getElementById("contacts-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
        </div>
      </section>

      {/* FAQ — закрываем возражения */}
      <section className="py-16 bg-evraz-light">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-10">
            <div className="accent-line" />
            <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold">
              ЧАСТЫЕ ВОПРОСЫ
            </h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-evraz-border bg-white">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-oswald text-base text-evraz-dark font-semibold pr-4">
                    {faq.q}
                  </span>
                  <Icon
                    name={openFaq === i ? "ChevronUp" : "ChevronDown"}
                    size={18}
                    className="text-evraz-red shrink-0"
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="font-ibm text-sm text-evraz-gray leading-relaxed border-t border-evraz-border pt-4">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S NEEDED FROM CLIENT */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="accent-line mx-auto" />
            </div>
            <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold">
              ЧТО НУЖНО ОТ ВАС
            </h2>
            <p className="font-ibm text-evraz-gray mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              Мы берём на себя максимум. Ниже — таймлайн стройки и что требуется от вас на каждом этапе.
            </p>
          </div>

          {/* Таймлайн */}
          <div className="max-w-4xl mx-auto">
            {[
              {
                step: "01",
                phase: "Недели 1–2",
                icon: "FileText",
                title: "Геология и проектирование",
                client: "Предоставить отчёт по геологии участка (или заказать через нас). Согласовать планировочное решение и подписать проект.",
                us: "Разрабатываем рабочую документацию, рассчитываем фундамент под геологию участка.",
              },
              {
                step: "02",
                phase: "Недели 3–4",
                icon: "Layers",
                title: "Фундамент",
                client: "Обеспечить доступ спецтехники на участок. Назначить ответственного представителя для приёмки фундамента.",
                us: "Устройство фундамента по проекту. Приёмка — только после соответствия геометрии допускам.",
              },
              {
                step: "03",
                phase: "Недели 5–6",
                icon: "Zap",
                title: "Монтаж каркаса",
                client: "Подвести временное электричество 380В для монтажного оборудования на площадку.",
                us: "Монтаж металлокаркаса из стали EVRAZ. Сварка, болтовые соединения, контроль качества.",
              },
              {
                step: "04",
                phase: "Недели 7–8",
                icon: "Package",
                title: "Ограждающие конструкции",
                client: "Промежуточная приёмка каркаса — подпись акта выполненных работ.",
                us: "Монтаж сэндвич-панелей, кровли, ворот, окон и фасадных элементов.",
              },
              {
                step: "05",
                phase: "Неделя 9+",
                icon: "CheckSquare",
                title: "Сдача объекта",
                client: "Финальная приёмка: проверка комплектности, подписание акта КС-2/КС-3, оплата оставшейся части по договору.",
                us: "Передаём исполнительную документацию, паспорта на конструкции и гарантийное письмо на 25 лет.",
              },
            ].map((s, i, arr) => (
              <div key={s.step} className="flex gap-6 relative">
                {/* Вертикальная линия */}
                {i < arr.length - 1 && (
                  <div className="absolute left-[27px] top-[56px] bottom-0 w-px bg-evraz-border" />
                )}
                {/* Иконка-маркер */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-14 h-14 bg-evraz-dark flex items-center justify-center relative z-10">
                    <Icon name={s.icon} size={20} className="text-white" />
                  </div>
                </div>
                {/* Контент */}
                <div className={`pb-10 flex-1 ${i === arr.length - 1 ? "pb-0" : ""}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-ibm text-xs text-evraz-red font-medium tracking-widest uppercase">
                      {s.phase}
                    </span>
                    <span className="font-oswald text-xs text-evraz-border tracking-widest">
                      ЭТАП {s.step}
                    </span>
                  </div>
                  <h4 className="font-oswald text-lg text-evraz-dark font-semibold mb-3">
                    {s.title}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-red-50 border border-red-100 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="User" size={13} className="text-evraz-red" />
                        <span className="font-oswald text-xs text-evraz-red tracking-wider uppercase">От вас</span>
                      </div>
                      <p className="font-ibm text-xs text-evraz-dark leading-relaxed">{s.client}</p>
                    </div>
                    <div className="bg-evraz-light border border-evraz-border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Building2" size={13} className="text-evraz-steel" />
                        <span className="font-oswald text-xs text-evraz-steel tracking-wider uppercase">Мы делаем</span>
                      </div>
                      <p className="font-ibm text-xs text-evraz-gray leading-relaxed">{s.us}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section id="contacts-section" className="py-16 bg-evraz-dark">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-oswald text-3xl md:text-4xl text-white font-semibold mb-4">
            ОСТАЛИСЬ ВОПРОСЫ?
          </h2>
          <p className="font-ibm text-gray-400 mb-8 text-sm leading-relaxed">
            Отправьте заявку — менеджер пришлёт полное КП с точной стоимостью,
            сроками и условиями гарантии в течение 2 часов.
          </p>
          <div className="bg-white/5 border border-white/10 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Имя и фамилия*"
                className="bg-white/5 border border-white/15 px-4 py-3 font-ibm text-white text-sm placeholder-gray-500 focus:outline-none focus:border-evraz-red transition-colors"
              />
              <input
                type="tel"
                placeholder="Телефон*"
                className="bg-white/5 border border-white/15 px-4 py-3 font-ibm text-white text-sm placeholder-gray-500 focus:outline-none focus:border-evraz-red transition-colors"
              />
              <input
                type="text"
                placeholder="Компания"
                className="bg-white/5 border border-white/15 px-4 py-3 font-ibm text-white text-sm placeholder-gray-500 focus:outline-none focus:border-evraz-red transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                className="bg-white/5 border border-white/15 px-4 py-3 font-ibm text-white text-sm placeholder-gray-500 focus:outline-none focus:border-evraz-red transition-colors"
              />
            </div>
            <textarea
              rows={3}
              placeholder="Укажите артикул проекта или опишите задачу..."
              className="w-full bg-white/5 border border-white/15 px-4 py-3 font-ibm text-white text-sm placeholder-gray-500 focus:outline-none focus:border-evraz-red transition-colors resize-none mb-4"
            />
            <button className="btn-primary w-full">Отправить заявку</button>
            <p className="font-ibm text-xs text-gray-600 mt-3">
              Нажимая кнопку, вы соглашаетесь с политикой обработки персональных
              данных
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}