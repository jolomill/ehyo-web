import { Mic, Tag, Brain, Wrench, BookText, Package, FlaskConical, Headphones } from 'lucide-react';

type Language = 'en' | 'zh';

const entries = [
  {
    date: '2026/5/7',
    version: 'v1.0.9',
    items: [
      { icon: Headphones, zh: { label: '聽寫練習卡', desc: '新增「聽寫練習」模式！現在你可以透過聽力測驗來練習拼寫單字，讓聽覺與書寫記憶同步提升！' }, en: { label: 'Dictation Practice Cards', desc: 'The new "Dictation Mode" is here! You can now practice spelling words through listening tests, helping you sync your listening and writing skills for more effective learning.' } },
      { icon: Wrench, zh: { label: '經驗值系統計算架構修復', desc: '' }, en: { label: 'XP System', desc: 'Fixed issues with the experience point calculation architecture.' } },
      { icon: Wrench, zh: { label: '語言隔離機制改善', desc: '' }, en: { label: 'Language Isolation', desc: 'Improved the isolation mechanism to ensure a more consistent language environment.' } },
    ],
  },
  {
    date: '2025/5/4',
    version: 'v1.0.8',
    items: [
      { icon: Mic, zh: { label: '跟讀單句錄音', desc: '你可以一邊錄下自己的聲音，一邊對照原音練習，讓口說能力更進步！' }, en: { label: 'Sentence Shadowing', desc: 'Record yourself while listening to the original audio — practice speaking and hear the difference in real time.' } },
      { icon: Tag, zh: { label: '單字標記功能', desc: '查詢過的單字會自動標注起來，複習時一目了然，方便隨時查看。' }, en: { label: 'Word Marking', desc: 'Words you look up are automatically highlighted, so you can spot and review them at a glance.' } },
      { icon: Brain, zh: { label: '經驗值系統視覺化', desc: '你的進度將直接反映在首頁的大腦圖上！現在可以更即時地感受自己的成長與變化～' }, en: { label: 'XP Visualization', desc: 'Your progress now shows up directly on the brain map on the home screen — feel your growth in real time.' } },
    ],
  },
  {
    date: '2025/4/26',
    version: 'v1.0.7',
    items: [
      { icon: Wrench, zh: { label: '修正 bugs', desc: '' }, en: { label: 'Bug fixes', desc: '' } },
      { icon: BookText, zh: { label: '增加：閱讀文法講解', desc: '' }, en: { label: 'Added: Grammar explanations in reading', desc: '' } },
    ],
  },
  {
    date: '2025/4/21',
    version: 'v1.0.6',
    items: [
      { icon: Package, zh: { label: '引入優惠碼系統', desc: '' }, en: { label: 'Promo code system', desc: '' } },
      { icon: Wrench, zh: { label: '修正 bugs', desc: '' }, en: { label: 'Bug fixes', desc: '' } },
    ],
  },
  {
    date: '2025/4/16',
    version: undefined,
    items: [
      { icon: FlaskConical, zh: { label: 'Beta 測試啟動', desc: '邀請首批測試者。' }, en: { label: 'Beta Launch', desc: 'First batch of testers invited.' } },
    ],
  },
];

const text = {
  zh: { title: '更新日誌', sub: 'EhYo 的每一步成長，都記在這裡。' },
  en: { title: 'Changelog', sub: "Every step of EhYo's growth, recorded here." },
};

export const ChangelogPage = ({ lang }: { lang: Language }) => {
  const t = text[lang];
  return (
    <div className="min-h-screen bg-ehyo-bg pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-2xl">
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-ehyo-text mb-4">{t.title}</h1>
        <p className="text-stone-500 mb-16">{t.sub}</p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-stone-200 ml-[7px]" />
          <div className="flex flex-col gap-12">
            {entries.map((entry, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-ehyo-indigo border-2 border-ehyo-bg mt-1 z-10" />
                <div className="flex-1 pb-2">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-sm text-stone-400">{entry.date}</span>
                    {entry.version && (
                      <span className="text-xs font-bold tracking-widest text-ehyo-indigo uppercase bg-ehyo-indigo/10 px-2 py-0.5 rounded-full">
                        {entry.version}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    {entry.items.map((item, j) => {
                      const content = item[lang];
                      return (
                        <div key={j} className="flex gap-3 items-start">
                          <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-white border border-stone-100 flex items-center justify-center text-ehyo-indigo shadow-sm">
                            <item.icon size={15} strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="font-medium text-ehyo-text text-sm">{content.label}</p>
                            {content.desc && <p className="text-stone-500 text-sm leading-relaxed mt-0.5">{content.desc}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
