import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

// ─── Данные кейсов ───────────────────────────────────────────────────────────

const CASES = [
  {
    id: 1,
    title: "Многофункциональный производственный комплекс",
    region: "ВОРОНЕЖСКАЯ ОБЛАСТЬ",
    tag: "ОПАСНОЕ ПРОИЗВОДСТВО",
    area: "45 000 м²",
    img: "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/files/84b93629-ff79-4c10-b284-fe9f7a217627.jpg",
  },
  {
    id: 2,
    title: "Производственное предприятие",
    region: "ВОРОНЕЖСКАЯ ОБЛАСТЬ",
    tag: "ПИЩЕВАЯ ПРОМЫШЛЕННОСТЬ",
    area: "25 200 м²",
    img: "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/files/43b391f4-82b0-463d-926b-e85530282b5a.jpg",
  },
];

// ─── Типы форм ───────────────────────────────────────────────────────────────

type FormType = "callback" | "catalog" | null;

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const EMPTY_FORM: FormData = { name: "", phone: "", email: "", message: "" };

// ─── Навигация ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Главная", href: "#hero" },
  { label: "Реализованные проекты", href: "#cases" },
  { label: "Изготовление", href: "#how" },
  { label: "Доставка", href: "#trust" },
  { label: "Монтаж", href: "#challenge" },
  { label: "О нас", href: "#cta" },
];

// ─── Компонент формы ─────────────────────────────────────────────────────────

function LeadForm({
  type,
  onClose,
  onSuccess,
}: {
  type: FormType;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const isCatalog = type === "catalog";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-evraz-gray hover:text-evraz-dark transition-colors"
        >
          <Icon name="X" size={20} />
        </button>
        <div className="bg-evraz-dark p-6">
          <h3 className="font-oswald text-xl text-white font-semibold">
            {isCatalog ? "ПОЛУЧИТЬ КАТАЛОГ" : "ЗАПРОСИТЬ РАСЧЁТ СТОИМОСТИ"}
          </h3>
          <p className="font-ibm text-xs text-gray-400 mt-2 leading-relaxed">
            {isCatalog
              ? "Заполните форму, чтобы получить каталог конструкционных решений и оценить возможные варианты оптимизации проекта"
              : "Введите свои данные, мы перезвоним и проконсультируем по проектированию здания для вашего бизнеса и условий вашего региона"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-1.5">
              Имя*
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Иван Иванов"
              className="w-full bg-evraz-light border border-evraz-border px-4 py-3 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red"
            />
          </div>
          <div>
            <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-1.5">
              Телефон*
            </label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+7 (___) ___-__-__"
              className="w-full bg-evraz-light border border-evraz-border px-4 py-3 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red"
            />
          </div>
          <div>
            <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-1.5">
              E-mail*
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="ivan@company.ru"
              className="w-full bg-evraz-light border border-evraz-border px-4 py-3 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red"
            />
          </div>
          <div>
            <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-1.5">
              {isCatalog ? "Получить каталог" : "Задайте ваш вопрос"}
            </label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder={
                isCatalog
                  ? "Укажите тип объекта или задайте вопрос..."
                  : "Площадь, назначение, регион..."
              }
              className="w-full bg-evraz-light border border-evraz-border px-4 py-3 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-evraz-red text-white font-oswald text-sm tracking-widest uppercase py-4 hover:bg-red-700 transition-colors"
          >
            {isCatalog ? "ПОЛУЧИТЬ КАТАЛОГ" : "ЗАПРОСИТЬ РАСЧЁТ СТОИМОСТИ"}
          </button>
          <p className="font-ibm text-xs text-evraz-gray text-center leading-relaxed">
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

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function BigBox() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const openForm = (type: FormType) => setActiveForm(type);
  const closeForm = () => setActiveForm(null);
  const handleSuccess = () => {
    closeForm();
    navigate("/bigbox/thanks");
  };

  return (
    <div className="min-h-screen bg-white font-ibm">
      {/* ── МОДАЛЬНАЯ ФОРМА ── */}
      {activeForm && (
        <LeadForm type={activeForm} onClose={closeForm} onSuccess={handleSuccess} />
      )}

      {/* ── ХЕДЕР ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-evraz-dark shadow-xl" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto py-4 flex items-center justify-between">
          {/* Лого */}
          <button onClick={() => navigate("/")} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-evraz-red flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rotate-45" />
            </div>
            <div className="text-left">
              <div className="font-oswald font-bold text-white text-lg leading-none tracking-widest">
                EVRAZ
              </div>
              <div className="font-ibm text-xs text-gray-400 tracking-wider uppercase">
                BigBox
              </div>
            </div>
          </button>

          {/* Навигация десктоп */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => scrollTo(l.href.slice(1))}
                className="font-ibm text-xs text-gray-300 hover:text-white transition-colors uppercase tracking-wider"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Телефон + CTA */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+78003006559"
              className="hidden md:block font-oswald text-white text-sm tracking-wider hover:text-evraz-red transition-colors"
            >
              8 800 300 65 59
            </a>
            <button
              onClick={() => openForm("callback")}
              className="bg-evraz-red text-white font-oswald text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-red-700 transition-colors hidden sm:block"
            >
              Запросить расчёт
            </button>
            {/* Бургер */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-white"
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {menuOpen && (
          <div className="lg:hidden bg-evraz-dark border-t border-evraz-charcoal px-6 py-4 space-y-3">
            {NAV_LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => scrollTo(l.href.slice(1))}
                className="block w-full text-left font-ibm text-sm text-gray-300 hover:text-white py-1.5 uppercase tracking-wider"
              >
                {l.label}
              </button>
            ))}
            <div className="pt-3 border-t border-evraz-charcoal">
              <a href="tel:+78003006559" className="block font-oswald text-white text-base mb-3">
                8 800 300 65 59
              </a>
              <button
                onClick={() => openForm("callback")}
                className="w-full bg-evraz-red text-white font-oswald text-xs tracking-widest uppercase px-5 py-3"
              >
                Запросить расчёт
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── ЭКРАН 0: ШАПКА-КОНТАКТЫ ── */}
      <section id="hero" className="bg-evraz-dark pt-32 pb-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="font-ibm text-xs text-gray-400 uppercase tracking-widest mb-2">
                Быстровозводимые здания площадью от 3 000 м²
              </p>
              <a
                href="tel:+78003006559"
                className="font-oswald text-3xl md:text-4xl text-white font-bold tracking-wider hover:text-evraz-red transition-colors block"
              >
                8 800 300 65 59
              </a>
              <p className="font-ibm text-xs text-gray-400 mt-1">
                пн.–пт. с 9:30 до 18:00 &nbsp;/&nbsp; Звоните, мы сейчас на связи
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => openForm("callback")}
                className="bg-evraz-red text-white font-oswald text-xs tracking-widest uppercase px-6 py-3 hover:bg-red-700 transition-colors w-fit"
              >
                Закажите звонок
              </button>
              <p className="font-ibm text-xs text-gray-400 font-medium">
                Задайте вопрос онлайн:
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://t.me/EvrazBigBox_bot"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 font-ibm text-xs text-gray-300 hover:text-white transition-colors"
                >
                  <Icon name="Send" size={14} className="text-evraz-red" />
                  @EvrazBigBox_bot
                </a>
                <a
                  href="https://wa.me/79692688420"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 font-ibm text-xs text-gray-300 hover:text-white transition-colors"
                >
                  <Icon name="MessageCircle" size={14} className="text-evraz-red" />
                  +7 969 268-84-20
                </a>
                <a
                  href="mailto:sales.bigbox@evrazsteel.ru"
                  className="flex items-center gap-2 font-ibm text-xs text-gray-300 hover:text-white transition-colors"
                >
                  <Icon name="Mail" size={14} className="text-evraz-red" />
                  sales.bigbox@evrazsteel.ru
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ЭКРАН 1: ОФФЕР ── */}
      <section className="bg-evraz-dark relative overflow-hidden pb-20 md:pb-28">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-evraz-red" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)",
          }}
        />
        <div className="container mx-auto relative z-10 pt-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-0.5 bg-evraz-red" />
              <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">
                BIG BOX — Индивидуальный проект
              </span>
            </div>
            <h1 className="font-oswald text-4xl md:text-6xl text-white font-bold mb-6 leading-tight">
              ПРОМЫШЛЕННЫЕ И СКЛАДСКИЕ
              <br />
              <span className="text-evraz-red">ЗДАНИЯ ПОД КЛЮЧ</span>
            </h1>
            <p className="font-ibm text-gray-300 text-base leading-relaxed mb-4 max-w-2xl">
              С гарантией сроков и фиксированной ценой. Решение BIG BOX: генеральное
              проектирование и комплексный договор на поставку и монтаж. Стальные конструкции
              собственного производства — полный контроль основного этапа строительства.
            </p>

            {/* Для кого */}
            <div className="bg-white/5 border border-white/10 p-5 mb-8 max-w-xl">
              <p className="font-oswald text-xs text-evraz-red uppercase tracking-widest mb-3">
                Для предприятий, где критично:
              </p>
              <ul className="space-y-2">
                {[
                  "Запустить производство в срок",
                  "Избежать переделок проекта",
                  "Зафиксировать бюджет до начала строительства",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Icon name="MapPin" size={13} className="text-evraz-red mt-0.5 shrink-0" />
                    <span className="font-ibm text-sm text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => openForm("callback")}
              className="bg-evraz-red text-white font-oswald text-sm tracking-widest uppercase px-8 py-4 hover:bg-red-700 transition-colors"
            >
              Получить расчёт стоимости под ваш проект
            </button>
          </div>
        </div>
      </section>

      {/* ── ЭКРАН 2: КЕЙСЫ ── */}
      <section id="cases" className="py-16 bg-evraz-light">
        <div className="container mx-auto">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-0.5 bg-evraz-red" />
              <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">
                Портфолио
              </span>
            </div>
            <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold">
              РЕАЛИЗОВАННЫЕ ПРОИЗВОДСТВЕННЫЕ ОБЪЕКТЫ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CASES.map((c) => (
              <div key={c.id} className="group bg-white border border-evraz-border overflow-hidden">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-4 left-4 bg-evraz-red text-white font-oswald text-xs tracking-widest uppercase px-3 py-1">
                    {c.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-oswald text-xl text-evraz-dark font-semibold mb-3 leading-snug">
                    {c.title}
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={13} className="text-evraz-red" />
                      <span className="font-ibm text-xs text-evraz-gray uppercase tracking-wider">
                        {c.region}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Square" size={13} className="text-evraz-red" />
                      <span className="font-ibm text-xs text-evraz-dark font-medium">
                        Площадь: {c.area}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЭКРАН 3: СИТУАЦИЯ ПОКУПКИ ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-0.5 bg-evraz-red" />
                <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">
                  Когда это нужно
                </span>
              </div>
              <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold mb-6 leading-tight">
                КОГДА ПОЛНОКОМПЛЕКТНОЕ ЗДАНИЕ —<br />
                <span className="text-evraz-red">ОПТИМАЛЬНОЕ РЕШЕНИЕ</span>
              </h2>
              <p className="font-ibm text-evraz-gray text-sm mb-6 leading-relaxed">
                Для производственного объекта, когда важна точность, скорость и единая ответственность:
              </p>
              <ul className="space-y-3">
                {[
                  "Запуск нового производства в кратчайшие сроки",
                  "Перенос или масштабирование мощностей",
                  "Модернизация с заменой технологии",
                  "Строительство под конкретную производственную линию",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-evraz-red flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name="Check" size={12} className="text-white" />
                    </div>
                    <span className="font-ibm text-sm text-evraz-dark leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "Factory", label: "Производство", desc: "Заводы, цеха, производственные линии" },
                { icon: "Warehouse", label: "Логистика", desc: "Распределительные центры, склады класса А" },
                { icon: "Zap", label: "Энергетика", desc: "Машинные залы, трансформаторные подстанции" },
                { icon: "Tractor", label: "Агропром", desc: "Элеваторы, зернохранилища, животноводство" },
              ].map((s) => (
                <div key={s.label} className="bg-evraz-light border border-evraz-border p-5">
                  <div className="w-10 h-10 bg-evraz-dark flex items-center justify-center mb-3">
                    <Icon name={s.icon} size={18} className="text-white" />
                  </div>
                  <h4 className="font-oswald text-sm text-evraz-dark font-semibold mb-1">{s.label}</h4>
                  <p className="font-ibm text-xs text-evraz-gray leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ЭКРАН 4: ЧЕЛЛЕНДЖЕР ── */}
      <section id="challenge" className="py-16 bg-evraz-dark relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-evraz-red" />
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
              Риски традиционного подхода
            </span>
          </div>
          <h2 className="font-oswald text-3xl md:text-4xl text-white font-semibold mb-10 leading-tight">
            ЧТО МОЖЕТ ПОЙТИ
            <br />
            <span className="text-evraz-red">НЕ ТАК</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Проблемы */}
            <div>
              <p className="font-oswald text-xs text-gray-400 uppercase tracking-widest mb-5">
                Типичные проблемы
              </p>
              <div className="space-y-3">
                {[
                  "Участвуют 5–10 разных подрядчиков",
                  "Сложные согласования между участниками",
                  "Проектирование, поставка и строительство не связаны в одну систему",
                  "Ответственность размыта между участниками",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-red-900/60 border border-red-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name="X" size={10} className="text-red-400" />
                    </div>
                    <span className="font-ibm text-sm text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="font-oswald text-xs text-gray-400 uppercase tracking-widest mb-4">
                  В результате:
                </p>
                <div className="space-y-2">
                  {[
                    "Решения пересматриваются уже в процессе",
                    "Сроки сдвигаются из-за несогласованности",
                    "Бюджет растёт из-за переделок и изменений",
                    "Проект теряет управляемость",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <Icon name="AlertTriangle" size={13} className="text-yellow-500 mt-0.5 shrink-0" />
                      <span className="font-ibm text-xs text-gray-400 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Решение */}
            <div className="bg-evraz-red/10 border border-evraz-red/30 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-evraz-red flex items-center justify-center">
                  <Icon name="ShieldCheck" size={16} className="text-white" />
                </div>
                <p className="font-oswald text-sm text-white uppercase tracking-widest">
                  Как это решено в EVRAZ STEEL BOX
                </p>
              </div>
              <p className="font-ibm text-sm text-gray-300 mb-5 leading-relaxed">
                Мы выстраиваем проект как единую систему с самого начала.
              </p>
              <div className="space-y-3">
                {[
                  "3-сторонний договор: единая команда от проектирования до реализации",
                  "Цена и сроки фиксируются до старта реализации проекта",
                  "Проектирование учитывает реальные ограничения площадки и задачи производства",
                  "Одна зона ответственности за результат",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-evraz-red flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name="Check" size={10} className="text-white" />
                    </div>
                    <span className="font-ibm text-sm text-white leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-evraz-red/30">
                <p className="font-oswald text-base text-white font-semibold">
                  Управляйте предсказуемым результатом!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ЭКРАН 5: КАК МЫ РАБОТАЕМ ── */}
      <section id="how" className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">
              Процесс
            </span>
          </div>
          <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold mb-2 leading-tight">
            УМНЫЙ ПОДХОД К СТРОИТЕЛЬСТВУ
          </h2>
          <p className="font-ibm text-evraz-gray text-sm mb-10 max-w-xl">
            Маршрут, который позволяет контролировать проект от идеи до ввода объекта в эксплуатацию.
          </p>

          <div className="max-w-4xl">
            {[
              {
                num: "01",
                icon: "Lightbulb",
                title: "Техническое задание",
                desc: "Изучаем задачу производства, особенности площадки и технологические требования. Формируем ТЗ с учётом всех ограничений.",
                duration: "1–3 дня",
              },
              {
                num: "02",
                icon: "FileText",
                title: "Проектирование",
                desc: "Разрабатываем рабочую документацию по ГОСТ. Согласовываем планировочные и конструктивные решения с заказчиком.",
                duration: "2–4 недели",
              },
              {
                num: "03",
                icon: "Factory",
                title: "Производство конструкций",
                desc: "Изготавливаем металлоконструкции на собственных заводах EVRAZ. Пооперационный контроль качества, маркировка каждого элемента.",
                duration: "4–8 недель",
              },
              {
                num: "04",
                icon: "Truck",
                title: "Логистика и доставка",
                desc: "Поставляем конструкции на площадку по согласованному графику. Контроль целостности при транспортировке.",
                duration: "По графику",
              },
              {
                num: "05",
                icon: "HardHat",
                title: "Монтаж и сдача",
                desc: "Монтаж аккредитованной бригадой с поэтапной приёмкой. Передаём исполнительную документацию и гарантийное письмо.",
                duration: "6–16 недель",
              },
            ].map((s, i, arr) => (
              <div key={s.num} className="flex gap-6 relative">
                {i < arr.length - 1 && (
                  <div className="absolute left-[27px] top-[56px] bottom-0 w-px bg-evraz-border" />
                )}
                <div className="shrink-0">
                  <div className="w-14 h-14 bg-evraz-dark flex items-center justify-center relative z-10">
                    <Icon name={s.icon} size={20} className="text-white" />
                  </div>
                </div>
                <div className={`pb-10 flex-1 ${i === arr.length - 1 ? "pb-0" : ""}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-oswald text-xs text-evraz-border tracking-widest">ЭТАП {s.num}</span>
                    <span className="font-ibm text-xs text-evraz-red font-medium">{s.duration}</span>
                  </div>
                  <h4 className="font-oswald text-lg text-evraz-dark font-semibold mb-2">{s.title}</h4>
                  <p className="font-ibm text-sm text-evraz-gray leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЭКРАН 6: ТЕХНИЧЕСКИЕ РЕШЕНИЯ / CTA КАТАЛОГ ── */}
      <section className="py-16 bg-evraz-light">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">
              Технические решения
            </span>
          </div>
          <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold mb-3 leading-tight">
            КОНСТРУКЦИОННЫЕ РЕШЕНИЯ
            <br />
            <span className="text-evraz-red">ДЛЯ ПОЛНОКОМПЛЕКТНЫХ ЗДАНИЙ</span>
          </h2>
          <p className="font-ibm text-evraz-gray text-sm mb-8 max-w-2xl leading-relaxed">
            Широкий диапазон пролётов без промежуточных опор, различные типы кровли и ограждающих
            конструкций, решения для опасных производств и агрессивных сред. Все конструкции —
            из стали собственного производства EVRAZ.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: "Maximize2", label: "Пролёты", value: "до 100 м" },
              { icon: "ArrowUp", label: "Высота", value: "до 30 м" },
              { icon: "Square", label: "Площадь", value: "от 3 000 м²" },
              { icon: "Shield", label: "Гарантия", value: "25 лет" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-evraz-border p-5 text-center">
                <div className="w-10 h-10 bg-evraz-dark mx-auto flex items-center justify-center mb-3">
                  <Icon name={s.icon} size={18} className="text-white" />
                </div>
                <div className="font-oswald text-xl text-evraz-red font-bold">{s.value}</div>
                <div className="font-ibm text-xs text-evraz-gray uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA каталог */}
          <div className="bg-evraz-dark p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-oswald text-xl text-white font-semibold mb-2">
                Скачайте каталог конструкционных решений
              </h3>
              <p className="font-ibm text-sm text-gray-400">
                Для полнокомплектных зданий EVRAZ STEEL BOX — оценить варианты оптимизации проекта
              </p>
            </div>
            <button
              onClick={() => openForm("catalog")}
              className="shrink-0 bg-evraz-red text-white font-oswald text-sm tracking-widest uppercase px-8 py-4 hover:bg-red-700 transition-colors"
            >
              Скачать каталог
            </button>
          </div>
        </div>
      </section>

      {/* ── ЭКРАН 8: ДОВЕРИЕ ── */}
      <section id="trust" className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-0.5 bg-evraz-red" />
            <span className="font-oswald text-evraz-red text-xs tracking-[0.25em] uppercase">
              О компании
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-evraz-border">
            {[
              { value: "300+", label: "Реализованных проектов" },
              { value: "30+", label: "Партнёрских заводов" },
              { label: "Собственное производство металлоконструкций", value: "✓" },
              { label: "Часть группы EVRAZ", value: "EVRAZ" },
            ].map((s, i) => (
              <div
                key={i}
                className="p-8 text-center border-r border-evraz-border last:border-r-0"
              >
                <div className="font-oswald text-4xl text-evraz-red font-bold mb-2">{s.value}</div>
                <div className="font-ibm text-xs text-evraz-gray uppercase tracking-wider leading-relaxed">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЭКРАН 9: CTA ФОРМА ── */}
      <section id="cta" ref={ctaRef} className="py-16 bg-evraz-dark relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-evraz-red" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)",
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
                Введите свои данные, мы перезвоним и проконсультируем по проектированию здания
                для вашего бизнеса и условий вашего региона.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "Phone", text: "8 800 300 65 59 — бесплатно по России" },
                  { icon: "Clock", text: "пн.–пт. с 9:30 до 18:00" },
                  { icon: "Mail", text: "sales.bigbox@evrazsteel.ru" },
                ].map((c) => (
                  <div key={c.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-evraz-red flex items-center justify-center">
                      <Icon name={c.icon} size={14} className="text-white" />
                    </div>
                    <span className="font-ibm text-sm text-gray-300">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Форма */}
            <div className="bg-evraz-light p-8">
              <h3 className="font-oswald text-lg text-evraz-dark font-semibold mb-6">
                ОСТАВИТЬ ЗАЯВКУ
              </h3>
              <CtaForm onSuccess={handleSuccess} />
            </div>
          </div>
        </div>
      </section>

      {/* ── ФУТЕР ── */}
      <footer className="bg-evraz-dark border-t border-evraz-charcoal py-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Бренд */}
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
              <p className="font-ibm text-xs text-gray-500">пн.–пт. с 9:30 до 18:00</p>
              <button
                onClick={() => openForm("callback")}
                className="mt-3 font-ibm text-xs text-evraz-red hover:text-white transition-colors underline"
              >
                Закажите звонок
              </button>
              <div className="mt-4 space-y-2">
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
                  <Icon name="MessageCircle" size={13} className="text-evraz-red" />
                  +7 969 268-84-20
                </a>
                <a
                  href="mailto:sales.bigbox@evrazsteel.ru"
                  className="flex items-center gap-2 font-ibm text-xs text-gray-400 hover:text-white transition-colors"
                >
                  <Icon name="Mail" size={13} className="text-evraz-red" />
                  sales.bigbox@evrazsteel.ru
                </a>
              </div>
            </div>

            {/* Навигация */}
            <div>
              <h5 className="font-oswald text-xs text-gray-400 uppercase tracking-widest mb-4">
                Навигация
              </h5>
              <ul className="space-y-2">
                {NAV_LINKS.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => scrollTo(l.href.slice(1))}
                      className="font-ibm text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Документы */}
            <div>
              <h5 className="font-oswald text-xs text-gray-400 uppercase tracking-widest mb-4">
                Документы
              </h5>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="font-ibm text-sm text-gray-400 hover:text-white transition-colors">
                    Политика конфиденциальности
                  </a>
                </li>
                <li>
                  <a href="#" className="font-ibm text-sm text-gray-400 hover:text-white transition-colors">
                    Согласие на обработку персональных данных
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-evraz-charcoal pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="font-ibm text-xs text-gray-500">
              © {new Date().getFullYear()} EVRAZ Steel Box. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Встроенная CTA-форма (без модального) ───────────────────────────────────

function CtaForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<FormData>({ name: "", phone: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-1.5">
          Имя*
        </label>
        <input
          required
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Иван Иванов"
          className="w-full bg-white border border-evraz-border px-4 py-3 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red"
        />
      </div>
      <div>
        <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-1.5">
          Телефон*
        </label>
        <input
          required
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+7 (___) ___-__-__"
          className="w-full bg-white border border-evraz-border px-4 py-3 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red"
        />
      </div>
      <div>
        <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-1.5">
          E-mail*
        </label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="ivan@company.ru"
          className="w-full bg-white border border-evraz-border px-4 py-3 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red"
        />
      </div>
      <div>
        <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-1.5">
          Задайте ваш вопрос
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
      <p className="font-ibm text-xs text-evraz-gray text-center leading-relaxed">
        Нажимая кнопку, вы соглашаетесь с{" "}
        <a href="#" className="underline hover:text-evraz-dark">
          политикой конфиденциальности
        </a>
      </p>
    </form>
  );
}
