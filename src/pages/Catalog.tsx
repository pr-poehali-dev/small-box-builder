import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

// ─── Данные каталога ────────────────────────────────────────────────────────

type BuildingTag = "Склад" | "Производство" | "Агро" | "Торговля" | "Спорт" | "Паркинг";

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
}

const CATALOG: CatalogItem[] = [
  {
    id: "s-18-36-6",
    tag: "Склад",
    name: "Склад S-18",
    width: 18, length: 36, height: 6,
    price: 8_100_000, pricePerSqm: 12_500,
    days: 30,
    features: ["2 ворот", "Утеплённые сэндвич-панели", "Рулонная кровля"],
  },
  {
    id: "s-24-48-7",
    tag: "Склад",
    name: "Склад S-24",
    width: 24, length: 48, height: 7,
    price: 14_400_000, pricePerSqm: 12_500,
    days: 35,
    features: ["2 ворот", "4 окна", "Антикор покрытие"],
    popular: true,
  },
  {
    id: "s-36-72-8",
    tag: "Склад",
    name: "Склад S-36",
    width: 36, length: 72, height: 8,
    price: 32_400_000, pricePerSqm: 12_500,
    days: 45,
    features: ["4 ворот", "6 окон", "Дымовые люки"],
  },
  {
    id: "p-24-48-10",
    tag: "Производство",
    name: "Цех P-24",
    width: 24, length: 48, height: 10,
    price: 20_160_000, pricePerSqm: 17_500,
    days: 40,
    features: ["2 ворот", "Мостовой кран 10т", "Усиленный каркас"],
    popular: true,
  },
  {
    id: "p-36-72-12",
    tag: "Производство",
    name: "Цех P-36",
    width: 36, length: 72, height: 12,
    price: 45_360_000, pricePerSqm: 17_500,
    days: 55,
    features: ["4 ворот", "Мостовой кран 20т", "Технические галереи"],
  },
  {
    id: "a-18-36-5",
    tag: "Агро",
    name: "Агро A-18",
    width: 18, length: 36, height: 5,
    price: 7_000_000, pricePerSqm: 10_800,
    days: 28,
    features: ["1 ворота", "Вентиляционные решётки", "Антикор каркас"],
  },
  {
    id: "a-24-60-6",
    tag: "Агро",
    name: "Агро A-24",
    width: 24, length: 60, height: 6,
    price: 15_552_000, pricePerSqm: 10_800,
    days: 35,
    features: ["2 ворот", "Принудительная вентиляция", "Аттестован под зерно"],
    popular: true,
  },
  {
    id: "t-30-60-8",
    tag: "Торговля",
    name: "ТЦ T-30",
    width: 30, length: 60, height: 8,
    price: 33_300_000, pricePerSqm: 18_500,
    days: 50,
    features: ["6 входных групп", "Витражное остекление", "Фасадные кассеты"],
    popular: true,
  },
  {
    id: "sp-48-72-14",
    tag: "Спорт",
    name: "Арена SP-48",
    width: 48, length: 72, height: 14,
    price: 76_204_800, pricePerSqm: 22_000,
    days: 70,
    features: ["Пролёт 48 м без опор", "Естественное освещение", "Трибуны 500 мест"],
  },
  {
    id: "pk-18-54-3",
    tag: "Паркинг",
    name: "Паркинг PK-18",
    width: 18, length: 54, height: 3,
    price: 9_450_000, pricePerSqm: 9_700,
    days: 30,
    features: ["54 машиноместа", "Открытый тип", "Быстрый монтаж"],
  },
  {
    id: "pk-24-72-6",
    tag: "Паркинг",
    name: "Паркинг PK-24 (2 уровня)",
    width: 24, length: 72, height: 6,
    price: 21_600_000, pricePerSqm: 12_500,
    days: 45,
    features: ["144 машиноместа", "2 уровня", "Антикор покрытие"],
    popular: true,
  },
];

const TAGS: BuildingTag[] = ["Склад", "Производство", "Агро", "Торговля", "Спорт", "Паркинг"];

const FORMAT_RUB = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

// ─── Компонент ──────────────────────────────────────────────────────────────

export default function Catalog() {
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState<BuildingTag | "Все">("Все");
  const [sortBy, setSortBy] = useState<"price" | "area" | "days">("price");
  const [maxPrice, setMaxPrice] = useState(100_000_000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered = CATALOG
    .filter((item) => activeTag === "Все" || item.tag === activeTag)
    .filter((item) => item.price <= maxPrice)
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "area") return (a.width * a.length) - (b.width * b.length);
      return a.days - b.days;
    });

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
          <button onClick={() => navigate("/")} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-evraz-red flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rotate-45" />
            </div>
            <div className="text-left">
              <div className="font-oswald font-bold text-white text-lg leading-none tracking-widest">EVRAZ</div>
              <div className="font-ibm text-xs text-gray-400 tracking-wider uppercase">SteelBox</div>
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
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)"
        }} />
        <div className="container mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">Серийные здания</span>
          </div>
          <h1 className="font-oswald text-4xl md:text-6xl text-white font-bold mb-4 leading-tight">
            КАТАЛОГ ГОТОВЫХ<br /><span className="text-evraz-red">РЕШЕНИЙ</span>
          </h1>
          <p className="font-ibm text-gray-300 max-w-2xl text-base leading-relaxed mb-8">
            Типовые здания с фиксированной ценой — рассчитаны заранее, запущены в производство за 5 рабочих дней.
            Нужен нестандартный размер? Воспользуйтесь калькулятором ниже.
          </p>
          {/* Quick stats */}
          <div className="flex flex-wrap gap-8">
            {[
              { v: "до 45 дн.", l: "Срок монтажа" },
              { v: "25 лет", l: "Гарантия" },
              { v: "Фикс. цена", l: "Без скрытых доплат" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-oswald text-2xl text-white font-bold">{s.v}</div>
                <div className="font-ibm text-xs text-gray-400 uppercase tracking-wider mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="bg-evraz-light border-b border-evraz-border py-5 sticky top-16 z-40">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            {/* Теги */}
            <div className="flex flex-wrap gap-2">
              {(["Все", ...TAGS] as (BuildingTag | "Все")[]).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`font-oswald text-xs tracking-widest uppercase px-4 py-2 border transition-all ${
                    activeTag === tag
                      ? "bg-evraz-red border-evraz-red text-white"
                      : "border-evraz-border text-evraz-steel hover:border-evraz-red hover:text-evraz-red bg-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {/* Сортировка */}
            <div className="flex items-center gap-2">
              <span className="font-ibm text-xs text-evraz-gray">Сортировка:</span>
              {[
                { key: "price", label: "По цене" },
                { key: "area", label: "По площади" },
                { key: "days", label: "По срокам" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSortBy(s.key as "price" | "area" | "days")}
                  className={`font-ibm text-xs px-3 py-1.5 border transition-all ${
                    sortBy === s.key
                      ? "bg-evraz-dark border-evraz-dark text-white"
                      : "border-evraz-border text-evraz-steel hover:border-evraz-dark bg-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Слайдер цены */}
          <div className="mt-4 flex items-center gap-4">
            <span className="font-ibm text-xs text-evraz-gray whitespace-nowrap">До: <span className="font-medium text-evraz-dark">{FORMAT_RUB(maxPrice)}</span></span>
            <input
              type="range"
              min={5_000_000}
              max={100_000_000}
              step={1_000_000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(+e.target.value)}
              className="w-48"
            />
            <span className="font-ibm text-xs text-evraz-gray">{filtered.length} проектов</span>
          </div>
        </div>
      </section>

      {/* CATALOG GRID */}
      <section className="py-12 bg-white">
        <div className="container mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <Icon name="SearchX" size={40} className="text-evraz-gray mx-auto mb-4" />
              <p className="font-oswald text-xl text-evraz-steel">Нет проектов по заданным параметрам</p>
              <button onClick={() => { setActiveTag("Все"); setMaxPrice(100_000_000); }} className="mt-4 font-ibm text-sm text-evraz-red underline">
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <div key={item.id} className="steel-card bg-white border border-evraz-border flex flex-col group cursor-pointer relative">
                  {item.popular && (
                    <div className="absolute top-4 right-4 bg-evraz-red font-oswald text-xs text-white tracking-widest uppercase px-3 py-1 z-10">
                      Популярный
                    </div>
                  )}

                  {/* Header */}
                  <div className="bg-evraz-dark px-6 py-5 flex items-start justify-between">
                    <div>
                      <span className="font-oswald text-xs tracking-widest text-evraz-red uppercase bg-white/5 px-2 py-0.5">
                        {item.tag}
                      </span>
                      <h3 className="font-oswald text-xl text-white font-semibold mt-2">{item.name}</h3>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="font-oswald text-2xl text-evraz-red font-bold">{FORMAT_RUB(item.price)}</div>
                      <div className="font-ibm text-xs text-gray-400 mt-0.5">{item.pricePerSqm.toLocaleString("ru-RU")} ₽/м²</div>
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="grid grid-cols-4 divide-x divide-evraz-border border-b border-evraz-border">
                    {[
                      { label: "Ширина", value: `${item.width} м` },
                      { label: "Длина", value: `${item.length} м` },
                      { label: "Высота", value: `${item.height} м` },
                      { label: "Площадь", value: `${(item.width * item.length).toLocaleString("ru-RU")} м²` },
                    ].map((d) => (
                      <div key={d.label} className="py-3 px-3 text-center">
                        <div className="font-oswald text-sm text-evraz-dark font-semibold">{d.value}</div>
                        <div className="font-ibm text-xs text-evraz-gray mt-0.5">{d.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Features + срок */}
                  <div className="p-6 flex flex-col flex-1">
                    <ul className="space-y-2 mb-5 flex-1">
                      {item.features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-evraz-red shrink-0 rotate-45" />
                          <span className="font-ibm text-sm text-evraz-steel">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Срок */}
                    <div className="flex items-center gap-2 bg-evraz-light px-4 py-2.5 mb-5">
                      <Icon name="Clock" size={14} className="text-evraz-red shrink-0" />
                      <span className="font-ibm text-xs text-evraz-gray">Монтаж под ключ:</span>
                      <span className="font-oswald text-sm text-evraz-dark font-semibold">{item.days} дней</span>
                    </div>

                    {/* CTA */}
                    <div className="flex gap-3">
                      <a
                        href="#calc"
                        onClick={(e) => { e.preventDefault(); document.getElementById("calc-section")?.scrollIntoView({ behavior: "smooth" }); }}
                        className="flex-1 text-center font-oswald text-sm tracking-wider uppercase py-3 border-2 border-evraz-dark text-evraz-dark hover:bg-evraz-dark hover:text-white transition-all"
                      >
                        Изменить размер
                      </a>
                      <button
                        onClick={() => document.getElementById("contacts-section")?.scrollIntoView({ behavior: "smooth" })}
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
      <section id="calc-section" className="py-16 bg-evraz-dark relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-evraz-red" />
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="flex justify-center mb-4"><div className="w-10 h-0.5 bg-evraz-red" /></div>
            <h2 className="font-oswald text-3xl md:text-4xl text-white font-semibold">НЕТ НУЖНОГО РАЗМЕРА?</h2>
            <p className="font-ibm text-gray-400 mt-3 text-sm leading-relaxed">
              Введите свои параметры — получите мгновенную оценку стоимости.
            </p>
          </div>
          <MiniCalculator />
        </div>
      </section>

      {/* FAQ — закрываем возражения */}
      <section className="py-16 bg-evraz-light">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-10">
            <div className="accent-line" />
            <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold">ЧАСТЫЕ ВОПРОСЫ</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-evraz-border bg-white">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-oswald text-base text-evraz-dark font-semibold pr-4">{faq.q}</span>
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
          <div className="mb-10 text-center">
            <div className="flex justify-center mb-4"><div className="accent-line mx-auto" /></div>
            <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold">ЧТО НУЖНО ОТ ВАС</h2>
            <p className="font-ibm text-evraz-gray mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              Мы берём на себя максимум. От заказчика требуется только это:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { step: "01", icon: "FileText", title: "Геология участка", desc: "Отчёт по геологии — основа для расчёта фундамента. Можем порекомендовать подрядчика." },
              { step: "02", icon: "Zap", title: "Электричество 380В", desc: "Для работы монтажного оборудования. Временный ввод на период строительства." },
              { step: "03", icon: "User", title: "Ответственный", desc: "Представитель заказчика на объекте — для приёмки работ по этапам." },
              { step: "04", icon: "CheckSquare", title: "Согласованный проект", desc: "Мы готовим проект и согласовываем с вами. Подпись — и в производство." },
            ].map((s) => (
              <div key={s.step} className="steel-card p-6 border border-evraz-border">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-oswald text-3xl text-evraz-border font-bold leading-none">{s.step}</span>
                  <div className="w-9 h-9 bg-red-50 flex items-center justify-center">
                    <Icon name={s.icon} size={18} className="text-evraz-red" />
                  </div>
                </div>
                <h4 className="font-oswald text-base text-evraz-dark font-semibold mb-2">{s.title}</h4>
                <p className="font-ibm text-xs text-evraz-gray leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section id="contacts-section" className="py-16 bg-evraz-dark">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-oswald text-3xl md:text-4xl text-white font-semibold mb-4">
            ПОДОБРАЛИ ПОДХОДЯЩИЙ ПРОЕКТ?
          </h2>
          <p className="font-ibm text-gray-400 mb-8 text-sm leading-relaxed">
            Отправьте заявку — менеджер пришлёт полное КП с точной стоимостью, сроками и условиями гарантии в течение 2 часов.
          </p>
          <div className="bg-white/5 border border-white/10 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Имя и фамилия*" className="bg-white/5 border border-white/15 px-4 py-3 font-ibm text-white text-sm placeholder-gray-500 focus:outline-none focus:border-evraz-red transition-colors" />
              <input type="tel" placeholder="Телефон*" className="bg-white/5 border border-white/15 px-4 py-3 font-ibm text-white text-sm placeholder-gray-500 focus:outline-none focus:border-evraz-red transition-colors" />
              <input type="text" placeholder="Компания" className="bg-white/5 border border-white/15 px-4 py-3 font-ibm text-white text-sm placeholder-gray-500 focus:outline-none focus:border-evraz-red transition-colors" />
              <input type="email" placeholder="Email" className="bg-white/5 border border-white/15 px-4 py-3 font-ibm text-white text-sm placeholder-gray-500 focus:outline-none focus:border-evraz-red transition-colors" />
            </div>
            <textarea rows={3} placeholder="Укажите артикул проекта или опишите задачу..." className="w-full bg-white/5 border border-white/15 px-4 py-3 font-ibm text-white text-sm placeholder-gray-500 focus:outline-none focus:border-evraz-red transition-colors resize-none mb-4" />
            <button className="btn-primary w-full">Отправить заявку</button>
            <p className="font-ibm text-xs text-gray-600 mt-3">Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Мини-калькулятор внутри страницы ───────────────────────────────────────

function MiniCalculator() {
  const [width, setWidth] = useState(24);
  const [length, setLength] = useState(48);
  const [height, setHeight] = useState(6);
  const [type, setType] = useState("warehouse");

  const calc = () => {
    const area = width * length;
    const base: Record<string, number> = { warehouse: 12500, production: 16000, trade: 18500, agro: 10800, sport: 22000, parking: 9700 };
    const coef = height > 8 ? 1.15 : height > 6 ? 1.08 : 1;
    return Math.round((area * (base[type] || 12500) * coef) / 1000) * 1000;
  };

  return (
    <div className="bg-white/5 border border-white/10 p-8 max-w-3xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {[
          { key: "warehouse", label: "Склад" },
          { key: "production", label: "Производство" },
          { key: "trade", label: "Торговля" },
          { key: "agro", label: "Агро" },
          { key: "sport", label: "Спорт" },
          { key: "parking", label: "Паркинг" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setType(t.key)}
            className={`font-oswald text-sm tracking-wider uppercase py-2.5 border transition-all ${
              type === t.key ? "bg-evraz-red border-evraz-red text-white" : "border-white/20 text-gray-300 hover:border-evraz-red hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Ширина", val: width, set: setWidth, min: 12, max: 60 },
          { label: "Длина", val: length, set: setLength, min: 18, max: 200 },
          { label: "Высота", val: height, set: setHeight, min: 4, max: 20 },
        ].map((s) => (
          <div key={s.label}>
            <div className="flex justify-between mb-2">
              <label className="font-oswald text-xs tracking-widest text-gray-400 uppercase">{s.label}</label>
              <span className="font-oswald text-evraz-red text-sm font-semibold">{s.val} м</span>
            </div>
            <input type="range" min={s.min} max={s.max} value={s.val} onChange={(e) => s.set(+e.target.value)} className="w-full" />
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-evraz-red/10 border border-evraz-red/30 p-5">
        <div>
          <div className="font-ibm text-xs text-gray-400 uppercase tracking-wider">Площадь</div>
          <div className="font-oswald text-xl text-white">{(width * length).toLocaleString("ru-RU")} м²</div>
        </div>
        <div className="text-center md:text-right">
          <div className="font-ibm text-xs text-gray-400 uppercase tracking-wider">Ориентировочная стоимость</div>
          <div className="font-oswald text-3xl text-evraz-red font-bold">{FORMAT_RUB(calc())}</div>
          <div className="font-ibm text-xs text-gray-500 mt-0.5">*без фундамента и инженерных сетей</div>
        </div>
        <button
          onClick={() => document.getElementById("contacts-section")?.scrollIntoView({ behavior: "smooth" })}
          className="btn-primary whitespace-nowrap"
        >
          Получить смету
        </button>
      </div>
    </div>
  );
}