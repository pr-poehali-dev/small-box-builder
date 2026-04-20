import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function BigBoxThanks() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-evraz-dark font-ibm flex flex-col">
      {/* Хедер */}
      <header className="py-6 border-b border-evraz-charcoal">
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/bigbox")} className="flex items-center gap-3">
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
          <div className="text-right hidden sm:block">
            <a
              href="tel:+78003006559"
              className="font-oswald text-xl text-white hover:text-evraz-red transition-colors block"
            >
              8 800 300 65 59
            </a>
            <p className="font-ibm text-xs text-gray-400">
              пн.–пт. с 9:30 до 18:00 &nbsp;/&nbsp; Звоните, мы сейчас на связи
            </p>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container mx-auto text-center max-w-2xl">
          <div className="w-16 h-16 bg-evraz-red mx-auto flex items-center justify-center mb-6">
            <Icon name="Check" size={32} className="text-white" />
          </div>
          <h1 className="font-oswald text-4xl md:text-5xl text-white font-bold mb-4">
            БЛАГОДАРИМ ВАС
            <br />
            <span className="text-evraz-red">ЗА ОБРАЩЕНИЕ!</span>
          </h1>
          <p className="font-ibm text-gray-300 text-base leading-relaxed mb-8">
            Мы перезвоним в течение 1 часа и разберём вашу задачу.
            <br />
            А пока — подпишитесь на нас или скачайте каталог:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <a
              href="https://t.me/EvrazBigBox_bot"
              target="_blank"
              rel="noreferrer"
              className="bg-white/5 border border-white/10 hover:border-evraz-red p-5 transition-colors group"
            >
              <Icon name="Send" size={24} className="text-evraz-red mx-auto mb-3" />
              <p className="font-oswald text-sm text-white uppercase tracking-wide mb-1">Telegram</p>
              <p className="font-ibm text-xs text-gray-400">@EvrazBigBox_bot</p>
            </a>
            <a
              href="https://wa.me/79692688420"
              target="_blank"
              rel="noreferrer"
              className="bg-white/5 border border-white/10 hover:border-evraz-red p-5 transition-colors group"
            >
              <Icon name="MessageCircle" size={24} className="text-evraz-red mx-auto mb-3" />
              <p className="font-oswald text-sm text-white uppercase tracking-wide mb-1">WhatsApp</p>
              <p className="font-ibm text-xs text-gray-400">+7 969 268-84-20</p>
            </a>
            <button
              onClick={() => navigate("/bigbox")}
              className="bg-white/5 border border-white/10 hover:border-evraz-red p-5 transition-colors"
            >
              <Icon name="BookOpen" size={24} className="text-evraz-red mx-auto mb-3" />
              <p className="font-oswald text-sm text-white uppercase tracking-wide mb-1">Каталог</p>
              <p className="font-ibm text-xs text-gray-400">Скачать решения</p>
            </button>
          </div>

          <button
            onClick={() => navigate("/bigbox")}
            className="inline-flex items-center gap-2 font-ibm text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            Вернуться на главную
          </button>
        </div>
      </main>

      {/* Мини-футер */}
      <footer className="border-t border-evraz-charcoal py-6">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-ibm text-xs text-gray-500">
            Задайте вопрос онлайн:
          </p>
          <div className="flex flex-wrap justify-center gap-5">
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
          <div className="flex gap-4">
            <a href="#" className="font-ibm text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="font-ibm text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Согласие на обработку ПД
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}