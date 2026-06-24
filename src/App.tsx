/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { HeroScene } from './components/QuantumScene';
import { ChangelogPage } from './components/ChangelogPage';
import { RoadmapPage } from './components/RoadmapPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { ArrowRight, Menu, X, BookOpen, Globe, Heart, Sprout, Mail, ChevronLeft, ChevronRight, Check, PenLine, Headphones, FolderOpen, Lightbulb, RotateCcw, Scale, Hourglass, Clock } from 'lucide-react';

const Logo = ({ scrolled, onClick }: { scrolled: boolean; onClick?: () => void }) => (
  <div className="flex flex-col items-center group cursor-pointer" onClick={onClick ?? (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}>
    <span className={`font-serif text-3xl font-bold tracking-tight transition-colors duration-300 ${scrolled ? 'text-ehyo-text' : 'text-ehyo-text'}`}>
      EhYo
    </span>
    {/* Book/Smile Curve underneath */}
    <svg width="40" height="8" viewBox="0 0 40 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[-2px]">
      <path d="M2 2C10 6 18 6 20 2C22 6 30 6 38 2" stroke="#6B7FD7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md hover:border-ehyo-indigo/20 transition-all duration-300">
    <div className="w-12 h-12 bg-ehyo-bg rounded-xl flex items-center justify-center mb-6 text-ehyo-indigo">
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <h3 className="font-serif text-xl font-bold mb-3 text-ehyo-text">{title}</h3>
    <p className="text-stone-500 leading-relaxed">{description}</p>
  </div>
);

const ProblemOnlyCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-stone-50/70 p-8 rounded-2xl border border-stone-100">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-stone-400 flex-shrink-0">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="font-serif text-lg font-bold text-stone-500 leading-snug">{title}</h3>
        <p className="text-sm text-stone-400 leading-relaxed mt-1">{description}</p>
      </div>
    </div>
  </div>
);

const SolutionCard = ({ title, description }: { title: string, description: string }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md hover:border-ehyo-indigo/20 transition-all duration-300">
    <div className="flex items-center gap-2 mb-3 text-ehyo-sage">
      <Check size={20} strokeWidth={2.5} />
      <span className="font-serif text-lg font-bold text-ehyo-text">{title}</span>
    </div>
    <p className="text-stone-600 leading-relaxed">{description}</p>
  </div>
);

type Language = 'en' | 'zh';
type Page = 'home' | 'changelog' | 'roadmap' | 'privacy';

const translations = {
  en: {
    nav: { get: "Get Started", changelog: "Changelog", roadmap: "Roadmap" },
    hero: {
      beta: "Now Available in Beta",
      h1_1: "EhYo",
      sub: "Designed for self-learners — save your time\nand turn every mistake into your learning journey.",
      langs: "Supports 28+ languages: English, Chinese, Japanese, Korean, Spanish, and more",
      btn_start: "Try it out!",
    },
    prob: {
      title: "EhYo solves these problems",
      c1_t: "Learning material scattered everywhere",
      c1_d: "Articles, ebooks, and web pages are all over the place. Even looking up grammar and vocabulary eats into your time.",
      c2_t: "Wasting precious time",
      c2_d: "Spending a lot of time organizing notes and looking things up.",
      c3_t: "Learning words you can't actually use",
      c3_d: "You don't know how to apply new vocabulary in real context, and you can barely remember what you've learned when it's time to review.",
      c4_t: "Hard to track your own mistakes",
      c4_d: "When mistakes aren't properly logged or corrected, you end up repeating the same errors over and over.",
      c5_t: "One-sided practice",
      c5_d: "You want to improve all your language skills, but unconsciously focus on just one and neglect the rest.",
      c6_t: "Fear of losing a language you've mastered",
      c6_d: "Without constant use, a language you worked so hard to learn slowly fades away.",
      s1_t: "Centralized Management",
      s1_d: "Import your own material—EPUBs, articles, videos, and more—to read, translate, note, organize, and review, all within EhYo.",
      s2_t: "Effortless Time-Saving",
      s2_d: "EhYo saves you the time spent looking things up and organizing, while you learn new vocabulary and grammar — automatically sorted into your learning record.",
      s3_t: "Tailored Difficulty Levels",
      s3_d: "From beginner to advanced, EhYo delivers content and feedback adapted to your specific proficiency level.",
      s4_t: "Smart Mistake Tracking",
      s4_d: "Go beyond basic vocabulary review. While practicing your writing, EhYo flags your most frequent grammar blind spots.",
      s5_t: "Personalized Tracking",
      s5_d: "Visual charts show exactly which skills need work, so you grow in listening, speaking, reading, and writing alike.",
      s6_t: "Independent Multilingual Tracks",
      s6_d: "Keep your languages separate and clutter-free. Confidently learn a new language while maintaining your progress in existing ones.",
      s7_t: "Cross-Device Sync",
      s7_d: "Read and save new words on your computer or tablet, then pick up practice on your phone — anytime, anywhere.",
    },
    phil: {
      title: "Spending a lot of time on language?",
      p1: "Leave it to EhYo.",
      p2: "EhYo is built for people who want to learn efficiently. Powered by your own learning record, it helps you effortlessly keep the languages you've learned alive — so they're not just something you \"studied,\" but something you can actually use.",
    },
    feat: {
      title: "Effortless Maintenance",
      sub: "Everything you need to keep your languages sharp, all in one place.",
      c1_t: "Personalized Content",
      c1_d: "Shaped around your interests, level, and learning patterns — so every resource feels relevant.",
      c2_t: "Expression Practice",
      c2_d: "More than grammar corrections — EhYo suggests natural, native-sounding ways to say what you mean.",
      c3_t: "Smart Review",
      c3_d: "Find your weak spots and conquer them. EhYo helps move them into long-term memory.",
      c4_t: "Real-World Practice",
      c4_d: "Join EhYo events like postcard exchanges — connect with native speakers and put your language to real use."
    },
    showcase: {
      tabs: {
        reading: "Reading",
        vocabulary: "Vocabulary",
        writing: "Writing",
        listening: "Listening"
      },
      reading: {
        slides: [
          {
            image: "/reading.png",
            title: "Your personal reading library",
            bullets: [
              "See your weekly reading time at a glance.",
              "Spot the difference between today and yesterday in seconds.",
              "Get reading material matched to your level.",
              "Add EPUB books, articles, song lyrics — anything you want to read."
            ]
          },
          {
            image: "/reading2-eng.png",
            title: "Tap any line for grammar, words, and sentence practice",
            bullets: [
              "Each sentence broken down by structure.",
              "Plain-language explanations of how words are actually used.",
              "Write your own sentence and get feedback on the spot."
            ]
          }
        ]
      },
      vocabulary: {
        slides: [
          {
            image: "/voc-eng.png",
            title: "A research-backed mix of practice modes",
            bullets: [
              "Cloze, sentence-making, flashcards, dictation — every angle covered.",
              "Every result is recorded, so EhYo keeps adapting to you.",
              "More practice modes coming soon."
            ]
          }
        ]
      },
      writing: {
        slides: [
          {
            image: "/writing_eg.png",
            title: "Guided writing, made for you",
            bullets: [
              "Prompts shaped by your level, interests, and recent vocabulary.",
              "Words you've been struggling with show up right under the prompt.",
              "Grammar slips you tend to repeat get flagged as you write.",
              "Get suggestions on grammar and phrasing — and write more fluently every time."
            ]
          },
          {
            image: "/writing2-diary.png",
            title: "Free writing, your way",
            bullets: [
              "Write a short story, a single line, or a journal entry — no rules.",
              "Pull from your saved words to keep practice grounded.",
              "Send it off for feedback whenever you're ready."
            ]
          }
        ]
      },
      listening: {
        slides: [
          {
            image: "/listening-eng.png",
            title: "Video practice, shaped around you",
            bullets: [
              "Clips native speakers actually watch — recommended based on what you're into.",
              "Add or remove interests anytime."
            ]
          },
          {
            image: "/shadowing.png",
            title: "The most effective way to practice speaking",
            bullets: [
              "Shadowing mode highlights each line as it plays.",
              "Record yourself and compare side by side.",
              "Loop a tricky line, or play it back against the original."
            ]
          }
        ]
      }
    },
    engine: {
      tag: "CORE CONCEPT",
      title: "Progress Visualization",
      p1: "Intuitively track your brain's growth — see signs of progress every single day. Visualized data makes improvement impossible to miss.",
      p2: "Perfect for busy professionals, travel enthusiasts, or anyone who wants to stay linguistically sharp without drowning in textbooks.",
      nodes: [
        { label: "Literal", text: "Direct meaning" },
        { label: "Media", text: "Used in Money Heist S3" },
        { label: "Slang", text: "Colloquial usage in Madrid" },
        { label: "Music", text: "Lyrics in Bad Bunny song" }
      ]
    },
    cta: {
      title: "Sounds great?",
      sub: "Start changing the way you maintain a language. Try it now!",
      ios: "Download for iOS",
      and: "Follow EhYo",
      trial: "Free 7-day trial."
    },
    footer: {
      desc: "EhYo is an app dedicated to making language learning personal, cultural, and deeply human."
    }
  },
  zh: {
    nav: { get: "下載", changelog: "更新日誌", roadmap: "開發路線" },
    hero: {
      beta: "Beta 測試版現已開放",
      h1_1: "EhYo",
      sub: "為語言自學者設計— 根據你的學習紀錄，打造最有效率的學習。",
      langs: "支援 28+ 種語言學習：英文、中文、日文、韓文、西班牙文...等",
      btn_start: "試試看！",
    },
    prob: {
      title: "EhYo 解決這些問題",
      c1_t: "學習資料散落各處",
      c1_d: "文章、電子書、其他讀物分散四處，光是查文法、查單字用法就花掉不少時間。",
      c2_t: "花費許多時間",
      c2_d: "花費大量時間整理筆記、查詢資料。",
      c3_t: "學了單字卻不會用",
      c3_d: "不知道怎麼把新學的單字用出來，練習時也常常想不起自己學過哪些字。",
      c4_t: "難以追蹤自己的錯誤",
      c4_d: "犯過的錯沒被好好記下、改正，結果不小心又犯了類似的錯。",
      c5_t: "練習總是偏重單一面向",
      c5_d: "想要全方面提升語言能力，卻不知不覺只練某一項技能，忽略了其他面向。",
      c6_t: "怕學了很久的語言退步",
      c6_d: "語言因為太久沒使用，漸漸生疏、被遺忘。",
      s1_t: "集中管理",
      s1_d: "匯入自己的素材，包含 EPUB、文章、影片等。翻譯、紀錄、整理、複習，EhYo 一次滿足。",
      s2_t: "輕鬆省時",
      s2_d: "EhYo 幫你省去查詢、整理的時間，同時學習新詞彙與文法結構。分門別類的增加到你的學習紀錄裡！",
      s3_t: "支援多種難度",
      s3_d: "從初學到進階，EhYo 依照程度給予不同內容和回饋。",
      s4_t: "錯誤追蹤",
      s4_d: "除了基本的單字複習之外，寫作練習時，EhYo 會提示你最近常犯的文法錯誤。",
      s5_t: "個人化追蹤",
      s5_d: "用視覺化圖像讓你一目了然缺乏哪些練習，全面發展聽說讀寫技能。",
      s6_t: "分隔的多語言紀錄",
      s6_d: "各語言紀錄獨立不互相干擾，讓你安心同時學習新語言、維持舊語言的進度。",
      s7_t: "跨裝置同步",
      s7_d: "你可以在電腦、平板上進行閱讀、記錄下字詞，再到手機上進行練習！",
    },
    phil: {
      title: "花很多時間在語言上？",
      p1: "都交給 EhYo。",
      p2: "EhYo 專為想要有效率學習的你設計，根據你的學習紀錄，讓你輕鬆維持多國語言能力。讓你的語言能力不再只是「學過」，而是「會用」。",

    },
    feat: {
      title: "輕鬆維持",
      sub: "學習、練習、沉浸，所有需求一次滿足。",
      c1_t: "個人化內容",
      c1_d: "結合興趣、個人程度、學習情況，為你送上最適合的學習資源。",
      c2_t: "表達練習",
      c2_d: "不止文法改錯，還會提供你更道地的表達方式。",
      c3_t: "智慧複習",
      c3_d: "找出弱點征服它！讓 EhYo 幫你轉換成長期記憶。",
      c4_t: "社交輸出",
      c4_d: "明信片交換等社交功能，讓你跟世界各地的母語者互動，把學到的語言真正用出來。"
    },
    showcase: {
      tabs: {
        reading: "閱讀",
        vocabulary: "單字",
        writing: "寫作",
        listening: "聽力"
      },
      reading: {
        slides: [
          {
            image: "/reading.png",
            title: "你的個人閱讀庫",
            bullets: [
              "一眼掌握本週閱讀時間。",
              "一目瞭然今天和昨天的閱讀時間差異。",
              "依照你的程度，提供最合適的閱讀素材。",
              "新增 epub 書籍、文章、歌詞或其他內容。"
            ]
          },
          {
            image: "/reading2-zh.png",
            title: "點一下，掌握文法、單字以及造句",
            bullets: [
              "文法斷句解析結構。",
              "白話解釋詞彙用法，讓你知道在生活如何使用。",
              "同步練習造句，得到回饋！"
            ]
          }
        ]
      },
      vocabulary: {
        slides: [
          {
            image: "/voc-zh.png",
            title: "科學化的多元練習",
            bullets: [
              "綜合練習、造句、閃卡、聽寫，補齊所有漏洞。",
              "所有的練習結果都會被記錄，讓 EhYo 更加個人化。",
              "即將推出更多練習！"
            ]
          }
        ]
      },
      writing: {
        slides: [
          {
            image: "/writing-zh.png",
            title: "個人化的引導寫作練習",
            bullets: [
              "根據你的程度、興趣與近期單字，產生量身訂做的題目。",
              "下方展示最近格外需要練習的單字。",
              "寫作時會提示最近常錯的文法。",
              "給予文法與自然表達的建議，幫你越寫越順。"
            ]
          },
          {
            image: "/writing2-diary.png",
            title: "自由書寫，想寫什麼就寫什麼",
            bullets: [
              "寫個小故事、一句話、或是當作日記，沒有任何限制。",
              "從你收藏的單字中挑選使用，讓練習更有意義。",
              "寫完隨時送出，馬上得到回饋。"
            ]
          }
        ]
      },
      listening: {
        slides: [
          {
            image: "/listening-zh.png",
            title: "屬於你的影片練習",
            bullets: [
              "依據你感興趣的主題，推薦母語者會看的影片。",
              "隨時可以新增或減少興趣。",

            ]
          },
          {
            image: "/shadowing.png",
            title: "最有效的口說練習方式",
            bullets: [
              "跟讀模式逐句標示。",
              "錄下自己的聲音比對。",
              "單句循環播放和單句比對原音。"
            ]
          }
        ]
      }
    },
    engine: {
      tag: "核心概念",
      title: "進度視覺化",
      p1: "直觀追蹤你的大腦成長，看見每一天的進步跡象。透過視覺化數據，讓進步不再不可見。",
      p2: "適合忙碌的上班族、熱愛旅遊的玩家，或是任何想保持語言敏銳度、不想被厚重課本淹沒的學習者。",
      nodes: [
        { label: "字面義", text: "直接翻譯" },
        { label: "媒體", text: "出自《紙房子》第三季" },
        { label: "俚語", text: "馬德里口語用法" },
        { label: "音樂", text: "Bad Bunny 歌詞" }
      ]
    },
    cta: {
      title: "聽起來很讚？",
      sub: "一起改變維持語言的方式，快來體驗！",
      ios: "下載 iOS 版",
      and: "追蹤 EhYo",
      trial: "7 天免費試用。"
    },
    footer: {
      desc: "EhYo 是一個致力於讓語言學習變得個人化、文化化且重視人文的軟體。"
    }
  }
};


const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem('ehyo-lang');
    if (saved === 'en' || saved === 'zh') return saved;
    return navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('ehyo-lang', lang);
  }, [lang]);
  const [page, setPage] = useState<Page>('home');
  type FeatureId = 'reading' | 'vocabulary' | 'writing' | 'listening';
  const [activeFeature, setActiveFeature] = useState<FeatureId>('reading');
  const [imageIdx, setImageIdx] = useState(0);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');

  const featureTabs: { id: FeatureId; icon: any }[] = [
    { id: 'reading', icon: BookOpen },
    { id: 'vocabulary', icon: Sprout },
    { id: 'writing', icon: PenLine },
    { id: 'listening', icon: Headphones }
  ];

  const navigate = (p: Page) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-ehyo-bg text-ehyo-text selection:bg-ehyo-indigo/20 selection:text-ehyo-indigo overflow-x-hidden w-full max-w-full">

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#FBFAF6]/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Logo scrolled={scrolled} onClick={() => navigate('home')} />

          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-stone-600">
            <button onClick={() => navigate('changelog')} className={`bg-transparent outline-none focus:outline-none transition-colors ${page === 'changelog' ? 'text-ehyo-text font-bold' : 'text-stone-400 hover:text-ehyo-indigo'}`}>{t.nav.changelog}</button>
            <button onClick={() => navigate('roadmap')} className={`bg-transparent outline-none focus:outline-none transition-colors ${page === 'roadmap' ? 'text-ehyo-text font-bold' : 'text-stone-400 hover:text-ehyo-indigo'}`}>{t.nav.roadmap}</button>
            {/* Language Switcher */}
            <div className="flex items-center gap-2 border-stone-300 pl-4 border-l">
              <button onClick={() => setLang('en')} className={`bg-transparent outline-none focus:outline-none transition-colors ${lang === 'en' ? 'text-ehyo-text font-bold' : 'text-stone-400 hover:text-ehyo-indigo'}`}>EN</button>
              <button onClick={() => setLang('zh')} className={`bg-transparent outline-none focus:outline-none transition-colors ${lang === 'zh' ? 'text-ehyo-text font-bold' : 'text-stone-400 hover:text-ehyo-indigo'}`}>中</button>
            </div>
          </div>

          <button className="md:hidden text-stone-900 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#FBFAF6] flex flex-col items-center justify-center gap-8 text-xl font-serif-in">
          <Logo scrolled={true} />
          <button onClick={() => navigate('changelog')} className={`bg-transparent outline-none focus:outline-none transition-colors ${page === 'changelog' ? 'text-ehyo-text font-bold' : 'text-stone-400 hover:text-ehyo-indigo'}`}>{t.nav.changelog}</button>
          <button onClick={() => navigate('roadmap')} className={`bg-transparent outline-none focus:outline-none transition-colors ${page === 'roadmap' ? 'text-ehyo-text font-bold' : 'text-stone-400 hover:text-ehyo-indigo'}`}>{t.nav.roadmap}</button>
          <div className="flex gap-6 mt-2">
            <button onClick={() => { setLang('en'); setMenuOpen(false); }} className={lang === 'en' ? 'font-bold' : 'text-stone-400'}>EN</button>
            <button onClick={() => { setLang('zh'); setMenuOpen(false); }} className={lang === 'zh' ? 'font-bold' : 'text-stone-400'}>中</button>
          </div>
        </div>
      )}

      {page === 'changelog' && <ChangelogPage lang={lang} />}
      {page === 'roadmap' && <RoadmapPage lang={lang} />}
      {page === 'privacy' && <PrivacyPolicyPage />}

      {/* Hero Section */}
      <header className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-20 ${page !== 'home' ? 'hidden' : ''}`}>
        <HeroScene />

        {/* Soft Overlay - Reduced opacity at center (0.0) for better visibility of Earth */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(251,250,246,0.0)_0%,rgba(251,250,246,0.5)_70%,rgba(251,250,246,1)_100%)]" />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-stone-200 rounded-full shadow-sm-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="w-2 h-2 rounded-full bg-ehyo-coral"></span>
            <span className="text-xs font-bold tracking-widest text-stone-500 uppercase">{t.hero.beta}</span>
          </div>

          <h1 className="font-serif text-6xl md:text-8xl font-medium leading-tight mb-8 text-ehyo-text drop-shadow-sm-in-up" style={{ animationDelay: '0.2s' }}>
            {t.hero.h1_1}
          </h1>

          <div className="font-serif text-xl md:text-3xl font-light leading-tight mb-10 text-ehyo-indigo drop-shadow-sm-in-up whitespace-pre-line" style={{ animationDelay: '0.25s' }}>
            {t.hero.sub}
          </div>



          <div className="flex flex-col md:flex-row justify-center gap-4-in-up" style={{ animationDelay: '0.4s' }}>
            <a
              href="https://apps.apple.com/us/app/ehyo/id6745819373"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-ehyo-text text-white rounded-full hover:bg-ehyo-indigo transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group">
              {t.hero.btn_start}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <p className="text-sm text-stone-400 mt-6" style={{ animationDelay: '0.45s', fontSize: '14px' }}>
            {t.hero.langs}
          </p>
        </div>
      </header>

      <main className={page !== 'home' ? 'hidden' : ''}>
        {/* Philosophy Section - Updated Layout */}
        <section id="philosophy" className="py-24 bg-white relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-ehyo-sage/20 to-transparent rounded-full blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center justify-center p-3 mb-8 bg-ehyo-sage/10 rounded-full text-ehyo-sage-in-up">
              <Sprout size={28} />
            </div>

            <h2 className="font-serif text-4xl md:text-5xl mb-6 text-ehyo-text">{t.phil.title}</h2>

            <p className="text-xl text-stone-600 leading-relaxed mb-8">
              {t.phil.p1}
            </p>

            <p className="text-lg text-stone-500 leading-relaxed mb-10 font-light">
              {t.phil.p2}
            </p>


          </div>
        </section>

        {/* Problems Section */}
        <section id="problems" className="py-24 bg-[#FBFAF6]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="font-serif text-4xl mb-4">{t.prob.title}</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-6 md:flex-1 md:mt-[4.5rem]">
                <ProblemOnlyCard icon={FolderOpen} title={t.prob.c1_t} description={t.prob.c1_d} />
                <ProblemOnlyCard icon={Clock} title={t.prob.c2_t} description={t.prob.c2_d} />
                <ProblemOnlyCard icon={Lightbulb} title={t.prob.c3_t} description={t.prob.c3_d} />
                <ProblemOnlyCard icon={RotateCcw} title={t.prob.c4_t} description={t.prob.c4_d} />
                <ProblemOnlyCard icon={Scale} title={t.prob.c5_t} description={t.prob.c5_d} />
                <ProblemOnlyCard icon={Hourglass} title={t.prob.c6_t} description={t.prob.c6_d} />
              </div>

              <div className="flex flex-col gap-6 md:flex-1">
                <SolutionCard title={t.prob.s1_t} description={t.prob.s1_d} />
                <SolutionCard title={t.prob.s2_t} description={t.prob.s2_d} />
                <SolutionCard title={t.prob.s3_t} description={t.prob.s3_d} />
                <SolutionCard title={t.prob.s4_t} description={t.prob.s4_d} />
                <SolutionCard title={t.prob.s5_t} description={t.prob.s5_d} />
                <SolutionCard title={t.prob.s6_t} description={t.prob.s6_d} />
                <SolutionCard title={t.prob.s7_t} description={t.prob.s7_d} />
              </div>
            </div>
          </div>
        </section>

        {/* Culture Engine Section */}
        <section className="py-24 bg-ehyo-text text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full bg-ehyo-indigo blur-[120px] absolute top-[-100px] left-[-100px]"></div>
            <div className="w-[500px] h-[500px] rounded-full bg-ehyo-coral blur-[120px] absolute bottom-[-100px] right-[-100px]"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-ehyo-coral text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-white/10">
                  {t.engine.tag}
                </div>
                <h2 className="font-serif text-4xl md:text-5xl mb-6">{t.engine.title}</h2>
                <p className="text-lg text-stone-300 mb-6 leading-relaxed">
                  {t.engine.p1}
                </p>
                <p className="text-lg text-stone-300 leading-relaxed">
                  {t.engine.p2}
                </p>
              </div>
              <div className="flex justify-center">
                <video
                  src="/brainxp.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full max-w-md rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-[#FBFAF6]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="font-serif text-4xl mb-4">{t.feat.title}</h2>
              <p className="text-stone-500">{t.feat.sub}</p>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-4">
              <div className="flex-1">
                <FeatureCard
                  icon={Globe}
                  title={t.feat.c1_t}
                  description={t.feat.c1_d}
                />
              </div>
              <div className="flex items-center justify-center text-ehyo-indigo/40 rotate-90 lg:rotate-0">
                <ArrowRight size={28} />
              </div>
              <div className="flex-1">
                <FeatureCard
                  icon={Heart}
                  title={t.feat.c2_t}
                  description={t.feat.c2_d}
                />
              </div>
              <div className="flex items-center justify-center text-ehyo-indigo/40 rotate-90 lg:rotate-0">
                <ArrowRight size={28} />
              </div>
              <div className="flex-1">
                <FeatureCard
                  icon={BookOpen}
                  title={t.feat.c3_t}
                  description={t.feat.c3_d}
                />
              </div>
              <div className="flex items-center justify-center text-ehyo-indigo/40 rotate-90 lg:rotate-0">
                <ArrowRight size={28} />
              </div>
              <div className="flex-1">
                <FeatureCard
                  icon={Mail}
                  title={t.feat.c4_t}
                  description={t.feat.c4_d}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Showcase (continues Effortless Maintenance section) */}
        <section className="pt-4 pb-24 bg-[#FBFAF6]">
          <div className="container mx-auto px-6">
            {/* Tab Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {featureTabs.map(({ id, icon: Icon }) => {
                const active = activeFeature === id;
                return (
                  <button
                    key={id}
                    onClick={() => { setActiveFeature(id); setImageIdx(0); }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 outline-none focus:outline-none ${active
                      ? 'bg-ehyo-indigo/10 text-ehyo-indigo'
                      : 'bg-white text-stone-500 hover:bg-stone-100'
                      }`}
                  >
                    <Icon size={16} strokeWidth={2} />
                    {t.showcase.tabs[id]}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            {(() => {
              const feat = t.showcase[activeFeature];
              const slides = feat.slides;
              const slide = slides[imageIdx];
              const hasMany = slides.length > 1;
              const prev = () => { setSlideDir('left'); setImageIdx((i) => (i - 1 + slides.length) % slides.length); };
              const next = () => { setSlideDir('right'); setImageIdx((i) => (i + 1) % slides.length); };
              const goTo = (i: number) => { setSlideDir(i > imageIdx ? 'right' : 'left'); setImageIdx(i); };
              const animClass = slideDir === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left';
              return (
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-center">
                    {/* Left arrow */}
                    <button
                      onClick={prev}
                      aria-label="Previous"
                      disabled={!hasMany}
                      className={`w-11 h-11 rounded-full bg-white shadow-sm border border-stone-200 flex items-center justify-center text-stone-500 hover:text-ehyo-indigo hover:shadow-md transition-all outline-none focus:outline-none ${!hasMany ? 'opacity-0 pointer-events-none' : ''
                        }`}
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {/* Image + Description */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                      <div className="flex justify-center overflow-hidden">
                        <img
                          key={slide.image}
                          src={slide.image}
                          alt={slide.title}
                          className={`w-full max-w-[280px] aspect-[9/19.5] object-cover rounded-[2.5rem] shadow-xl ${animClass}`}
                        />
                      </div>
                      <div key={slide.title} className={animClass}>
                        <h3 className="font-serif text-2xl md:text-3xl mb-5 text-ehyo-text leading-tight">
                          {slide.title}
                        </h3>
                        <ul className="space-y-3">
                          {slide.bullets.map((b, i) => (
                            <li key={i} className="flex gap-3 text-stone-600 leading-relaxed">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-ehyo-indigo/10 text-ehyo-indigo flex items-center justify-center mt-1">
                                <Check size={12} strokeWidth={3} />
                              </span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right arrow */}
                    <button
                      onClick={next}
                      aria-label="Next"
                      disabled={!hasMany}
                      className={`w-11 h-11 rounded-full bg-white shadow-sm border border-stone-200 flex items-center justify-center text-stone-500 hover:text-ehyo-indigo hover:shadow-md transition-all outline-none focus:outline-none ${!hasMany ? 'opacity-0 pointer-events-none' : ''
                        }`}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* Dot indicator */}
                  {hasMany && (
                    <div className="flex justify-center gap-1.5 mt-10">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => goTo(i)}
                          aria-label={`Go to slide ${i + 1}`}
                          className={`h-1.5 rounded-full transition-all outline-none focus:outline-none ${i === imageIdx ? 'w-6 bg-ehyo-indigo' : 'w-1.5 bg-stone-300'
                            }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-white text-center">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-5xl md:text-6xl mb-8 text-ehyo-text">{t.cta.title}</h2>
              <p className="text-xl text-stone-500 mb-12 font-light">
                {t.cta.sub}
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <a
                  href="https://apps.apple.com/us/app/ehyo/id6745819373"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-10 py-4 bg-ehyo-text text-white hover:text-white rounded-full text-lg hover:bg-ehyo-indigo transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">

                  {t.cta.ios}
                </a>

              </div>
              <p className="mt-8 text-sm text-stone-400">{t.cta.trial}</p>
            </div>
          </div>
        </section>

      </main>

      <footer className={`bg-[#F5F4F0] text-stone-600 py-16 border-t border-stone-200 ${page === 'changelog' || page === 'roadmap' ? 'hidden' : ''}`}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="text-center md:text-left max-w-xs">
            <Logo scrolled={true} />
            <p className="mt-4 text-sm text-stone-500 leading-relaxed">
              {t.footer && t.footer.desc ? t.footer.desc : "EhYo is a platform dedicated to making language learning personal, cultural, and deeply human."}
            </p>
          </div>

          <div className="flex flex-col gap-4 text-sm">

            <div className="flex flex-col gap-4 ">
              <h4 className="font-bold text-ehyo-text uppercase tracking-wider text-xs">Social</h4>
              <a
                href="https://www.instagram.com/ehyo.world/"
                target="_blank"
                className="hover:text-ehyo-indigo transition-colors">Instagram</a>
              <a
                href="https://discord.com/invite/htVu7kyx3m"
                target="_blank"
                className="hover:text-ehyo-indigo transition-colors">Discord</a>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-stone-300 text-center md:text-left flex flex-col md:flex-row justify-between text-xs text-stone-400">
          <p>© 2025 EhYo Language Learning. All rights reserved.</p>
          <div className="flex gap-6 justify-center md:justify-end mt-4 md:mt-0">
            <button onClick={() => navigate('privacy')} className="bg-transparent outline-none hover:text-ehyo-indigo transition-colors">Privacy Policy</button>
            <a href="mailto:valzin@ehyo.app" className="hover:text-ehyo-indigo transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;