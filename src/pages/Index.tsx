import Header from "@/components/shared/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { ContentSections } from "@/components/sections/ContentSections";

export default function Index() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const NAV_LINKS = [
    { label: "Проект", href: "cases" },
    { label: "Компания", href: "about" },
    { label: "Партнёрам", href: "partners" },
    { label: "Цены онлайн", href: "/catalog" },
    { label: "Контакты", href: "contacts" },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith("/")) {
      window.location.href = href;
    } else {
      scrollTo(href);
    }
  };

  return (
    <div className="min-h-screen bg-white font-ibm">
      <Header
        navLinks={NAV_LINKS}
        onNavClick={handleNavClick}
        onCallbackClick={() => scrollTo("contacts")}
      />
      <HeroSection scrollTo={scrollTo} />
      <ContentSections scrollTo={scrollTo} />
    </div>
  );
}
