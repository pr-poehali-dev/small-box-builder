import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

interface NavLink {
  label: string;
  href: string;
}

interface ProductMenuItem {
  label: string;
  href: string;
}

const PRODUCT_MENU: ProductMenuItem[] = [
  { label: "Склады", href: "/catalog" },
  { label: "Производственные здания", href: "/catalog" },
  { label: "Агро здания", href: "/catalog" },
  { label: "Торговые здания", href: "/catalog" },
  { label: "Паркинги", href: "/parking" },
];

const NAV_ITEMS = [
  { label: "Проект", href: "/" },
  { label: "Компания", href: "/" },
  { label: "Партнёрам", href: "/" },
  { label: "Цены онлайн", href: "/catalog" },
  { label: "Контакты", href: "/" },
];

interface HeaderProps {
  navLinks?: NavLink[];
  onNavClick?: (href: string) => void;
  onCallbackClick?: () => void;
  backButton?: { label: string; onClick: () => void };
}

export default function Header({
  navLinks,
  onNavClick,
  onCallbackClick,
  backButton,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = () => setProductOpen(false);
    if (productOpen) {
      document.addEventListener("click", close);
    }
    return () => document.removeEventListener("click", close);
  }, [productOpen]);

  const handleProductToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProductOpen((v) => !v);
  };

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (onNavClick) {
      onNavClick(href);
    } else {
      navigate(href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? "shadow-md" : "border-b border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Лого */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center shrink-0"
        >
          <img
            src="https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/07662369-c03c-4cb9-b942-839aad61017e.png"
            alt="EVRAZ SteelBox"
            className="h-10 w-auto"
          />
        </button>

        {/* Навигация десктоп */}
        {!backButton && (
          <nav className="hidden lg:flex items-center gap-1">
            {/* Продукция с выпадашкой */}
            <div className="relative">
              <button
                onClick={handleProductToggle}
                className={`flex items-center gap-1 font-ibm text-xs text-evraz-dark hover:text-evraz-red transition-colors uppercase tracking-wider px-3 py-2 rounded border ${
                  productOpen
                    ? "border-orange-400 text-evraz-red"
                    : "border-transparent"
                }`}
              >
                Продукция
                <Icon
                  name={productOpen ? "ChevronUp" : "ChevronDown"}
                  size={14}
                />
              </button>
              {productOpen && (
                <div
                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded min-w-[220px] z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {PRODUCT_MENU.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setProductOpen(false);
                        navigate(item.href);
                      }}
                      className="block w-full text-left px-4 py-2.5 font-ibm text-xs text-evraz-dark hover:bg-gray-50 hover:text-evraz-red transition-colors uppercase tracking-wider border-b border-gray-100 last:border-0"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Остальные пункты */}
            {(navLinks
              ? navLinks.map((l) => ({ label: l.label, href: l.href }))
              : NAV_ITEMS
            ).map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="font-ibm text-xs text-evraz-dark hover:text-evraz-red transition-colors uppercase tracking-wider px-3 py-2"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Кнопка назад (для страниц без навигации) */}
        {backButton && (
          <button
            onClick={backButton.onClick}
            className="flex items-center gap-2 font-ibm text-sm text-evraz-gray hover:text-evraz-dark transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            {backButton.label}
          </button>
        )}

        {/* Правая часть */}
        {!backButton && (
          <div className="flex items-center gap-3 shrink-0">
            {/* Иконки соцсетей */}
            <div className="hidden md:flex items-center gap-2">
              <a
                href="mailto:info@evrazsteelbox.ru"
                className="text-evraz-gray hover:text-evraz-red transition-colors"
                title="Email"
              >
                <Icon name="Mail" size={18} />
              </a>
              <a
                href="https://t.me/evrazsteelbox"
                target="_blank"
                rel="noopener noreferrer"
                className="text-evraz-gray hover:text-evraz-red transition-colors"
                title="Telegram"
              >
                <Icon name="Send" size={18} />
              </a>
              <a
                href="https://wa.me/78003029686"
                target="_blank"
                rel="noopener noreferrer"
                className="text-evraz-gray hover:text-evraz-red transition-colors"
                title="WhatsApp"
              >
                <Icon name="MessageCircle" size={18} />
              </a>
            </div>

            {/* Телефон */}
            <a
              href="tel:+78003029686"
              className="hidden md:block font-oswald text-evraz-dark text-sm tracking-wider hover:text-evraz-red transition-colors whitespace-nowrap"
            >
              +7 (800) 302-96-86
            </a>

            {/* Кнопка обратного звонка */}
            <button
              onClick={onCallbackClick}
              className="hidden sm:block font-ibm text-xs text-evraz-dark border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors uppercase tracking-wider whitespace-nowrap"
            >
              Обратный звонок
            </button>

            {/* Бургер */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-evraz-dark"
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        )}
      </div>

      {/* Мобильное меню */}
      {menuOpen && !backButton && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-1">
          {/* Продукция */}
          <button
            onClick={() => setProductOpen(!productOpen)}
            className="flex items-center gap-1 w-full text-left font-ibm text-sm text-evraz-dark hover:text-evraz-red py-2 uppercase tracking-wider"
          >
            Продукция
            <Icon
              name={productOpen ? "ChevronUp" : "ChevronDown"}
              size={14}
            />
          </button>
          {productOpen && (
            <div className="pl-4 space-y-1">
              {PRODUCT_MENU.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setMenuOpen(false);
                    setProductOpen(false);
                    navigate(item.href);
                  }}
                  className="block w-full text-left font-ibm text-xs text-evraz-gray hover:text-evraz-red py-1.5 uppercase tracking-wider"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {(navLinks
            ? navLinks.map((l) => ({ label: l.label, href: l.href }))
            : NAV_ITEMS
          ).map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="block w-full text-left font-ibm text-sm text-evraz-dark hover:text-evraz-red py-2 uppercase tracking-wider"
            >
              {item.label}
            </button>
          ))}

          <div className="pt-3 border-t border-gray-200 space-y-3">
            <div className="flex items-center gap-4">
              <a href="mailto:info@evrazsteelbox.ru" className="text-evraz-gray hover:text-evraz-red transition-colors">
                <Icon name="Mail" size={20} />
              </a>
              <a href="https://t.me/evrazsteelbox" target="_blank" rel="noopener noreferrer" className="text-evraz-gray hover:text-evraz-red transition-colors">
                <Icon name="Send" size={20} />
              </a>
              <a href="https://wa.me/78003029686" target="_blank" rel="noopener noreferrer" className="text-evraz-gray hover:text-evraz-red transition-colors">
                <Icon name="MessageCircle" size={20} />
              </a>
            </div>
            <a
              href="tel:+78003029686"
              className="block font-oswald text-evraz-dark text-lg"
            >
              +7 (800) 302-96-86
            </a>
            <button
              onClick={() => {
                setMenuOpen(false);
                onCallbackClick?.();
              }}
              className="w-full font-ibm text-xs text-evraz-dark border border-black px-4 py-3 hover:bg-black hover:text-white transition-colors uppercase tracking-wider"
            >
              Обратный звонок
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
