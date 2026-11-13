/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronRight, Route, Sparkles, Check } from 'lucide-react';
import { EhYoMark } from './EhYoMark';

// "Describe yourself, see how EhYo fits": the visitor fills in one sentence and the
// three parts of EhYo line up in the order that suits them, with a day plan below.

type Lang = 'en' | 'zh';
type Level = 'beginner' | 'experienced' | 'advanced';
const LEVELS: Level[] = ['beginner', 'experienced', 'advanced'];
type Count = 1 | 2 | 3;
type Time = 15 | 30 | 60;
type Goal = 'travel' | 'exam' | 'work' | 'content' | 'maintain';
type Part = 'path' | 'ehyo' | 'toolkit';
// The languages EhYo offers (list to be confirmed by the team)
const LANGS = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ar', 'hi', 'th', 'vi', 'id', 'ms', 'tr', 'nl', 'pl', 'sv', 'no', 'da', 'fi', 'el', 'cs', 'uk', 'he', 'tl'] as const;
type LangKey = (typeof LANGS)[number];
type Pick = { key: LangKey; level: Level };

const GOALS: Goal[] = ['content', 'travel', 'exam', 'work', 'maintain'];
const TIMES: Time[] = [15, 30, 60];

const ORDER: Record<Level, Part[]> = {
  beginner: ['path', 'ehyo', 'toolkit'],
  experienced: ['toolkit', 'ehyo', 'path'],
  advanced: ['toolkit', 'ehyo', 'path'],
};

const TEXT = {
  zh: {
    title: '你的 EhYo 學習方式',
    sub: '點一下句子裡的底線，換成你的狀況。下面會排出最適合你的學法。',
    s: { learning: '我在自學', langsUnit: '語言', is: '是', comma: '，', and: '、', perDay: '每天有', canLearn: '可以學', for: '學語言是為了', end: '。' },
    ph: { count: '幾種', lang: '哪種語言', level: '程度', time: '多少時間', goal: '什麼目標' },
    count: { 1: '一種', 2: '兩種', 3: '三種以上' } as Record<Count, string>,
    lang: { en: '英文', zh: '中文', ja: '日文', ko: '韓文', es: '西班牙文', fr: '法文', de: '德文', it: '義大利文', pt: '葡萄牙文', ru: '俄文', ar: '阿拉伯文', hi: '印地文', th: '泰文', vi: '越南文', id: '印尼文', ms: '馬來文', tr: '土耳其文', nl: '荷蘭文', pl: '波蘭文', sv: '瑞典文', no: '挪威文', da: '丹麥文', fi: '芬蘭文', el: '希臘文', cs: '捷克文', uk: '烏克蘭文', he: '希伯來文', tl: '菲律賓文' } as Record<LangKey, string>,
    level: { beginner: '初學者', experienced: '有基礎', advanced: '進階想要更好' } as Record<Level, string>,
    time: { 15: '15 分鐘以內', 30: '30 分鐘左右', 60: '一小時以上' } as Record<Time, string>,
    goal: { content: '看懂喜歡的內容', travel: '旅行與日常會話', exam: '考試或檢定', work: '工作需要', maintain: '維持不退步' } as Record<Goal, string>,
    soon: '即將推出',
    boost: '補強',
    focus: '最常用',
    route: { beginner: '先打基礎，再用喜歡的素材複習', experienced: '先用素材自學，再針對弱點補強', advanced: '用道地的素材精進，再把細節補到位' } as Record<Level, string>,
    waiting: '填好上面的句子，EhYo 會為你排出學法',
    building: 'EhYo 正在為你安排學習方式',
    multiNote: '每個語言各自記錄、各走各的順序，進度不會混在一起。',
    dayTitle: (t: string) => `每天 ${t}，可以這樣安排`,
    dayFor: (l: string) => `以${l}為例`,
    min: '分鐘',
    parts: {
      path: { name: '個人化學習路徑' },
      ehyo: { name: 'EhYo' },
      toolkit: { name: '自學工具組' },
    },
    cards: {
      beginner: {
        path: { t: '跟著路徑打基礎', d: 'EhYo 依你的目標排好文法、單字和練習，不用煩惱先學什麼。' },
        ehyo: { t: 'EhYo 記住你卡住的地方', d: '練習時的錯誤都會被記下來，下一步就幫你安排複習。' },
        toolkit: { t: '用喜歡的素材複習', d: (m: string) => `拿${m}來讀、來聽，把剛學的東西用在真實內容裡。` },
      },
      experienced: {
        toolkit: { t: '照你的興趣自學', d: (m: string) => `直接用${m}學，看不懂點一下就懂，生字自動整理好。` },
        ehyo: { t: 'EhYo 找出你的弱點', d: '自學時犯的錯，EhYo 會整理成你的錯誤模式，不用自己記。' },
        path: { t: '針對弱點補強', d: '把不熟的地方排成專屬課程，練熟了再回到素材。' },
      },
      advanced: {
        toolkit: { t: '用道地的素材挑戰自己', d: (m: string) => `直接讀、直接聽${m}，細微的用法差異點一下就懂，生字和句型自動整理好。` },
        ehyo: { t: 'EhYo 抓出你沒發現的習慣', d: '用字重複、說法不夠自然這些小地方，EhYo 也會記下來，整理成你的錯誤模式。' },
        path: { t: '把最後的細節補起來', d: '針對你的錯誤模式排出專屬課程，讓表達更精準、更自然。' },
      },
    },
    material: {
      content: '喜歡的劇、小說和歌詞', travel: '旅遊影片和日常對話', exam: '程度剛好的文章和範文', work: '工作信件和產業新聞', maintain: '平常會看的新聞和文章',
    } as Record<Goal, string>,
    tools: {
      content: ['閱讀', '聽力'], travel: ['聽力', '跟讀'], exam: ['寫作批改', '單字'], work: ['寫作', '閱讀'], maintain: ['單字複習', '跨裝置同步'],
    } as Record<Goal, string[]>,
    acts: {
      path: '學習路徑的一個單元', read: '讀或看喜歡的素材', write: '寫一段，馬上批改', shadow: '跟讀練口說', review: '單字複習', boost: '學習路徑：補強弱點',
    },
  },
  en: {
    title: 'How EhYo fits you',
    sub: 'Tap the underlined words to describe yourself. EhYo lines up the way that suits you below.',
    s: { learning: "I'm teaching myself", langsUnit: '', is: 'at', comma: ',', and: ',', perDay: 'I have', canLearn: 'a day to learn', for: 'and I want to', end: '.' },
    ph: { count: 'how many', lang: 'which language', level: 'what level', time: 'how long', goal: 'do what' },
    count: { 1: 'one language', 2: 'two languages', 3: 'three or more languages' } as Record<Count, string>,
    lang: { en: 'English', zh: 'Chinese', ja: 'Japanese', ko: 'Korean', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese', ru: 'Russian', ar: 'Arabic', hi: 'Hindi', th: 'Thai', vi: 'Vietnamese', id: 'Indonesian', ms: 'Malay', tr: 'Turkish', nl: 'Dutch', pl: 'Polish', sv: 'Swedish', no: 'Norwegian', da: 'Danish', fi: 'Finnish', el: 'Greek', cs: 'Czech', uk: 'Ukrainian', he: 'Hebrew', tl: 'Tagalog' } as Record<LangKey, string>,
    level: { beginner: 'beginner level', experienced: 'intermediate level', advanced: 'advanced level, aiming higher' } as Record<Level, string>,
    time: { 15: '15 minutes or less', 30: 'about 30 minutes', 60: 'an hour or more' } as Record<Time, string>,
    goal: { content: 'enjoy content I love', travel: 'travel and chat', exam: 'pass an exam', work: 'use it at work', maintain: 'keep what I know' } as Record<Goal, string>,
    soon: 'Coming soon',
    boost: 'Fix weak spots',
    focus: 'Use most',
    route: { beginner: 'Build the basics first, then review with material you love', experienced: 'Learn from your own material first, then fix the weak spots', advanced: 'Sharpen yourself on native material, then polish the details' } as Record<Level, string>,
    waiting: 'Fill in the sentence above and EhYo will line up your way to learn',
    building: 'EhYo is putting your plan together',
    multiNote: 'Each language keeps its own record and its own order, so progress never gets mixed up.',
    dayTitle: (t: string) => `With ${t} a day, you could`,
    dayFor: (l: string) => `For ${l}`,
    min: 'min',
    parts: {
      path: { name: 'Personal Learning Path' },
      ehyo: { name: 'EhYo' },
      toolkit: { name: 'Self-Study Toolkit' },
    },
    cards: {
      beginner: {
        path: { t: 'Build your basics on the path', d: 'EhYo lines up grammar, words and practice for your goal, so you never wonder what to learn first.' },
        ehyo: { t: 'EhYo remembers where you got stuck', d: 'Every mistake you make in practice is noted, and your next step reviews it.' },
        toolkit: { t: 'Review with material you love', d: (m: string) => `Read and listen to ${m}, and use what you just learned on real content.` },
      },
      experienced: {
        toolkit: { t: 'Learn from what you enjoy', d: (m: string) => `Learn straight from ${m}. Tap anything you don't get, and new words are sorted for you.` },
        ehyo: { t: 'EhYo finds your weak spots', d: 'The mistakes you make while studying become your mistake patterns, without you keeping notes.' },
        path: { t: 'Fix the weak spots', d: "What you're unsure of becomes a course made for you; once it sticks, go back to your material." },
      },
      advanced: {
        toolkit: { t: 'Challenge yourself with native material', d: (m: string) => `Read and listen to ${m} as they are. Tap any fine shade of meaning, and new words and patterns are sorted for you.` },
        ehyo: { t: "EhYo catches habits you don't notice", d: 'Small things like repeated words or phrasing that sounds off are noted too, and become your mistake patterns.' },
        path: { t: 'Polish the last details', d: 'A course built on your mistake patterns makes what you say more precise and more natural.' },
      },
    },
    material: {
      content: 'the shows, novels and lyrics you love', travel: 'travel videos and everyday talk', exam: 'articles and model essays at your level', work: 'work emails and industry news', maintain: 'the news and articles you already read',
    } as Record<Goal, string>,
    tools: {
      content: ['Reading', 'Listening'], travel: ['Listening', 'Shadowing'], exam: ['Writing feedback', 'Vocabulary'], work: ['Writing', 'Reading'], maintain: ['Vocabulary review', 'Sync across devices'],
    } as Record<Goal, string[]>,
    acts: {
      path: 'One learning path unit', read: 'Read or watch what you love', write: 'Write a paragraph, get feedback', shadow: 'Shadow to practise speaking', review: 'Vocabulary review', boost: 'Learning path: fix weak spots',
    },
  },
};

type Act = keyof typeof TEXT.zh.acts;
// A day's plan: activity and minutes, by time and level
const DAY: Record<Time, Record<Level, [Act, number][]>> = {
  15: { beginner: [['path', 10], ['review', 5]], experienced: [['read', 10], ['review', 5]], advanced: [['read', 10], ['boost', 5]] },
  30: { beginner: [['path', 15], ['read', 10], ['review', 5]], experienced: [['read', 15], ['write', 10], ['review', 5]], advanced: [['read', 15], ['write', 10], ['boost', 5]] },
  60: { beginner: [['path', 25], ['read', 20], ['write', 10], ['review', 5]], experienced: [['read', 25], ['write', 15], ['shadow', 10], ['boost', 10]], advanced: [['read', 25], ['write', 20], ['shadow', 10], ['boost', 5]] },
};
const ACT_PART: Record<Act, Part> = { path: 'path', boost: 'path', read: 'toolkit', write: 'toolkit', shadow: 'toolkit', review: 'ehyo' };
const PART_STYLE: Record<Part, { bar: string; soft: string; text: string }> = {
  path: { bar: 'bg-ehyo-indigo', soft: 'bg-ehyo-indigo/10', text: 'text-ehyo-indigo' },
  ehyo: { bar: 'bg-ehyo-sage', soft: 'bg-ehyo-sage/15', text: 'text-[#5E6B45]' },
  toolkit: { bar: 'bg-ehyo-coral', soft: 'bg-ehyo-coral/15', text: 'text-[#B23A5E]' },
};

// ---------------------------------------------------------------------------
// One underlined word in the sentence that opens a short list of choices
// ---------------------------------------------------------------------------
function Choice<T extends string | number>({ value, options, label, onChange, render, placeholder }: {
  value: T | undefined; options: readonly T[]; label: string; onChange: (v: T) => void; render: (v: T) => string; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  // How far the menu shifts left so it stays on screen
  const [shift, setShift] = useState(0);
  const wrap = useRef<HTMLSpanElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    wrap.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]);
  return (
    <span ref={wrap} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        aria-label={value === undefined ? `${label}: ${placeholder}` : `${label}: ${render(value)}`}
        onClick={() => {
          const r = wrap.current?.getBoundingClientRect();
          const menuW = options.length > 8 ? Math.min(352, window.innerWidth - 32) : 192;
          setShift(r ? Math.max(Math.min(0, window.innerWidth - 16 - menuW - r.left), 16 - r.left) : 0);
          setOpen((o) => !o);
        }}
        className={`inline-flex items-baseline gap-1 border-b-2 border-dashed ${value === undefined ? 'text-ehyo-indigo/50 border-ehyo-indigo/50' : 'text-ehyo-indigo border-ehyo-indigo/40'} hover:border-ehyo-indigo hover:bg-ehyo-indigo/5 rounded-t-md px-1 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ehyo-indigo/50`}
      >
        {value === undefined ? <span className="inline-block w-[4em]" aria-hidden="true">&nbsp;</span> : render(value)}
        {value === undefined && <ChevronDown size={18} className={`self-center transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            style={{ left: shift }}
            className={`absolute top-full mt-2 z-30 ${options.length > 8 ? 'grid grid-cols-2 w-[min(22rem,calc(100vw-2rem))] max-h-80 overflow-y-auto' : 'flex flex-col w-48'} p-1.5 bg-white rounded-2xl border border-stone-100 shadow-xl font-sans text-base`}
          >
            {options.map((o) => (
              <button
                key={String(o)}
                type="button"
                role="menuitemradio"
                aria-checked={o === value}
                onClick={() => { onChange(o); setOpen(false); }}
                className={`flex items-center justify-between gap-3 text-left whitespace-nowrap px-3 py-2.5 rounded-xl outline-none transition-colors duration-150 focus-visible:bg-ehyo-indigo/10 ${o === value ? 'text-ehyo-indigo font-semibold bg-ehyo-indigo/5' : 'text-ehyo-text hover:bg-stone-50'}`}
              >
                {render(o)}
                {o === value && <Check size={16} aria-hidden="true" />}
              </button>
            ))}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// ---------------------------------------------------------------------------
// One of the three parts, in the place this visitor's order puts it
// ---------------------------------------------------------------------------
export type StudyPart = Part;
export type StudyDetailContext = { goal: Goal; level: Level; lang: Lang };
type RenderDetail = (part: Part, ctx: StudyDetailContext) => React.ReactNode;

const PartIcon: React.FC<{ part: Part; size?: 'sm' | 'md' }> = ({ part, size = 'md' }) => {
  if (part === 'ehyo') return <EhYoMark className={size === 'sm' ? 'w-9' : 'w-12'} />;
  const Icon = part === 'path' ? Route : BookOpen;
  return <Icon size={size === 'sm' ? 18 : 22} strokeWidth={1.75} />;
};

const Badges: React.FC<{ part: Part; level: Level; lang: Lang }> = ({ part, level, lang }) => {
  const t = TEXT[lang];
  if (part !== 'path') return null;
  return (
    <>
      {level !== 'beginner' && <span className="text-xs font-bold rounded-full px-2 py-0.5 bg-ehyo-indigo text-white">{t.boost}</span>}
      <span className="text-xs font-semibold rounded-full px-2 py-0.5 bg-ehyo-coral/15 text-[#B23A5E]">{t.soon}</span>
    </>
  );
};

const cardText = (part: Part, level: Level, goal: Goal, lang: Lang) => {
  const t = TEXT[lang];
  const c = t.cards[level][part];
  return { title: c.t, desc: typeof c.d === 'function' ? c.d(t.material[goal]) : c.d };
};

// The open part: what it is for this visitor, then its own material
const Detail: React.FC<{ part: Part; level: Level; goal: Goal; lang: Lang; renderDetail?: RenderDetail }> = ({ part, level, goal, lang, renderDetail }) => {
  const t = TEXT[lang];
  const { title, desc } = cardText(part, level, goal, lang);
  const st = PART_STYLE[part];
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className={`text-sm font-semibold ${st.text}`}>{t.parts[part].name}</span>
        <Badges part={part} level={level} lang={lang} />
      </div>
      <h4 className="font-sans text-xl md:text-2xl font-bold text-ehyo-text leading-snug mb-3">{title}</h4>
      <p className="text-stone-600 leading-relaxed">{desc}</p>
      {part === 'toolkit' && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-stone-500">{t.focus}</span>
          {t.tools[goal].map((x) => (
            <span key={x} className="rounded-full px-2.5 py-1 bg-ehyo-bg text-ehyo-text border border-stone-100">{x}</span>
          ))}
        </div>
      )}
      {renderDetail && <div className="mt-8">{renderDetail(part, { goal, level, lang })}</div>}
    </div>
  );
};

// One language's route, top to bottom: the three parts in this visitor's order.
// Picking a part opens its detail beside the list (under it on small screens).
const Lane: React.FC<{ id: string; level: Level; goal: Goal; lang: Lang; reduce: boolean; renderDetail?: RenderDetail }> = ({ id, level, goal, lang, reduce, renderDetail }) => {
  const t = TEXT[lang];
  const order = ORDER[level];
  const [sel, setSel] = useState<Part>(order[0]);
  // A new order starts from its first step
  useEffect(() => { setSel(ORDER[level][0]); }, [level]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <div className="lg:col-span-5">
        <p className="text-stone-500 mb-5">{t.route[level]}</p>
        <LayoutGroup id={id}>
          <ol role="tablist" aria-orientation="vertical" className="list-none p-0 m-0">
            {order.map((part, i) => {
              const active = sel === part;
              const st = PART_STYLE[part];
              const { title, desc } = cardText(part, level, goal, lang);
              const last = i === order.length - 1;
              return (
                <motion.li key={part} layout={!reduce} layoutId={`${id}-${part}`} transition={{ type: 'spring', stiffness: 260, damping: 30 }} className="flex gap-4">
                  {/* the step and the line down to the next one */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <span className={`w-12 h-12 rounded-full flex items-center justify-center font-sans text-lg font-bold transition-colors duration-200 ${active ? `${st.bar} text-white` : 'bg-white border border-stone-200 text-stone-400'}`}>{i + 1}</span>
                    {!last && <span className="w-px flex-1 min-h-6 bg-stone-200 my-1" aria-hidden="true" />}
                  </div>
                  <div className={`flex-1 min-w-0 ${last ? '' : 'pb-4'}`}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSel(part)}
                      className={`w-full text-left rounded-2xl p-4 md:p-5 border transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ehyo-indigo/50 ${active ? 'bg-white border-stone-100 shadow-sm' : 'border-transparent hover:bg-white/60'}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`h-10 min-w-10 px-1.5 rounded-xl flex items-center justify-center flex-shrink-0 ${st.soft} ${st.text}`}><PartIcon part={part} size="sm" /></span>
                        <span className="flex-1 min-w-0">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className={`text-sm font-semibold ${st.text}`}>{t.parts[part].name}</span>
                            <Badges part={part} level={level} lang={lang} />
                          </span>
                          <span className={`block font-sans text-lg font-bold leading-snug ${active ? 'text-ehyo-text' : 'text-stone-600'}`}>{title}</span>
                        </span>
                        <ChevronDown size={18} className={`lg:hidden flex-shrink-0 transition-transform duration-200 ${active ? 'text-ehyo-indigo rotate-180' : 'text-stone-300'}`} aria-hidden="true" />
                        <ChevronRight size={18} className={`hidden lg:block flex-shrink-0 transition-colors duration-200 ${active ? 'text-ehyo-indigo' : 'text-stone-300'}`} aria-hidden="true" />
                      </span>
                      {!active && <span className="block mt-2 text-sm text-stone-500 leading-relaxed line-clamp-2">{desc}</span>}
                    </button>
                    {/* small screens: the detail opens right here */}
                    {active && (
                      <div className="lg:hidden mt-3 bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
                        <Detail part={part} level={level} goal={goal} lang={lang} renderDetail={renderDetail} />
                      </div>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </LayoutGroup>
      </div>
      <div className="hidden lg:block lg:col-span-7 lg:sticky lg:top-24">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${id}-${level}-${sel}`}
            role="tabpanel"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8 min-h-[480px]"
          >
            <Detail part={sel} level={level} goal={goal} lang={lang} renderDetail={renderDetail} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// The day plan: one bar split by minutes, coloured by which part each activity uses
const DayPlan: React.FC<{ time: Time; level: Level; lang: Lang; who: string; reduce: boolean }> = ({ time, level, lang, who, reduce }) => {
  const t = TEXT[lang];
  const plan = DAY[time][level];
  const total = plan.reduce((s, [, m]) => s + m, 0);
  return (
    <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
        <h3 className="font-sans text-xl font-bold text-ehyo-text">{t.dayTitle(t.time[time])}</h3>
        <span className="text-sm text-stone-500">{t.dayFor(who)}</span>
      </div>
      <div className="flex h-4 rounded-full overflow-hidden bg-stone-100 gap-0.5" aria-hidden="true">
        {plan.map(([a, m], i) => (
          <motion.span
            key={`${time}-${level}-${i}`}
            className={`h-full ${PART_STYLE[ACT_PART[a]].bar}`}
            initial={reduce ? false : { width: 0 }}
            animate={{ width: `${(m / total) * 100}%` }}
            transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
        {plan.map(([a, m], i) => {
          const part = ACT_PART[a];
          return (
            <li key={i} className="flex items-start gap-3">
              <span className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${PART_STYLE[part].bar}`} aria-hidden="true" />
              <span>
                <span className="block text-ehyo-text font-semibold">{t.acts[a]}</span>
                <span className="block text-sm text-stone-500">
                  {m} {t.min}{(a === 'path' || a === 'boost') && ` · ${t.soon}`}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

// While the sentence has blanks, EhYo waits; once it is complete, EhYo works for a moment
// before the route appears, so the result never pops in from nothing.
const Loader: React.FC<{ building: boolean; filled: number; total: number; lang: Lang; reduce: boolean }> = ({ building, filled, total, lang, reduce }) => {
  const t = TEXT[lang];
  const loop = reduce ? undefined : { duration: building ? 0.9 : 2.4, repeat: Infinity, ease: 'easeInOut' as const };
  return (
    <div className="mt-14 md:mt-20 min-h-[320px] rounded-3xl border border-dashed border-stone-200 bg-white/50 flex flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <motion.div
        animate={reduce ? undefined : { scale: building ? [1, 1.08, 1] : [1, 1.04, 1], opacity: building ? 1 : [0.55, 1, 0.55] }}
        transition={loop}
      >
        <EhYoMark className="w-28" />
      </motion.div>
      <div className="flex items-center gap-2 text-ehyo-indigo font-semibold" role="status">
        <motion.span
          animate={reduce || !building ? { rotate: 0, scale: 1 } : { rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: reduce || !building ? 0 : Infinity }}
        >
          <Sparkles size={16} aria-hidden="true" />
        </motion.span>
        <span className={building ? '' : 'text-stone-500 font-medium'}>{building ? t.building : t.waiting}</span>
        <span className="flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((d) => (
            <motion.span
              key={d}
              className="w-1.5 h-1.5 rounded-full bg-ehyo-indigo"
              animate={reduce ? { opacity: 0.6 } : { opacity: [0.2, 1, 0.2] }}
              transition={{ duration: building ? 0.6 : 1.2, repeat: Infinity, delay: d * (building ? 0.1 : 0.2) }}
            />
          ))}
        </span>
      </div>
      {/* how much of the sentence is filled in */}
      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${i < filled ? 'bg-ehyo-indigo' : 'bg-stone-200'}`} />
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
export const StudyBuilder: React.FC<{ lang: Lang; renderDetail?: RenderDetail }> = ({ lang, renderDetail }) => {
  const t = TEXT[lang];
  const reduce = !!useReducedMotion();
  // Everything starts blank; the route appears once the sentence is complete
  const [count, setCountState] = useState<Count>();
  const [picks, setPicks] = useState<Partial<Pick>[]>([]);
  const [time, setTime] = useState<Time>();
  const [goal, setGoal] = useState<Goal>();
  const [laneSel, setLaneSel] = useState(0);

  const setCount = (c: Count) => {
    setCountState(c);
    setPicks((ps) => Array.from({ length: c }, (_, i) => ps[i] ?? {}));
    setLaneSel(0);
  };
  // Every language appears once: picking one already listed swaps the two
  const setKey = (i: number, key: LangKey) => setPicks((ps) => {
    const j = ps.findIndex((p) => p.key === key);
    return ps.map((p, k) => (k === i ? { ...p, key } : k === j ? { ...p, key: ps[i].key } : p));
  });
  const setLevel = (i: number, level: Level) => setPicks((ps) => ps.map((p, k) => (k === i ? { ...p, level } : p)));

  const done = (p: Partial<Pick>): p is Pick => !!p.key && !!p.level;
  const ready = !!count && picks.length === count && picks.every(done) && !!time && !!goal;
  const total = 1 + 2 * (count ?? 1) + 2;
  const filled = (count ? 1 : 0) + picks.reduce((n, p) => n + (p.key ? 1 : 0) + (p.level ? 1 : 0), 0) + (time ? 1 : 0) + (goal ? 1 : 0);
  // wait while there are blanks; build for a moment once there are none; then show
  const [stage, setStage] = useState<'wait' | 'build' | 'show'>('wait');
  useEffect(() => {
    if (!ready) { setStage('wait'); return; }
    if (stage !== 'wait') return;
    if (reduce) { setStage('show'); return; }
    setStage('build');
    const id = setTimeout(() => setStage('show'), 1400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  const full = picks.filter(done);
  const lane = Math.min(laneSel, Math.max(full.length - 1, 0));
  const cur = full[lane];

  const L = (k: LangKey) => t.lang[k];
  const lv = (v: Level) => t.level[v];
  const s = t.s;
  const sp = lang === 'zh' ? '' : ' ';

  return (
    <div>
      {/* The sentence the visitor fills in */}
      <div className="font-rounded text-lg md:text-[1.375rem] font-medium leading-[2.1] text-ehyo-text max-w-6xl mx-auto text-center">
        <p>
          {s.learning}{sp}
          <Choice label={s.learning} value={count} options={[1, 2, 3] as const} onChange={setCount} render={(v) => t.count[v]} placeholder={t.ph.count} />
          {s.langsUnit}{picks.length > 0 ? (lang === 'zh' ? '：' : ': ') : (lang === 'zh' ? '，' : ',')}
          {picks.map((p, i) => (
            <span key={i} className="whitespace-nowrap">
              <Choice label={`${s.langsUnit || 'Language'} ${i + 1}`} value={p.key} options={LANGS} onChange={(k) => setKey(i, k)} render={L} placeholder={t.ph.lang} />
              {sp}{s.is}{sp}
              <Choice label={p.key ? L(p.key) : t.ph.level} value={p.level} options={LEVELS} onChange={(v) => setLevel(i, v)} render={lv} placeholder={t.ph.level} />
              {i < picks.length - 1 ? s.and : s.comma}{sp}
            </span>
          ))}
        </p>
        {/* the time and the goal start their own line */}
        <p>
          {s.perDay}{sp}
          <span className="whitespace-nowrap"><Choice label={s.perDay} value={time} options={TIMES} onChange={setTime} render={(v) => t.time[v]} placeholder={t.ph.time} />{sp}{s.canLearn}{s.comma}</span>
          {sp}{s.for}{sp}
          <span className="whitespace-nowrap"><Choice label={s.for} value={goal} options={GOALS} onChange={setGoal} render={(v) => t.goal[v]} placeholder={t.ph.goal} />{s.end}</span>
        </p>
      </div>

      {/* What fits: the route for the chosen language, then the day */}
      <div aria-live="polite">
      <AnimatePresence mode="wait">
      {stage !== 'show' && (
        <motion.div key="loader" initial={false} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          <Loader building={stage === 'build'} filled={filled} total={total} lang={lang} reduce={reduce} />
        </motion.div>
      )}
      {stage === 'show' && ready && cur && time && goal && (
      <motion.div
        key="result"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, y: 12 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mt-14 md:mt-20 space-y-12"
      >
        <div>
          {full.length > 1 ? (
            <div className="mb-8">
              <div role="tablist" aria-label={s.learning} className="inline-flex flex-wrap gap-1 p-1.5 rounded-2xl bg-stone-100">
                {full.map((p, i) => {
                  const active = lane === i;
                  return (
                    <button key={i} type="button" role="tab" aria-selected={active} onClick={() => setLaneSel(i)}
                      className={`rounded-xl px-4 py-2.5 text-left transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ehyo-indigo/50 ${active ? 'bg-white shadow-sm' : 'hover:bg-white/60'}`}>
                      <span className={`font-sans text-lg font-bold ${active ? 'text-ehyo-text' : 'text-stone-500'}`}>{L(p.key)}</span>
                      <span className="ml-2 text-sm text-stone-500">{t.level[p.level]}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 flex items-center gap-2 text-stone-500">
                <Sparkles size={16} className="text-ehyo-indigo flex-shrink-0" aria-hidden="true" />
                {t.multiNote}
              </p>
            </div>
          ) : (
            <h3 className="font-sans text-xl font-bold text-ehyo-text mb-2">{L(cur.key)} · {t.level[cur.level]}</h3>
          )}
          <Lane key={`${lane}-${cur.key}`} id={`lane-${lane}`} level={cur.level} goal={goal} lang={lang} reduce={reduce} renderDetail={renderDetail} />
        </div>
        <DayPlan time={time} level={cur.level} lang={lang} who={L(cur.key)} reduce={reduce} />
      </motion.div>
      )}
      </AnimatePresence>
      </div>
    </div>
  );
};
