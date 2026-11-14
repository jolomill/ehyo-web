/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useReducedMotion } from 'framer-motion';

// three.js is the heaviest part of the page: load it after the first paint
const HeroScene = lazy(() => import('./components/QuantumScene').then((m) => ({ default: m.HeroScene })));
import { ChangelogPage } from './components/ChangelogPage';
import { RoadmapPage } from './components/RoadmapPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { CentralizeVisual, TimeSaveVisual, LevelVisual, WeaknessVisual, SyncVisual, LearningPathVisual } from './components/SolutionVisuals';
import { EhYoMark } from './components/EhYoMark';
import { StudyBuilder, type StudyPart, type StudyDetailContext } from './components/StudyBuilder';
import { ArrowRight, Menu, X, Sprout, FolderOpen, Lightbulb, RotateCcw, Scale, Hourglass, Clock, RefreshCw, type LucideIcon } from 'lucide-react';

const Logo = ({ onClick }: { scrolled?: boolean; onClick?: () => void }) => (
  <div className="flex items-center cursor-pointer" onClick={onClick ?? (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}>
    <EhYoMark className="h-11 w-auto" />
  </div>
);

type Language = 'en' | 'zh';
type Page = 'home' | 'changelog' | 'roadmap' | 'privacy';

type ProblemItem = {
  icon: LucideIcon;
  problem?: string;
  problemDetail?: string;
  title: string;
  description: string;
  visual?: React.ReactNode;
};

// The answer to one problem: what used to go wrong, how EhYo handles it, and its animation.
const ProblemAnswer = ({ item }: { item: ProblemItem }) => (
  <div>
    {item.problem && (
      <div className="mb-6 pb-6 border-b border-stone-100">
        <div className="text-sm font-bold text-stone-500 line-through decoration-ehyo-coral/70">{item.problem}</div>
        {item.problemDetail && <p className="text-sm text-stone-500 leading-relaxed mt-1">{item.problemDetail}</p>}
      </div>
    )}
    <h3 className="font-serif text-2xl font-bold text-ehyo-text mb-3">{item.title}</h3>
    <p className="text-stone-600 leading-relaxed">{item.description}</p>
    {item.visual && <div className="mt-6">{item.visual}</div>}
  </div>
);

const translations = {
  en: {
    nav: { get: "Download", changelog: "Changelog", roadmap: "Roadmap", openMenu: "Open menu", closeMenu: "Close menu", language: "Language" },
    hero: {
      beta: "Now Available in Beta",
      h1_1: "EhYo",
      sub: "Designed for self-learners.\nSave your time and turn every mistake into your next step.",
      langs: "Supports 28+ languages: English, Chinese, Japanese, Korean, Spanish, and more",
      btn_start: "Try it out!",
    },
    prob: {
      title: "EhYo solves these problems",
      sol_title: "How EhYo helps",
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
    vis: {
      time: { example: "Example", exampleText: "Decidí estudiar en Madrid.", translate: "Translation", translateText: "decided (decidir, past tense)", grammar: "Grammar", grammarText: "Preterite: decid- + -ió (3rd person singular)", record: "Learning record", vocab: "Vocabulary", grammarBin: "Grammar" },
      level: { build: "Build", notes: "Notes", reading: "Reading", notesA1: "decide = to make a choice", notesB2: "decide on / against · syn. resolve, determine" },
      weak: "Next up: let's strengthen your verb forms!",
      brain: { listening: "Listening", speaking: "Speaking", reading: "Reading", writing: "Writing", vocab: "Vocab", grammar: "Grammar", weak: "Needs work" },
      sync: { saved: "Saved", meaning: "short-lived", laptop: "Computer: read & save", phone: "Phone: review" },
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
    builder: {
      tag: "How to learn with EhYo",
      title: "How EhYo fits you",
      sub: "Tap the underlined words to describe yourself. EhYo lines up the way that suits you below.",
    },
    study: {
      tag: "How to learn with EhYo",
      title: "Every way you learn counts",
      sub: "Just starting out or already on your way, EhYo has a way of learning that fits. Its two parts strengthen each other, so nothing you learn goes to waste.",
      tabs: { beginner: "I'm a beginner", experienced: "I already know some" },
      taglines: { beginner: "Build a solid foundation, step by step", experienced: "Keep improving with what you already read and watch" },
      diagram: {
        toolkit: { eyebrow: "Learn from your own material", title: "Self-Study Toolkit" },
        path: { eyebrow: "A course built just for you", title: "Personal Learning Path" },
        soon: "Coming soon",
      },
      multi: "Learning more than one language? Each keeps its own record, so you can be a beginner in one and experienced in another:",
      chips: [
        { lang: "日本語", level: "Beginner", mode: "beginner" as const },
        { lang: "English", level: "Experienced", mode: "experienced" as const },
      ],
      lead: {
        beginner: "Start with your Personal Learning Path to build a solid foundation, then use the Self-Study Toolkit to review with material you love.",
        experienced: "Start with the Self-Study Toolkit and learn from what you already read and watch. Whatever you're unsure of, EhYo turns into your Personal Learning Path.",
      },
      steps: {
        beginner: [
          { t: "Build your foundation on the path", d: "EhYo lines up grammar, words and practice in order, so you never wonder what to learn first." },
          { t: "Review with material you love", d: "Read an article or watch a video and use what you just learned on real content." },
          { t: "Weak spots get fixed for you", d: "Mistakes you make while reviewing go back into your path, and the next step helps you master them." },
        ],
        experienced: [
          { t: "Learn from what interests you", d: "Read and watch whatever you like. Anything you don't get makes sense with one tap." },
          { t: "Turn the unfamiliar into a path", d: "New things you meet and your old repeat mistakes are lined up in one path for you." },
          { t: "Come back fluent", d: "When it shows up in real content again, you already know how to use it." },
        ],
      },
      toolkit: {
        tag: "Self-Study Toolkit",
        title: "What you love is the best textbook",
        desc: "Books, articles, videos and lyrics all become study material. Tap anything you don't get and it makes sense, and what you learn is organized for you.",
      },
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
            title: "Turn the books you love into lessons",
            bullets: [
              "Read whatever you like: ebooks, articles, song lyrics.",
              "See how much you read each day and watch the progress add up.",
              "Get reading picks at just the right level: not too hard, not too easy."
            ]
          },
          {
            image: "/reading2-eng.png",
            title: "Stuck? One tap and it clicks",
            bullets: [
              "Long sentences broken down so the structure is obvious.",
              "Words explained in plain language, so you know how people really use them.",
              "Use it in a sentence right away and get feedback, so it sticks."
            ]
          }
        ]
      },
      vocabulary: {
        slides: [
          {
            image: "/voc-eng.png",
            title: "Words that stay with you",
            bullets: [
              "Flashcards, sentence-making and dictation take you from recognizing a word to using it.",
              "The more you practice, the better EhYo knows what you need.",
              "More ways to practice are on the way."
            ]
          }
        ]
      },
      writing: {
        slides: [
          {
            image: "/writing_eg.png",
            title: "Write it to own it",
            bullets: [
              "Prompts fit your level and interests, so you're never stuck for words.",
              "The words you need to practice are right there, so writing doubles as review.",
              "A heads-up on your usual mistakes before you start helps you break old habits.",
              "Grammar and natural phrasing improve together, so you sound more like a native speaker."
            ]
          },
          {
            image: "/writing2-diary.png",
            title: "Write about anything you like",
            bullets: [
              "A short story, one line or a journal entry: no pressure.",
              "Use the words you've saved, so practice means something.",
              "Get feedback the moment you're done."
            ]
          }
        ]
      },
      listening: {
        slides: [
          {
            image: "/listening-eng.png",
            title: "Watch what you already enjoy",
            bullets: [
              "Videos native speakers actually watch, picked for your interests.",
              "When your interests change, so do the picks."
            ]
          },
          {
            image: "/shadowing.png",
            title: "Speak along and hear yourself improve",
            bullets: [
              "Shadow line by line and pick up a native speaker's rhythm.",
              "Record yourself next to the original and hear exactly what's different.",
              "Replay any line until it flows."
            ]
          }
        ]
      }
    },
    engine: {
      tag: "CORE CONCEPT",
      title: "Your Personal Learning Path",
      p1: "Built from your weak spots and error patterns, EhYo plans learning content just for you.",
      p2: "Don't spend time figuring out what to do next. Open EhYo and your learning path is ready.",
      path: {
        weak: ["Verb forms", "Pronunciation", "Linking ideas", "Prepositions", "Fluency", "Word repetition"],
        generating: "EhYo is building your path",
        levelUp: "Level Up!",
        steps: ["Notes", "Podcast", "Reading", "Writing"],
      },
    },
    cta: {
      title: "Sounds great?",
      sub: "Start changing the way you maintain a language. Try it now!",
      ios: "Download for iOS",
      and: "Follow EhYo"
    },
    footer: {
      desc: "EhYo is an app dedicated to making language learning personal, cultural, and deeply human.",
      social: "Social",
      privacy: "Privacy Policy",
      contact: "Contact",
      rights: "EhYo Language Learning. All rights reserved.",
    }
  },
  zh: {
    nav: { get: "下載", changelog: "更新日誌", roadmap: "開發路線", openMenu: "開啟選單", closeMenu: "關閉選單", language: "語言" },
    hero: {
      beta: "Beta 測試版現已開放",
      h1_1: "EhYo",
      sub: "為語言自學者設計\n根據你的學習紀錄，打造最有效率的學習。",
      langs: "支援 28 種以上語言：英文、中文、日文、韓文、西班牙文等",
      btn_start: "試試看！",
    },
    prob: {
      title: "EhYo 解決這些問題",
      sol_title: "EhYo 這樣幫你",
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
    vis: {
      time: { example: "造句", exampleText: "Decidí estudiar en Madrid.", translate: "翻譯", translateText: "決定了（decidir 的過去式）", grammar: "文法", grammarText: "簡單過去式：decid- + -ió（第三人稱單數）", record: "學習紀錄", vocab: "詞彙", grammarBin: "文法" },
      level: { build: "拼句", notes: "筆記", reading: "閱讀素材", notesA1: "decide ＝ 決定", notesB2: "decide on / against ＝ 選定／決定不⋯；近義：resolve, determine" },
      weak: "接下來幫你加強動詞變化！",
      brain: { listening: "聽", speaking: "說", reading: "讀", writing: "寫", vocab: "單字", grammar: "文法", weak: "需要加強" },
      sync: { saved: "已儲存", meaning: "短暫的", laptop: "電腦：閱讀、存單字", phone: "手機：複習" },
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
    builder: {
      tag: "如何用 EhYo 自學",
      title: "你的 EhYo 學習方式",
      sub: "點一下句子裡的底線，換成你的狀況。下面會排出最適合你的學法。",
    },
    study: {
      tag: "如何用 EhYo 自學",
      title: "怎麼學，都不白費",
      sub: "剛起步或已經有基礎，EhYo 都有適合你的學法。兩種方式互相補強，學過的都不會白費。",
      tabs: { beginner: "我是初學者", experienced: "我已經有基礎" },
      taglines: { beginner: "有系統地打好基礎", experienced: "用你在看的東西繼續進步" },
      diagram: {
        toolkit: { eyebrow: "用你的素材學", title: "自學工具組" },
        path: { eyebrow: "幫你打造專屬課程", title: "個人化學習路徑" },
        soon: "即將推出",
      },
      multi: "同時學好幾種語言？每個語言各自記錄，你可以同時是初學者，也是老手：",
      chips: [
        { lang: "日本語", level: "初學者", mode: "beginner" as const },
        { lang: "English", level: "有基礎", mode: "experienced" as const },
      ],
      lead: {
        beginner: "從個人化學習路徑開始，有系統地打好基礎；再用自學工具組，拿喜歡的素材複習。",
        experienced: "從自學工具組開始，用你本來就在看的東西學；不熟的內容，EhYo 幫你排進個人化學習路徑。",
      },
      steps: {
        beginner: [
          { t: "跟著路徑打基礎", d: "EhYo 依序安排文法、單字和練習，不用煩惱先學什麼。" },
          { t: "用喜歡的素材複習", d: "讀一篇文章、看一支影片，把剛學的東西用在真實內容裡。" },
          { t: "卡住的地方自動補強", d: "複習時犯的錯會回到學習路徑，下一步就幫你練到會。" },
        ],
        experienced: [
          { t: "照你的興趣自學", d: "讀你想讀的、看你想看的，看不懂的地方點一下就懂。" },
          { t: "不熟的變成學習路徑", d: "新遇到的內容和常犯的老毛病，EhYo 幫你排進同一條路徑。" },
          { t: "練熟了再回到素材", d: "在真實內容裡再遇到時，你已經會用了。" },
        ],
      },
      toolkit: {
        tag: "自學工具組",
        title: "喜歡的內容，就是最好的教材",
        desc: "書、文章、影片、歌詞都能拿來學。看不懂的地方點一下就懂，學到的東西自動整理好。",
      },
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
            title: "把喜歡的書變成教材",
            bullets: [
              "電子書、文章、歌詞，想讀什麼就讀什麼。",
              "每天讀了多少一看就知道，進步看得見。",
              "推薦程度剛好的讀物，不會太難也不會太簡單。"
            ]
          },
          {
            image: "/reading2-zh.png",
            title: "看不懂？點一下就懂",
            bullets: [
              "長句子拆開來看，結構一眼就清楚。",
              "用白話解釋單字，知道生活中怎麼用。",
              "馬上造句並得到回饋，學到的當場就會用。"
            ]
          }
        ]
      },
      vocabulary: {
        slides: [
          {
            image: "/voc-zh.png",
            title: "單字不再背了就忘",
            bullets: [
              "閃卡、造句、聽寫輪流練，從認得到會用。",
              "練得越多，EhYo 越知道你需要什麼。",
              "更多練習方式陸續加入。"
            ]
          }
        ]
      },
      writing: {
        slides: [
          {
            image: "/writing-zh.png",
            title: "寫出來，才是真的會",
            bullets: [
              "題目配合你的程度和興趣，寫起來不卡。",
              "該練的單字就在眼前，寫作的同時順便複習。",
              "下筆前先提醒你常犯的錯，避開老毛病。",
              "文法和自然說法一起改，越寫越像母語者。"
            ]
          },
          {
            image: "/writing2-diary.png",
            title: "想寫什麼就寫什麼",
            bullets: [
              "小故事、一句話、日記都可以，沒有壓力。",
              "用上自己收藏的單字，練習更有意義。",
              "寫完馬上得到回饋。"
            ]
          }
        ]
      },
      listening: {
        slides: [
          {
            image: "/listening-zh.png",
            title: "看你本來就想看的影片",
            bullets: [
              "依你的興趣，推薦母語者真正在看的影片。",
              "興趣變了，推薦也跟著變。",

            ]
          },
          {
            image: "/shadowing.png",
            title: "跟著說，口說進步聽得見",
            bullets: [
              "逐句跟讀，跟上母語者的節奏。",
              "錄下自己的聲音和原音比對，聽得出差在哪。",
              "任何一句都能重複播放，練到順為止。"
            ]
          }
        ]
      }
    },
    engine: {
      tag: "核心概念",
      title: "個人化學習路徑",
      p1: "結合你的弱點、錯誤模式，為你安排專屬的學習內容。",
      p2: "不用花時間思考下一步，打開 EhYo，屬於你的學習路徑已經準備好了。",
      path: {
        weak: ["動詞變化", "發音", "句子連貫", "介係詞", "口說流暢度", "用字重複"],
        generating: "EhYo 正在為你安排學習路徑",
        levelUp: "Level Up!",
        steps: ["筆記", "Podcast", "閱讀", "造句"],
      },
    },
    cta: {
      title: "聽起來很讚？",
      sub: "一起改變維持語言的方式，快來體驗！",
      ios: "下載 iOS 版",
      and: "追蹤 EhYo"
    },
    footer: {
      desc: "EhYo 是一個致力於讓語言學習變得個人化、文化化且重視人文的軟體。",
      social: "社群",
      privacy: "隱私權政策",
      contact: "聯絡我們",
      rights: "EhYo Language Learning. 保留所有權利。",
    }
  }
};


// What each step of "How EhYo fits you" opens: the site's own screens, animations and copy
type Showcase = (typeof translations)['zh']['showcase'];
type ToolTab = 'listening' | 'reading' | 'vocabulary' | 'writing';
const TOOL_ORDER: ToolTab[] = ['listening', 'reading', 'vocabulary', 'writing'];
// the tool a goal uses most opens first
const GOAL_TOOL: Record<StudyDetailContext['goal'], ToolTab> = { content: 'reading', travel: 'listening', exam: 'writing', work: 'writing', maintain: 'vocabulary' };

const ToolkitDetail: React.FC<{ showcase: Showcase; goal: StudyDetailContext['goal'] }> = ({ showcase, goal }) => {
  const [tool, setTool] = useState<ToolTab>(GOAL_TOOL[goal]);
  const [idx, setIdx] = useState(0);
  const slides = showcase[tool].slides;
  const slide = slides[Math.min(idx, slides.length - 1)];
  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-2 mb-6">
        {TOOL_ORDER.map((k) => (
          <button key={k} type="button" role="tab" aria-selected={tool === k} onClick={() => { setTool(k); setIdx(0); }}
            className={`rounded-full px-4 py-2 text-sm border transition-colors duration-200 ${tool === k ? 'bg-ehyo-indigo/10 border-ehyo-indigo/30 text-ehyo-indigo font-semibold' : 'bg-white border-stone-200 text-stone-600 hover:border-ehyo-indigo/40'}`}>
            {showcase.tabs[k]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] gap-6 items-start">
        <img key={slide.image} src={slide.image} alt={slide.title} loading="lazy" className="w-full max-w-[200px] mx-auto rounded-[22px] shadow-lg border border-stone-100" />
        <div>
          <h5 className="text-xl font-bold text-ehyo-text mb-3">{slide.title}</h5>
          <ul className="space-y-2 text-stone-600 list-none p-0 m-0">
            {slide.bullets.map((b, i) => (
              <li key={i} className="flex gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-ehyo-indigo flex-shrink-0" />{b}</li>
            ))}
          </ul>
          {slides.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {slides.map((sl, i) => (
                <button key={i} type="button" onClick={() => setIdx(i)} aria-pressed={idx === i}
                  className={`text-sm rounded-full px-3 py-1.5 border ${idx === i ? 'border-ehyo-indigo/40 text-ehyo-indigo bg-ehyo-indigo/5' : 'border-stone-200 text-stone-500'}`}>{sl.title}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
  const [probIdx, setProbIdx] = useState(0);

  const navigate = (p: Page) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = translations[lang];
  const renderStudyDetail = (part: StudyPart, ctx: StudyDetailContext) => {
    if (part === 'toolkit') return <ToolkitDetail key={`${ctx.goal}-${lang}`} showcase={t.showcase} goal={ctx.goal} />;
    if (part === 'sync') return <SyncVisual text={t.vis.sync} />;
    if (part === 'path') return (
      <div className="rounded-2xl bg-ehyo-text p-4 md:p-6 flex justify-center overflow-hidden"><LearningPathVisual text={t.engine.path} /></div>
    );
    return (
      <div className="grid gap-6">
        <div>
          <h5 className="text-lg font-bold text-ehyo-text mb-1">{t.prob.s4_t}</h5>
          <p className="text-stone-600 text-[15px] leading-relaxed mb-4">{t.prob.s4_d}</p>
          <WeaknessVisual bubble={t.vis.weak} />
        </div>
        <div>
          <h5 className="text-lg font-bold text-ehyo-text mb-1">{t.prob.s5_t}</h5>
          <p className="text-stone-600 text-[15px] leading-relaxed mb-4">{t.prob.s5_d}</p>
          <video src="/brainxp.mp4" autoPlay loop muted playsInline className="block w-full max-w-[240px] mx-auto rounded-xl" />
        </div>
      </div>
    );
  };
  const problems: ProblemItem[] = [
    { icon: FolderOpen, problem: t.prob.c1_t, problemDetail: t.prob.c1_d, title: t.prob.s1_t, description: t.prob.s1_d, visual: <CentralizeVisual /> },
    { icon: Clock, problem: t.prob.c2_t, problemDetail: t.prob.c2_d, title: t.prob.s2_t, description: t.prob.s2_d, visual: <TimeSaveVisual text={t.vis.time} /> },
    { icon: Lightbulb, problem: t.prob.c3_t, problemDetail: t.prob.c3_d, title: t.prob.s3_t, description: t.prob.s3_d, visual: <LevelVisual text={t.vis.level} /> },
    { icon: RotateCcw, problem: t.prob.c4_t, problemDetail: t.prob.c4_d, title: t.prob.s4_t, description: t.prob.s4_d, visual: <WeaknessVisual bubble={t.vis.weak} /> },
    { icon: Scale, problem: t.prob.c5_t, problemDetail: t.prob.c5_d, title: t.prob.s5_t, description: t.prob.s5_d, visual: <video src="/brainxp.mp4" autoPlay loop muted playsInline className="block w-full max-w-[260px] mx-auto rounded-xl" /> },
    { icon: Hourglass, problem: t.prob.c6_t, problemDetail: t.prob.c6_d, title: t.prob.s6_t, description: t.prob.s6_d },
    { icon: RefreshCw, title: t.prob.s7_t, description: t.prob.s7_d, visual: <SyncVisual text={t.vis.sync} /> },
  ];

  // The page's language for screen readers and search engines
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  }, [lang]);

  // Pause the hero scene once it scrolls away, and keep it still for visitors who ask for less motion
  const heroRef = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);
  const reduceMotion = !!useReducedMotion();
  // Start the 3D scene once the browser is idle, so the page itself is usable first
  const [sceneReady, setSceneReady] = useState(false);
  useEffect(() => {
    const start = () => setSceneReady(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = globalThis.setTimeout(start, 1500);
    return () => globalThis.clearTimeout(id);
  }, []);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
            <button onClick={() => navigate('changelog')} className={`bg-transparent outline-none focus:outline-none transition-colors ${page === 'changelog' ? 'text-ehyo-text font-bold' : 'text-stone-500 hover:text-ehyo-indigo'}`}>{t.nav.changelog}</button>
            <button onClick={() => navigate('roadmap')} className={`bg-transparent outline-none focus:outline-none transition-colors ${page === 'roadmap' ? 'text-ehyo-text font-bold' : 'text-stone-500 hover:text-ehyo-indigo'}`}>{t.nav.roadmap}</button>
            {/* Language Switcher */}
            <div className="flex items-center gap-2 border-stone-300 pl-4 border-l" role="group" aria-label={t.nav.language}>
              <button aria-pressed={lang === 'en'} onClick={() => setLang('en')} className={`bg-transparent outline-none focus:outline-none transition-colors ${lang === 'en' ? 'text-ehyo-text font-bold' : 'text-stone-500 hover:text-ehyo-indigo'}`}>EN</button>
              <button aria-pressed={lang === 'zh'} onClick={() => setLang('zh')} className={`bg-transparent outline-none focus:outline-none transition-colors ${lang === 'zh' ? 'text-ehyo-text font-bold' : 'text-stone-500 hover:text-ehyo-indigo'}`}>中</button>
            </div>
            <a
              href="https://apps.apple.com/us/app/ehyo/id6745819373"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full bg-ehyo-text text-white hover:bg-ehyo-indigo transition-colors"
            >
              {t.nav.get}
            </a>
          </div>

          <button className="md:hidden text-stone-900 p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu} aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#FBFAF6] flex flex-col items-center justify-center gap-8 text-xl font-serif">
          <Logo scrolled={true} />
          <button onClick={() => navigate('changelog')} className={`bg-transparent outline-none focus:outline-none transition-colors ${page === 'changelog' ? 'text-ehyo-text font-bold' : 'text-stone-500 hover:text-ehyo-indigo'}`}>{t.nav.changelog}</button>
          <button onClick={() => navigate('roadmap')} className={`bg-transparent outline-none focus:outline-none transition-colors ${page === 'roadmap' ? 'text-ehyo-text font-bold' : 'text-stone-500 hover:text-ehyo-indigo'}`}>{t.nav.roadmap}</button>
          <div className="flex gap-6 mt-2" role="group" aria-label={t.nav.language}>
            <button aria-pressed={lang === 'en'} onClick={() => { setLang('en'); setMenuOpen(false); }} className={lang === 'en' ? 'font-bold' : 'text-stone-500'}>EN</button>
            <button aria-pressed={lang === 'zh'} onClick={() => { setLang('zh'); setMenuOpen(false); }} className={lang === 'zh' ? 'font-bold' : 'text-stone-500'}>中</button>
          </div>
          <a
            href="https://apps.apple.com/us/app/ehyo/id6745819373"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 px-8 py-3 rounded-full bg-ehyo-text text-white text-base font-sans"
          >
            {t.nav.get}
          </a>
        </div>
      )}

      {page === 'changelog' && <ChangelogPage lang={lang} />}
      {page === 'roadmap' && <RoadmapPage lang={lang} />}
      {page === 'privacy' && <PrivacyPolicyPage />}

      {/* Hero Section */}
      <header ref={heroRef} className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-20 ${page !== 'home' ? 'hidden' : ''}`}>
        {sceneReady && (
          <Suspense fallback={null}>
            <HeroScene paused={!heroVisible || reduceMotion || page !== 'home'} />
          </Suspense>
        )}

        {/* Soft Overlay - Reduced opacity at center (0.0) for better visibility of Earth */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(251,250,246,0.0)_0%,rgba(251,250,246,0.5)_70%,rgba(251,250,246,1)_100%)]" />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-stone-200 rounded-full shadow-sm" style={{ animationDelay: '0.1s' }}>
            <span className="w-2 h-2 rounded-full bg-ehyo-coral"></span>
            <span className="text-xs font-bold tracking-widest text-stone-500 uppercase">{t.hero.beta}</span>
          </div>

          <h1 className="font-serif text-6xl md:text-8xl font-medium leading-tight mb-8 text-ehyo-text drop-shadow-sm" style={{ animationDelay: '0.2s' }}>
            {t.hero.h1_1}
          </h1>

          <div className="font-serif text-xl md:text-3xl font-light leading-tight mb-10 text-ehyo-indigo drop-shadow-sm whitespace-pre-line" style={{ animationDelay: '0.25s' }}>
            {t.hero.sub}
          </div>



          <div className="flex flex-col md:flex-row justify-center gap-4" style={{ animationDelay: '0.4s' }}>
            <a
              href="https://apps.apple.com/us/app/ehyo/id6745819373"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-ehyo-text text-white rounded-full hover:bg-ehyo-indigo transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group">
              {t.hero.btn_start}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <p className="text-sm text-stone-500 mt-6">
            {t.hero.langs}
          </p>
        </div>
      </header>

      <main className={page !== 'home' ? 'hidden' : ''}>
        {/* Philosophy Section - Updated Layout */}
        {/* "Spending a lot of time on languages?" on the left, "How EhYo fits you" on the right;
            the route the visitor builds opens full width below both */}
        <section id="how" className="py-24 md:py-28 bg-ehyo-bg relative overflow-hidden">
          <div className="absolute top-24 -left-40 w-[560px] h-[560px] bg-gradient-to-tr from-ehyo-sage/20 to-transparent rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
          <div className="container mx-auto px-6 relative z-10">
            <StudyBuilder
              key={lang}
              lang={lang}
              renderDetail={renderStudyDetail}
              aside={
                <div id="philosophy" className="text-center lg:text-left">
                  <div className="inline-flex items-center justify-center p-3 mb-8 bg-ehyo-sage/10 rounded-full text-ehyo-sage">
                    <Sprout size={28} />
                  </div>
                  <h2 className="font-serif text-4xl md:text-5xl mb-6 text-ehyo-text">{t.phil.title}</h2>
                  <p className="text-xl text-stone-600 leading-relaxed mb-6">{t.phil.p1}</p>
                  <p className="text-lg text-stone-500 leading-relaxed font-light">{t.phil.p2}</p>
                </div>
              }
              head={
                <div className="mb-6">
                  <h2 className="font-serif text-3xl md:text-4xl mb-3 text-ehyo-text">{t.builder.title}</h2>
                  <p className="text-stone-500 leading-relaxed">{t.builder.sub}</p>
                </div>
              }
            />
          </div>
        </section>

        {/* Problems Section */}
        <section id="problems" className="py-24 md:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <h2 className="font-serif text-4xl">{t.prob.title}</h2>
            </div>

            {/* Each problem beside how EhYo solves it: pick a row, the card on the right shows the answer.
                On small screens the answer opens under the chosen row instead. */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
              <ul aria-label={t.prob.title} className="lg:col-span-5 border-t border-stone-200">
                {problems.map((item, i) => {
                  const active = probIdx === i;
                  return (
                    <li key={i} className="border-b border-stone-200">
                      <button
                        type="button"
                        aria-expanded={active}
                        aria-controls="problem-answer"
                        onClick={() => setProbIdx(i)}
                        className={`w-full flex items-center gap-4 text-left px-4 py-4 my-1 rounded-2xl transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ehyo-indigo/50 ${active ? 'bg-white shadow-sm' : 'hover:bg-white/60'}`}
                      >
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${active ? 'bg-ehyo-indigo/10 text-ehyo-indigo' : 'bg-stone-100 text-stone-500'}`}>
                          <item.icon size={20} />
                        </span>
                        <span className="flex-1 min-w-0">
                          {item.problem && (
                            <span className="block text-sm text-stone-500 line-through decoration-ehyo-coral/70">{item.problem}</span>
                          )}
                          <span className={`block font-serif text-lg font-bold ${active ? 'text-ehyo-indigo' : 'text-ehyo-text'}`}>{item.title}</span>
                        </span>
                        <ArrowRight size={18} className={`flex-shrink-0 transition-all duration-200 ${active ? 'text-ehyo-indigo translate-x-0' : 'text-stone-300 -translate-x-1'}`} />
                      </button>
                      {active && <div className="lg:hidden px-1 pb-6 pt-2"><ProblemAnswer item={item} /></div>}
                    </li>
                  );
                })}
              </ul>
              <div className="hidden lg:block lg:col-span-7 lg:sticky lg:top-28">
                <div key={`${lang}-${probIdx}`} id="problem-answer" role="region" aria-live="polite" aria-label={problems[probIdx].title} className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm min-h-[520px] motion-safe-fade animate-[fadeUp_0.35s_ease-out]">
                  <ProblemAnswer item={problems[probIdx]} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 md:py-32 bg-ehyo-bg text-center">
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
            </div>
          </div>
        </section>

      </main>

      <footer className={`bg-[#F5F4F0] text-stone-600 py-16 border-t border-stone-200 ${page === 'changelog' || page === 'roadmap' ? 'hidden' : ''}`}>
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="text-center md:text-left max-w-xs">
            <Logo scrolled={true} />
            <p className="mt-4 text-sm text-stone-600 leading-relaxed">
              {t.footer.desc}
            </p>
          </div>

          <div className="flex flex-col gap-4 text-sm">

            <div className="flex flex-col gap-4 ">
              <p className="font-bold text-ehyo-text text-sm">{t.footer.social}</p>
              <a
                href="https://www.instagram.com/ehyo.world/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ehyo-indigo transition-colors">Instagram</a>
              <a
                href="https://discord.com/invite/htVu7kyx3m"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ehyo-indigo transition-colors">Discord</a>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-stone-300 text-center md:text-left flex flex-col md:flex-row justify-between text-xs text-stone-600">
          <p>© {new Date().getFullYear()} {t.footer.rights}</p>
          <div className="flex gap-6 justify-center md:justify-end mt-4 md:mt-0">
            <button onClick={() => navigate('privacy')} className="bg-transparent outline-none hover:text-ehyo-indigo transition-colors">{t.footer.privacy}</button>
            <a href="mailto:valzin@ehyo.app" className="hover:text-ehyo-indigo transition-colors">{t.footer.contact}</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;