'use client';
import { useState, useEffect } from 'react';

const mainTranslations = {
  UZ: {
    title: 'AuraKit.pro — Hammasi 1 ta bosishda!',
    subtitle: 'Odamlar va xalq uchun eng oson sun\'iy intellekt yordamchisi',
    card1_title: 'Ovozni matnga aylantirish',
    card2_title: 'Mag\'zini chiqarish',
    card3_title: 'Tarjima qilish',
    card4_title: 'Professional CV tayyorlash',
    name: 'Ismingiz', exp: 'Tajriba', skills: 'Ko\'nikmalar', create: 'CV yaratish'
  },
  RU: {
    title: 'AuraKit.pro — Всё в 1 клик!',
    subtitle: 'Самый простой помощник на базе ИИ для людей',
    card1_title: 'Преобразование голоса в текст',
    card2_title: 'Выделение главного (Конспект)',
    card3_title: 'Переводчик',
    card4_title: 'Создание профессионального CV',
    name: 'Ваше имя', exp: 'Опыт работы', skills: 'Ваши навыки', create: 'Создать CV'
  },
  EN: {
    title: 'AuraKit.pro — All in 1 Click!',
    subtitle: 'The easiest AI assistant for everyone',
    card1_title: 'Speech to Text (Transcribe)',
    card2_title: 'Text Summarization',
    card3_title: 'Translation Service',
    card4_title: 'Professional CV Builder',
    name: 'Your Name', exp: 'Your Experience', skills: 'Your Skills', create: 'Create CV'
  }
};

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<'UZ' | 'RU' | 'EN'>('UZ');
  const [showCV, setShowCV] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') as 'UZ' | 'RU' | 'EN';
    if (savedLang) setCurrentLang(savedLang);
  }, []);

  const t = mainTranslations[currentLang];

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
      {/* Til tanlash tugmalari */}
      <div className="absolute top-6 right-6 flex bg-slate-800 p-1 rounded-xl border border-slate-700/50 z-10">
        {(['UZ', 'RU', 'EN'] as const).map((lang) => (
          <button key={lang} onClick={() => { setCurrentLang(lang); localStorage.setItem('selectedLanguage', lang); }} 
            className={`px-3 py-1.5 rounded-lg ${currentLang === lang ? 'bg-indigo-600' : 'text-slate-400'}`}>
            {lang}
          </button>
        ))}
      </div>

      <div className="text-center max-w-2xl mb-12 mt-12">
        <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">{t.title}</h1>
        <p className="text-slate-400">{t.subtitle}</p>
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* CV Formasi (Agar ochilsa, eng tepada turadi) */}
        {showCV && (
          <div className="bg-slate-800/50 border border-amber-500 p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">{t.card4_title}</h3>
            <input className="w-full p-3 mb-3 bg-slate-900 rounded border border-slate-700" placeholder={t.name} />
            <textarea className="w-full p-3 mb-3 bg-slate-900 rounded border border-slate-700" placeholder={t.exp} />
            <textarea className="w-full p-3 mb-4 bg-slate-900 rounded border border-slate-700" placeholder={t.skills} />
            <button className="w-full bg-amber-600 py-3 rounded-xl font-bold">{t.create}</button>
            <button onClick={() => setShowCV(false)} className="mt-4 text-slate-400 underline w-full text-center">Orqaga</button>
          </div>
        )}

        {/* 2x2 Grid (Forma ochilsa ham, pastda qoladi) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-32 flex items-center">🎙️ {t.card1_title}</div>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-32 flex items-center">📄 {t.card2_title}</div>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-32 flex items-center">🌐 {t.card3_title}</div>
          <button onClick={() => setShowCV(true)} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-32 text-left hover:border-amber-500 flex items-center">
            💼 {t.card4_title}
          </button>
        </div>
      </div>
    </main>
  );
}


