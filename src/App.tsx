/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { HeroScene } from './components/QuantumScene';
import { CultureContextEngine } from './components/Diagrams';
import { ArrowRight, Menu, X, BookOpen, Globe, Heart, Sprout } from 'lucide-react';

const Logo = ({ scrolled }: { scrolled: boolean }) => (
  <div className="flex flex-col items-center group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
    <span className={`font-serif text-3xl font-bold tracking-tight transition-colors duration-300 ${scrolled ? 'text-ehyo-text' : 'text-ehyo-text'}`}>
      EhYo
    </span>
    {/* Book/Smile Curve underneath */}
    <svg width="40" height="8" viewBox="0 0 40 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[-2px]">
      <path d="M2 2C10 6 18 6 20 2C22 6 30 6 38 2" stroke="#6B7FD7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
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

type Language = 'en' | 'zh';

const translations = {
  en: {
    nav: { get: "Get Started" },
    hero: {
      beta: "Now Available in Beta",
      h1_1: "EhYo",
      
      sub: "Not a vocab app. We activates your language brain.",
      btn_start: "Try it out!",
    },
    phil: {
      title: "Effortless cultivation",
      p1: "We handle everything for you.",
      p2: "EhYo builds your personalized practice, so you can focus on learning and immersing yourself in the language.",
      
    },
    feat: {
      title: "All in one",
      sub: "Everything you need to learn, practice, and immerse in one app.",
      c1_t: "Cultural Context",
      c1_d: "Learning and experiencing culture at the same time.",
      c2_t: "Deeply Personal",
      c2_d: "Learn through lessons built around your own life",
      c3_t: "Smart Review",
      c3_d: "One task a day to maintain your language brain."
    },
    engine: {
      tag: "THE ENGINE",
      title: "Input, then Output",
      p1: "Absorb language from shows, songs, books, and articles, and let EhYo turn it into practice you can actually use in your daily life.",
      p2: "It's not just about knowing the words, but understanding the soul of the language through culture.",
      nodes: [
        { label: "Literal", text: "Direct meaning" },
        { label: "Media", text: "Used in Money Heist S3" },
        { label: "Slang", text: "Colloquial usage in Madrid" },
        { label: "Music", text: "Lyrics in Bad Bunny song" }
      ]
    },
    cta: {
      title: "Sounds great?",
      sub: "Start changing the way you learn a language today.",
      ios: "Download for iOS",
      and: "Follow EhYo",
      trial: "Free 14-day trial. No credit card required."
    },
    footer: {
      desc: "EhYo is an App dedicated to making language learning personal, cultural, and deeply human."
    }
  },
  zh: {
     nav: { get: "下載" },
    hero: {
      beta: "Beta 測試版現已開放",
      h1_1: "EhYo",
      sub: "學語言，不只是背單字。而是建立語言大腦。",
      btn_start: "試試看！",
    },
    phil: {
      title: "無痛養成",
      p1: "都交給 EhYo。",
      p2: "EhYo 會為你建立個人化的練習，而你只需要沈浸在語言之中。",
      
    },
    feat: {
      title: "一應俱全",
      sub: "學習、練習、沉浸，所有需求一次滿足。",
      c1_t: "文化語境",
      c1_d: "學習語言的同時，體驗文化精髓。",
      c2_t: "深度個人化",
      c2_d: "圍繞你的生活打造專屬課程。",
      c3_t: "智慧複習",
      c3_d: "找出弱點征服它！也可以用來維持你的語感。"
    },
    engine: {
      tag: "核心概念",
      title: "輸入，接著輸出",
      p1: "從影集、歌曲、書籍和文章中吸收外文，然後讓 EhYo 將其轉化成個人化的輸出練習。",
      p2: "學習語言不只是認識單字，精髓在理解語言的使用。",
      nodes: [
        { label: "字面義", text: "直接翻譯" },
        { label: "媒體", text: "出自《紙房子》第三季" },
        { label: "俚語", text: "馬德里口語用法" },
        { label: "音樂", text: "Bad Bunny 歌詞" }
      ]
    },
    cta: {
      title: "聽起來很讚？",
      sub: "一起改變學語言的方式！",
      ios: "下載 iOS 版",
      and: "追蹤 EhYo",
      trial: "14 天免費試用。無需信用卡。"
    },
    footer: {
      desc: "EhYo 是一個致力於讓語言學習變得個人化、文化化且重視人文的軟體。"
    }
  }
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');

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
          <Logo scrolled={scrolled} />
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-stone-600">
            {/* Language Switcher */}
            <div className="flex items-center gap-2 border-stone-300 pr-6 mr-[-1rem]">
                <button onClick={() => setLang('en')} className={`transition-colors ${lang === 'en' ? 'text-ehyo-text font-bold' : 'text-stone-400 hover:text-stone-600'}`}>EN</button>
                <button onClick={() => setLang('zh')} className={`transition-colors ${lang === 'zh' ? 'text-ehyo-text font-bold' : 'text-stone-400 hover:text-stone-600'}`}>中</button>
            </div>

            
          </div>

          <button className="md:hidden text-stone-900 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#FBFAF6] flex flex-col items-center justify-center gap-8 text-xl font-serif animate-fade-in">
            <Logo scrolled={true} />
            <div className="flex gap-6 mt-4">
                <button onClick={() => { setLang('en'); setMenuOpen(false); }} className={lang === 'en' ? 'font-bold' : ''}>EN</button>
                <button onClick={() => { setLang('zh'); setMenuOpen(false); }} className={lang === 'zh' ? 'font-bold' : ''}>中</button>
            </div>
           
        </div>
      )}

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <HeroScene />
        
        {/* Soft Overlay - Reduced opacity at center (0.0) for better visibility of Earth */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(251,250,246,0.0)_0%,rgba(251,250,246,0.5)_70%,rgba(251,250,246,1)_100%)]" />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-stone-200 rounded-full shadow-sm animate-fade-in-up" style={{animationDelay: '0.1s'}}>
             <span className="w-2 h-2 rounded-full bg-ehyo-coral"></span>
             <span className="text-xs font-bold tracking-widest text-stone-500 uppercase">{t.hero.beta}</span>
          </div>
          
          <h1 className="font-serif text-6xl md:text-8xl font-medium leading-tight mb-8 text-ehyo-text drop-shadow-sm animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            {t.hero.h1_1}
          </h1>

          <div className="font-serif text-xl md:text-3xl font-light leading-tight mb-10 text-ehyo-indigo drop-shadow-sm animate-fade-in-up" style={{animationDelay: '0.25s'}}>
             {t.hero.sub}
          </div>
          
          
          
          <div className="flex flex-col md:flex-row justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
             <a
                href="https://apps.apple.com/us/app/ehyo/id6745819373"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-ehyo-text text-white rounded-full hover:bg-ehyo-indigo transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group">
                {t.hero.btn_start}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
             </a>
          </div>
        </div>
      </header>

      <main>
        {/* Philosophy Section - Updated Layout */}
        <section id="philosophy" className="py-24 bg-white relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-ehyo-sage/20 to-transparent rounded-full blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
             <div className="inline-flex items-center justify-center p-3 mb-8 bg-ehyo-sage/10 rounded-full text-ehyo-sage animate-fade-in-up">
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

        {/* Features Grid */}
        <section id="features" className="py-24 bg-[#FBFAF6]">
           <div className="container mx-auto px-6">
              <div className="text-center mb-16 max-w-2xl mx-auto">
                 <h2 className="font-serif text-4xl mb-4">{t.feat.title}</h2>
                 <p className="text-stone-500">{t.feat.sub}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <FeatureCard 
                    icon={Globe}
                    title={t.feat.c1_t}
                    description={t.feat.c1_d}
                 />
                 <FeatureCard 
                    icon={Heart}
                    title={t.feat.c2_t}
                    description={t.feat.c2_d}
                 />
                 <FeatureCard 
                    icon={BookOpen}
                    title={t.feat.c3_t}
                    description={t.feat.c3_d}
                 />
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
                        <CultureContextEngine nodesData={t.engine.nodes} />
                     </div>
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
                          className="w-full sm:w-auto px-10 py-4 bg-ehyo-text text-white rounded-full text-lg hover:bg-ehyo-indigo transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                        
                            {t.cta.ios}
                        </a>
                        
                    </div>
                    <p className="mt-8 text-sm text-stone-400">{t.cta.trial}</p>
                </div>
            </div>
        </section>

      </main>

      <footer className="bg-[#F5F4F0] text-stone-600 py-16 border-t border-stone-200">
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
                <a href="https://languagehyo.notion.site/Privacy-Policy-for-EhYo-241fac091b8d8017909decefd86f4bd6?source=copy_link" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                <a href="https://languagehyo.notion.site/Privacy-Policy-for-EhYo-241fac091b8d8017909decefd86f4bd6?source=copy_link" target="_blank" rel="noopener noreferrer">Terms of Service</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;