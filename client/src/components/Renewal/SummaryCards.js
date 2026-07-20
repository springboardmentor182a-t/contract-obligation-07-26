import {
  AlertTriangle,
  Clock3,
  CalendarDays,
  BellRing,
} from "lucide-react";

const defaultCards = [
  {
    title: "EXPIRING IN\n30D",
    value: "0",
    subtitle: "No urgent renewals",
    cardClass: "bg-red-50/80",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    icon: AlertTriangle,
  },
  {
    title: "EXPIRING IN\n60D",
    value: "0",
    subtitle: "Watchlist",
    cardClass: "bg-orange-50/80",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    icon: Clock3,
  },
  {
    title: "EXPIRING IN\n90D",
    value: "0",
    subtitle: "Upcoming",
    cardClass: "bg-blue-50/80",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: CalendarDays,
  },
  {
    title: "AUTO REMINDER\nON",
    value: "0",
    subtitle: "No reminders scheduled",
    cardClass: "bg-emerald-50/80",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    icon: BellRing,
  },
];

function SummaryCards({ data }) {
  const cards = [
    {
      ...defaultCards[0],
      value: data?.expiring30 ?? defaultCards[0].value,
      subtitle: data?.expiring30 ? "Critical" : defaultCards[0].subtitle,
    },
    {
      ...defaultCards[1],
      value: data?.expiring60 ?? defaultCards[1].value,
      subtitle: data?.expiring60 ? "Warning" : defaultCards[1].subtitle,
    },
    {
      ...defaultCards[2],
      value: data?.expiring90 ?? defaultCards[2].value,
      subtitle: data?.expiring90 ? "Upcoming" : defaultCards[2].subtitle,
    },
    {
      ...defaultCards[3],
      value: data?.autoReminder ?? defaultCards[3].value,
      subtitle: data?.autoReminder ? "Reminders active" : defaultCards[3].subtitle,
    },
  ];

  return (
    <section className="renewal-summary-grid">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
              key={card.title}
              className="summary-card bg-white rounded-[28px] border border-slate-200 p-7 shadow-sm flex items-center justify-between"
            >
            <div className="flex-1">
              <p className="summary-card__label whitespace-pre-line">{card.title}</p>
              <h2 className="summary-card__value mt-5">{card.value}</h2>
              <p className="summary-card__subtitle">{card.subtitle}</p>
            </div>

            <div
                className={`summary-card__icon ${
                card.title.includes("30")
                  ? "summary-card__icon--red"
                  : card.title.includes("60")
                  ? "summary-card__icon--amber"
                  : card.title.includes("90")
                  ? "summary-card__icon--blue"
                  : "summary-card__icon--emerald"
              }`}
            >
              <Icon
                size={28}
                strokeWidth={2.2}
                className={card.iconColor}
              />
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default SummaryCards;