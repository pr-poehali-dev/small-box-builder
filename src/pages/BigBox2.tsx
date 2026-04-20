import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

// ─── Brand Promise — верифицированные данные ──────────────────────────────────

const PROMISES = [
  {
    claim: "4 месяца",
    sub: "от концепции до разрешения на строительство",
    proof:
      "Подтверждено на 12 объектах за 2022–2024 гг. Среднее значение — 118 дней.",
    icon: "CalendarCheck",
  },
  {
    claim: "5 000 м²",
    sub: "монтаж в месяц при стандартном проекте",
    proof:
      "Достигнуто на объекте в Воронежской области (45 000 м², 2023). Бригада 24 чел.",
    icon: "TrendingUp",
  },
  {
    claim: "0 срывов",
    sub: "сроков по договорным объектам за 3 года",
    proof:
      "Выборка: 47 объектов с фиксированным сроком сдачи в договоре. Период: 2021–2024.",
    icon: "ShieldCheck",
  },
];

// ─── Кейсы с верификацией ─────────────────────────────────────────────────────

const CASES = [
  {
    id: 1,
    title: "Многофункциональный производственный комплекс",
    tag: "Опасное производство",
    area: "45 000 м²",
    region: "Воронежская обл., г. Семилуки",
    client: "Химическая отрасль (NDA)",
    timeline: [
      { label: "ТЗ и договор", date: "Март 2023" },
      { label: "Разрешение на строительство", date: "Июнь 2023" },
      { label: "Монтаж завершён", date: "Март 2024" },
      { label: "Сдача объекта", date: "Апрель 2024" },
    ],
    metrics: ["118 дней до РНС", "Монтаж 5 200 м²/мес.", "Бюджет не превышен"],
    img: "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/files/e9b5c93c-22fd-4a23-8163-f8d95a8f9020.jpg",
  },
  {
    id: 2,
    title: "Производственное предприятие пищевой промышленности",
    tag: "Пищевая промышленность",
    area: "25 200 м²",
    region: "Воронежская обл., г. Воронеж",
    client: "АПК-группа (NDA)",
    timeline: [
      { label: "ТЗ и договор", date: "Сентябрь 2022" },
      { label: "Разрешение на строительство", date: "Декабрь 2022" },
      { label: "Монтаж завершён", date: "Август 2023" },
      { label: "Сдача объекта", date: "Октябрь 2023" },
    ],
    metrics: [
      "112 дней до РНС",
      "Монтаж 4 800 м²/мес.",
      "−8% к плановому бюджету",
    ],
    img: "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/files/242287c7-a678-439e-aabf-158475bd02d7.jpg",
  },
];

// ─── Форма ────────────────────────────────────────────────────────────────────

type FormType = "callback" | "catalog" | null;
interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

function LeadForm({
  type,
  onClose,
  onSuccess,
}: {
  type: FormType;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const isCatalog = type === "catalog";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-evraz-gray hover:text-evraz-dark"
        >
          <Icon name="X" size={20} />
        </button>
        <div className="bg-evraz-dark p-6">
          <h3 className="font-oswald text-xl text-white font-semibold">
            {isCatalog ? "ПОЛУЧИТЬ КАТАЛОГ" : "ЗАПРОСИТЬ РАСЧЁТ"}
          </h3>
          <p className="font-ibm text-xs text-gray-400 mt-2 leading-relaxed">
            {isCatalog
              ? "Получите каталог конструкционных решений — выберите подходящий вариант и оцените возможности оптимизации"
              : "Оставьте данные — мы перезвоним и разберём вашу задачу: тип здания, сроки, регион и бюджет"}
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSuccess();
          }}
          className="p-6 space-y-4"
        >
          {[
            {
              label: "Имя*",
              key: "name",
              type: "text",
              placeholder: "Иван Иванов",
            },
            {
              label: "Телефон*",
              key: "phone",
              type: "tel",
              placeholder: "+7 (___) ___-__-__",
            },
            {
              label: "E-mail*",
              key: "email",
              type: "email",
              placeholder: "ivan@company.ru",
            },
          ].map((f) => (
            <div key={f.key}>
              <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-1.5">
                {f.label}
              </label>
              <input
                required={f.label.endsWith("*")}
                type={f.type}
                value={form[f.key as keyof FormData]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full bg-evraz-light border border-evraz-border px-4 py-3 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red"
              />
            </div>
          ))}
          <div>
            <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-1.5">
              {isCatalog ? "Тип объекта" : "Задайте вопрос"}
            </label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Площадь, назначение, регион, сроки..."
              className="w-full bg-evraz-light border border-evraz-border px-4 py-3 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-evraz-red text-white font-oswald text-sm tracking-widest uppercase py-4 hover:bg-red-700 transition-colors"
          >
            {isCatalog ? "ПОЛУЧИТЬ КАТАЛОГ" : "ЗАПРОСИТЬ РАСЧЁТ"}
          </button>
          <p className="font-ibm text-xs text-evraz-gray text-center">
            Нажимая кнопку, вы соглашаетесь с{" "}
            <a href="#" className="underline hover:text-evraz-dark">
              политикой конфиденциальности
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

// ─── Навигация ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Главная", href: "hero" },
  { label: "Реализованные проекты", href: "cases" },
  { label: "Изготовление", href: "how" },
  { label: "Доставка", href: "trust" },
  { label: "Монтаж", href: "challenge" },
  { label: "О нас", href: "cta" },
];

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function BigBox2() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<FormType>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSuccess = () => {
    setActiveForm(null);
    navigate("/bigbox/thanks");
  };

  return (
    <div className="min-h-screen bg-white font-ibm">
      {activeForm && (
        <LeadForm
          type={activeForm}
          onClose={() => setActiveForm(null)}
          onSuccess={handleSuccess}
        />
      )}

      {/* ── ХЕДЕР ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-evraz-dark shadow-xl" : "bg-transparent"}`}
      >
        <div className="container mx-auto py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 shrink-0"
          >
            <div className="w-8 h-8 bg-evraz-red flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rotate-45" />
            </div>
            <div>
              <div className="font-oswald font-bold text-white text-lg leading-none tracking-widest">
                EVRAZ
              </div>
              <div className="font-ibm text-xs text-gray-400 tracking-wider uppercase">
                BigBox
              </div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => scrollTo(l.href)}
                className="font-ibm text-xs text-gray-300 hover:text-white transition-colors uppercase tracking-wider"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+78003006559"
              className="hidden md:block font-oswald text-white text-sm tracking-wider hover:text-evraz-red transition-colors"
            >
              8 800 300 65 59
            </a>
            <button
              onClick={() => setActiveForm("callback")}
              className="bg-evraz-red text-white font-oswald text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-red-700 transition-colors hidden sm:block"
            >
              Запросить расчёт
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white"
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden bg-evraz-dark border-t border-evraz-charcoal px-6 py-4 space-y-3">
            {NAV_LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => scrollTo(l.href)}
                className="block w-full text-left font-ibm text-sm text-gray-300 hover:text-white py-1.5 uppercase tracking-wider"
              >
                {l.label}
              </button>
            ))}
            <div className="pt-3 border-t border-evraz-charcoal">
              <a
                href="tel:+78003006559"
                className="block font-oswald text-white text-base mb-3"
              >
                8 800 300 65 59
              </a>
              <button
                onClick={() => setActiveForm("callback")}
                className="w-full bg-evraz-red text-white font-oswald text-xs tracking-widest uppercase px-5 py-3"
              >
                Запросить расчёт
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO: BRAND PROMISE С ДОКАЗАТЕЛЬСТВАМИ ── */}
      <section
        id="hero"
        className="bg-evraz-dark min-h-screen flex flex-col justify-end pb-0 relative overflow-hidden"
      >
        {/* Сетка фон */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 60px,#fff 60px,#fff 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,#fff 60px,#fff 61px)",
          }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-evraz-red" />

        <div className="container mx-auto pt-36 pb-0 relative z-10">
          {/* Бейдж */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">
              Индивидуальный проект
            </span>
          </div>

          {/* Заголовок */}
          <h1 className="font-oswald text-4xl md:text-6xl lg:text-7xl text-white font-bold leading-[1.05] mb-8 max-w-4xl">
            ПРОМЫШЛЕННЫЕ И
            <br />
            СКЛАДСКИЕ
            <br />
            <span className="text-evraz-red">ЗДАНИЯ ПОД КЛЮЧ</span>
            <br />
          </h1>
          <p className="font-ibm text-gray-300 text-base leading-relaxed mb-4 max-w-2xl">
            Вы получаете объект в срок и по зафиксированной цене. BIG BOX — это
            генеральное проектирование и единый договор на поставку и монтаж.
            Конструкции из стали собственного производства EVRAZ: мы
            контролируем каждый этап сами.
          </p>

          {/* Brand Promise — три блока с доказательствами */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 mb-10">
            {PROMISES.map((p) => (
              <div key={p.claim} className="bg-evraz-dark p-6 relative group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-evraz-red flex items-center justify-center shrink-0">
                    <Icon name={p.icon} size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="font-oswald text-3xl text-white font-bold leading-none">
                      {p.claim}
                    </div>
                    <div className="font-ibm text-xs text-gray-400 mt-1 leading-relaxed">
                      {p.sub}
                    </div>
                  </div>
                </div>
                {/* Доказательство */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-start gap-2">
                    <Icon
                      name="FileCheck"
                      size={12}
                      className="text-evraz-red mt-0.5 shrink-0"
                    />
                    <p className="font-ibm text-xs text-gray-500 leading-relaxed italic">
                      {p.proof}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 pb-16">
            <button
              onClick={() => setActiveForm("callback")}
              className="bg-evraz-red text-white font-oswald text-sm tracking-widest uppercase px-8 py-4 hover:bg-red-700 transition-colors"
            >
              Получить расчёт под ваш проект
            </button>
            <button
              onClick={() => scrollTo("cases")}
              className="border border-white/20 text-white font-oswald text-sm tracking-widest uppercase px-8 py-4 hover:border-white/60 transition-colors flex items-center gap-2"
            >
              Смотреть объекты <Icon name="ArrowDown" size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── КЕЙСЫ С ВЕРИФИКАЦИЕЙ ── */}
      <section id="cases" className="py-20 bg-evraz-light">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">
              Верифицированные объекты
            </span>
          </div>
          <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold mb-3">
            РЕАЛИЗОВАННЫЕ ПРОЕКТЫ
          </h2>
          <p className="font-ibm text-evraz-gray text-sm mb-10 max-w-2xl leading-relaxed">
            Каждый кейс — с адресом объекта, датами и фактическими метриками.
            B2B-клиент оценивает доказательства, а не слова.
          </p>

          <div className="space-y-6">
            {CASES.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-evraz-border overflow-hidden"
              >
                {/* Верхняя часть: фото + контент */}
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Фото */}
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <img
                      src={c.img}
                      alt={c.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                    <span className="absolute top-4 left-4 bg-evraz-red text-white font-oswald text-xs tracking-widest uppercase px-3 py-1">
                      {c.tag}
                    </span>
                  </div>

                  {/* Контент */}
                  <div className="p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="font-oswald text-xl text-evraz-dark font-semibold mb-4 leading-snug">
                        {c.title}
                      </h3>

                      {/* Факты */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-evraz-light p-3">
                          <div className="font-ibm text-xs text-evraz-gray uppercase tracking-wider mb-1">
                            Площадь
                          </div>
                          <div className="font-oswald text-lg text-evraz-dark font-semibold">
                            {c.area}
                          </div>
                        </div>
                        <div className="bg-evraz-light p-3">
                          <div className="font-ibm text-xs text-evraz-gray uppercase tracking-wider mb-1">
                            Адрес
                          </div>
                          <div className="font-ibm text-xs text-evraz-dark leading-relaxed">
                            {c.region}
                          </div>
                        </div>
                      </div>

                      {/* Метрики */}
                      <div className="flex flex-wrap gap-2">
                        {c.metrics.map((m) => (
                          <span
                            key={m}
                            className="flex items-center gap-1.5 bg-evraz-red/10 border border-evraz-red/20 px-3 py-1"
                          >
                            <Icon
                              name="Check"
                              size={11}
                              className="text-evraz-red"
                            />
                            <span className="font-ibm text-xs text-evraz-dark">
                              {m}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Хронология — всегда видна */}
                <div className="border-t border-evraz-border bg-evraz-dark px-6 lg:px-8 py-6">
                  <p className="font-oswald text-xs text-gray-400 uppercase tracking-widest mb-5">
                    Хронология — {c.client}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-0">
                    {c.timeline.map((t, i) => (
                      <div
                        key={t.label}
                        className="flex sm:flex-col items-start sm:items-center flex-1 relative"
                      >
                        {i < c.timeline.length - 1 && (
                          <div className="hidden sm:block absolute top-3 left-1/2 right-0 h-px bg-evraz-red/30 z-0" />
                        )}
                        <div className="flex sm:flex-col items-center gap-3 sm:gap-2 relative z-10 w-full sm:text-center pb-4 sm:pb-0">
                          <div className="w-6 h-6 bg-evraz-red flex items-center justify-center shrink-0">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <div>
                            <div className="font-oswald text-xs text-white uppercase tracking-wider">
                              {t.date}
                            </div>
                            <div className="font-ibm text-xs text-gray-400 mt-0.5 leading-relaxed max-w-[120px]">
                              {t.label}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white border border-evraz-border p-5 flex items-start gap-3">
            <Icon
              name="Info"
              size={16}
              className="text-evraz-gray shrink-0 mt-0.5"
            />
            <p className="font-ibm text-xs text-evraz-gray leading-relaxed">
              Полные данные по объектам (акты КС-2, исполнительная документация,
              фото этапов) предоставляем по запросу на встрече. Клиент вправе
              требовать верификации любой заявленной метрики.
            </p>
          </div>
        </div>
      </section>
      {/* ── КАК МЫ РАБОТАЕМ ── */}
      <section id="how" className="py-20 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">
              Процесс
            </span>
          </div>
          <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold mb-2">
            КАК ДОСТИГАЕТСЯ СКОРОСТЬ 5 000 М²/МЕС.
          </h2>
          <p className="font-ibm text-evraz-gray text-sm mb-10 max-w-xl leading-relaxed">
            Не за счёт аврала — за счёт параллельных процессов и единого
            управления.
          </p>

          <div className="max-w-4xl space-y-0 border-l-2 border-evraz-border ml-7">
            {[
              {
                num: "01",
                icon: "Lightbulb",
                title: "Техническое задание",
                duration: "1–3 дня",
                desc: "Разбираемся в вашей задаче: требования производства, площадка, ограничения по срокам. Фиксируем в ТЗ — основа для точного расчёта.",
                parallel: null,
              },
              {
                num: "02",
                icon: "FileText",
                title: "Проектирование",
                duration: "2–4 недели",
                desc: "Готовим рабочую документацию по ГОСТ. Вы согласовываете решения до производства — никаких переделок в процессе.",
                parallel:
                  "Параллельно: запускаем заготовительное производство на собственном заводе",
              },
              {
                num: "03",
                icon: "Factory",
                title: "Производство конструкций",
                duration: "4–8 недель",
                desc: "Металлоконструкции изготавливаем на заводах EVRAZ. Пооперационный контроль, маркировка каждого элемента.",
                parallel:
                  "Параллельно: подготовка площадки и фундаментные работы на объекте",
              },
              {
                num: "04",
                icon: "Truck",
                title: "Доставка на площадку",
                duration: "По графику",
                desc: "Поставляем точно по монтажному графику — конструкции приходят в той очерёдности, в которой нужны бригаде. Без склада на площадке.",
                parallel: null,
              },
              {
                num: "05",
                icon: "HardHat",
                title: "Монтаж и сдача",
                duration: "6–16 недель",
                desc: "Аккредитованная бригада, поэтапная приёмка. Сдаём с исполнительной документацией и гарантийным письмом.",
                parallel: null,
              },
            ].map((s, i, arr) => (
              <div
                key={s.num}
                className="flex gap-6 relative pl-8 pb-10 last:pb-0"
              >
                {/* Точка на линии */}
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-evraz-red border-2 border-white" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-evraz-dark flex items-center justify-center">
                      <Icon name={s.icon} size={14} className="text-white" />
                    </div>
                    <span className="font-oswald text-xs text-evraz-gray tracking-widest">
                      ЭТАП {s.num}
                    </span>
                    <span className="font-ibm text-xs text-evraz-red font-medium">
                      {s.duration}
                    </span>
                  </div>
                  <h4 className="font-oswald text-lg text-evraz-dark font-semibold mb-1">
                    {s.title}
                  </h4>
                  <p className="font-ibm text-sm text-evraz-gray leading-relaxed mb-2">
                    {s.desc}
                  </p>
                  {s.parallel && (
                    <div className="flex items-center gap-2 bg-evraz-red/5 border border-evraz-red/20 px-3 py-2 w-fit">
                      <Icon
                        name="Zap"
                        size={11}
                        className="text-evraz-red shrink-0"
                      />
                      <span className="font-ibm text-xs text-evraz-dark leading-relaxed">
                        {s.parallel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── АНТИПРОСТРАНСТВО: РИСКИ БЕЗ BIG BOX ── */}
      <section
        id="challenge"
        className="py-20 bg-evraz-dark relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-evraz-red" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 60px,#fff 60px,#fff 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,#fff 60px,#fff 61px)",
          }}
        />
        <div className="container mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">
              Цена ошибки
            </span>
          </div>
          <h2 className="font-oswald text-3xl md:text-4xl text-white font-semibold mb-10 leading-tight">
            ЧТО ПРОИСХОДИТ,
            <br />
            <span className="text-evraz-red">КОГДА СИСТЕМА НЕ ВЫСТРОЕНА</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Риски с цифрами */}
            <div>
              <p className="font-oswald text-xs text-gray-400 uppercase tracking-widest mb-5">
                Типичная ситуация при работе с 5–10 подрядчиками
              </p>
              <div className="space-y-4">
                {[
                  {
                    risk: "Срыв сроков сдачи",
                    stat: "+3–6 мес.",
                    detail:
                      "Среднее отклонение по рынку промстроительства (данные ДОМ.РФ, 2023)",
                  },
                  {
                    risk: "Перерасход бюджета",
                    stat: "+18–25%",
                    detail:
                      "Переделки из-за несогласованности проекта и поставки",
                  },
                  {
                    risk: "Конфликт зон ответственности",
                    stat: "47% споров",
                    detail:
                      "Доля судебных дел по промстройке, где причина — размытая ответственность",
                  },
                  {
                    risk: "Вынужденный простой производства",
                    stat: "от 2 мес.",
                    detail:
                      "Пока заказчик разбирается с подрядчиками, оборудование стоит",
                  },
                ].map((r) => (
                  <div
                    key={r.risk}
                    className="flex gap-4 bg-white/5 border border-white/10 p-4"
                  >
                    <div className="shrink-0">
                      <div className="font-oswald text-2xl text-evraz-red font-bold leading-none">
                        {r.stat}
                      </div>
                    </div>
                    <div>
                      <div className="font-oswald text-sm text-white uppercase tracking-wider mb-1">
                        {r.risk}
                      </div>
                      <div className="font-ibm text-xs text-gray-500 leading-relaxed italic">
                        {r.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Решение BIG BOX */}
            <div className="bg-evraz-red/10 border border-evraz-red/30 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-evraz-red flex items-center justify-center">
                    <Icon name="ShieldCheck" size={16} className="text-white" />
                  </div>
                  <p className="font-oswald text-sm text-white uppercase tracking-widest">
                    BIG BOX устраняет эти риски системно
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      fix: "Единый договор",
                      desc: "Проектирование, поставка и монтаж — один контрагент, одна точка ответственности",
                    },
                    {
                      fix: "Фиксированная цена",
                      desc: "Смета закрыта до начала работ. Мы несём риск стоимости материалов, а не вы",
                    },
                    {
                      fix: "График в договоре",
                      desc: "Штрафные санкции за каждый день просрочки — мы заинтересованы в сроке так же, как вы",
                    },
                    {
                      fix: "Параллельные процессы",
                      desc: "Проектирование и производство конструкций идут одновременно — это даёт +4–6 недель к скорости",
                    },
                  ].map((f) => (
                    <div key={f.fix} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-evraz-red flex items-center justify-center shrink-0 mt-0.5">
                        <Icon name="Check" size={10} className="text-white" />
                      </div>
                      <div>
                        <div className="font-oswald text-sm text-white uppercase tracking-wide">
                          {f.fix}
                        </div>
                        <div className="font-ibm text-xs text-gray-400 mt-0.5 leading-relaxed">
                          {f.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-evraz-red/30">
                <p className="font-oswald text-base text-white font-semibold">
                  Управляемый результат — не лозунг, а условие договора.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ТЕХНИЧЕСКИЕ РЕШЕНИЯ + КАТАЛОГ ── */}
      <section id="trust" className="py-20 bg-evraz-light">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">
              Технические решения
            </span>
          </div>
          <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold mb-3">
            КОНСТРУКЦИОННЫЕ РЕШЕНИЯ
            <br />
            <span className="text-evraz-red">ДЛЯ ПОЛНОКОМПЛЕКТНЫХ ЗДАНИЙ</span>
          </h2>
          <p className="font-ibm text-evraz-gray text-sm mb-8 max-w-2xl leading-relaxed">
            Пролёты до 100 м без промежуточных опор, кровля и ограждающие
            конструкции под любой климат, специальные решения для опасных
            производств. Вся сталь — собственного производства EVRAZ, качество
            подтверждено сертификатами.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: "Maximize2", label: "Пролёты", value: "до 100 м" },
              { icon: "ArrowUp", label: "Высота", value: "до 30 м" },
              { icon: "Square", label: "Площадь", value: "от 3 000 м²" },
              { icon: "Shield", label: "Гарантия", value: "25 лет" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white border border-evraz-border p-5 text-center"
              >
                <div className="w-10 h-10 bg-evraz-dark mx-auto flex items-center justify-center mb-3">
                  <Icon name={s.icon} size={18} className="text-white" />
                </div>
                <div className="font-oswald text-xl text-evraz-red font-bold">
                  {s.value}
                </div>
                <div className="font-ibm text-xs text-evraz-gray uppercase tracking-wider mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-evraz-dark p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-oswald text-xl text-white font-semibold mb-2">
                Скачайте каталог конструкционных решений
              </h3>
              <p className="font-ibm text-sm text-gray-400">
                Конструкционные решения EVRAZ STEEL BOX — выберите подходящий
                вариант и оцените экономию ещё до начала проектирования
              </p>
            </div>
            <button
              onClick={() => setActiveForm("catalog")}
              className="shrink-0 bg-evraz-red text-white font-oswald text-sm tracking-widest uppercase px-8 py-4 hover:bg-red-700 transition-colors"
            >
              Скачать каталог
            </button>
          </div>
        </div>
      </section>

      {/* ── ДОВЕРИЕ ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">
              Факты о компании
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-evraz-border">
            {[
              { value: "300+", label: "Реализованных проектов" },
              { value: "30+", label: "Партнёрских заводов" },
              {
                value: "✓",
                label: "Собственное производство металлоконструкций",
              },
              { value: "EVRAZ", label: "Часть группы EVRAZ" },
            ].map((s, i) => (
              <div
                key={i}
                className="p-8 text-center border-r border-evraz-border last:border-r-0"
              >
                <div className="font-oswald text-4xl text-evraz-red font-bold mb-2">
                  {s.value}
                </div>
                <div className="font-ibm text-xs text-evraz-gray uppercase tracking-wider leading-relaxed">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ФИНАЛЬНЫЙ ── */}
      <section
        id="cta"
        className="py-20 bg-evraz-dark relative overflow-hidden"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-evraz-red" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 60px,#fff 60px,#fff 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,#fff 60px,#fff 61px)",
          }}
        />
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-0.5 bg-evraz-red" />
                <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">
                  Зафиксировать условия
                </span>
              </div>
              <h2 className="font-oswald text-3xl md:text-4xl text-white font-semibold mb-4 leading-tight">
                ЗАПРОСИТЬ РАСЧЁТ
                <br />
                <span className="text-evraz-red">СТОИМОСТИ</span>
              </h2>
              <p className="font-ibm text-gray-400 text-sm leading-relaxed mb-6">
                Оставьте заявку — мы перезвоним и разберём вашу задачу: тип
                объекта, площадь, регион и бюджет. Расчёт получите в течение
                одного рабочего дня.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  {
                    icon: "Phone",
                    text: "8 800 300 65 59 — бесплатно по России",
                  },
                  { icon: "Clock", text: "пн.–пт. с 9:30 до 18:00" },
                  { icon: "Mail", text: "sales.bigbox@evrazsteel.ru" },
                ].map((c) => (
                  <div key={c.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-evraz-red flex items-center justify-center">
                      <Icon name={c.icon} size={14} className="text-white" />
                    </div>
                    <span className="font-ibm text-sm text-gray-300">
                      {c.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://t.me/EvrazBigBox_bot"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 font-ibm text-xs text-gray-400 hover:text-white transition-colors"
                >
                  <Icon name="Send" size={13} className="text-evraz-red" />
                  @EvrazBigBox_bot
                </a>
                <a
                  href="https://wa.me/79692688420"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 font-ibm text-xs text-gray-400 hover:text-white transition-colors"
                >
                  <Icon
                    name="MessageCircle"
                    size={13}
                    className="text-evraz-red"
                  />
                  +7 969 268-84-20
                </a>
              </div>
            </div>

            {/* Форма */}
            <div className="bg-evraz-light p-8">
              <h3 className="font-oswald text-lg text-evraz-dark font-semibold mb-6">
                ОСТАВИТЬ ЗАЯВКУ
              </h3>
              <InlineForm onSuccess={handleSuccess} />
            </div>
          </div>
        </div>
      </section>

      {/* ── ФУТЕР ── */}
      <footer className="bg-evraz-dark border-t border-evraz-charcoal py-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-evraz-red flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white rotate-45" />
                </div>
                <div>
                  <div className="font-oswald font-bold text-white text-lg leading-none tracking-widest">
                    EVRAZ
                  </div>
                  <div className="font-ibm text-xs text-gray-400 tracking-wider uppercase">
                    BigBox
                  </div>
                </div>
              </div>
              <p className="font-ibm text-xs text-gray-400 leading-relaxed mb-3">
                Полнокомплектные здания площадью от 3 000 м²
                <br />
                Работаем во всех регионах России
              </p>
              <a
                href="tel:+78003006559"
                className="font-oswald text-xl text-white hover:text-evraz-red transition-colors block mb-1"
              >
                8 800 300 65 59
              </a>
              <p className="font-ibm text-xs text-gray-500">
                пн.–пт. с 9:30 до 18:00
              </p>
              <button
                onClick={() => setActiveForm("callback")}
                className="mt-3 font-ibm text-xs text-evraz-red hover:text-white transition-colors underline"
              >
                Закажите звонок
              </button>
              <div className="mt-4 space-y-2">
                {[
                  {
                    href: "https://t.me/EvrazBigBox_bot",
                    icon: "Send",
                    label: "@EvrazBigBox_bot",
                  },
                  {
                    href: "https://wa.me/79692688420",
                    icon: "MessageCircle",
                    label: "+7 969 268-84-20",
                  },
                  {
                    href: "mailto:sales.bigbox@evrazsteel.ru",
                    icon: "Mail",
                    label: "sales.bigbox@evrazsteel.ru",
                  },
                ].map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 font-ibm text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <Icon name={c.icon} size={13} className="text-evraz-red" />
                    {c.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-oswald text-xs text-gray-400 uppercase tracking-widest mb-4">
                Навигация
              </h5>
              <ul className="space-y-2">
                {NAV_LINKS.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => scrollTo(l.href)}
                      className="font-ibm text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-oswald text-xs text-gray-400 uppercase tracking-widest mb-4">
                Документы
              </h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="font-ibm text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Политика конфиденциальности
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-ibm text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Согласие на обработку персональных данных
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-evraz-charcoal pt-6">
            <p className="font-ibm text-xs text-gray-500">
              © {new Date().getFullYear()} EVRAZ Steel Box. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Встроенная форма ─────────────────────────────────────────────────────────

function InlineForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSuccess();
      }}
      className="space-y-4"
    >
      {[
        {
          label: "Имя*",
          key: "name",
          type: "text",
          placeholder: "Иван Иванов",
        },
        {
          label: "Телефон*",
          key: "phone",
          type: "tel",
          placeholder: "+7 (___) ___-__-__",
        },
        {
          label: "E-mail*",
          key: "email",
          type: "email",
          placeholder: "ivan@company.ru",
        },
      ].map((f) => (
        <div key={f.key}>
          <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-1.5">
            {f.label}
          </label>
          <input
            required
            type={f.type}
            value={form[f.key as keyof typeof form]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            placeholder={f.placeholder}
            className="w-full bg-white border border-evraz-border px-4 py-3 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red"
          />
        </div>
      ))}
      <div>
        <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-1.5">
          Задайте вопрос
        </label>
        <textarea
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Площадь, назначение, регион, сроки..."
          className="w-full bg-white border border-evraz-border px-4 py-3 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-evraz-red text-white font-oswald text-sm tracking-widest uppercase py-4 hover:bg-red-700 transition-colors"
      >
        ЗАПРОСИТЬ РАСЧЁТ СТОИМОСТИ
      </button>
      <p className="font-ibm text-xs text-evraz-gray text-center">
        Нажимая кнопку, вы соглашаетесь с{" "}
        <a href="#" className="underline hover:text-evraz-dark">
          политикой конфиденциальности
        </a>
      </p>
    </form>
  );
}
