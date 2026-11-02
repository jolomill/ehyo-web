/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { HeroScene } from './components/QuantumScene';
import { ChangelogPage } from './components/ChangelogPage';
import { RoadmapPage } from './components/RoadmapPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { CentralizeVisual, TimeSaveVisual, LevelVisual, WeaknessVisual, SyncVisual, LearningPathVisual } from './components/SolutionVisuals';
import { EhYoMark } from './components/EhYoMark';
import { StudyJourney, type StudyMode } from './components/StudyModes';
import { ArrowRight, Menu, X, BookOpen, Sprout, ChevronLeft, ChevronRight, Check, PenLine, Headphones, FolderOpen, Lightbulb, RotateCcw, Scale, Hourglass, Clock } from 'lucide-react';

const Logo = ({ onClick }: { scrolled?: boolean; onClick?: () => void }) => (
  <div className="flex items-center cursor-pointer" onClick={onClick ?? (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}>
    <EhYoMark className="h-11 w-auto" />
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

const SolutionCard = ({ title, description, visual }: { title: string, description: string, visual?: React.ReactNode }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md hover:border-ehyo-indigo/20 transition-all duration-300">
    <div className="flex items-center gap-2 mb-3 text-ehyo-sage">
      <Check size={20} strokeWidth={2.5} />
      <span className="font-serif text-lg font-bold text-ehyo-text">{title}</span>
    </div>
    <p className="text-stone-600 leading-relaxed">{description}</p>
    {visual && <div className="mt-6">{visual}</div>}
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
    study: {
      tag: "How to learn with EhYo",
      title: "Every way you learn counts",
      sub: "Just starting out or already on your way, EhYo has a way of learning that fits. Its two parts strengthen each other, so nothing you learn goes to waste.",
      tabs: { beginner: "I'm a beginner", experienced: "I already know some" },
      taglines: { beginner: "Build a solid foundation, step by step", experienced: "Keep improving with what you already read and watch" },
      journey: {
        multi: "Learning more than one language? Each keeps its own record, so you can be a beginner in one and experienced in another:",
        chips: [
          { lang: "日本語", level: "Beginner", mode: "beginner" as const },
          { lang: "English", level: "Experienced", mode: "experienced" as const },
        ],
        cards: {
          path: { eyebrow: "Planned for you", title: "Personal Learning Path" },
          toolkit: { eyebrow: "Your own material", title: "Self-Study Toolkit" },
          start: "Start here",
          then: "Then",
          soon: "Coming soon",
        },
        beginner: {
          pathLine: "A clear structure takes you step by step, so you never have to work out what comes first.",
          toolkitLine: "Review what you've learned with books and videos you enjoy.",
          forward: "Review what you learn with material you love",
          back: "Where you get stuck, the path helps you catch up",
        },
        experienced: {
          toolkitLine: "Keep improving with the books, videos and articles you already enjoy.",
          pathLine: "What you're unsure of, plus your old repeat mistakes, becomes a path made for you.",
          forward: "Whatever you're unsure of becomes your learning path",
          back: "Once it sticks, use it in real content",
        },
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
    study: {
      tag: "如何用 EhYo 自學",
      title: "怎麼學，都不白費",
      sub: "剛起步或已經有基礎，EhYo 都有適合你的學法。兩種方式互相補強，學過的都不會白費。",
      tabs: { beginner: "我是初學者", experienced: "我已經有基礎" },
      taglines: { beginner: "有系統地打好基礎", experienced: "用你在看的東西繼續進步" },
      journey: {
        multi: "同時學好幾種語言？每個語言各自記錄，你可以同時是初學者，也是老手：",
        chips: [
          { lang: "日本語", level: "初學者", mode: "beginner" as const },
          { lang: "English", level: "有基礎", mode: "experienced" as const },
        ],
        cards: {
          path: { eyebrow: "EhYo 為你安排", title: "個人化學習路徑" },
          toolkit: { eyebrow: "用你的素材", title: "自學工具組" },
          start: "從這裡開始",
          then: "接著",
          soon: "即將推出",
        },
        beginner: {
          pathLine: "有系統的架構，一步步打好基礎，不用自己摸索該先學什麼。",
          toolkitLine: "用喜歡的書和影片，複習學過的內容。",
          forward: "學到的，用喜歡的素材複習",
          back: "複習時卡住的地方，路徑幫你補強",
        },
        experienced: {
          toolkitLine: "用你本來就在看的書、影片、文章繼續進步。",
          pathLine: "不熟的新內容，加上常錯的老問題，排成你的專屬路徑。",
          forward: "不熟的內容，自動變成學習路徑",
          back: "練熟了，回到真實內容裡用出來",
        },
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
  const [studyMode, setStudyMode] = useState<StudyMode>('beginner');
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
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <h2 className="font-serif text-4xl">{t.prob.title}</h2>
            </div>

            {/* The problems, as a compact grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ProblemOnlyCard icon={FolderOpen} title={t.prob.c1_t} description={t.prob.c1_d} />
              <ProblemOnlyCard icon={Clock} title={t.prob.c2_t} description={t.prob.c2_d} />
              <ProblemOnlyCard icon={Lightbulb} title={t.prob.c3_t} description={t.prob.c3_d} />
              <ProblemOnlyCard icon={RotateCcw} title={t.prob.c4_t} description={t.prob.c4_d} />
              <ProblemOnlyCard icon={Scale} title={t.prob.c5_t} description={t.prob.c5_d} />
              <ProblemOnlyCard icon={Hourglass} title={t.prob.c6_t} description={t.prob.c6_d} />
            </div>

            <div className="flex items-center gap-4 my-14 max-w-xl mx-auto">
              <div className="h-px flex-1 bg-stone-200" />
              <h3 className="font-serif text-2xl text-ehyo-text whitespace-nowrap">{t.prob.sol_title}</h3>
              <div className="h-px flex-1 bg-stone-200" />
            </div>

            {/* How EhYo solves them: two-column masonry so cards of different heights pack without gaps */}
            <div className="columns-1 md:columns-2 gap-6 [&>*]:break-inside-avoid [&>*]:mb-6">
              <SolutionCard title={t.prob.s1_t} description={t.prob.s1_d} visual={<CentralizeVisual />} />
              <SolutionCard title={t.prob.s2_t} description={t.prob.s2_d} visual={<TimeSaveVisual text={t.vis.time} />} />
              <SolutionCard title={t.prob.s3_t} description={t.prob.s3_d} visual={<LevelVisual text={t.vis.level} />} />
              <SolutionCard title={t.prob.s4_t} description={t.prob.s4_d} visual={<WeaknessVisual bubble={t.vis.weak} />} />
              <SolutionCard
                title={t.prob.s5_t}
                description={t.prob.s5_d}
                visual={<video src="/brainxp.mp4" autoPlay loop muted playsInline className="block w-full max-w-[260px] mx-auto rounded-xl" />}
              />
              <SolutionCard title={t.prob.s6_t} description={t.prob.s6_d} />
              <SolutionCard title={t.prob.s7_t} description={t.prob.s7_d} visual={<SyncVisual text={t.vis.sync} />} />
            </div>
          </div>
        </section>

        {/* Core Concept: Personal Learning Path */}
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
                <LearningPathVisual text={t.engine.path} />
              </div>
            </div>
          </div>
        </section>

        {/* How to study with EhYo: beginners start on the learning path, experienced learners with
            their own material; both parts feed each other. */}
        <section id="features" className="py-24 bg-[#FBFAF6]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <div className="text-xs font-bold tracking-widest uppercase text-ehyo-indigo mb-3">{t.study.tag}</div>
              <h2 className="font-serif text-4xl mb-4">{t.study.title}</h2>
              <p className="text-stone-500 leading-relaxed">{t.study.sub}</p>
            </div>

            {/* Who are you? */}
            <div role="tablist" className="grid grid-cols-2 gap-2 max-w-xl mx-auto mb-6 p-1.5 rounded-2xl bg-stone-100">
              {(['beginner', 'experienced'] as const).map((m) => {
                const active = studyMode === m;
                return (
                  <button
                    key={m}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setStudyMode(m)}
                    className={`rounded-xl px-3 py-3 text-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ehyo-indigo/50 ${active ? 'bg-white shadow-sm' : 'hover:bg-white/60'}`}
                  >
                    <span className={`block font-serif text-base md:text-lg font-bold ${active ? 'text-ehyo-text' : 'text-stone-500'}`}>{t.study.tabs[m]}</span>
                    <span className="block text-xs text-stone-500 mt-0.5">{t.study.taglines[m]}</span>
                  </button>
                );
              })}
            </div>

            <StudyJourney mode={studyMode} text={t.study.journey} onSelect={setStudyMode} />

            {/* How it goes, step by step */}
            <ol key={studyMode} className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mt-14 animate-fade-in-up">
              {t.study.steps[studyMode].map((st, i) => (
                <li key={i} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-ehyo-indigo/10 text-ehyo-indigo font-bold flex items-center justify-center mb-4">{i + 1}</div>
                  <h4 className="font-serif text-lg font-bold mb-2 text-ehyo-text">{st.t}</h4>
                  <p className="text-stone-500 text-sm leading-relaxed">{st.d}</p>
                </li>
              ))}
            </ol>

            {/* The toolkit, for everyone */}
            <div className="mt-24">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="text-xs font-bold tracking-widest uppercase text-ehyo-indigo mb-3">{t.study.toolkit.tag}</div>
                <h3 className="font-serif text-3xl mb-3 text-ehyo-text">{t.study.toolkit.title}</h3>
                <p className="text-stone-500 leading-relaxed">{t.study.toolkit.desc}</p>
              </div>
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