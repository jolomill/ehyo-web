/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { BookOpen, ChevronDown, Route, Sparkles, ArrowRight, ArrowDown, Check } from 'lucide-react';
import { EhYoMark } from './EhYoMark';

// "Describe yourself, see how EhYo fits": the visitor fills in one sentence and the
// three parts of EhYo line up in the order that suits them, with a day plan below.

type Lang = 'en' | 'zh';
type Level = 'beginner' | 'experienced';
type Count = 1 | 2;
type Time = 15 | 30 | 60;
type Goal = 'travel' | 'exam' | 'work' | 'content' | 'maintain';
type Part = 'path' | 'ehyo' | 'toolkit';
type LangKey = 'en' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'zh';

const LANGS: LangKey[] = ['ja', 'en', 'ko', 'es', 'fr', 'de', 'zh'];
const GOALS: Goal[] = ['content', 'travel', 'exam', 'work', 'maintain'];
const TIMES: Time[] = [15, 30, 60];

const ORDER: Record<Level, Part[]> = {
  beginner: ['path', 'ehyo', 'toolkit'],
  experienced: ['toolkit', 'ehyo', 'path'],
};

const TEXT = {
  zh: {
    title: '你的 EhYo 學習方式',
    sub: '點一下句子裡的底線，換成你的狀況。下面會排出最適合你的學法。',
    s: { learning: '我在學', langsUnit: '語言', is: '是', comma: '，', and: '、', perDay: '每天大概有', for: '學語言是為了', end: '。' },
    count: { 1: '一種', 2: '兩種' } as Record<Count, string>,
    lang: { en: '英文', ja: '日文', ko: '韓文', es: '西班牙文', fr: '法文', de: '德文', zh: '中文' } as Record<LangKey, string>,
    level: { beginner: '初學者', experienced: '有基礎' } as Record<Level, string>,
    time: { 15: '15 分鐘以內', 30: '30 分鐘左右', 60: '一小時以上' } as Record<Time, string>,
    goal: { content: '看懂喜歡的內容', travel: '旅行與日常會話', exam: '考試或檢定', work: '工作需要', maintain: '維持不退步' } as Record<Goal, string>,
    soon: '即將推出',
    boost: '補強',
    focus: '最常用',
    route: { beginner: '先打基礎，再用喜歡的素材複習', experienced: '先用素材自學，再針對弱點補強' } as Record<Level, string>,
    multiNote: '兩個語言各自記錄、各走各的順序，進度不會混在一起。',
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
    s: { learning: "I'm learning", langsUnit: '', is: 'at', comma: ',', and: ' and', perDay: 'I have', for: 'a day, and I want to', end: '.' },
    count: { 1: 'one language', 2: 'two languages' } as Record<Count, string>,
    lang: { en: 'English', ja: 'Japanese', ko: 'Korean', es: 'Spanish', fr: 'French', de: 'German', zh: 'Chinese' } as Record<LangKey, string>,
    level: { beginner: 'beginner level', experienced: 'intermediate level' } as Record<Level, string>,
    time: { 15: '15 minutes or less', 30: 'about 30 minutes', 60: 'an hour or more' } as Record<Time, string>,
    goal: { content: 'enjoy content I love', travel: 'travel and chat', exam: 'pass an exam', work: 'use it at work', maintain: 'keep what I know' } as Record<Goal, string>,
    soon: 'Coming soon',
    boost: 'Fix weak spots',
    focus: 'Use most',
    route: { beginner: 'Build the basics first, then review with material you love', experienced: 'Learn from your own material first, then fix the weak spots' } as Record<Level, string>,
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
  15: { beginner: [['path', 10], ['review', 5]], experienced: [['read', 10], ['review', 5]] },
  30: { beginner: [['path', 15], ['read', 10], ['review', 5]], experienced: [['read', 15], ['write', 10], ['review', 5]] },
  60: { beginner: [['path', 25], ['read', 20], ['write', 10], ['review', 5]], experienced: [['read', 25], ['write', 15], ['shadow', 10], ['boost', 10]] },
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
function Choice<T extends string | number>({ value, options, label, onChange, render }: {
  value: T; options: readonly T[]; label: string; onChange: (v: T) => void; render: (v: T) => string;
}) {
  const [open, setOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
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
        aria-label={`${label}: ${render(value)}`}
        onClick={() => {
          const r = wrap.current?.getBoundingClientRect();
          setAlignRight(!!r && r.left + 200 > window.innerWidth);
          setOpen((o) => !o);
        }}
        className="inline-flex items-baseline gap-1 text-ehyo-indigo border-b-2 border-dashed border-ehyo-indigo/40 hover:border-ehyo-indigo hover:bg-ehyo-indigo/5 rounded-t-md px-1 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ehyo-indigo/50"
      >
        {render(value)}
        <ChevronDown size={18} className={`self-center transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
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
            className={`absolute ${alignRight ? 'right-0' : 'left-0'} top-full mt-2 z-30 flex flex-col min-w-[11rem] p-1.5 bg-white rounded-2xl border border-stone-100 shadow-xl font-sans text-base`}
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
const PartIcon: React.FC<{ part: Part }> = ({ part }) => {
  if (part === 'ehyo') return <EhYoMark className="w-12" />;
  const Icon = part === 'path' ? Route : BookOpen;
  return <Icon size={22} strokeWidth={1.75} />;
};

const StageCard: React.FC<{ part: Part; level: Level; goal: Goal; lang: Lang; step: number }> = ({ part, level, goal, lang, step }) => {
  const t = TEXT[lang];
  const c = t.cards[level][part];
  const d = typeof c.d === 'function' ? c.d(t.material[goal]) : c.d;
  const st = PART_STYLE[part];
  return (
    <div className="h-full bg-white rounded-3xl border border-stone-100 shadow-sm p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className={`h-12 min-w-12 px-2 rounded-2xl flex items-center justify-center ${st.soft} ${st.text}`}>
          <PartIcon part={part} />
        </span>
        <span className="font-serif text-4xl text-stone-200 leading-none" aria-hidden="true">{step}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-sm font-semibold ${st.text}`}>{t.parts[part].name}</span>
        {part === 'path' && level === 'experienced' && (
          <span className="text-xs font-bold rounded-full px-2 py-0.5 bg-ehyo-indigo text-white">{t.boost}</span>
        )}
        {part === 'path' && <span className="text-xs font-semibold rounded-full px-2 py-0.5 bg-ehyo-coral/15 text-[#B23A5E]">{t.soon}</span>}
      </div>
      <h4 className="font-serif text-xl font-bold text-ehyo-text leading-snug">{c.t}</h4>
      <p className="text-stone-600 leading-relaxed text-[15px]">{d}</p>
      {part === 'toolkit' && (
        <div className="mt-auto pt-2 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-stone-500">{t.focus}</span>
          {t.tools[goal].map((x) => (
            <span key={x} className="rounded-full px-2.5 py-1 bg-ehyo-bg text-ehyo-text border border-stone-100">{x}</span>
          ))}
        </div>
      )}
    </div>
  );
};

// One language's route: three cards that slide into this visitor's order
const Lane: React.FC<{ id: string; who: string; level: Level; goal: Goal; lang: Lang; reduce: boolean }> = ({ id, who, level, goal, lang, reduce }) => {
  const t = TEXT[lang];
  const order = ORDER[level];
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4">
        <h3 className="font-serif text-2xl font-bold text-ehyo-text">{who}</h3>
        <span className="text-stone-500">{t.route[level]}</span>
      </div>
      <LayoutGroup id={id}>
        <ol className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] gap-3 md:gap-2 items-stretch list-none p-0 m-0">
          {order.map((part, i) => (
            <React.Fragment key={part}>
              <motion.li layout={!reduce} layoutId={`${id}-${part}`} transition={{ type: 'spring', stiffness: 260, damping: 30 }} className="min-w-0">
                <StageCard part={part} level={level} goal={goal} lang={lang} step={i + 1} />
              </motion.li>
              {i < order.length - 1 && (
                <li aria-hidden="true" className="flex items-center justify-center text-stone-300">
                  <ArrowRight className="hidden md:block" size={20} />
                  <ArrowDown className="md:hidden" size={20} />
                </li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </LayoutGroup>
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
        <h3 className="font-serif text-2xl font-bold text-ehyo-text">{t.dayTitle(t.time[time])}</h3>
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

// ---------------------------------------------------------------------------
export const StudyBuilder: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = TEXT[lang];
  const reduce = !!useReducedMotion();
  const [count, setCount] = useState<Count>(2);
  const [langA, setLangA] = useState<LangKey>('ja');
  const [levelA, setLevelA] = useState<Level>('beginner');
  const [langB, setLangB] = useState<LangKey>('en');
  const [levelB, setLevelB] = useState<Level>('experienced');
  const [time, setTime] = useState<Time>(30);
  const [goal, setGoal] = useState<Goal>('content');

  // The two languages always differ
  const pickA = (v: LangKey) => { if (v === langB) setLangB(langA); setLangA(v); };
  const pickB = (v: LangKey) => { if (v === langA) setLangA(langB); setLangB(v); };

  const L = (k: LangKey) => t.lang[k];
  const lv = (v: Level) => t.level[v];
  const s = t.s;
  const sp = lang === 'zh' ? '' : ' ';

  return (
    <div>
      {/* The sentence the visitor fills in */}
      <p className="font-serif text-2xl md:text-[2rem] leading-[1.9] md:leading-[1.9] text-ehyo-text max-w-4xl mx-auto text-center text-balance">
        {s.learning}{sp}
        <Choice label={s.learning} value={count} options={[1, 2] as const} onChange={setCount} render={(v) => t.count[v]} />
        {s.langsUnit}{lang === 'zh' ? '：' : ': '}
        <Choice label={t.count[1]} value={langA} options={LANGS} onChange={pickA} render={L} />
        {sp}{s.is}{sp}
        <Choice label={L(langA)} value={levelA} options={['beginner', 'experienced'] as const} onChange={setLevelA} render={lv} />
        {count === 2 && (
          <>
            {s.and}{sp}
            <Choice label={t.count[2]} value={langB} options={LANGS} onChange={pickB} render={L} />
            {sp}{s.is}{sp}
            <span className="whitespace-nowrap"><Choice label={L(langB)} value={levelB} options={['beginner', 'experienced'] as const} onChange={setLevelB} render={lv} />{s.comma}</span>
          </>
        )}
        {count === 1 && s.comma}{sp}{s.perDay}{sp}
        <span className="whitespace-nowrap"><Choice label={s.perDay} value={time} options={TIMES} onChange={setTime} render={(v) => t.time[v]} />{lang === 'zh' ? '，' : ''}</span>
        {sp}{s.for}{sp}
        <span className="whitespace-nowrap"><Choice label={s.for} value={goal} options={GOALS} onChange={setGoal} render={(v) => t.goal[v]} />{s.end}</span>
      </p>

      {/* What fits: one route per language, then the day */}
      <div className="mt-14 md:mt-20 space-y-12" aria-live="polite">
        <Lane id="a" who={`${L(langA)} · ${t.level[levelA]}`} level={levelA} goal={goal} lang={lang} reduce={reduce} />
        <AnimatePresence initial={false}>
          {count === 2 && (
            <motion.div
              key="b"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 16 }}
              transition={{ duration: 0.35 }}
            >
              <Lane id="b" who={`${L(langB)} · ${t.level[levelB]}`} level={levelB} goal={goal} lang={lang} reduce={reduce} />
              <p className="mt-6 flex items-center gap-2 text-stone-500">
                <Sparkles size={16} className="text-ehyo-indigo flex-shrink-0" aria-hidden="true" />
                {t.multiNote}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <DayPlan time={time} level={levelA} lang={lang} who={L(langA)} reduce={reduce} />
      </div>
    </div>
  );
};

