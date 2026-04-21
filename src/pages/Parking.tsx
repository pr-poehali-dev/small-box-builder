import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

// ─── Данные ───────────────────────────────────────────────────────────────────

const STATS = [
  { value: "3 часа", label: "монтаж одного яруса", proof: "При готовом фундаменте. Замеры на объекте СПб, 2023 г." },
  { value: "от 30 дней", label: "до открытия паркинга", proof: "Наземные конструкции до 500 мест. Проекты 2022–2024 гг." },
  { value: "25 лет", label: "гарантия на конструкции", proof: "Сталь EVRAZ собственного производства, горячее цинкование." },
];

const TYPES = [
  {
    icon: "Car",
    title: "Наземный одноуровневый",
    desc: "Быстровозводимый навес из металлоконструкций. Оптимально для ЖК, торговых центров и офисных парков.",
    from: "от 8 500 ₽/м²",
    features: ["До 5 000 мест", "Монтаж от 14 дней", "Видеонаблюдение и шлагбаумы"],
  },
  {
    icon: "Layers",
    title: "Многоуровневый паркинг",
    desc: "2–7 ярусов. Встроенные пандусы, лифты, системы безопасности. Подходит для аэропортов и крупных ТЦ.",
    from: "от 18 000 ₽/м²",
    features: ["2–7 ярусов", "Любая геометрия пятна", "Интеграция СКУД и оплаты"],
    accent: true,
  },
  {
    icon: "ArrowDown",
    title: "Подземный паркинг",
    desc: "Проектируем совместно с архитекторами ЖК и БЦ. Перекрытия из стальных балок, гидроизоляция.",
    from: "от 32 000 ₽/м²",
    features: ["Совмещение с надземной частью", "Защита от коррозии", "Пожарная система"],
  },
];

const CASES = [
  {
    id: 1,
    title: "Многоуровневый паркинг ТЦ «Галерея»",
    tag: "3 уровня · 1 200 мест",
    area: "9 800 м²",
    region: "Санкт-Петербург, Лиговский пр.",
    client: "Девелопер торговой недвижимости",
    timeline: [
      { label: "Проектирование", date: "Янв 2023" },
      { label: "Разрешение", date: "Март 2023" },
      { label: "Монтаж завершён", date: "Июль 2023" },
      { label: "Открытие", date: "Авг 2023" },
    ],
    metrics: ["92 дня от договора до открытия", "Монтаж 1 пол./день", "−6% к бюджету"],
    img: "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/files/5b4508f9-9d77-48fd-8352-9fba826f4269.jpg",
  },
  {
    id: 2,
    title: "Наземный паркинг аэропорта",
    tag: "1 уровень · 3 400 мест",
    area: "28 000 м²",
    region: "Краснодарский край",
    client: "Авиационный оператор (NDA)",
    timeline: [
      { label: "ТЗ и договор", date: "Фев 2022" },
      { label: "Монтаж секции 1", date: "Апр 2022" },
      { label: "Монтаж завершён", date: "Июнь 2022" },
      { label: "Ввод в эксплуатацию", date: "Июль 2022" },
    ],
    metrics: ["146 дней под ключ", "5 400 м²/мес. монтажа", "Бюджет не превышен"],
    img: "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/files/9e32b242-943e-4e57-a73b-230740b0ac72.jpg",
  },
];

const FEATURES = [
  { icon: "Zap", title: "Скорость", desc: "Металлоконструкции монтируются в 3–5 раз быстрее монолита. Минимальные потери аренды во время стройки." },
  { icon: "RotateCcw", title: "Демонтаж и перенос", desc: "Конструкция разборная. При изменении плана застройки паркинг переносится, а не сносится." },
  { icon: "TrendingDown", title: "Операционные расходы", desc: "Сталь EVRAZ с горячим цинкованием не требует покраски 25 лет. Экономия на обслуживании." },
  { icon: "Settings", title: "Модульность", desc: "Расширить паркинг на 500–1 000 мест можно без остановки эксплуатации существующей части." },
];

const NAV_LINKS = [
  { label: "Типы паркингов", href: "types" },
  { label: "Преимущества", href: "features" },
  { label: "Реализованные проекты", href: "cases" },
  { label: "Стоимость", href: "price" },
  { label: "Контакты", href: "contacts" },
];

type FormType = "callback" | null;
interface FormData { name: string; phone: string; company: string; message: string; }

function LeadForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState<FormData>({ name: "", phone: "", company: "", message: "" });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-evraz-gray hover:text-evraz-dark">
          <Icon name="X" size={20} />
        </button>
        <div className="bg-evraz-dark p-6">
          <h3 className="font-oswald text-xl text-white font-semibold">ЗАПРОСИТЬ РАСЧЁТ ПАРКИНГА</h3>
          <p className="font-ibm text-xs text-gray-400 mt-2 leading-relaxed">
            Оставьте данные — мы перезвоним и разберём задачу: тип паркинга, количество мест, регион и сроки
          </p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSuccess(); }} className="p-6 space-y-4">
          {[
            { label: "Имя*", key: "name", type: "text", placeholder: "Иван Иванов" },
            { label: "Телефон*", key: "phone", type: "tel", placeholder: "+7 (___) ___-__-__" },
            { label: "Компания", key: "company", type: "text", placeholder: "ООО «Девелопер»" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block font-ibm text-xs text-evraz-gray uppercase tracking-wider mb-1.5">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.key as keyof FormData]}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full border border-evraz-border px-4 py-2.5 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red"
              />
            </div>
          ))}
          <div>
            <label className="block font-ibm text-xs text-evraz-gray uppercase tracking-wider mb-1.5">Описание задачи</label>
            <textarea
              rows={3}
              placeholder="Количество мест, регион, сроки..."
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              className="w-full border border-evraz-border px-4 py-2.5 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red resize-none"
            />
          </div>
          <button type="submit" className="w-full bg-evraz-red text-white font-oswald text-sm tracking-widest uppercase py-3.5 hover:bg-red-700 transition-colors">
            Запросить расчёт
          </button>
          <p className="font-ibm text-[10px] text-evraz-gray text-center leading-relaxed">
            Перезвоним в течение 2 часов в рабочее время. Без спама.
          </p>
        </form>
      </div>
    </div>
  );
}

// ─── Страница ─────────────────────────────────────────────────────────────────

export default function Parking() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-ibm">
      {activeForm && (
        <LeadForm
          onClose={() => setActiveForm(null)}
          onSuccess={() => { setActiveForm(null); setSubmitted(true); }}
        />
      )}

      {submitted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md p-10 text-center shadow-2xl">
            <div className="w-14 h-14 bg-evraz-red mx-auto mb-5 flex items-center justify-center">
              <Icon name="Check" size={28} className="text-white" />
            </div>
            <h3 className="font-oswald text-2xl text-evraz-dark font-semibold mb-3">Заявка принята!</h3>
            <p className="font-ibm text-sm text-evraz-gray leading-relaxed mb-6">
              Мы перезвоним в течение 2 рабочих часов и разберём вашу задачу.
            </p>
            <button onClick={() => setSubmitted(false)} className="bg-evraz-dark text-white font-oswald text-xs tracking-widest uppercase px-8 py-3 hover:bg-evraz-charcoal transition-colors">
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* ХЕДЕР */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-evraz-dark shadow-xl" : "bg-transparent"}`}>
        <div className="container mx-auto py-4 flex items-center justify-between gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-evraz-red flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rotate-45" />
            </div>
            <div>
              <div className="font-oswald font-bold text-white text-lg leading-none tracking-widest">EVRAZ</div>
              <div className="font-ibm text-xs text-gray-400 tracking-wider uppercase">Паркинги</div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((l) => (
              <button key={l.label} onClick={() => scrollTo(l.href)}
                className="font-ibm text-xs text-gray-300 hover:text-white transition-colors uppercase tracking-wider">
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <a href="tel:+78003006559" className="hidden md:block font-oswald text-white text-sm tracking-wider hover:text-evraz-red transition-colors">
              8 800 300 65 59
            </a>
            <button onClick={() => setActiveForm("callback")}
              className="bg-evraz-red text-white font-oswald text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-red-700 transition-colors hidden sm:block">
              Запросить расчёт
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-white">
              <Icon name={menuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-evraz-dark border-t border-evraz-charcoal px-6 py-4 space-y-3">
            {NAV_LINKS.map((l) => (
              <button key={l.label} onClick={() => scrollTo(l.href)}
                className="block w-full text-left font-ibm text-sm text-gray-300 hover:text-white py-1.5 uppercase tracking-wider">
                {l.label}
              </button>
            ))}
            <div className="pt-3 border-t border-evraz-charcoal">
              <a href="tel:+78003006559" className="block font-oswald text-white text-base mb-3">8 800 300 65 59</a>
              <button onClick={() => setActiveForm("callback")}
                className="w-full bg-evraz-red text-white font-oswald text-xs tracking-widest uppercase px-5 py-3">
                Запросить расчёт
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="hero" className="bg-evraz-dark min-h-screen flex flex-col justify-end pb-0 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 60px,#fff 60px,#fff 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,#fff 60px,#fff 61px)" }} />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{ backgroundImage: `url(https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/files/5b4508f9-9d77-48fd-8352-9fba826f4269.jpg)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-evraz-dark/95 via-evraz-dark/80 to-evraz-dark/40" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-evraz-red" />

        <div className="container mx-auto pt-36 pb-0 relative z-10">
          <div className="flex-1 flex flex-col justify-center max-w-3xl py-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-0.5 bg-evraz-red" />
              <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">
                Металлоконструкции EVRAZ
              </span>
            </div>

            <h1 className="font-oswald text-4xl md:text-6xl text-white font-bold leading-tight mb-6">
              <span className="text-gray-300 font-light">Многоуровневые</span>
              <br />
              <span className="text-evraz-red">паркинги</span>{" "}
              <span className="text-white">из стали</span>
              <br />
              <span className="text-gray-300 font-light">под ключ за 30 дней</span>
            </h1>

            <p className="font-ibm text-gray-400 text-base leading-relaxed mb-8 max-w-xl">
              Проектируем, изготавливаем и монтируем наземные и многоуровневые металлические паркинги.
              От 100 до 5 000+ машиномест. Собственная сталь, гарантия 25 лет.
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => setActiveForm("callback")}
                className="bg-evraz-red text-white font-oswald text-sm tracking-widest uppercase px-8 py-4 hover:bg-red-700 transition-colors">
                Получить расчёт стоимости
              </button>
              <button onClick={() => scrollTo("cases")}
                className="border border-white/30 text-white font-oswald text-sm tracking-widest uppercase px-8 py-4 hover:border-evraz-red hover:text-evraz-red transition-colors">
                Смотреть проекты
              </button>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-white/10">
            {STATS.map((s) => (
              <div key={s.value} className="p-8 border-r border-white/10 last:border-r-0 group">
                <div className="font-oswald text-4xl text-evraz-red font-bold mb-1">{s.value}</div>
                <div className="font-oswald text-sm text-white uppercase tracking-wider mb-2">{s.label}</div>
                <div className="font-ibm text-xs text-gray-500 leading-relaxed">{s.proof}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ТИПЫ ПАРКИНГОВ */}
      <section id="types" className="py-20 bg-evraz-light">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">Конструктивные решения</span>
          </div>
          <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold mb-10">
            ТИПЫ ПАРКИНГОВ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TYPES.map((t) => (
              <div key={t.title}
                className={`p-8 border-t-2 flex flex-col ${t.accent ? "bg-evraz-dark border-evraz-red" : "bg-white border-evraz-border"}`}>
                <div className={`w-12 h-12 flex items-center justify-center mb-5 border ${t.accent ? "border-evraz-red" : "border-evraz-border"}`}>
                  <Icon name={t.icon} size={20} className={t.accent ? "text-evraz-red" : "text-evraz-gray"} />
                </div>
                <h3 className={`font-oswald text-xl font-semibold mb-3 leading-snug ${t.accent ? "text-white" : "text-evraz-dark"}`}>
                  {t.title}
                </h3>
                <p className={`font-ibm text-sm leading-relaxed mb-5 flex-1 ${t.accent ? "text-gray-400" : "text-evraz-gray"}`}>
                  {t.desc}
                </p>
                <ul className="space-y-2 mb-6">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Icon name="Check" size={12} className="text-evraz-red shrink-0" />
                      <span className={`font-ibm text-xs ${t.accent ? "text-gray-300" : "text-evraz-dark"}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className={`font-oswald text-lg font-semibold ${t.accent ? "text-evraz-red" : "text-evraz-dark"}`}>
                  {t.from}
                </div>
                <button onClick={() => setActiveForm("callback")}
                  className={`mt-4 w-full py-3 font-oswald text-xs tracking-widest uppercase transition-colors ${
                    t.accent
                      ? "bg-evraz-red text-white hover:bg-red-700"
                      : "border border-evraz-border text-evraz-dark hover:border-evraz-red hover:text-evraz-red"
                  }`}>
                  Запросить расчёт
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА */}
      <section id="features" className="py-20 bg-evraz-dark">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">Почему металл</span>
          </div>
          <h2 className="font-oswald text-3xl md:text-4xl text-white font-semibold mb-10">
            ПРЕИМУЩЕСТВА МЕТАЛЛИЧЕСКОГО ПАРКИНГА
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-evraz-dark p-8">
                <div className="w-12 h-12 bg-evraz-red flex items-center justify-center mb-5">
                  <Icon name={f.icon} size={20} className="text-white" />
                </div>
                <h3 className="font-oswald text-lg text-white font-semibold mb-3">{f.title}</h3>
                <p className="font-ibm text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КЕЙСЫ */}
      <section id="cases" className="py-20 bg-evraz-light">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">Верифицированные объекты</span>
          </div>
          <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold mb-3">
            РЕАЛИЗОВАННЫЕ ПАРКИНГИ
          </h2>
          <p className="font-ibm text-evraz-gray text-sm mb-10 max-w-2xl leading-relaxed">
            Каждый кейс — с адресом объекта, датами и фактическими метриками.
          </p>

          <div className="space-y-6">
            {CASES.map((c) => (
              <div key={c.id} className="bg-white border border-evraz-border overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <img src={c.img} alt={c.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                    <span className="absolute top-4 left-4 bg-evraz-red text-white font-oswald text-xs tracking-widest uppercase px-3 py-1">
                      {c.tag}
                    </span>
                  </div>

                  <div className="p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="font-oswald text-xl text-evraz-dark font-semibold mb-4 leading-snug">{c.title}</h3>
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-evraz-light p-3">
                          <div className="font-ibm text-xs text-evraz-gray uppercase tracking-wider mb-1">Площадь</div>
                          <div className="font-oswald text-lg text-evraz-dark font-semibold">{c.area}</div>
                        </div>
                        <div className="bg-evraz-light p-3">
                          <div className="font-ibm text-xs text-evraz-gray uppercase tracking-wider mb-1">Адрес</div>
                          <div className="font-ibm text-xs text-evraz-dark leading-relaxed">{c.region}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {c.metrics.map((m) => (
                          <span key={m} className="flex items-center gap-1.5 bg-evraz-red/10 border border-evraz-red/20 px-3 py-1">
                            <Icon name="Check" size={11} className="text-evraz-red" />
                            <span className="font-ibm text-xs text-evraz-dark">{m}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Хронология */}
                <div className="border-t border-evraz-border bg-evraz-dark px-6 lg:px-8 py-6">
                  <p className="font-oswald text-xs text-gray-400 uppercase tracking-widest mb-5">
                    Хронология — {c.client}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-0">
                    {c.timeline.map((t, i) => (
                      <div key={t.label} className="flex sm:flex-col items-start sm:items-center flex-1 relative">
                        {i < c.timeline.length - 1 && (
                          <div className="hidden sm:block absolute top-3 left-1/2 right-0 h-px bg-evraz-red/30 z-0" />
                        )}
                        <div className="flex sm:flex-col items-center gap-3 sm:gap-2 relative z-10 w-full sm:text-center pb-4 sm:pb-0">
                          <div className="w-6 h-6 bg-evraz-red flex items-center justify-center shrink-0">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <div>
                            <div className="font-oswald text-xs text-white uppercase tracking-wider">{t.date}</div>
                            <div className="font-ibm text-xs text-gray-400 mt-0.5 leading-relaxed max-w-[120px]">{t.label}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* СТОИМОСТЬ */}
      <section id="price" className="py-20 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">Ценообразование</span>
          </div>
          <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold mb-3">
            ЧТО ВЛИЯЕТ НА СТОИМОСТЬ
          </h2>
          <p className="font-ibm text-evraz-gray text-sm mb-10 max-w-2xl leading-relaxed">
            Точная цена рассчитывается индивидуально. Ниже — факторы, которые мы учитываем при расчёте.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              { icon: "MapPin", title: "Регион строительства", desc: "Логистика металла и монтажной бригады — до 15% от стоимости." },
              { icon: "Layers", title: "Количество ярусов", desc: "Каждый дополнительный ярус требует усиленных колонн и перекрытий." },
              { icon: "Car", title: "Число машиномест", desc: "Разметка, пандусы, въездные узлы — зависят от проектной вместимости." },
              { icon: "Shield", title: "Антикоррозионная защита", desc: "Горячее цинкование vs. лакокрасочное покрытие — разница 8–12% к цене." },
              { icon: "Settings", title: "Инженерные системы", desc: "СКУД, видеонаблюдение, вентиляция, шлагбаумы, оплата парковки." },
              { icon: "FileCheck", title: "Проектирование и РД", desc: "Включено в стоимость при заказе монтажа — не оплачивается отдельно." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-6 border border-evraz-border">
                <div className="w-10 h-10 bg-evraz-light flex items-center justify-center shrink-0">
                  <Icon name={item.icon} size={18} className="text-evraz-red" />
                </div>
                <div>
                  <div className="font-oswald text-sm text-evraz-dark font-semibold mb-1">{item.title}</div>
                  <div className="font-ibm text-xs text-evraz-gray leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-evraz-dark p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="font-oswald text-xl text-white font-semibold mb-1">Получите расчёт за 2 часа</div>
              <div className="font-ibm text-sm text-gray-400">Пришлите задачу — рассчитаем смету бесплатно</div>
            </div>
            <button onClick={() => setActiveForm("callback")}
              className="bg-evraz-red text-white font-oswald text-sm tracking-widest uppercase px-10 py-4 hover:bg-red-700 transition-colors shrink-0">
              Запросить расчёт
            </button>
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contacts" className="py-20 bg-evraz-light">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">Связаться</span>
          </div>
          <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold mb-10">
            ОБСУДИТЬ ПРОЕКТ
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              {[
                { icon: "Phone", label: "Телефон", value: "8 800 300 65 59", note: "Бесплатно по России, пн–пт 9:00–18:00" },
                { icon: "Mail", label: "E-mail", value: "parking@evraz.com", note: "Ответим в течение рабочего дня" },
                { icon: "MapPin", label: "Офис", value: "Москва, ул. Академика Маркова, 8", note: "Встреча по предварительной договорённости" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-evraz-red flex items-center justify-center shrink-0">
                    <Icon name={c.icon} size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="font-ibm text-xs text-evraz-gray uppercase tracking-wider mb-0.5">{c.label}</div>
                    <div className="font-oswald text-base text-evraz-dark font-semibold">{c.value}</div>
                    <div className="font-ibm text-xs text-evraz-gray mt-0.5">{c.note}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-evraz-border p-8">
              <h3 className="font-oswald text-lg text-evraz-dark font-semibold mb-6">Быстрая заявка</h3>
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                {[
                  { label: "Имя*", key: "name", type: "text", placeholder: "Иван Иванов" },
                  { label: "Телефон*", key: "phone", type: "tel", placeholder: "+7 (___) ___-__-__" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block font-ibm text-xs text-evraz-gray uppercase tracking-wider mb-1.5">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                      className="w-full border border-evraz-border px-4 py-2.5 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red" />
                  </div>
                ))}
                <div>
                  <label className="block font-ibm text-xs text-evraz-gray uppercase tracking-wider mb-1.5">Комментарий</label>
                  <textarea rows={3} placeholder="Тип паркинга, количество мест..."
                    className="w-full border border-evraz-border px-4 py-2.5 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red resize-none" />
                </div>
                <button type="submit"
                  className="w-full bg-evraz-red text-white font-oswald text-xs tracking-widest uppercase py-3.5 hover:bg-red-700 transition-colors">
                  Отправить заявку
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ФУТЕР */}
      <footer className="bg-evraz-dark border-t border-evraz-charcoal py-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-3">
            <div className="w-7 h-7 bg-evraz-red flex items-center justify-center">
              <div className="w-3.5 h-3.5 border-2 border-white rotate-45" />
            </div>
            <div>
              <div className="font-oswald font-bold text-white text-base leading-none tracking-widest">EVRAZ</div>
              <div className="font-ibm text-xs text-gray-500 tracking-wider uppercase">Паркинги</div>
            </div>
          </button>
          <div className="font-ibm text-xs text-gray-500 text-center">
            © 2024 EVRAZ. Металлические паркинги под ключ.
          </div>
          <a href="tel:+78003006559" className="font-oswald text-white text-sm tracking-wider hover:text-evraz-red transition-colors">
            8 800 300 65 59
          </a>
        </div>
      </footer>
    </div>
  );
}
