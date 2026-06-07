'use client';
import { useState, useEffect } from 'react';

const mainTranslations = {
  UZ: {
    title: 'AuraKit.pro — Hammasi 1 ta bosishda!',
    subtitle: 'Odamlar va xalq uchun eng oson sun\'iy intellekt yordamchisi',
    card1: 'Ovozni matnga aylantirish',
    card2: 'Mag\'zini chiqarish',
    card3: 'Tarjima qilish',
    card4: 'Professional CV tayyorlash',
    name: 'Ismingiz', exp: 'Tajriba', skills: 'Ko\'nikmalar', create: 'CV yaratish', back: 'Orqaga'
  },
  RU: {
    title: 'AuraKit.pro — Всё в 1 клик!',
    subtitle: 'Самый простой помощник на базе ИИ для людей',
    card1: 'Преобразование голоса в текст',
    card2: 'Выделение главного (Конспект)',
    card3: 'Переводчик',
    card4: 'Создание профессионального CV',
    name: 'Ваше имя', exp: 'Опыт работы', skills: 'Ваши навыки', create: 'Создать CV', back: 'Назад'
  },
  EN: {
    title: 'AuraKit.pro — All in 1 Click!',
    subtitle: 'The easiest AI assistant for everyone',
    card1: 'Speech to Text (Transcribe)',
    card2: 'Text Summarization',
    card3: 'Translation Service',
    card4: 'Professional CV Builder',
    name: 'Your Name', exp: 'Your Experience', skills: 'Your Skills', create: 'Create CV', back: 'Back'
  }
};

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<'UZ' | 'RU' | 'EN'>('UZ');
  const [showCV, setShowCV] = useState(false);
  const [data, setData] = useState({ name: '', experience: '', skills: '' });
  const [cvResult, setCvResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') as 'UZ' | 'RU' | 'EN';
    if (savedLang) setCurrentLang(savedLang);
  }, []);

  const t = mainTranslations[currentLang];

  const handleCreateCV = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, language: currentLang }),
      });
      const result = await res.json();
      setCvResult(result.cv);
    } catch (error) {
      console.error("Xatolik:", error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
      {/* Til tanlash */}
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
        {showCV && (
          <div className="bg-slate-800/50 border border-amber-500 p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">{t.card4}</h3>
            <input className="w-full p-3 mb-3 bg-slate-900 rounded border border-slate-700" placeholder={t.name} onChange={(e) => setData({...data, name: e.target.value})} />
            <textarea className="w-full p-3 mb-3 bg-slate-900 rounded border border-slate-700" placeholder={t.exp} onChange={(e) => setData({...data, experience: e.target.value})} />
            <textarea className="w-full p-3 mb-4 bg-slate-900 rounded border border-slate-700" placeholder={t.skills} onChange={(e) => setData({...data, skills: e.target.value})} />
            <button onClick={handleCreateCV} className="w-full bg-amber-600 py-3 rounded-xl font-bold hover:bg-amber-700 transition">
              {loading ? '...' : t.create}
            </button>
            <button onClick={() => setShowCV(false)} className="mt-4 text-slate-400 underline w-full text-center">{t.back}</button>
            {cvResult && <div className="mt-6 p-4 bg-slate-950 rounded-lg border border-indigo-500 whitespace-pre-line">{cvResult}</div>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-32 flex items-center">🎙️ {t.card1}</div>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-32 flex items-center">📄 {t.card2}</div>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-32 flex items-center">🌐 {t.card3}</div>
          <button onClick={() => setShowCV(true)} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-32 text-left hover:border-amber-500 flex items-center transition">
            💼 {t.card4}
          </button>
        </div>
      </div>
    </main>
  );
}


