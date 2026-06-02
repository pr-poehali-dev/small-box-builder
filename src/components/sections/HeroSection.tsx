import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const BUILDING_TYPES = [
  "склад",
  "производство",
  "торговый центр",
  "спортзал",
  "автосервис",
];

interface HeroSectionProps {
  scrollTo: (id: string) => void;
}

export function HeroSection({ scrollTo }: HeroSectionProps) {
  const navigate = useNavigate();
  const [typeIndex, setTypeIndex] = useState(0);
  const [typeFading, setTypeFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTypeFading(true);
      setTimeout(() => {
        setTypeIndex((i) => (i + 1) % BUILDING_TYPES.length);
        setTypeFading(false);
      }, 350);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: `url(https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/files/5b4508f9-9d77-48fd-8352-9fba826f4269.jpg)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-evraz-charcoal/98 via-evraz-charcoal/85 to-evraz-charcoal/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-evraz-charcoal/60 via-transparent to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(107,63,160,0.5) 60px,rgba(107,63,160,0.5) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(107,63,160,0.5) 60px,rgba(107,63,160,0.5) 61px)",
        }}
      />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-evraz-red" />

      <div className="container mx-auto relative z-10 pt-24 pb-0 flex flex-col min-h-screen">
        {/* Верхняя часть — заголовок */}
        <div className="flex-1 flex flex-col justify-center max-w-3xl py-12">
          <h1 className="font-oswald text-4xl md:text-6xl text-evraz-dark font-bold leading-tight mb-6 animate-fade-in-up">
            <span className="text-evraz-gray font-light">
              Спроектируем, изготовим
            </span>
            <br />
            <span className="text-evraz-gray font-light">и построим</span>{" "}
            <span
              className="text-evraz-red inline-block transition-all duration-300"
              style={{
                opacity: typeFading ? 0 : 1,
                transform: typeFading ? "translateY(8px)" : "translateY(0)",
              }}
            >
              {BUILDING_TYPES[typeIndex]}
            </span>
            <br />
          </h1>

          <div className="flex items-center gap-3 animate-fade-in-up delay-200">
            <span className="font-oswald text-evraz-dark text-lg tracking-widest uppercase">
              400+ успешных проектов по всей России
            </span>
            <span className="font-oswald text-evraz-dark text-lg tracking-widest uppercase">
              Сопровождение от проектирования до сдачи под ключ
            </span>
            <span className="font-oswald text-evraz-dark text-lg tracking-widest uppercase">
              Фиксированная цена до 90 дней. Прозрачное ценообразование
            </span>
          </div>
        </div>

        {/* Нижняя часть — три карточки аудитории */}
        <div className="grid grid-cols-1 md:grid-cols-3 animate-fade-in-up delay-300">
          {[
            {
              icon: "Package",
              tag: "Серийные здания до 3000м²",
              title: "Готовые решения за 45 дней",
              desc: "Типовые склады, цеха, ангары, магазины. Минимальные сроки, предсказуемая цена.",
              cta: "Смотреть каталог",
              target: "solutions",
              accent: false,
              route: "/catalog",
              image:
                "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/02b7701e-8f0d-4d16-8e31-51e2632569a9.png",
            },
            {
              icon: "PenRuler",
              tag: "Индивидуальные проекты от 3000м²",
              title: "Под ваши задачи",
              desc: "Проектируем с нуля под технологию, нагрузки и архитектуру. Фальцевая кровля, уникальный фасад.",
              cta: "Обсудить проект",
              target: "contacts",
              accent: true,

              image:
                "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/a183d3e6-91ce-4d88-a8bb-785b392733e8.jpg",
            },
            {
              icon: "Car",
              tag: "Парковки",
              title: "Многоуровневые паркинги",
              desc: "Эффективные большепролетные паркинги с применением префаб-технологий для жилых комплексов, торговых центров и аэропортов.",
              cta: "Узнать подробнее",
              target: "calculator",
              accent: false,

              image:
                "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/c5af765d-44ea-4928-b299-a722ed76e5e8.png",
            },
          ].map((card) => (
            <div
              key={card.tag}
              className="group relative overflow-hidden cursor-pointer border-t-2 border-evraz-border hover:border-evraz-red transition-colors duration-300"
              style={{ minHeight: "280px" }}
              onClick={() =>
                card.route ? navigate(card.route) : scrollTo(card.target)
              }
            >
              {/* Фоновое изображение */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${card.image})` }}
              />

              {/* Затемнение: лёгкое по умолчанию, сильное при наведении */}
              <div className="absolute inset-0 bg-evraz-dark/30 group-hover:bg-evraz-dark/80 transition-colors duration-300" />

              {/* Контент: всегда в одной позиции, hover докидывает остальное */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-10">
                {/* Тег — появляется при наведении */}
                <span className="font-oswald text-xs tracking-[0.2em] uppercase px-2 py-1 bg-evraz-red text-white self-start mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {card.tag}
                </span>
                {/* Заголовок — виден всегда */}
                <h3 className="font-oswald text-2xl font-semibold leading-tight text-white mb-3">
                  {card.title}
                </h3>
                {/* Описание — появляется при наведении */}
                <p className="font-ibm text-sm leading-relaxed text-white/80 mb-8 max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-300">
                  {card.desc}
                </p>
                {/* CTA — появляется при наведении */}
                <div className="flex items-center gap-2 font-oswald text-sm tracking-wider uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {card.cta}
                  <Icon
                    name="ArrowRight"
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-evraz-red group-hover:w-full transition-all duration-500 z-30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
