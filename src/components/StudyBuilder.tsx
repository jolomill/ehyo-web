/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronRight, Route, Sparkles, Check, Laptop, Smartphone, RefreshCw } from 'lucide-react';
import { EhYoMark } from './EhYoMark';

// "Describe yourself, see how EhYo fits": the visitor fills in one sentence and the
// three parts of EhYo line up in the order that suits them, with a day plan below.

type Lang = 'en' | 'zh';
type Level = 'beginner' | 'experienced' | 'advanced';
const LEVELS: Level[] = ['beginner', 'experienced', 'advanced'];
type Count = 1 | 2 | 3;
type Goal = 'travel' | 'exam' | 'work' | 'content' | 'maintain';
type Part = 'path' | 'ehyo' | 'toolkit' | 'sync';
// The languages EhYo offers (list to be confirmed by the team)
const LANGS = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ar', 'hi', 'th', 'vi', 'id', 'ms', 'tr', 'nl', 'pl', 'sv', 'no', 'da', 'fi', 'el', 'cs', 'uk', 'he', 'tl'] as const;
type LangKey = (typeof LANGS)[number];
type Pick = { key: LangKey; level: Level };

const GOALS: Goal[] = ['content', 'travel', 'exam', 'work', 'maintain'];

const ORDER: Record<Level, Part[]> = {
  // every route ends the same way: review across devices
  beginner: ['path', 'ehyo', 'toolkit', 'sync'],
  experienced: ['toolkit', 'ehyo', 'path', 'sync'],
  advanced: ['toolkit', 'ehyo', 'path', 'sync'],
};

const TEXT = {
  zh: {
    title: '你的 EhYo 學習方式',
    sub: '點一下句子裡的底線，換成你的狀況。下面會排出最適合你的學法。',
    s: { learning: '我在自學', langsUnit: '語言', is: '是', comma: '，', and: '、', for: '學語言是為了', end: '。' },
    ph: { count: '幾種', lang: '哪種語言', level: '程度', goal: '什麼目標' },
    count: { 1: '一種', 2: '兩種', 3: '三種以上' } as Record<Count, string>,
    lang: { en: '英文', zh: '中文', ja: '日文', ko: '韓文', es: '西班牙文', fr: '法文', de: '德文', it: '義大利文', pt: '葡萄牙文', ru: '俄文', ar: '阿拉伯文', hi: '印地文', th: '泰文', vi: '越南文', id: '印尼文', ms: '馬來文', tr: '土耳其文', nl: '荷蘭文', pl: '波蘭文', sv: '瑞典文', no: '挪威文', da: '丹麥文', fi: '芬蘭文', el: '希臘文', cs: '捷克文', uk: '烏克蘭文', he: '希伯來文', tl: '菲律賓文' } as Record<LangKey, string>,
    level: { beginner: '初學者', experienced: '有基礎', advanced: '進階想要更好' } as Record<Level, string>,
    goal: { content: '看懂喜歡的內容', travel: '旅行與日常會話', exam: '考試或檢定', work: '工作需要', maintain: '維持不退步' } as Record<Goal, string>,
    boost: '補強',
    route: { beginner: '了解基礎架構後，練習使用', experienced: '先用素材自學，再針對弱點補強', advanced: '用道地的素材精進，再把細節補到位' } as Record<Level, string>,
    thinking: '正在思考如何幫助你中',
    multiNote: '每個語言各自記錄、各走各的順序，進度不會混在一起。',
    parts: {
      path: { name: '個人化學習路徑' },
      ehyo: { name: 'EhYo' },
      toolkit: { name: '自學工具組' },
      sync: { name: '跨裝置複習' },
    },
    cards: {
      // Beginner: learn how the language is built, then practise using it
      beginner: {
        path: { t: '依照你的目標安排課程', d: '從最基本的文法和單字開始，EhYo 依你的目標排好學習順序，一步步建立語言的基礎架構。' },
        ehyo: { t: '課程跟著你的程度', d: '卡住、答錯的地方，EhYo 都會記下來，隨時依你的程度調整課程，不會難到放棄，也不會簡單到無聊。' },
        toolkit: { t: '輕鬆複習，不用多想', d: (m: string) => `拿${m}來複習，不必自己排進度；EhYo 會隨時觀察你的複習狀況，幫你調整下一步。` },
        sync: { t: '在電腦學，用手機複習', d: '在電腦上專心上課、做筆記，通勤或排隊的空檔打開手機，複習今天學的單字和句型，紀錄自動同步。' },
      },
      // Experienced: learn from what you enjoy, let EhYo find the weak spots, then work on them
      experienced: {
        toolkit: { t: '用你的興趣來學', d: (m: string) => `已經有基礎，就直接用${m}學，看不懂點一下就懂，生字自動整理好。` },
        ehyo: { t: 'EhYo 找出你的弱項', d: '自學時犯過的錯，EhYo 會整理成你的錯誤模式，讓你清楚知道哪裡最需要加強。' },
        path: { t: '針對弱點安排課程', d: 'EhYo 把你的弱項排成專屬課程，不浪費時間在已經會的地方，練熟了再回到喜歡的素材。' },
        sync: { t: '在電腦學，用手機複習', d: '在電腦上讀素材、存生字，空檔打開手機，複習弱項和剛存的單字，紀錄自動同步。' },
      },
      // Advanced: keep using your own material, see the habits you miss, polish them away
      advanced: {
        toolkit: { t: '用自己的內容', d: '原文書、長篇報導、專業文章這類比較難的內容，都能直接匯入來讀；細微的用法差異點一下就懂，句型和說法自動整理好。' },
        ehyo: { t: 'EhYo 抓出你沒發現的習慣', d: '用字重複、說法不夠自然這些小地方，EhYo 也會記下來，讓你看見自己沒察覺的習慣。' },
        path: { t: '把最後的細節補起來', d: '針對這些習慣排出專屬課程，讓你的表達更精準、更自然。' },
        sync: { t: '在電腦學，用手機複習', d: '在電腦上精讀、寫作，空檔打開手機，複習道地說法和常犯的小錯，紀錄自動同步。' },
      },
    },
    material: {
      content: '喜歡的劇、小說和歌詞', travel: '旅遊影片和日常對話', exam: '程度剛好的文章和範文', work: '工作信件和產業新聞', maintain: '平常會看的新聞和文章',
    } as Record<Goal, string>,
    device: {
      desk: { name: '電腦', role: '專心學', hint: '大螢幕讀得久，筆記和單字順手存' },
      phone: { name: '手機', role: '隨時複習', hint: '通勤、排隊的空檔，複習剛存的內容' },
    },
    synced: '自動同步',
  },
  en: {
    title: 'How EhYo fits you',
    sub: 'Tap the underlined words to describe yourself. EhYo lines up the way that suits you below.',
    s: { learning: "I'm teaching myself", langsUnit: '', is: 'at', comma: ',', and: ',', for: 'I want to', end: '.' },
    ph: { count: 'how many', lang: 'which language', level: 'what level', goal: 'do what' },
    count: { 1: 'one language', 2: 'two languages', 3: 'three or more languages' } as Record<Count, string>,
    lang: { en: 'English', zh: 'Chinese', ja: 'Japanese', ko: 'Korean', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese', ru: 'Russian', ar: 'Arabic', hi: 'Hindi', th: 'Thai', vi: 'Vietnamese', id: 'Indonesian', ms: 'Malay', tr: 'Turkish', nl: 'Dutch', pl: 'Polish', sv: 'Swedish', no: 'Norwegian', da: 'Danish', fi: 'Finnish', el: 'Greek', cs: 'Czech', uk: 'Ukrainian', he: 'Hebrew', tl: 'Tagalog' } as Record<LangKey, string>,
    level: { beginner: 'beginner level', experienced: 'intermediate level', advanced: 'advanced level, aiming higher' } as Record<Level, string>,
    goal: { content: 'enjoy content I love', travel: 'travel and chat', exam: 'pass an exam', work: 'use it at work', maintain: 'keep what I know' } as Record<Goal, string>,
    boost: 'Fix weak spots',
    route: { beginner: 'Learn how the language is built, then put it to use', experienced: 'Learn from your own material first, then fix the weak spots', advanced: 'Sharpen yourself on native material, then polish the details' } as Record<Level, string>,
    thinking: 'Thinking about how to help you',
    multiNote: 'Each language keeps its own record and its own order, so progress never gets mixed up.',
    parts: {
      path: { name: 'Personal Learning Path' },
      ehyo: { name: 'EhYo' },
      toolkit: { name: 'Self-Study Toolkit' },
      sync: { name: 'Review on any device' },
    },
    cards: {
      beginner: {
        path: { t: 'Lessons planned around your goal', d: 'Start from the most basic grammar and words. EhYo puts them in order for your goal, so the structure of the language builds up step by step.' },
        ehyo: { t: 'Lessons that follow your level', d: "Wherever you get stuck or answer wrong, EhYo notes it and adjusts your lessons to your level as you go: never so hard you give up, never so easy you're bored." },
        toolkit: { t: 'Review without overthinking it', d: (m: string) => `Review with ${m}, no schedule to plan; EhYo keeps an eye on how your reviews go and adjusts what comes next.` },
        sync: { t: 'Study at the computer, review on your phone', d: "Take lessons and notes at the computer; on the commute or in a queue, open your phone to review today's words and patterns, with everything synced." },
      },
      experienced: {
        toolkit: { t: 'Learn through what you enjoy', d: (m: string) => `You know the basics, so learn straight from ${m}. Tap anything you don't get, and new words are sorted for you.` },
        ehyo: { t: 'EhYo finds your weak spots', d: 'The mistakes you make while studying become your mistake patterns, so you can see exactly what needs work.' },
        path: { t: 'Lessons built on your weak spots', d: "EhYo turns your weak spots into a course made for you, with no time spent on what you already know; once it sticks, go back to your material." },
        sync: { t: 'Study at the computer, review on your phone', d: 'Read and save words at the computer; in spare moments, open your phone to review your weak spots and new words, with everything synced.' },
      },
      advanced: {
        toolkit: { t: 'Bring your own content', d: 'Import harder reads like books in the original, long-form reporting and professional articles; tap any fine shade of meaning, and patterns and phrasing are sorted for you.' },
        ehyo: { t: "EhYo catches habits you don't notice", d: "Small things like repeated words or phrasing that sounds off are noted too, so you can see habits you didn't know you had." },
        path: { t: 'Polish the last details', d: 'A course built on those habits makes what you say more precise and more natural.' },
        sync: { t: 'Study at the computer, review on your phone', d: 'Read closely and write at the computer; in spare moments, review native phrasing and your small slips on your phone, with everything synced.' },
      },
    },
    material: {
      content: 'the shows, novels and lyrics you love', travel: 'travel videos and everyday talk', exam: 'articles and model essays at your level', work: 'work emails and industry news', maintain: 'the news and articles you already read',
    } as Record<Goal, string>,
    device: {
      desk: { name: 'Computer', role: 'Focused study', hint: 'A big screen for long reads; notes and words saved as you go' },
      phone: { name: 'Phone', role: 'Review anywhere', hint: "On the commute or in a queue, go over what you just saved" },
    },
    synced: 'Synced automatically',
  },
};

type Device = 'desk' | 'phone';
const PART_STYLE: Record<Part, { bar: string; soft: string; text: string }> = {
  path: { bar: 'bg-ehyo-indigo', soft: 'bg-ehyo-indigo/10', text: 'text-ehyo-indigo' },
  ehyo: { bar: 'bg-ehyo-sage', soft: 'bg-ehyo-sage/15', text: 'text-[#5E6B45]' },
  toolkit: { bar: 'bg-ehyo-coral', soft: 'bg-ehyo-coral/15', text: 'text-[#B23A5E]' },
  sync: { bar: 'bg-ehyo-text', soft: 'bg-stone-100', text: 'text-ehyo-text' },
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
        className={`group mx-1 inline-flex items-baseline gap-1 rounded-sm transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-ehyo-indigo/50 ${value === undefined ? 'text-ehyo-indigo/50' : 'text-ehyo-indigo'}`}
      >
        {value === undefined
          ? <span className="inline-block w-[4em] h-0 translate-y-[7px] border-b-2 border-dashed border-ehyo-indigo/45 group-hover:border-ehyo-indigo" aria-hidden="true" />
          : <span className="underline decoration-dashed decoration-2 underline-offset-[7px] decoration-ehyo-indigo/45 group-hover:decoration-ehyo-indigo transition-colors duration-200">{render(value)}</span>}
        {value === undefined && <ChevronDown size={18} className={`translate-y-[2px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />}
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
  if (part === 'ehyo') return <EhYoMark className={size === 'sm' ? 'w-7' : 'w-12'} />;
  const Icon = part === 'path' ? Route : part === 'sync' ? RefreshCw : BookOpen;
  return <Icon size={size === 'sm' ? 18 : 22} strokeWidth={1.75} />;
};

const Badges: React.FC<{ part: Part; level: Level; lang: Lang }> = ({ part, level, lang }) => {
  const t = TEXT[lang];
  if (part !== 'path' || level === 'beginner') return null;
  return <span className="text-xs font-bold rounded-full px-2 py-0.5 bg-ehyo-indigo text-white">{t.boost}</span>;
};

const cardText = (part: Part, level: Level, goal: Goal, lang: Lang) => {
  const t = TEXT[lang];
  const c = t.cards[level][part];
  return { title: c.t, desc: typeof c.d === 'function' ? c.d(t.material[goal]) : c.d };
};

// The open part: what it is for this visitor, then its own material
// Study at the computer, review on the phone: one record across both
const DevicePair: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = TEXT[lang];
  const one = (d: Device) => {
    const Icon = d === 'desk' ? Laptop : Smartphone;
    const st = d === 'desk' ? PART_STYLE.path : PART_STYLE.toolkit;
    return (
      <div className="flex-1 min-w-0 rounded-2xl bg-ehyo-bg p-4 flex items-start gap-3">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${st.soft} ${st.text}`}><Icon size={20} strokeWidth={1.75} /></span>
        <span className="min-w-0">
          <span className="block font-semibold text-ehyo-text">{t.device[d].name} · {t.device[d].role}</span>
          <span className="block text-sm text-stone-500 leading-relaxed">{t.device[d].hint}</span>
        </span>
      </div>
    );
  };
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {one('desk')}
      <span className="flex sm:flex-col items-center justify-center gap-1 text-ehyo-indigo text-xs font-semibold whitespace-nowrap" aria-hidden="true">
        <RefreshCw size={16} />{t.synced}
      </span>
      {one('phone')}
    </div>
  );
};

// `inline`: opened under its own card on small screens, where the card already shows the name and title
const Detail: React.FC<{ part: Part; level: Level; goal: Goal; lang: Lang; renderDetail?: RenderDetail; inline?: boolean }> = ({ part, level, goal, lang, renderDetail, inline }) => {
  const t = TEXT[lang];
  const { title, desc } = cardText(part, level, goal, lang);
  const st = PART_STYLE[part];
  return (
    <div>
      {!inline && (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-sm font-semibold ${st.text}`}>{t.parts[part].name}</span>
            <Badges part={part} level={level} lang={lang} />
          </div>
          <h4 className="font-sans text-xl md:text-2xl font-bold text-ehyo-text leading-snug mb-3">{title}</h4>
        </>
      )}
      <p className="text-stone-600 leading-relaxed">{desc}</p>
      {part === 'sync' && <DevicePair lang={lang} />}
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
        <LayoutGroup id={id}>
          <ol className="list-none p-0 m-0" data-route>
            {order.map((part, i) => {
              const active = sel === part;
              const st = PART_STYLE[part];
              const { title, desc } = cardText(part, level, goal, lang);
              const last = i === order.length - 1;
              return (
                <motion.li key={part} layout={!reduce} layoutId={`${id}-${part}`} transition={{ type: 'spring', stiffness: 260, damping: 30 }} className="flex gap-4">
                  {/* the step and the line down to the next one */}
                  <div className="flex flex-col items-center flex-shrink-0 pt-4 md:pt-5">
                    <span className={`w-12 h-12 rounded-full flex items-center justify-center font-sans text-lg font-bold transition-colors duration-200 ${active ? `${st.bar} text-white` : 'bg-white border border-stone-200 text-stone-400'}`}>{i + 1}</span>
                    {!last && <span className="w-px flex-1 min-h-6 bg-stone-200 my-1" aria-hidden="true" />}
                  </div>
                  <div className={`flex-1 min-w-0 ${last ? '' : 'pb-4'}`}>
                    <button
                      type="button"
                      aria-expanded={active}
                      aria-controls={`${id}-detail`}
                      onClick={() => setSel(part)}
                      className={`w-full text-left rounded-2xl p-4 md:p-5 border transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ehyo-indigo/50 ${active ? 'bg-white border-stone-100 shadow-sm' : 'border-transparent hover:bg-white/60'}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${st.soft} ${st.text}`}><PartIcon part={part} size="sm" /></span>
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
                        <Detail part={part} level={level} goal={goal} lang={lang} renderDetail={renderDetail} inline />
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
            id={`${id}-detail`}
            role="region"
            aria-live="polite"
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

// Until the route is ready: the logo, and one line with a light sweeping across it.
// The bars below fill as the sentence does.
const SHIMMER = 'linear-gradient(90deg, #A8A29E 0%, #A8A29E 38%, #6B7FD7 50%, #A8A29E 62%, #A8A29E 100%)';
const Loader: React.FC<{ filled: number; total: number; lang: Lang; reduce: boolean }> = ({ filled, total, lang, reduce }) => {
  const t = TEXT[lang];
  return (
    <div className="mt-14 md:mt-20 min-h-[320px] rounded-3xl border border-dashed border-stone-200 bg-white/50 flex flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <EhYoMark className="w-28" />
      <motion.span
        role="status"
        className={`text-base md:text-lg font-semibold tracking-wide ${reduce ? 'text-stone-500' : 'text-transparent bg-clip-text'}`}
        style={reduce ? undefined : { backgroundImage: SHIMMER, backgroundSize: '250% 100%', WebkitBackgroundClip: 'text' }}
        animate={reduce ? undefined : { backgroundPosition: ['100% 0%', '-150% 0%'] }}
        transition={reduce ? undefined : { duration: 1.8, repeat: Infinity, ease: 'linear' }}
      >
        {t.thinking}
      </motion.span>
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
  const [goal, setGoal] = useState<Goal>();
  const [laneSel, setLaneSel] = useState(0);

  const setCount = (c: Count) => {
    setCountState(c);
    // each new row comes with a level already picked: beginner, then has basics, then advanced
    setPicks((ps) => Array.from({ length: c }, (_, i) => ({ ...ps[i], level: ps[i]?.level ?? LEVELS[i] })));
    setLaneSel(0);
  };
  // Every language appears once: picking one already listed swaps the two
  const setKey = (i: number, key: LangKey) => setPicks((ps) => {
    const j = ps.findIndex((p) => p.key === key);
    return ps.map((p, k) => (k === i ? { ...p, key } : k === j ? { ...p, key: ps[i].key } : p));
  });
  const setLevel = (i: number, level: Level) => setPicks((ps) => ps.map((p, k) => (k === i ? { ...p, level } : p)));

  const done = (p: Partial<Pick>): p is Pick => !!p.key && !!p.level;
  const ready = !!count && picks.length === count && picks.every(done) && !!goal;
  const total = 1 + 2 * (count ?? 1) + 1;
  const filled = (count ? 1 : 0) + picks.reduce((n, p) => n + (p.key ? 1 : 0) + (p.level ? 1 : 0), 0) + (goal ? 1 : 0);
  // wait while there are blanks; build for a moment once there are none; then show
  const [stage, setStage] = useState<'wait' | 'build' | 'show'>('wait');
  useEffect(() => {
    // a blank reopened mid-build sends it back to waiting; after the route shows it stays
    if (!ready) { if (stage === 'build') setStage('wait'); return; }
    if (stage !== 'wait') return;
    if (reduce) { setStage('show'); return; }
    setStage('build');
    const id = setTimeout(() => setStage('show'), 1400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  const full = picks.filter(done);
  // The open tab, by position in the sentence; an unfinished language falls back to the first finished one
  const sel = picks[laneSel];
  const lane = sel && done(sel) ? laneSel : picks.findIndex(done);
  const cur = full.length ? (picks[lane] as Pick) : undefined;

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
        {/* the goal starts its own line */}
        <p>
          {s.for}{sp}
          <span className="whitespace-nowrap"><Choice label={s.for} value={goal} options={GOALS} onChange={setGoal} render={(v) => t.goal[v]} placeholder={t.ph.goal} />{s.end}</span>
        </p>
      </div>

      {/* What fits: the route for the chosen language */}
      <div aria-live="polite">
      <AnimatePresence mode="wait">
      {stage !== 'show' && (
        <motion.div key="loader" initial={false} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          <Loader filled={filled} total={total} lang={lang} reduce={reduce} />
        </motion.div>
      )}
      {stage === 'show' && cur && goal && (
      <motion.div
        key="result"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, y: 12 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mt-16 md:mt-24 space-y-12 md:space-y-16"
      >
        <div>
          {/* One tab per language, even with one; adding a language splits a new tab off the last one */}
          <div className="mb-10 md:mb-12 flex flex-col items-center text-center gap-4">
            <LayoutGroup id="lang-tabs">
              <div role="tablist" aria-label={s.learning} className="inline-flex flex-wrap gap-1 p-1.5 rounded-2xl bg-stone-100">
                <AnimatePresence initial={false}>
                  {picks.map((p, i) => {
                    const ok = done(p);
                    const active = ok && lane === i;
                    return (
                      <motion.button
                        key={i}
                        layout={!reduce}
                        initial={reduce ? false : { opacity: 0, x: -28, scale: 0.85 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={reduce ? undefined : { opacity: 0, x: -28, scale: 0.85 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        type="button" role="tab" aria-selected={active} disabled={!ok} onClick={() => setLaneSel(i)}
                        className={`rounded-xl px-4 py-2.5 text-left transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ehyo-indigo/50 ${active ? 'bg-white shadow-sm' : ok ? 'hover:bg-white/60' : 'border border-dashed border-stone-300 cursor-default'}`}>
                        {ok ? (
                          <>
                            <span className={`font-sans text-lg font-bold ${active ? 'text-ehyo-text' : 'text-stone-500'}`}>{L(p.key!)}</span>
                            <span className="ml-2 text-sm text-stone-500">{t.level[p.level!]}</span>
                          </>
                        ) : (
                          <span className="font-sans text-lg font-bold text-stone-300" aria-label={`${s.langsUnit || 'Language'} ${i + 1}`}>？</span>
                        )}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </LayoutGroup>
            <p className="text-ehyo-text font-medium">{t.route[cur.level]}</p>
            {picks.length > 1 && (
              <p className="-mt-2 text-sm text-stone-500 text-balance max-w-md">
                <Sparkles size={14} className="inline-block align-[-2px] mr-1.5 text-ehyo-indigo" aria-hidden="true" />
                {t.multiNote}
              </p>
            )}
          </div>
          <Lane key={`${lane}-${cur.key}`} id={`lane-${lane}`} level={cur.level} goal={goal} lang={lang} reduce={reduce} renderDetail={renderDetail} />
        </div>
      </motion.div>
      )}
      </AnimatePresence>
      </div>
    </div>
  );
};
