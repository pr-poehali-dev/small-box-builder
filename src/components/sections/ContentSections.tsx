import { useState } from "react";
import Icon from "@/components/ui/icon";
import { AnimSection } from "@/components/shared/AnimSection";


const CASES = [
  {
    title: "Логистический центр OZON",
    location: "Московская обл., Домодедово",
    area: "48 000 м²",
    year: "2023",
    image: "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/files/5b4508f9-9d77-48fd-8352-9fba826f4269.jpg",
    tag: "Склад",
  },
  {
    title: "Ледовая арена «Металлург»",
    location: "Челябинск",
    area: "12 000 м²",
    year: "2022",
    image: "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/files/9e32b242-943e-4e57-a73b-230740b0ac72.jpg",
    tag: "Спорт",
  },
  {
    title: "Производственный корпус НТМК",
    location: "Нижний Тагил",
    area: "22 500 м²",
    year: "2023",
    image: "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/files/2f1137ee-0472-4df9-ad4a-581bcc729974.jpg",
    tag: "Производство",
  },
];

const ADVANTAGES = [
  { icon: "Shield", title: "Гарантия 25 лет", desc: "На несущие конструкции из стали EVRAZ" },
  { icon: "Zap", title: "Скорость монтажа", desc: "В 3–4 раза быстрее традиционного строительства" },
  { icon: "Award", title: "Сталь EVRAZ", desc: "Собственное производство стали высшего качества" },
  { icon: "FileCheck", title: "Проектирование", desc: "Полный цикл от концепции до ввода в эксплуатацию" },
  { icon: "Wrench", title: "Техподдержка", desc: "Сервисное обслуживание по всей России и СНГ" },
  { icon: "Globe", title: "Сеть партнёров", desc: "Более 120 аккредитованных исполнителей в 45 регионах" },
];

const PARTNERS = [
  { name: "СтальСтрой", region: "Москва и МО", projects: 48, rating: 5 },
  { name: "УралМеталлМонтаж", region: "Урал, Сибирь", projects: 62, rating: 5 },
  { name: "СибирьСталь", region: "Новосибирск, Красноярск", projects: 35, rating: 4 },
  { name: "ЮгМонтаж", region: "Краснодар, Ростов", projects: 29, rating: 5 },
  { name: "ВолгаПром", region: "Поволжье", projects: 41, rating: 4 },
  { name: "СеверСтройПроект", region: "СЗФО", projects: 23, rating: 5 },
];

const BLOG_POSTS = [
  {
    title: "Как выбрать пролёт для производственного здания",
    date: "10 апреля 2026",
    category: "Производство",
    read: "8 мин",
    desc: "Разбираем ключевые факторы при проектировании — технологические требования, нагрузки, перспективы расширения.",
  },
  {
    title: "Сравнение ЛСТК и тяжёлого металлокаркаса",
    date: "2 апреля 2026",
    category: "Технологии",
    read: "12 мин",
    desc: "Когда выгодно использовать лёгкие стальные конструкции, а когда необходим полноценный металлокаркас.",
  },
  {
    title: "Нормативы и экспертиза: что изменилось в 2026 году",
    date: "25 марта 2026",
    category: "Нормативы",
    read: "6 мин",
    desc: "Обзор актуальных изменений в строительном законодательстве, влияющих на проектирование металлических зданий.",
  },
  {
    title: "Агропромышленные объекты: специфика проектирования",
    date: "18 марта 2026",
    category: "Агро",
    read: "10 мин",
    desc: "Требования к коррозионной стойкости, влажности и температурным перепадам в зданиях агросектора.",
  },
];

export function ContentSections({ scrollTo }: { scrollTo: (id: string) => void }) {
  const [width, setWidth] = useState(24);
  const [length, setLength] = useState(48);
  const [height, setHeight] = useState(6);
  const [buildingType, setBuildingType] = useState("warehouse");

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
    return Math.round((area * base * heightCoef) / 1000) * 1000;
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <>
      {/* CASES */}
      <section id="cases" className="py-24 bg-evraz-light">
        <div className="container mx-auto">
          <AnimSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="accent-line" />
                <h2 className="font-oswald text-4xl md:text-5xl text-evraz-dark font-semibold">КЕЙСЫ И ПРОЕКТЫ</h2>
                <p className="font-ibm text-evraz-gray mt-4 max-w-xl text-base leading-relaxed">
                  Реальные объекты, сданные в срок. Более 850 реализованных проектов по всей России и СНГ.
                </p>
              </div>
              <button className="btn-outline-dark self-start md:self-auto">Все проекты</button>
            </div>
          </AnimSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASES.map((c, i) => (
              <AnimSection key={c.title}>
                <div
                  className="steel-card bg-white border border-evraz-border overflow-hidden cursor-pointer group"
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-evraz-dark/30 group-hover:bg-evraz-dark/20 transition-all duration-300" />
                    <span className="absolute top-4 left-4 font-oswald text-xs tracking-widest text-white uppercase bg-evraz-red px-3 py-1">
                      {c.tag}
                    </span>
                    <span className="absolute top-4 right-4 font-oswald text-xs tracking-widest text-white">
                      {c.year}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-oswald text-lg text-evraz-dark font-semibold mb-1">{c.title}</h3>
                    <div className="flex items-center gap-2 text-evraz-gray mb-4">
                      <Icon name="MapPin" size={14} className="text-evraz-red" />
                      <span className="font-ibm text-sm">{c.location}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-evraz-border pt-4">
                      <div>
                        <div className="font-oswald text-evraz-dark font-semibold text-lg">{c.area}</div>
                        <div className="font-ibm text-xs text-evraz-gray">Общая площадь</div>
                      </div>
                      <div className="w-8 h-8 bg-red-50 flex items-center justify-center group-hover:bg-evraz-red transition-colors">
                        <Icon
                          name="ArrowRight"
                          size={16}
                          className="text-evraz-red group-hover:text-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="py-24 bg-evraz-dark relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)",
          }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-evraz-red" />

        <div className="container mx-auto relative z-10">
          <AnimSection>
            <div className="mb-16 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-0.5 bg-evraz-red" />
              </div>
              <h2 className="font-oswald text-4xl md:text-5xl text-white font-semibold">ОНЛАЙН-КАЛЬКУЛЯТОР</h2>
              <p className="font-ibm text-gray-400 mt-4 max-w-xl mx-auto text-base">
                Получите предварительный расчёт стоимости за несколько секунд. Точная смета — после бесплатной
                консультации.
              </p>
            </div>
          </AnimSection>

          <div className="max-w-4xl mx-auto">
            <AnimSection>
              <div className="bg-white/5 border border-white/10 p-8 md:p-12">
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
                        onClick={() => setBuildingType(t.key)}
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

                <div className="bg-evraz-red/10 border border-evraz-red/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <div className="font-ibm text-xs text-gray-400 uppercase tracking-wider mb-1">Площадь здания</div>
                    <div className="font-oswald text-2xl text-white">{(width * length).toLocaleString("ru-RU")} м²</div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="font-ibm text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Ориентировочная стоимость
                    </div>
                    <div className="font-oswald text-4xl text-evraz-red font-bold">{formatPrice(calcPrice())}</div>
                    <div className="font-ibm text-xs text-gray-500 mt-1">*без учёта инженерных сетей и фундамента</div>
                  </div>
                  <button onClick={() => scrollTo("contacts")} className="btn-primary whitespace-nowrap">
                    Получить смету
                  </button>
                </div>
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimSection>
              <div>
                <div className="accent-line" />
                <h2 className="font-oswald text-4xl md:text-5xl text-evraz-dark font-semibold mb-6">О КОМПАНИИ</h2>
                <p className="font-ibm text-evraz-gray mb-6 leading-relaxed">
                  EVRAZ Steel Buildings — ведущий поставщик металлических конструкций для быстровозводимых зданий в
                  России и странах СНГ. Базируемся на производственных мощностях EVRAZ — одного из крупнейших
                  вертикально интегрированных сталелитейных и горнодобывающих предприятий в мире.
                </p>
                <p className="font-ibm text-evraz-gray mb-8 leading-relaxed">
                  Полный производственный цикл от проектирования и изготовления металлоконструкций до монтажа и сдачи
                  объекта под ключ позволяет обеспечить строгий контроль качества на каждом этапе.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    { n: "850+", l: "Объектов" },
                    { n: "45", l: "Регионов" },
                    { n: "120+", l: "Партнёров" },
                    { n: "30 лет", l: "Опыта" },
                  ].map((s) => (
                    <div key={s.l} className="border-l-2 border-evraz-red pl-4">
                      <div className="font-oswald text-3xl text-evraz-dark font-bold">{s.n}</div>
                      <div className="font-ibm text-sm text-evraz-gray mt-1">{s.l}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => scrollTo("contacts")} className="btn-primary">
                  Связаться с нами
                </button>
              </div>
            </AnimSection>

            <AnimSection>
              <div className="grid grid-cols-2 gap-4">
                {ADVANTAGES.map((adv) => (
                  <div key={adv.title} className="steel-card p-6 border border-evraz-border">
                    <div className="w-10 h-10 bg-red-50 flex items-center justify-center mb-4">
                      <Icon name={adv.icon} size={20} className="text-evraz-red" />
                    </div>
                    <h4 className="font-oswald text-base text-evraz-dark font-semibold mb-2">{adv.title}</h4>
                    <p className="font-ibm text-sm text-evraz-gray leading-relaxed">{adv.desc}</p>
                  </div>
                ))}
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partners" className="py-24 bg-evraz-dark">
        <div className="container mx-auto">
          <AnimSection>
            <div className="text-center mb-16">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-0.5 bg-evraz-red" />
              </div>
              <h2 className="font-oswald text-4xl md:text-5xl text-white font-semibold">СЕТЬ ПАРТНЁРОВ</h2>
              <p className="font-ibm text-gray-400 mt-4 max-w-xl mx-auto text-base leading-relaxed">
                Аккредитованные строительные организации, прошедшие обучение и сертификацию EVRAZ. Гарантия качества
                монтажа по всей России.
              </p>
            </div>
          </AnimSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PARTNERS.map((p) => (
              <AnimSection key={p.name}>
                <div className="bg-white/5 border border-white/10 p-6 hover:border-evraz-red/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-oswald text-lg text-white font-semibold">{p.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Icon name="MapPin" size={12} className="text-evraz-red" />
                        <span className="font-ibm text-sm text-gray-400">{p.region}</span>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Icon
                          key={j}
                          name="Star"
                          size={12}
                          className={j < p.rating ? "text-evraz-red" : "text-gray-600"}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                    <span className="font-ibm text-sm text-gray-400">{p.projects} проектов</span>
                    <span className="font-oswald text-xs tracking-widest text-evraz-red uppercase bg-evraz-red/10 px-2 py-1">
                      Аккредитован
                    </span>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>

          <AnimSection>
            <div className="mt-12 border border-evraz-red/30 bg-evraz-red/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-oswald text-2xl text-white font-semibold">Хотите стать партнёром?</h3>
                <p className="font-ibm text-gray-400 mt-2 text-sm">
                  Присоединяйтесь к сети из 120+ аккредитованных исполнителей EVRAZ
                </p>
              </div>
              <button onClick={() => scrollTo("contacts")} className="btn-primary whitespace-nowrap">
                Подать заявку
              </button>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="py-24 bg-evraz-light">
        <div className="container mx-auto">
          <AnimSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="accent-line" />
                <h2 className="font-oswald text-4xl md:text-5xl text-evraz-dark font-semibold">БЛОГ И СТАТЬИ</h2>
                <p className="font-ibm text-evraz-gray mt-4 max-w-xl text-base leading-relaxed">
                  Экспертные материалы по проектированию, строительству и эксплуатации быстровозводимых зданий.
                </p>
              </div>
              <button className="btn-outline-dark self-start md:self-auto">Все статьи</button>
            </div>
          </AnimSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BLOG_POSTS.map((post, i) => (
              <AnimSection key={post.title}>
                <div
                  className="steel-card bg-white border border-evraz-border p-8 cursor-pointer group"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-oswald text-xs tracking-widest text-evraz-red uppercase bg-red-50 px-2 py-1">
                      {post.category}
                    </span>
                    <span className="font-ibm text-xs text-evraz-gray">{post.date}</span>
                    <span className="font-ibm text-xs text-evraz-gray ml-auto flex items-center gap-1">
                      <Icon name="Clock" size={12} /> {post.read}
                    </span>
                  </div>
                  <h3 className="font-oswald text-xl text-evraz-dark font-semibold mb-3 group-hover:text-evraz-red transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-ibm text-evraz-gray text-sm leading-relaxed mb-5">{post.desc}</p>
                  <div className="flex items-center gap-2 text-evraz-red font-oswald text-sm font-medium tracking-wider uppercase">
                    Читать <Icon name="ArrowRight" size={14} />
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <AnimSection>
              <div>
                <div className="accent-line" />
                <h2 className="font-oswald text-4xl md:text-5xl text-evraz-dark font-semibold mb-6">КОНТАКТЫ</h2>
                <p className="font-ibm text-evraz-gray mb-10 leading-relaxed">
                  Оставьте заявку — наш специалист свяжется с вами в течение 2 часов и проконсультирует по любым
                  вопросам проектирования и строительства.
                </p>

                <div className="space-y-6 mb-10">
                  {[
                    { icon: "Phone", label: "Телефон", value: "8 800 123-45-67 (бесплатно)" },
                    { icon: "Mail", label: "Email", value: "info@evraz-buildings.ru" },
                    { icon: "MapPin", label: "Офис", value: "Москва, ул. Дубининская, 21, стр. 1" },
                    { icon: "Clock", label: "Режим работы", value: "Пн–Пт: 9:00–18:00 МСК" },
                  ].map((c) => (
                    <div key={c.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon name={c.icon} size={18} className="text-evraz-red" />
                      </div>
                      <div>
                        <div className="font-ibm text-xs text-evraz-gray uppercase tracking-wider mb-0.5">
                          {c.label}
                        </div>
                        <div className="font-ibm text-evraz-dark font-medium">{c.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimSection>

            <AnimSection>
              <div className="bg-evraz-light border border-evraz-border p-8 md:p-10">
                <h3 className="font-oswald text-2xl text-evraz-dark font-semibold mb-6">ОСТАВИТЬ ЗАЯВКУ</h3>
                <div className="space-y-4">
                  <div>
                    <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-2">
                      Имя и фамилия*
                    </label>
                    <input
                      type="text"
                      placeholder="Иванов Александр"
                      className="w-full bg-white border border-evraz-border px-4 py-3 font-ibm text-evraz-dark text-sm focus:outline-none focus:border-evraz-red transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-2">
                      Компания
                    </label>
                    <input
                      type="text"
                      placeholder="ООО «Ваша компания»"
                      className="w-full bg-white border border-evraz-border px-4 py-3 font-ibm text-evraz-dark text-sm focus:outline-none focus:border-evraz-red transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-2">
                        Телефон*
                      </label>
                      <input
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        className="w-full bg-white border border-evraz-border px-4 py-3 font-ibm text-evraz-dark text-sm focus:outline-none focus:border-evraz-red transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="mail@company.ru"
                        className="w-full bg-white border border-evraz-border px-4 py-3 font-ibm text-evraz-dark text-sm focus:outline-none focus:border-evraz-red transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-2">
                      Тип объекта
                    </label>
                    <select className="w-full bg-white border border-evraz-border px-4 py-3 font-ibm text-evraz-dark text-sm focus:outline-none focus:border-evraz-red transition-colors appearance-none">
                      <option>Складской комплекс</option>
                      <option>Производственный корпус</option>
                      <option>Торговый центр</option>
                      <option>Агропромышленный объект</option>
                      <option>Спортивное сооружение</option>
                      <option>Другое</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-2">
                      Описание проекта
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Опишите ваш проект: площадь, регион, требования..."
                      className="w-full bg-white border border-evraz-border px-4 py-3 font-ibm text-evraz-dark text-sm focus:outline-none focus:border-evraz-red transition-colors resize-none"
                    />
                  </div>
                  <button className="btn-primary w-full text-center">Отправить заявку</button>
                  <p className="font-ibm text-xs text-evraz-gray text-center leading-relaxed">
                    Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
                  </p>
                </div>
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-evraz-dark border-t border-white/10 py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-evraz-red flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white rotate-45" />
                </div>
                <div>
                  <div className="font-oswald font-bold text-white text-lg leading-none tracking-widest">EVRAZ</div>
                  <div className="font-ibm text-xs text-gray-400 tracking-wider uppercase">Steel Buildings</div>
                </div>
              </div>
              <p className="font-ibm text-sm text-gray-400 leading-relaxed">
                Быстровозводимые стальные здания. Сталь EVRAZ — надёжность, проверенная временем.
              </p>
            </div>

            {[
              {
                title: "Решения",
                items: ["Склады и логистика", "Производство", "Торговые центры", "Агро объекты", "Спорт сооружения"],
              },
              {
                title: "Компания",
                items: ["О компании", "Кейсы", "Партнёры", "Блог", "Гарантии"],
              },
              {
                title: "Контакты",
                items: ["8 800 123-45-67", "info@evraz-buildings.ru", "Москва, Дубининская 21", "Пн–Пт 9:00–18:00"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h5 className="font-oswald text-sm tracking-widest text-gray-300 uppercase mb-4">{col.title}</h5>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item}>
                      <span className="font-ibm text-sm text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-ibm text-xs text-gray-600">© 2026 EVRAZ Steel Buildings. Все права защищены.</p>
            <div className="flex gap-6">
              <span className="font-ibm text-xs text-gray-600 hover:text-gray-400 cursor-pointer transition-colors">
                Политика конфиденциальности
              </span>
              <span className="font-ibm text-xs text-gray-600 hover:text-gray-400 cursor-pointer transition-colors">
                Пользовательское соглашение
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}