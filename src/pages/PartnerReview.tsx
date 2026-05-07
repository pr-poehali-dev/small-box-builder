import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { PARTNERS } from "@/components/sections/ContentSections";

export default function PartnerReview() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  const partner = PARTNERS.find((p) => p.slug === slug);

  if (!partner || !partner.review) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="font-oswald text-2xl text-evraz-dark">Партнёр не найден</p>
          <button onClick={() => navigate(-1)} className="mt-4 btn-primary">
            Назад
          </button>
        </div>
      </div>
    );
  }

  const { review } = partner;

  return (
    <div className="min-h-screen bg-white font-ibm">
      {/* HEADER */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md py-3" : "bg-white border-b border-evraz-border py-5"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center">
            <img
              src="https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/07662369-c03c-4cb9-b942-839aad61017e.png"
              alt="EVRAZ SteelBox"
              className="h-10 w-auto"
            />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-ibm text-sm text-evraz-steel hover:text-evraz-red transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            Назад к партнёрам
          </button>
        </div>
      </header>

      <div className="pt-24 pb-20">
        <div className="container mx-auto max-w-3xl px-4">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-ibm text-evraz-gray mb-10">
            <button onClick={() => navigate("/")} className="hover:text-evraz-red transition-colors">
              Главная
            </button>
            <Icon name="ChevronRight" size={12} />
            <span>Сеть партнёров</span>
            <Icon name="ChevronRight" size={12} />
            <span className="text-evraz-dark">{partner.name}</span>
          </div>

          {/* Partner header */}
          <div className="border border-evraz-border p-8 mb-8 bg-evraz-light">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-oswald text-xs tracking-widest text-evraz-steel uppercase bg-evraz-steel/10 px-2 py-1">
                    Сертифицирован
                  </span>
                </div>
                <h1 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-bold mt-2">
                  {partner.name}
                </h1>
                <div className="flex items-center gap-1.5 mt-2">
                  <Icon name="MapPin" size={14} className="text-evraz-steel" />
                  <span className="font-ibm text-sm text-evraz-gray">{partner.region}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex gap-1 justify-end mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Icon
                      key={j}
                      name="Star"
                      size={16}
                      className={j < partner.rating ? "text-evraz-orange" : "text-evraz-border"}
                    />
                  ))}
                </div>
                <div className="font-oswald text-3xl text-evraz-dark font-bold">
                  {partner.projects}
                </div>
                <div className="font-ibm text-xs text-evraz-gray uppercase tracking-wider">
                  реализованных проектов
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {partner.services.map((s) => (
                <span
                  key={s}
                  className={`font-oswald text-xs tracking-wider uppercase px-3 py-1.5 ${
                    s === "Проектирование"
                      ? "bg-evraz-charcoal text-evraz-steel border border-evraz-border"
                      : "bg-evraz-red/10 text-evraz-red border border-evraz-red/30"
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Review */}
          <div className="border-l-4 border-evraz-red pl-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Quote" size={20} className="text-evraz-red" />
              <span className="font-oswald text-xs tracking-widest text-evraz-red uppercase">
                Отзыв о сотрудничестве
              </span>
            </div>
            <blockquote className="font-ibm text-lg text-evraz-dark leading-relaxed italic mb-6">
              «{review.fullText ?? review.text}»
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-evraz-dark flex items-center justify-center shrink-0">
                <Icon name="User" size={14} className="text-white" />
              </div>
              <span className="font-ibm text-sm text-evraz-steel font-medium">
                {review.author}
              </span>
            </div>
          </div>

          {/* Video link */}
          {review.videoUrl && (
            <a
              href={review.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 border border-evraz-border p-5 hover:border-evraz-red transition-colors group mb-8"
            >
              <div className="w-12 h-12 bg-evraz-red flex items-center justify-center shrink-0">
                <Icon name="Play" size={20} className="text-white" />
              </div>
              <div>
                <div className="font-oswald text-base text-evraz-dark group-hover:text-evraz-red transition-colors">
                  Смотреть видеоотзыв
                </div>
                <div className="font-ibm text-xs text-evraz-gray mt-0.5">
                  YouTube · {partner.name}
                </div>
              </div>
              <Icon name="ExternalLink" size={16} className="text-evraz-gray ml-auto" />
            </a>
          )}

          {/* Back */}
          <div className="border-t border-evraz-border pt-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 font-ibm text-sm text-evraz-steel hover:text-evraz-red transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              Вернуться к списку партнёров
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
