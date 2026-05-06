import { type LucideIcon, Target, CheckCircle2, Zap, Clock, Rocket } from 'lucide-react';

type Language = 'en' | 'zh';
type Status = 'completed' | 'in-progress' | 'planned';

const statusConfig: Record<Status, {
  icon: LucideIcon;
  en: string;
  zh: string;
  iconClass: string;
  bgClass: string;
  badgeClass: string;
  pulse?: boolean;
}> = {
  completed: {
    icon: CheckCircle2,
    en: 'Completed',
    zh: '已完成',
    iconClass: 'text-ehyo-sage',
    bgClass: 'bg-ehyo-sage/10',
    badgeClass: 'text-ehyo-sage bg-ehyo-sage/10',
  },
  'in-progress': {
    icon: Zap,
    en: 'In Progress',
    zh: '進行中',
    iconClass: 'text-ehyo-indigo',
    bgClass: 'bg-ehyo-indigo/10',
    badgeClass: 'text-ehyo-indigo bg-ehyo-indigo/10',
    pulse: true,
  },
  planned: {
    icon: Clock,
    en: 'Planned',
    zh: '計畫中',
    iconClass: 'text-stone-400',
    bgClass: 'bg-stone-100',
    badgeClass: 'text-stone-400 bg-stone-100',
  },
};

const roadmapItems: {
  quarter: string;
  status: Status;
  en: { title: string; desc: string };
  zh: { title: string; desc: string };
}[] = [
  {
    quarter: '2025 Q1',
    status: 'completed',
    en: {
      title: 'Public Beta Launch',
      desc: 'Opening invitation code applications for the first batch of users to test the core cultural context engine.',
    },
    zh: {
      title: 'Beta 公開測試啟動',
      desc: '開放邀請碼申請，邀請首批使用者測試核心的文化語境引擎。',
    },
  },
];

const text = {
  en: {
    tag: "What's ahead",
    title: 'Our Roadmap',
    sub: 'A transparent look at where EhYo is headed.',
    cta_title: 'What features do you want to see?',
    cta_sub: 'EhYo aims to return learning to the essence of humanity. We value feedback from every user.',
    cta_btn: 'Join the discussion',
  },
  zh: {
    tag: '未來展望',
    title: '開發地圖',
    sub: '透明呈現 EhYo 的下一步方向。',
    cta_title: '你想看到什麼功能？',
    cta_sub: 'EhYo 致力讓學習回歸人文本質，我們重視每一位使用者的回饋。',
    cta_btn: '加入討論',
  },
};

export const RoadmapPage = ({ lang }: { lang: Language }) => {
  const t = text[lang];

  return (
    <div className="min-h-screen bg-ehyo-bg pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-ehyo-sage/10 text-ehyo-sage rounded-full mb-6">
            <Target size={16} strokeWidth={1.5} />
            <span className="text-xs font-bold tracking-widest uppercase">{t.tag}</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-ehyo-text mb-4">{t.title}</h1>
          <p className="text-stone-500 text-lg font-light max-w-xl mx-auto">{t.sub}</p>
        </div>

        {/* Roadmap Cards */}
        <div className="flex flex-col gap-5 mb-16">
          {roadmapItems.map((item, i) => {
            const s = statusConfig[item.status];
            const Icon = s.icon;
            const content = item[lang];
            return (
              <div
                key={i}
                className="bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-8 flex gap-6 items-start"
              >
                {/* Status Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full ${s.bgClass} flex items-center justify-center relative`}>
                  {s.pulse && (
                    <span className={`absolute inset-0 rounded-full ${s.bgClass} animate-ping opacity-60`} />
                  )}
                  <Icon size={22} strokeWidth={1.5} className={s.iconClass} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-semibold text-stone-400 tracking-wide">{item.quarter}</span>
                    <span className={`text-xs font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full ${s.badgeClass}`}>
                      {s[lang]}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-ehyo-text mb-2">{content.title}</h3>
                  <p className="text-stone-500 leading-relaxed font-light">{content.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Block */}
        <div className="bg-ehyo-text rounded-3xl px-8 py-16 text-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">{t.cta_title}</h2>
            <p className="text-stone-400 mb-10 font-light max-w-lg mx-auto leading-relaxed">{t.cta_sub}</p>
            <a
              href="https://discord.com/invite/htVu7kyx3m"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-ehyo-text rounded-full font-semibold hover:bg-ehyo-indigo hover:text-white transition-all duration-300 shadow-lg"
            >
              <Rocket size={18} strokeWidth={1.5} />
              {t.cta_btn}
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
