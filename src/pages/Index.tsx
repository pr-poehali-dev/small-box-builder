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
          <button onClick={() => scrollTo("home")} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-evraz-red flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rotate-45" />
            </div>
            <div className="text-left">
              <div className="font-oswald font-bold text-white text-lg leading-none tracking-widest">EVRAZ</div>
              <div className="font-ibm text-xs text-gray-400 tracking-wider uppercase">SteelBox</div>
            </div>
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