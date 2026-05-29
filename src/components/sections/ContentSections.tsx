import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { AnimSection } from "@/components/shared/AnimSection";

type CaseCategory = "Серийные здания" | "Индивидуальные проекты" | "Парковки";

const CASES: {
  title: string;
  location: string;
  area: string;
  year: string;
  image: string;
  tag: string;
  dims: { width: string; length: string; height: string };
  partner: string;
  review: string | null;
  category: CaseCategory;
}[] = [
  {
    title: "Производство очистных систем",
    location: "Московская обл., Домодедово",
    area: "24 833 м²",
    year: "2025",
    image:
      "https://evrazsteelbox.ru/upload/iblock/d64/we3s93is5c5pfquynm5j88josbj50poj.jpg",
    tag: "Производство",
    dims: { width: "54 м", length: "100 м", height: "10,3 м" },
    partner: "СтальСтрой",
    review: "https://ozon.ru",
    category: "Индивидуальные проекты",
  },
  {
    title: "Торговый центр",
    location: "ЯНАО, г. Надым",
    area: "1 440 м²",
    year: "2026",
    image:
      "https://evrazsteelbox.ru/upload/iblock/002/n6azi9qr6xbitzth4po2353gykbamus9.jpg",
    tag: "Торговый центр",
    dims: { width: "24 м", length: "60 м", height: "5 м" },
    partner: "УралМеталлМонтаж",
    review: "https://metallurg.ru",
    category: "Серийные здания",
  },
  {
    title: "Склад спортивного питания",
    location: "г. Смоленск",
    area: "864 м²",
    year: "2025",
    image:
      "https://evrazsteelbox.ru/upload/iblock/c33/94695mb2p801sfk2s3pad4y31dms9k20.png",
    tag: "Склад",
    dims: { width: "24 м", length: "36 м", height: "6 м" },
    partner: "СибирьСталь",
    review: null,
    category: "Серийные здания",
  },
  {
    title: "Логистический комплекс",
    location: "Тульская обл., Узловая",
    area: "12 600 м²",
    year: "2025",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/files/34ba11a3-b1fe-4f66-89ea-dd01b3d5386a.jpg",
    tag: "Склад",
    dims: { width: "42 м", length: "300 м", height: "12 м" },
    partner: "ТехноСтальМонтаж",
    review: null,
    category: "Серийные здания",
  },
  {
    title: "Многоуровневый паркинг ЖК",
    location: "г. Екатеринбург",
    area: "8 200 м²",
    year: "2026",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/files/b0ec478d-e1b7-4efa-9b5e-73c039061c72.jpg",
    tag: "Паркинг",
    dims: { width: "36 м", length: "82 м", height: "14 м" },
    partner: "УралСтройГрупп",
    review: null,
    category: "Парковки",
  },
  {
    title: "Цех металлоконструкций",
    location: "г. Челябинск",
    area: "18 400 м²",
    year: "2024",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/files/70650cd9-92ae-4db5-afef-df9bd475ee3f.jpg",
    tag: "Производство",
    dims: { width: "60 м", length: "180 м", height: "14 м" },
    partner: "МеталлСтройПроект",
    review: null,
    category: "Индивидуальные проекты",
  },
];

const ADVANTAGES = [
  {
    icon: "Shield",
    title: "Фиксированная цена",
    desc: "Мы фиксируем цены до 90 дней",
  },
  {
    icon: "Zap",
    title: "Скорость монтажа",
    desc: "В 3–4 раза быстрее традиционного строительства",
  },
  {
    icon: "Award",
    title: "Сталь EVRAZ",
    desc: "Собственное производство стали высшего качества",
  },
  {
    icon: "FileCheck",
    title: "Проектирование",
    desc: "Полный цикл от концепции до ввода в эксплуатацию",
  },
  {
    icon: "Globe",
    title: "Сеть партнёров",
    desc: "Более 180 аккредитованных исполнителей в 45 регионах",
  },
];

export const PARTNERS = [
  {
    slug: "stalstroy",
    name: "СтальСтрой",
    region: "Москва и МО",
    projects: 48,
    services: ["Монтаж", "Проектирование"],
    review: {
      text: "Сдали объект на 2 недели раньше срока. Качество монтажа — без нареканий.",
      fullText:
        "Сдали объект на 2 недели раньше срока. Качество монтажа — без нареканий. Работаем с командой EVRAZ STEEL BOX уже пять лет, и каждый раз убеждаемся: документация чёткая, комплект поставки приходит в срок, монтажные карты исчерпывающие. Из 48 реализованных объектов ни один не вышел за рамки сметы.",
      author: "Алексей К., директор ООО «ЛогоПарк»",
    },
  },
  {
    slug: "uralmontazh",
    name: "УралМеталлМонтаж",
    region: "Урал, Сибирь",
    projects: 62,
    services: ["Монтаж"],
    review: {
      text: "Работаем с ними на трёх объектах подряд. Надёжная команда, чёткое соблюдение смет.",
      fullText:
        "Работаем с ними на трёх объектах подряд. Надёжная команда, чёткое соблюдение смет. На двух объектах в Екатеринбурге и одном в Тюмени мы уложились в сроки, хотя зима была ранняя. Металлоконструкции идут без брака — это важно, когда монтируешь в мороз.",
      author: "Игорь Р., технический директор НТМК",
    },
  },
  {
    slug: "sibirstal",
    name: "СибирьСталь",
    region: "Новосибирск, Красноярск",
    projects: 35,
    services: ["Монтаж", "Проектирование"],
    review: {
      text: "Профессиональный подход к проекту, грамотная проектная документация.",
      fullText:
        "Профессиональный подход к проекту, грамотная проектная документация. EVRAZ STEEL BOX — один из немногих поставщиков, у которых документация реально соответствует тому, что приходит на объект. Качество антикоррозийного покрытия — через два года после монтажа замечаний нет.",
      author: "Светлана М., АгроХолдинг «Восток»",
    },
  },
  {
    slug: "yugmontazh",
    name: "ЮгМонтаж",
    region: "Краснодар, Ростов",
    projects: 29,
    services: ["Монтаж"],
    review: {
      text: "Быстро развернули бригаду, уложились в 28 дней под ключ.",
      fullText:
        "EVRAZ STEEL BOX обеспечил отгрузку комплекта за 12 дней с момента подписания договора, мы развернули бригаду из 14 человек и уложились в 28 дней вместо запланированных 35. Качество узлов — без нареканий, всё собирается по инструкции без подгонки.",
      author: "Дмитрий П., ИП Павлов",
    },
  },
  {
    slug: "volgaprom",
    name: "ВолгаПром",
    region: "Поволжье",
    projects: 41,
    services: ["Монтаж", "Проектирование"],
    review: {
      text: "Сотрудничаем с EVRAZ STEEL BOX уже четвёртый год.",
      fullText:
        "За это время реализовали 41 объект в Поволжье — от небольших складов до производственных цехов с мостовыми кранами. Чёткая логистика комплектов и постоянная поддержка технического отдела делают работу предсказуемой и без сюрпризов.",
      author: "Артём Д., генеральный директор ВолгаПром",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  },
  {
    slug: "severstroy",
    name: "СеверСтройПроект",
    region: "СЗФО",
    projects: 23,
    services: ["Проектирование"],
    review: {
      text: "Разработали проект с учётом северных снеговых нагрузок — всё соответствует нормативам.",
      fullText:
        "EVRAZ STEEL BOX предоставил усиленный вариант каркаса без доплаты — это было предусмотрено в базовой комплектации для данного региона. Проектная документация прошла экспертизу с первого раза.",
      author: "Николай В., «Северлес»",
    },
  },
  {
    slug: "dalstroy",
    name: "ДальСтройМонтаж",
    region: "Хабаровск, Владивосток",
    projects: 17,
    services: ["Монтаж"],
    review: {
      text: "Работаем на Дальнем Востоке — логистика сложная, но EVRAZ всегда выдерживает сроки.",
      fullText:
        "Работаем на Дальнем Востоке — логистика сложная, но EVRAZ STEEL BOX всегда выдерживает сроки поставки. Собрали три объекта во Владивостоке и два в Хабаровском крае. Комплект приходит полным, без недостачи.",
      author: "Василий Н., ДальСтройМонтаж",
    },
  },
  {
    slug: "kazanpromstroy",
    name: "КазаньПромСтрой",
    region: "Татарстан, Башкирия",
    projects: 33,
    services: ["Монтаж", "Проектирование"],
    review: {
      text: "Реализовали 33 объекта за три года, ни одного срыва сроков.",
      fullText:
        "Реализовали 33 объекта за три года — производственные цеха, склады, торговые павильоны. Ни одного срыва сроков по вине поставщика. EVRAZ STEEL BOX — наш ключевой партнёр по металлоконструкциям.",
      author: "Рустам Г., КазаньПромСтрой",
    },
  },
  {
    slug: "omskmetall",
    name: "ОмскМеталл",
    region: "Омск, Тюмень",
    projects: 26,
    services: ["Монтаж"],
    review: {
      text: "Качественные конструкции и чёткая документация — с такими поставщиками работать одно удовольствие.",
      fullText:
        "Монтируем объекты в Западной Сибири уже три года. Качественные конструкции и чёткая документация — с такими поставщиками работать легко. Особо ценим техническую поддержку при нестандартных узлах.",
      author: "Сергей Л., ОмскМеталл",
    },
  },
];

const BLOG_POSTS = [
  {
    title:
      "Кровля, которая не боится сибирской зимы: как построили центр для лыжников у подножия горы Туманной",
    date: "16 апреля 2026",
    category: "Технологии",
    read: "5 мин",
    desc: "Разбираем, почему застройщик и проектировщики выбрали фальцевую систему EVRAZ STEEL BOX и как это экономит деньги в долгосрочной перспективе.",
  },
  {
    title: "Стоимость проектирования зданий: от чего зависит и как уменьшить",
    date: "19 марта 2026",
    category: "Технологии",
    read: "12 мин",
    desc: "Качество проектной документации определяет сроки, бюджет и надежность будущего здания. В статье подробно разберем, из чего формируется стоимость проектирования и как снизить затраты, сохранив высокое качество.",
  },
  {
    title:
      "Пищевое производство: зарабатывая на полке, не потеряйте деньги на складе",
    date: "18 февраля 2026",
    category: "Интервью",
    read: "6 мин",
    desc: "Пока внимание участников рынка приковано к дегустациям и новинкам на «ПРОДЭКСПО», реальная маржа все чаще прячется в логистике и эффективности хранения. В рамках деловой программы эксперты обсудили, как собственнику бизнеса не закопать бюджет в бетон и металл при строительстве складов.",
  },
  {
    title: "Ускорение проектирования за счёт стандартизации и технологий",
    date: "10 февраля 2026",
    category: "Новость",
    read: "3 мин",
    desc: "Рассказываем о нашей новой технологической платформе BOX EXPRESS",
  },
];

function PartnersSection({ onContact }: { onContact: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const CARD_WIDTH = 320 + 16; // width + gap

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "right" ? CARD_WIDTH * 2 : -CARD_WIDTH * 2,
      behavior: "smooth",
    });
  };

  return (
    <section id="partners" className="py-24 bg-evraz-light">
      <div className="container mx-auto">
        <AnimSection>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex justify-center mb-4 justify-start">
                <div className="w-12 h-0.5 bg-evraz-red" />
              </div>
              <h2 className="font-oswald text-4xl md:text-5xl text-evraz-dark font-semibold">
                СЕТЬ ПАРТНЁРОВ
              </h2>
              <p className="font-ibm text-evraz-gray mt-4 max-w-xl text-base leading-relaxed">
                Аккредитованные строительные и проектные организации Гарантия
                качества монтажа по всей России.
              </p>
            </div>
            {/* Стрелки */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 border border-evraz-border bg-white flex items-center justify-center hover:border-evraz-red hover:text-evraz-red transition-all"
              >
                <Icon name="ChevronLeft" size={18} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 border border-evraz-border bg-white flex items-center justify-center hover:border-evraz-red hover:text-evraz-red transition-all"
              >
                <Icon name="ChevronRight" size={18} />
              </button>
            </div>
          </div>
        </AnimSection>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="bg-white border border-evraz-border p-6 hover:border-evraz-red/40 transition-all duration-300 flex flex-col flex-shrink-0"
              style={{ width: "320px", scrollSnapAlign: "start" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-oswald text-lg text-evraz-dark font-semibold">
                    {p.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Icon
                      name="MapPin"
                      size={12}
                      className="text-evraz-steel"
                    />
                    <span className="font-ibm text-sm text-evraz-gray">
                      {p.region}
                    </span>
                  </div>
                </div>
                <span className="font-oswald text-xs tracking-widest text-evraz-steel uppercase bg-evraz-light px-2 py-1 shrink-0 border border-evraz-border">
                  Серт.
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.services.map((s) => (
                  <span
                    key={s}
                    className={`font-oswald text-xs tracking-wider uppercase px-2.5 py-1 ${
                      s === "Проектирование"
                        ? "bg-evraz-charcoal text-evraz-steel border border-evraz-border"
                        : "bg-evraz-red/10 text-evraz-red border border-evraz-red/30"
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {p.review && (
                <div className="bg-evraz-light border-l-2 border-evraz-red px-4 py-3 mb-4 flex-1">
                  <p className="font-ibm text-xs text-evraz-dark leading-relaxed italic">
                    «{p.review.text}»
                  </p>
                  <p className="font-ibm text-xs text-evraz-gray mt-2">
                    — {p.review.author}
                  </p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <Link
                      to={`/partners/${p.slug}`}
                      className="font-ibm text-xs text-evraz-red hover:underline flex items-center gap-1"
                    >
                      <Icon name="ChevronRight" size={12} />
                      Подробнее
                    </Link>
                    {p.review.videoUrl && (
                      <a
                        href={p.review.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-ibm text-xs text-evraz-red hover:underline flex items-center gap-1"
                      >
                        <Icon name="Play" size={12} />
                        Видеоотзыв
                      </a>
                    )}
                  </div>
                </div>
              )}
              {!p.review && <div className="flex-1" />}

              <div className="border-t border-evraz-border pt-4">
                <span className="font-ibm text-sm text-evraz-gray">
                  {p.projects} проектов
                </span>
              </div>
            </div>
          ))}
        </div>

        <AnimSection>
          <div className="mt-10 border border-evraz-steel/30 bg-evraz-charcoal p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-oswald text-2xl text-evraz-dark font-semibold">
                Хотите стать партнёром?
              </h3>
              <p className="font-ibm text-evraz-gray mt-2 text-sm">
                Присоединяйтесь к сети из 180+ сертифицированных партнёров EVRAZ
                STEEL BOX
              </p>
            </div>
            <button
              onClick={onContact}
              className="btn-primary whitespace-nowrap"
            >
              Подать заявку
            </button>
          </div>
        </AnimSection>
      </div>
    </section>
  );
}

const CASE_CATEGORIES: CaseCategory[] = [
  "Серийные здания",
  "Индивидуальные проекты",
  "Парковки",
];

const VISIBLE = 3;

export function ContentSections({
  scrollTo,
}: {
  scrollTo: (id: string) => void;
}) {
  const [caseFilter, setCaseFilter] = useState<CaseCategory | "Все">("Все");
  const [slideIndex, setSlideIndex] = useState(0);

  const filteredCases =
    caseFilter === "Все"
      ? CASES
      : CASES.filter((c) => c.category === caseFilter);

  const maxIndex = Math.max(0, filteredCases.length - VISIBLE);

  const handleFilter = (cat: CaseCategory | "Все") => {
    setCaseFilter(cat);
    setSlideIndex(0);
  };

  const prev = () => setSlideIndex((i) => Math.max(0, i - 1));
  const next = () => setSlideIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <>
      {/* CASES */}
      <section id="cases" className="py-24 bg-evraz-light">
        <div className="container mx-auto">
          <AnimSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="accent-line" />
                <h2 className="font-oswald text-4xl md:text-5xl text-evraz-dark font-semibold">
                  КЕЙСЫ И ПРОЕКТЫ
                </h2>
                <p className="font-ibm text-evraz-gray mt-4 max-w-xl text-base leading-relaxed">
                  Реальные объекты, сданные в срок. Более 400 реализованных
                  проектов по всей России и СНГ.
                </p>
              </div>
              <button className="btn-outline-dark self-start md:self-auto">
                Все проекты
              </button>
            </div>
          </AnimSection>

          {/* Фильтры + навигация */}
          <AnimSection>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
              <div className="flex flex-wrap gap-2">
                {(["Все", ...CASE_CATEGORIES] as (CaseCategory | "Все")[]).map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => handleFilter(cat)}
                      className={`font-oswald text-sm tracking-wider uppercase px-5 py-2.5 border transition-all ${
                        caseFilter === cat
                          ? "bg-evraz-red border-evraz-red text-white"
                          : "border-evraz-border bg-white text-evraz-steel hover:border-evraz-red hover:text-evraz-red"
                      }`}
                    >
                      {cat}
                    </button>
                  ),
                )}
              </div>
              {/* Стрелки */}
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  disabled={slideIndex === 0}
                  className="w-10 h-10 border border-evraz-border flex items-center justify-center transition-all hover:border-evraz-red hover:text-evraz-red disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Icon name="ChevronLeft" size={18} />
                </button>
                <button
                  onClick={next}
                  disabled={slideIndex >= maxIndex}
                  className="w-10 h-10 border border-evraz-border flex items-center justify-center transition-all hover:border-evraz-red hover:text-evraz-red disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Icon name="ChevronRight" size={18} />
                </button>
              </div>
            </div>
          </AnimSection>

          {/* Слайдер */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(calc(-${slideIndex} * (100% / ${VISIBLE} + 8px)))`,
              }}
            >
              {filteredCases.map((c) => (
                <div
                  key={c.title}
                  className="flex-shrink-0 bg-white border border-evraz-border overflow-hidden group flex flex-col"
                  style={{
                    width: `calc((100% - ${(VISIBLE - 1) * 24}px) / ${VISIBLE})`,
                  }}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden shrink-0">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-evraz-dark/30 group-hover:bg-evraz-dark/20 transition-all duration-300" />
                    <span className="absolute top-4 left-4 font-oswald text-xs tracking-widest text-white uppercase bg-evraz-red px-3 py-1">
                      {c.tag}
                    </span>
                    <span className="absolute top-4 right-4 font-oswald text-xs tracking-widest text-white bg-evraz-dark/50 px-2 py-0.5">
                      {c.year}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-oswald text-xl text-evraz-dark font-semibold mb-2">
                      {c.title}
                    </h3>
                    <div className="flex items-center gap-2 text-evraz-gray mb-5">
                      <Icon
                        name="MapPin"
                        size={13}
                        className="text-evraz-red shrink-0"
                      />
                      <span className="font-ibm text-sm">{c.location}</span>
                    </div>

                    {/* Габариты */}
                    <div className="grid grid-cols-4 gap-2 mb-5">
                      {[
                        { label: "Площадь", value: c.area },
                        { label: "Ширина", value: c.dims.width },
                        { label: "Длина", value: c.dims.length },
                        { label: "Высота", value: c.dims.height },
                      ].map((d) => (
                        <div
                          key={d.label}
                          className="bg-evraz-light px-2 py-2.5 text-center"
                        >
                          <div className="font-oswald text-sm text-evraz-dark font-semibold leading-none">
                            {d.value}
                          </div>
                          <div className="font-ibm text-xs text-evraz-gray mt-1">
                            {d.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Партнёр */}
                    <div className="flex items-center gap-2 mb-5">
                      <Icon
                        name="HardHat"
                        size={13}
                        className="text-evraz-gray shrink-0"
                      />
                      <span className="font-ibm text-xs text-evraz-gray">
                        Монтаж:
                      </span>
                      <span className="font-ibm text-xs text-evraz-dark font-medium">
                        {c.partner}
                      </span>
                    </div>

                    {/* Отзыв + стрелка */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-evraz-border">
                      {c.review ? (
                        <a
                          href={c.review}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 font-oswald text-xs tracking-wider uppercase text-evraz-red hover:text-evraz-dark transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Icon name="MessageSquareQuote" size={13} />
                          Отзыв клиента
                        </a>
                      ) : (
                        <div />
                      )}
                      <div className="w-8 h-8 bg-red-50 flex items-center justify-center group-hover:bg-evraz-red transition-colors cursor-pointer">
                        <Icon
                          name="ArrowRight"
                          size={15}
                          className="text-evraz-red group-hover:text-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Точки-индикаторы */}
          {maxIndex > 0 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`h-1.5 transition-all duration-300 ${i === slideIndex ? "w-8 bg-evraz-red" : "w-3 bg-evraz-border hover:bg-evraz-gray"}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto">
          <AnimSection>
            {/* Шапка */}
            <div className="mb-12">
              <div className="accent-line" />
              <h2 className="font-oswald text-4xl md:text-5xl text-evraz-dark font-semibold">
                О КОМПАНИИ
              </h2>
            </div>
          </AnimSection>

          {/* Верхний ряд: текст + 5 статов */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <AnimSection>
              <p className="font-ibm text-evraz-gray leading-relaxed mb-4">
                EVRAZ STEEL BOX специализируется на проектировании и поставке
                зданий и кровельных систем для проектов промышленного и
                коммерческого назначения.
              </p>
              <p className="font-ibm text-evraz-gray leading-relaxed mb-8">
                Мы предлагаем полнокомплектные здания заводского изготовления с
                высокой степенью готовности, что позволяет нашим клиентам
                значительно сократить сроки строительства. EVRAZ STEEL BOX
                входит в состав ЕВРАЗа — вертикально-интегрированной
                металлургической компании, лидера на рынке стального проката и
                готовых решений для инфраструктурных проектов.
              </p>
              <button
                onClick={() => scrollTo("contacts")}
                className="btn-primary"
              >
                Связаться с нами
              </button>
            </AnimSection>

            <AnimSection>
              <div className="grid grid-cols-2 gap-px bg-evraz-border border border-evraz-border">
                {[
                  { n: "400+", l: "реализованных проектов по всей России" },
                  { n: "45 дней", l: "поставка и монтаж серийных зданий" },
                  {
                    n: "500 000 м²",
                    l: "запроектированных объектов в портфеле",
                  },
                  { n: "300 000 м²", l: "построенных индивидуальных объектов" },
                  { n: "60+", l: "многоуровневых паркингов на 50 000 м/мест" },
                ].map((s, i) => (
                  <div
                    key={s.n}
                    className={`bg-white px-6 py-5 ${i === 4 ? "col-span-2 border-t border-evraz-border" : ""}`}
                  >
                    <div className="font-oswald text-3xl text-evraz-dark font-bold leading-none mb-1">
                      {s.n}
                    </div>
                    <div className="font-ibm text-sm text-evraz-gray">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </AnimSection>
          </div>

          {/* Нижний ряд: 5 преимуществ */}
          <AnimSection>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-evraz-border border border-evraz-border">
              {ADVANTAGES.map((adv) => (
                <div key={adv.title} className="bg-white p-6 flex flex-col">
                  <div className="w-9 h-9 bg-evraz-light flex items-center justify-center mb-4">
                    <Icon
                      name={adv.icon}
                      size={18}
                      className="text-evraz-red"
                    />
                  </div>
                  <h4 className="font-oswald text-sm text-evraz-dark font-semibold uppercase tracking-wide mb-1">
                    {adv.title}
                  </h4>
                  <p className="font-ibm text-xs text-evraz-gray leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              ))}
            </div>
          </AnimSection>
        </div>
      </section>

      {/* PARTNERS */}
      <PartnersSection onContact={() => scrollTo("contacts")} />

      {/* BLOG */}
      <section id="blog" className="py-24 bg-white">
        <div className="container mx-auto">
          <AnimSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="accent-line" />
                <h2 className="font-oswald text-4xl md:text-5xl text-evraz-dark font-semibold">
                  БЛОГ И ОТЗЫВЫ
                </h2>
                <p className="font-ibm text-evraz-gray mt-4 max-w-xl text-base leading-relaxed">
                  Экспертные материалы, актуальные новости компании, отзывы
                  наших клиентов.
                </p>
              </div>
              <button className="btn-outline-dark self-start md:self-auto">
                Все статьи
              </button>
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
                    <span className="font-ibm text-xs text-evraz-gray">
                      {post.date}
                    </span>
                    <span className="font-ibm text-xs text-evraz-gray ml-auto flex items-center gap-1">
                      <Icon name="Clock" size={12} /> {post.read}
                    </span>
                  </div>
                  <h3 className="font-oswald text-xl text-evraz-dark font-semibold mb-3 group-hover:text-evraz-red transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-ibm text-evraz-gray text-sm leading-relaxed mb-5">
                    {post.desc}
                  </p>
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
      <section id="contacts" className="py-24 bg-evraz-light">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <AnimSection>
              <div>
                <div className="accent-line" />
                <h2 className="font-oswald text-4xl md:text-5xl text-evraz-dark font-semibold mb-6">
                  КОНТАКТЫ
                </h2>
                <p className="font-ibm text-evraz-gray mb-10 leading-relaxed">
                  Оставьте заявку — наш специалист свяжется с вами в течение 1
                  часа и проконсультирует по любым вопросам проектирования и
                  строительства.
                </p>

                <div className="space-y-6 mb-10">
                  {[
                    {
                      icon: "Phone",
                      label: "Телефон",
                      value: "8 800 302 96 86 (звонок по России бесплатный)",
                    },
                    {
                      icon: "Mail",
                      label: "Email",
                      value: "info.box@evrazsteel.ru",
                    },
                    {
                      icon: "MapPin",
                      label: "Офис",
                      value:
                        "125252, Россия, г. Москва, ул. Авиаконструктора Микояна, д. 12, БЦ «Линкор» ",
                    },
                  ].map((c) => (
                    <div key={c.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon
                          name={c.icon}
                          size={18}
                          className="text-evraz-red"
                        />
                      </div>
                      <div>
                        <div className="font-ibm text-xs text-evraz-gray uppercase tracking-wider mb-0.5">
                          {c.label}
                        </div>
                        <div className="font-ibm text-evraz-dark font-medium">
                          {c.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimSection>

            <AnimSection>
              <div className="bg-evraz-light border border-evraz-border p-8 md:p-10">
                <h3 className="font-oswald text-2xl text-evraz-dark font-semibold mb-6">
                  ОСТАВИТЬ ЗАЯВКУ
                </h3>
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
                      Описание проекта
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Опишите ваш проект: площадь, регион, требования..."
                      className="w-full bg-white border border-evraz-border px-4 py-3 font-ibm text-evraz-dark text-sm focus:outline-none focus:border-evraz-red transition-colors resize-none"
                    />
                  </div>
                  <button className="btn-primary w-full text-center">
                    Отправить заявку
                  </button>
                  <p className="font-ibm text-xs text-evraz-gray text-center leading-relaxed">
                    Нажимая кнопку, вы соглашаетесь с политикой обработки
                    персональных данных
                  </p>
                </div>
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-evraz-charcoal border-t border-evraz-border pt-14 pb-8">
        <div className="container mx-auto">
          {/* Верхняя часть: лого + описание */}
          <div className="mb-10">
            <div className="mb-4">
              <img
                src="https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/07662369-c03c-4cb9-b942-839aad61017e.png"
                alt="EVRAZ SteelBox"
                className="h-10 w-auto"
              />
            </div>
            <p className="font-ibm text-sm text-evraz-gray leading-relaxed max-w-xs">
              EVRAZ STEEL BOX — высокотехнологичный поставщик быстровозводимых
              зданий
            </p>
          </div>

          {/* Колонки меню */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Продукция */}
            <div>
              <h5 className="font-oswald text-xs tracking-widest text-evraz-dark uppercase mb-4">
                Продукция
              </h5>
              <ul className="space-y-2">
                {[
                  "BOX 2.0",
                  "Склады и ангары",
                  "Быстровозводимые здания",
                  "Магазины и торговые здания",
                  "Здания для транспорта",
                  "Спортивные сооружения",
                  "Сельхозяйственные здания",
                ].map((item) => (
                  <li key={item}>
                    <span className="font-ibm text-sm text-evraz-gray hover:text-evraz-dark cursor-pointer transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* О компании */}
            <div>
              <h5 className="font-oswald text-xs tracking-widest text-evraz-dark uppercase mb-4">
                О компании
              </h5>
              <ul className="space-y-2">
                {[
                  "О компании",
                  "Контакты",
                  "Наше производство",
                  "Этапы реализации",
                  "Готовые проекты",
                ].map((item) => (
                  <li key={item}>
                    <span className="font-ibm text-sm text-evraz-gray hover:text-evraz-dark cursor-pointer transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Пресс-центр */}
            <div>
              <h5 className="font-oswald text-xs tracking-widest text-evraz-dark uppercase mb-4">
                Пресс-центр
              </h5>
              <ul className="space-y-2">
                {["Новости", "Статьи", "База знаний", "FAQ"].map((item) => (
                  <li key={item}>
                    <span className="font-ibm text-sm text-evraz-gray hover:text-evraz-dark cursor-pointer transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Головной офис */}
            <div>
              <h5 className="font-oswald text-xs tracking-widest text-evraz-dark uppercase mb-4">
                Головной офис
              </h5>
              <p className="font-ibm text-sm text-evraz-gray leading-relaxed mb-3">
                г. Москва, ул. Авиаконструктора Микояна, д. 12
              </p>
              <p className="font-ibm text-xs text-evraz-gray mb-1">
                Мы открыты
              </p>
              <p className="font-ibm text-xs text-evraz-dark font-medium">
                09:30 — 18:00
              </p>
              <p className="font-ibm text-xs text-evraz-gray mt-3">
                Наши офисы расположены по всей России
              </p>
            </div>

            {/* Контакты */}
            <div>
              <h5 className="font-oswald text-xs tracking-widest text-evraz-dark uppercase mb-4">
                Контакты
              </h5>
              <p className="font-ibm text-xs text-evraz-gray mb-1">Телефон</p>
              <a
                href="tel:88003029686"
                className="font-ibm text-sm text-evraz-dark hover:text-evraz-red transition-colors block mb-1"
              >
                8 800 302 96 86
              </a>
              <p className="font-ibm text-xs text-evraz-gray mb-3">
                звонок по России бесплатный
              </p>
              <p className="font-ibm text-xs text-evraz-gray mb-1">Email</p>
              <a
                href="mailto:info.box@evrazsteel.ru"
                className="font-ibm text-sm text-evraz-dark hover:text-evraz-red transition-colors"
              >
                info.box@evrazsteel.ru
              </a>
            </div>
          </div>

          {/* Нижняя строка */}
          <div className="border-t border-evraz-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-ibm text-xs text-evraz-gray">
              © {new Date().getFullYear()} EVRAZ Steel BOX. Все права защищены.
            </p>
            <div className="flex gap-6">
              <span className="font-ibm text-xs text-evraz-gray hover:text-evraz-dark cursor-pointer transition-colors">
                Политика конфиденциальности
              </span>
              <span className="font-ibm text-xs text-evraz-gray hover:text-evraz-dark cursor-pointer transition-colors">
                Пользовательское соглашение
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
