import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const BUILDING_TYPES = [
  "склад",
  "производство",
  "паркинг",
  "торговый центр",
  "спортарену",
  "агрокомплекс",
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
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/files/5b4508f9-9d77-48fd-8352-9fba826f4269.jpg)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-evraz-dark/95 via-evraz-dark/80 to-evraz-dark/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-evraz-dark/60 via-transparent to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-evraz-red" />

      <div className="container mx-auto relative z-10 pt-24 pb-0 flex flex-col min-h-screen">
        {/* Верхняя часть — заголовок */}
        <div className="flex-1 flex flex-col justify-center max-w-3xl py-12">
          <h1 className="font-oswald text-4xl md:text-6xl text-white font-bold leading-tight mb-6 animate-fade-in-up">
            <span className="text-gray-300 font-light">Спроектируем, изготовим</span>
            <br />
            <span className="text-gray-300 font-light">и построим</span>{" "}
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
            <span className="text-white">под ключ за 40 дней</span>
          </h1>

          <div className="flex items-center gap-3 animate-fade-in-up delay-200">
            <div className="w-8 h-8 bg-evraz-red flex items-center justify-center shrink-0">
              <div className="w-3.5 h-3.5 border-2 border-white rotate-45" />
            </div>
            <span className="font-oswald text-white text-lg tracking-widest uppercase">
              Гарантия EVRAZ
            </span>
          </div>
        </div>

        {/* Нижняя часть — три карточки аудитории */}
        <div className="grid grid-cols-1 md:grid-cols-3 animate-fade-in-up delay-300">
          {[
            {
              icon: "Package",
              tag: "Серийные здания",
              title: "Готовые решения",
              desc: "Типовые складские, производственные и агропромышленные здания из каталога. Минимальные сроки и предсказуемая цена.",
              cta: "Смотреть каталог",
              target: "solutions",
              accent: false,
              route: "/catalog",
            },
            {
              icon: "PenRuler",
              tag: "Индивидуальный проект",
              title: "Под ваши задачи",
              desc: "Проектируем с нуля под технологию, нагрузки и архитектуру. Уникальные пролёты, кровля, фасад — любая геометрия.",
              cta: "Обсудить проект",
              target: "contacts",
              accent: true,
              route: null,
            },
            {
              icon: "Car",
              tag: "Парковки",
              title: "Многоуровневые паркинги",
              desc: "Наземные и многоуровневые металлические паркинги для жилых комплексов, торговых центров и аэропортов.",
              cta: "Узнать подробнее",
              target: "calculator",
              accent: false,
              route: null,
            },
          ].map((card) => (
            <div
              key={card.tag}
              className={`group relative p-8 md:p-10 border-t-2 cursor-pointer transition-all duration-300 ${
                card.accent
                  ? "bg-evraz-red border-evraz-red"
                  : "bg-evraz-dark/80 border-white/10 hover:bg-white/10 hover:border-evraz-red"
              }`}
              onClick={() => card.route ? navigate(card.route) : scrollTo(card.target)}
            >
              {/* Top */}
              <div className="flex items-center justify-between mb-6">
                <span
                  className={`font-oswald text-xs tracking-[0.2em] uppercase px-2 py-1 ${
                    card.accent ? "bg-white/20 text-white" : "bg-white/5 text-evraz-red"
                  }`}
                >
                  {card.tag}
                </span>
                <div
                  className={`w-10 h-10 flex items-center justify-center border ${
                    card.accent ? "border-white/30" : "border-white/10 group-hover:border-evraz-red"
                  } transition-colors`}
                >
                  <Icon name={card.icon} size={18} className={card.accent ? "text-white" : "text-gray-400 group-hover:text-evraz-red"} />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-oswald text-2xl text-white font-semibold mb-3 leading-tight">
                {card.title}
              </h3>
              <p className={`font-ibm text-sm leading-relaxed mb-8 ${card.accent ? "text-white/80" : "text-gray-400"}`}>
                {card.desc}
              </p>

              {/* CTA */}
              <div className={`flex items-center gap-2 font-oswald text-sm tracking-wider uppercase transition-all ${
                card.accent ? "text-white" : "text-gray-400 group-hover:text-white"
              }`}>
                {card.cta}
                <Icon
                  name="ArrowRight"
                  size={16}
                  className={`transition-transform duration-300 group-hover:translate-x-1 ${card.accent ? "text-white" : ""}`}
                />
              </div>

              {/* Bottom accent line */}
              {!card.accent && (
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-evraz-red group-hover:w-full transition-all duration-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}