import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { HeroSection } from "@/components/sections/HeroSection";
import { ContentSections } from "@/components/sections/ContentSections";

export default function Index() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-ibm">
      {/* HEADER */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-evraz-dark shadow-2xl py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center">
            <img src="https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/07662369-c03c-4cb9-b942-839aad61017e.png" alt="EVRAZ SteelBox" className="h-10 w-auto" />
          </button>

          <div className="flex items-center gap-4">
            <a
              href="tel:+78001234567"
              className="hidden sm:block text-white font-ibm text-sm font-medium hover:text-evraz-red transition-colors"
            >
              8 800 123-45-67
            </a>
            <button onClick={() => scrollTo("contacts")} className="btn-primary text-sm">
              Заказать проект
            </button>
          </div>
        </div>
      </header>

      <HeroSection scrollTo={scrollTo} />
      <ContentSections scrollTo={scrollTo} />
    </div>
  );
}