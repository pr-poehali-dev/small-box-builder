import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/shared/Header";
import Icon from "@/components/ui/icon";

// ─── Что входит в проект ───────────────────────────────────────────────────────

const DELIVERABLES = [
  {
    icon: "FileText",
    title: "Архитектурные решения (АР)",
    items: ["Планы этажей и фасады", "Разрезы и узлы", "Пояснительная записка"],
  },
  {
    icon: "Settings",
    title: "Конструктивные решения (КР)",
    items: [
      "Чертежи металлоконструкций",
      "Ведомость элементов",
      "Нагрузки на фундаменты",
    ],
  },
  {
    icon: "Layers",
    title: "Форматы файлов",
    items: [
      "Редактируемые DWG (AutoCAD)",
      "IFC-модель для BIM",
      "PDF-комплект для экспертизы",
      "Расчет стоимости здания: каркас, ограждающие конструкции, элементы заполнения проёмов",
    ],
  },
];

// ─── Что не входит ────────────────────────────────────────────────────────────

const NOT_INCLUDED = [
  {
    title: "Фундаменты (раздел КЖ)",
    note: "Разрабатывается специализированной проектной организации",
  },
  {
    title: "Расчетно-пояснительная записка для экспертизы",
    note: "Разрабатывается индивидуально в рамках договора поставки",
  },
  {
    title: "Спецификации металла",
    note: "Включены в договор поставки на стадии КМД",
  },  
];

// ─── Сравнение с рынком ────────────────────────────────────────────────────────

const COMPARISON = [
  {
    label: "Проектное бюро",
    price: "150 000 ₽",
    days: "30–60 дней",
    ok: false,
  },
  {
    label: "Фриланс-инженер",
    price: "60 000 ₽",
    days: "20–40 дней",
    ok: false,
  },
  { label: "EVRAZ STEEL BOX", price: "9 998 ₽", days: "2 дня", ok: true },
];

// ─── Для кого подходит ─────────────────────────────────────────────────────────

// ─── Форма ─────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  phone: string;
  email: string;
  area: string;
}

function LeadForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    area: "",
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-evraz-gray hover:text-evraz-dark"
        >
          <Icon name="X" size={20} />
        </button>
        <div className="bg-evraz-dark p-6">
          <h3 className="font-oswald text-xl text-white font-semibold tracking-wide">
            ЗАКАЗАТЬ АР+КР — 9 998 ₽
          </h3>
          <p className="font-ibm text-xs text-gray-400 mt-2 leading-relaxed">
            Укажите параметры здания — получите готовый проект за 2 рабочих дня
            с подписью инженеров EVRAZ STEEL BOX
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSuccess();
          }}
          className="p-6 space-y-4"
        >
          {[
            {
              label: "Имя*",
              key: "name",
              type: "text",
              placeholder: "Иван Иванов",
            },
            {
              label: "Телефон*",
              key: "phone",
              type: "tel",
              placeholder: "+7 (___) ___-__-__",
            },
            {
              label: "E-mail*",
              key: "email",
              type: "email",
              placeholder: "ivan@company.ru",
            },
            {
              label: "Площадь здания (м²)*",
              key: "area",
              type: "text",
              placeholder: "Например: 1 500 м²",
            },
          ].map((f) => (
            <div key={f.key}>
              <label className="font-ibm text-xs text-evraz-gray uppercase tracking-wider block mb-1.5">
                {f.label}
              </label>
              <input
                required={f.label.endsWith("*")}
                type={f.type}
                value={form[f.key as keyof FormData]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full bg-evraz-light border border-evraz-border px-4 py-3 font-ibm text-sm text-evraz-dark focus:outline-none focus:border-evraz-red"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-evraz-red text-white font-oswald text-sm tracking-widest uppercase py-4 hover:bg-red-700 transition-colors"
          >
            ЗАКАЗАТЬ ПРОЕКТ ЗА 9 998 ₽
          </button>
          <p className="font-ibm text-xs text-evraz-gray text-center">
            Нажимая кнопку, вы соглашаетесь с{" "}
            <a href="#" className="underline hover:text-evraz-dark">
              политикой конфиденциальности
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

// ─── Главный компонент ────────────────────────────────────────────────────────

export default function ArKr() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    setShowForm(false);
    navigate("/bigbox/thanks");
  };

  return (
    <div className="min-h-screen bg-white font-ibm">
      {showForm && (
        <LeadForm
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}

      <Header onCallbackClick={() => setShowForm(true)} />

      {/* ── HERO ── */}
      <section className="bg-evraz-dark min-h-[90vh] flex flex-col justify-center relative overflow-hidden px-6 py-20">
        {/* Сетка фон */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(232,96,10,0.5) 60px,rgba(232,96,10,0.5) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(232,96,10,0.5) 60px,rgba(232,96,10,0.5) 61px)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          {/* Бейдж */}
          <div className="inline-flex items-center gap-2 bg-evraz-red/10 border border-evraz-red/30 px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-evraz-red rounded-full animate-pulse" />
            <span className="font-ibm text-evraz-red text-xs uppercase tracking-widest">
              Для проектировщиков
            </span>
          </div>

          {/* Заголовок */}
          <h1 className="font-oswald text-5xl md:text-7xl font-bold text-white leading-none mb-6 uppercase">
            Экономия <span className="text-evraz-red">до 140 000 ₽</span>
            <br />
            на каждом проекте
          </h1>

          <p className="font-ibm text-lg text-gray-400 mb-10 max-w-2xl leading-relaxed">
            Проект АР+КР для типовых зданий 200–3 000 м² за{" "}
            <span className="text-white font-semibold">9 998 ₽</span> вместо 150
            000 ₽. Готово за 2 рабочих дня. Подпись инженеров EVRAZ STEEL BOX.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-evraz-red text-white font-oswald text-sm tracking-widest uppercase px-10 py-5 hover:bg-red-700 transition-colors"
            >
              ЗАКАЗАТЬ ЗА 9 998 ₽
            </button>
            <div className="flex items-center gap-3 px-6 py-5 border border-evraz-border">
              <Icon
                name="Clock"
                size={18}
                className="text-evraz-red flex-shrink-0"
              />
              <span className="font-ibm text-sm text-gray-400">
                Готово за <span className="text-white">2 рабочих дня</span>
              </span>
            </div>
          </div>

          {/* Зачёркнутая цена */}
          <p className="font-ibm text-xs text-gray-600 mt-6">
            Рыночная стоимость АР+КР:{" "}
            <span className="line-through text-gray-500">150 000 ₽</span> →{" "}
            <span className="text-evraz-red font-semibold">9 998 ₽</span>
          </p>
        </div>
      </section>

      {/* ── СОСТАВ ПРОЕКТА ── */}
      <section id="deliverables" className="py-24 bg-evraz-light px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="font-ibm text-xs text-evraz-red uppercase tracking-widest mb-3">
              Состав проекта
            </p>
            <h2 className="font-oswald text-4xl font-bold text-evraz-dark uppercase">
              Что входит — и что нет
            </h2>
          </div>


 {/* ── СРАВНЕНИЕ ── */}
      <section id="comparison" className="py-24 bg-evraz-light px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="font-ibm text-xs text-evraz-red uppercase tracking-widest mb-3">
              Экономика
            </p>
            <h2 className="font-oswald text-4xl font-bold text-evraz-dark uppercase">
              Сравнение с рынком
            </h2>
          </div>

          <div className="space-y-4">
            {COMPARISON.map((c) => (
              <div
                key={c.label}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 border-2 gap-4 ${
                  c.ok
                    ? "border-evraz-red bg-evraz-red/5"
                    : "border-evraz-border bg-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${c.ok ? "bg-evraz-red" : "bg-evraz-border"}`}
                  >
                    <Icon
                      name={c.ok ? "Check" : "X"}
                      size={16}
                      className={c.ok ? "text-white" : "text-evraz-gray"}
                    />
                  </div>
                  <span
                    className={`font-oswald text-lg uppercase ${c.ok ? "text-evraz-dark font-bold" : "text-evraz-gray"}`}
                  >
                    {c.label}
                  </span>
                  {c.ok && (
                    <span className="bg-evraz-red text-white font-ibm text-xs px-2 py-1 uppercase tracking-wider">
                      Выгоднее в 15 раз
                    </span>
                  )}
                </div>
                <div className="flex gap-8 sm:gap-12 text-right">
                  <div>
                    <p className="font-ibm text-xs text-evraz-gray uppercase tracking-wider mb-1">
                      Стоимость
                    </p>
                    <p
                      className={`font-oswald text-xl font-bold ${c.ok ? "text-evraz-red" : "text-evraz-gray line-through"}`}
                    >
                      {c.price}
                    </p>
                  </div>
                  <div>
                    <p className="font-ibm text-xs text-evraz-gray uppercase tracking-wider mb-1">
                      Срок
                    </p>
                    <p
                      className={`font-oswald text-xl font-bold ${c.ok ? "text-evraz-dark" : "text-evraz-gray"}`}
                    >
                      {c.days}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
            {/* Не входит */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-6 bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <Icon name="Minus" size={14} className="text-white" />
                </div>
                <h3 className="font-oswald text-xl font-semibold text-evraz-dark uppercase">
                  Не входит
                </h3>
              </div>
              <div className="space-y-3">
                {NOT_INCLUDED.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 border border-evraz-border bg-white p-5"
                  >
                    <div className="w-5 h-5 bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name="X" size={11} className="text-evraz-gray" />
                    </div>
                    <div>
                      <p className="font-ibm text-sm font-semibold text-evraz-dark">
                        {item.title}
                      </p>
                      {item.note && (
                        <p className="font-ibm text-xs text-evraz-gray mt-1 leading-relaxed">
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
 <div className="grid lg:grid-cols-2 gap-8">
            {/* Входит */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-6 bg-evraz-red flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={14} className="text-white" />
                </div>
                <h3 className="font-oswald text-xl font-semibold text-evraz-dark uppercase">
                  Входит в проект
                </h3>
              </div>
              <div className="space-y-4">
                {DELIVERABLES.map((d) => (
                  <div
                    key={d.title}
                    className="bg-white border border-evraz-border p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Icon
                        name={d.icon}
                        size={18}
                        className="text-evraz-red flex-shrink-0"
                      />
                      <h4 className="font-oswald text-sm font-semibold text-evraz-dark uppercase">
                        {d.title}
                      </h4>
                    </div>
                    <ul className="space-y-1.5 pl-7">
                      {d.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 font-ibm text-sm text-evraz-gray"
                        >
                          <Icon
                            name="Check"
                            size={12}
                            className="text-evraz-red mt-0.5 flex-shrink-0"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
     

      {/* ── КАК РАБОТАЕТ ── */}
      <section id="how" className="py-24 bg-evraz-light px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="font-ibm text-xs text-evraz-red uppercase tracking-widest mb-3">
              Процесс
            </p>
            <h2 className="font-oswald text-4xl font-bold text-evraz-dark uppercase">
              Как это работает
            </h2>
          </div>

          <div className="grid sm:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Заявка",
                desc: "Укажите площадь, назначение здания и регион",
              },
              {
                step: "02",
                title: "Оплата",
                desc: "9 998 ₽ — один платёж без скрытых доплат",
              },
              {
                step: "03",
                title: "Расчёт",
                desc: "Автоматическое проектирование + проверка инженером",
              },
              {
                step: "04",
                title: "Получение",
                desc: "DWG, IFC и PDF-комплект с подписью EVRAZ STEEL BOX",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white border border-evraz-border p-6"
              >
                <div className="font-oswald text-5xl font-bold text-evraz-red/20 mb-4">
                  {s.step}
                </div>
                <h3 className="font-oswald text-lg font-semibold text-evraz-dark uppercase mb-2">
                  {s.title}
                </h3>
                <p className="font-ibm text-sm text-evraz-gray leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ФИНАЛЬНЫЙ CTA ── */}
      <section id="cta" className="py-24 bg-evraz-red px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-oswald text-5xl font-bold text-white uppercase mb-4">
            Проект АР+КР
            <br />
            за 9 998 ₽
          </h2>
          <p className="font-ibm text-white/80 mb-10 text-lg leading-relaxed">
            Редактируемые DWG + IFC-модель. Подпись инженеров EVRAZ STEEL BOX.
            <br />
            Готово за 1 рабочий день. Здания 200–3 000 м².
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-evraz-red font-oswald text-sm tracking-widest uppercase px-12 py-5 hover:bg-gray-100 transition-colors"
          >
            ЗАКАЗАТЬ ПРОЕКТ
          </button>
          <p className="font-ibm text-xs text-white/60 mt-6">
            Вместо 150 000 ₽ на рынке. Экономия 140 002 ₽ на каждом проекте.
          </p>
        </div>
      </section>

      {/* ── ФУТЕР ── */}
      <footer className="bg-evraz-dark py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-ibm text-xs text-gray-600">
            © 2024 EVRAZ STEEL BOX
          </span>
          <div className="flex gap-6">
            <a
              href="#"
              className="font-ibm text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Политика конфиденциальности
            </a>
            <a
              href="#"
              className="font-ibm text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Согласие на обработку ПД
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}