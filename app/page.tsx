'use client';
import { useState, useEffect } from 'react';

// Tillarga mos matnlar
const mainTranslations = {
  UZ: {
    title: 'AuraKit.pro — Hammasi 1 ta bosishda!',
    subtitle: 'Odamlar va xalq uchun eng oson sun\'iy intellekt yordamchisi',
    card1_title: 'Ovozni matnga aylantirish',
    card1_btn: 'Boshlash →',
    card2_title: 'Mag\'zini chiqarish',
    card2_btn: 'Boshlash →',
    card3_title: 'Tarjima qilish',
    card3_btn: 'Boshlash →',
    card4_title: 'Professional CV tayyorlash',
    card4_btn: 'Boshlash →'
  },
  RU: {
    title: 'AuraKit.pro — Всё в 1 клик!',
    subtitle: 'Самый простой помощник на базе ИИ для людей',
    card1_title: 'Преобразование голоса в текст',
    card1_btn: 'Начать →',
    card2_title: 'Выделение главного (Конспект)',
    card2_btn: 'Начать →',
    card3_title: 'Переводчик',
    card3_btn: 'Начать →',
    card4_title: 'Создание профессионального CV',
    card4_btn: 'Начать →'
  },
  EN: {
    title: 'AuraKit.pro — All in 1 Click!',
    subtitle: 'The easiest AI assistant for everyone',
    card1_title: 'Speech to Text (Transcribe)',
    card1_btn: 'Get Started →',
    card2_title: 'Text Summarization',
    card2_btn: 'Get Started →',
    card3_title: 'Translation Service',
    card3_btn: 'Get Started →',
    card4_title: 'Professional CV Builder',
    card4_btn: 'Get Started →'
  }
};

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<'UZ' | 'RU' | 'EN'>('UZ');

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') as 'UZ' | 'RU' | 'EN';
    if (savedLang && ['UZ', 'RU', 'EN'].includes(savedLang)) {
      setCurrentLang(savedLang);
    }
  }, []);

  const changeLanguage = (lang: 'UZ' | 'RU' | 'EN') => {
    setCurrentLang(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  const t = mainTranslations[currentLang];

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative">
      
      <div className="absolute top-6 right-6 flex bg-slate-800 p-1 rounded-xl border border-slate-700/50 text-xs font-semibold z-10">
        {(['UZ', 'RU', 'EN'] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            className={`px-3 py-1.5 rounded-lg transition ${
              currentLang === lang 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="text-center max-w-2xl mb-12 mt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-slate-400 text-base md:text-lg">
          {t.subtitle}
        </p>
      </div>

      {/* Grid konteyner (4 ta karta shu ichida) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        
        {/* 1-Karta */}
        <a href="/transcribe" className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/50 transition flex flex-col justify-between h-44 group">
          <div>
            <span className="text-2xl mb-3 block">🎙️</span>
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition">{t.card1_title}</h3>
          </div>
          <span className="text-sm font-medium text-indigo-400 group-hover:underline">{t.card1_btn}</span>
        </a>

        {/* 2-Karta */}
        <a href="/summarize" className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition flex flex-col justify-between h-44 group">
          <div>
            <span className="text-2xl mb-3 block">📄</span>
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-purple-400 transition">{t.card2_title}</h3>
          </div>
          <span className="text-sm font-medium text-purple-400 group-hover:underline">{t.card2_btn}</span>
        </a>

        {/* 3-Karta */}
        <a href="/translate" className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/50 transition flex flex-col justify-between h-44 group">
          <div>
            <span className="text-2xl mb-3 block">🌐</span>
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition">{t.card3_title}</h3>
          </div>
          <span className="text-sm font-medium text-emerald-400 group-hover:underline">{t.card3_btn}</span>
        </a>

        {/* 4-Karta */}
        <a href="/cv-builder" className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/50 transition flex flex-col justify-between h-44 group">
          <div>
            <span className="text-2xl mb-3 block">💼</span>
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-400 transition">{t.card4_title}</h3>
          </div>
          <span className="text-sm font-medium text-amber-500 group-hover:underline">{t.card4_btn}</span>
        </a>

      </div>

      <footer className="mt-16 text-xs text-slate-600">
        © 2026 AuraKit.pro
      </footer>
    </main>
  );
}
