import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/shared/Header";

export default function BigBoxThanks() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-ibm flex flex-col">
      {/* Хедер */}
      <Header
        backButton={{ label: "Назад", onClick: () => navigate("/bigbox") }}
      />

      {/* Основной контент */}
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container mx-auto text-center max-w-2xl">
          <div className="w-16 h-16 bg-evraz-red mx-auto flex items-center justify-center mb-6">
            <Icon name="Check" size={32} className="text-white" />
          </div>
          <h1 className="font-oswald text-4xl md:text-5xl text-evraz-dark font-bold mb-4">
            БЛАГОДАРИМ ВАС
            <br />
            <span className="text-evraz-red">ЗА ОБРАЩЕНИЕ!</span>
          </h1>
          <p className="font-ibm text-evraz-gray text-base leading-relaxed mb-8">
            Мы перезвоним в течение 1 часа и разберём вашу задачу.
            <br />
            А пока — подпишитесь на нас или скачайте каталог:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <a
              href="https://t.me/EvrazBigBox_bot"
              target="_blank"
              rel="noreferrer"
              className="bg-evraz-charcoal border border-evraz-border hover:border-evraz-red p-5 transition-colors group"
            >
              <Icon name="Send" size={24} className="text-evraz-red mx-auto mb-3" />
              <p className="font-oswald text-sm text-evraz-dark uppercase tracking-wide mb-1">Telegram</p>
              <p className="font-ibm text-xs text-evraz-gray">@EvrazBigBox_bot</p>
            </a>
            <a
              href="https://wa.me/79692688420"
              target="_blank"
              rel="noreferrer"
              className="bg-evraz-charcoal border border-evraz-border hover:border-evraz-red p-5 transition-colors group"
            >
              <Icon name="MessageCircle" size={24} className="text-evraz-red mx-auto mb-3" />
              <p className="font-oswald text-sm text-evraz-dark uppercase tracking-wide mb-1">WhatsApp</p>
              <p className="font-ibm text-xs text-evraz-gray">+7 969 268-84-20</p>
            </a>
            <button
              onClick={() => navigate("/bigbox")}
              className="bg-evraz-charcoal border border-evraz-border hover:border-evraz-red p-5 transition-colors"
            >
              <Icon name="BookOpen" size={24} className="text-evraz-red mx-auto mb-3" />
              <p className="font-oswald text-sm text-evraz-dark uppercase tracking-wide mb-1">Каталог</p>
              <p className="font-ibm text-xs text-evraz-gray">Скачать решения</p>
            </button>
          </div>

          <button
            onClick={() => navigate("/bigbox")}
            className="inline-flex items-center gap-2 font-ibm text-sm text-evraz-gray hover:text-evraz-dark transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            Вернуться на главную
          </button>
        </div>
      </main>

      {/* Мини-футер */}
      <footer className="border-t border-evraz-border py-6">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-ibm text-xs text-evraz-gray">
            Задайте вопрос онлайн:
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <a
              href="https://t.me/EvrazBigBox_bot"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 font-ibm text-xs text-evraz-gray hover:text-evraz-dark transition-colors"
            >
              <Icon name="Send" size={13} className="text-evraz-red" />
              @EvrazBigBox_bot
            </a>
            <a
              href="https://wa.me/79692688420"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 font-ibm text-xs text-evraz-gray hover:text-evraz-dark transition-colors"
            >
              <Icon name="MessageCircle" size={13} className="text-evraz-red" />
              +7 969 268-84-20
            </a>
            <a
              href="mailto:sales.bigbox@evrazsteel.ru"
              className="flex items-center gap-2 font-ibm text-xs text-evraz-gray hover:text-evraz-dark transition-colors"
            >
              <Icon name="Mail" size={13} className="text-evraz-red" />
              sales.bigbox@evrazsteel.ru
            </a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="font-ibm text-xs text-evraz-gray hover:text-evraz-dark transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="font-ibm text-xs text-evraz-gray hover:text-evraz-dark transition-colors">
              Согласие на обработку ПД
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}