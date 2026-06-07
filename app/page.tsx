'use client';
import { useState, useEffect } from 'react';

const mainTranslations = {
  UZ: {
    title: 'AuraKit.pro — Hammasi 1 ta bosishda!',
    subtitle: 'Odamlar va xalq uchun eng oson sun\'iy intellekt yordamchisi',
    card1_title: '🎙️ Ovozni matnga aylantirish',
    card2_title: '📄 Mag\'zini chiqarish',
    card3_title: '🌐 Tarjima qilish',
    card4_title: '💼 Professional CV tayyorlash',
    card4_btn: 'CV yaratish',
    placeholder_name: 'Ismingiz',
    placeholder_exp: 'Ish tajribangiz',
    placeholder_skills: 'Ko\'nikmalaringiz (Skills)'
  },
  RU: {
    title: 'AuraKit.pro — Всё в 1 клик!',
    subtitle: 'Самый простой помощник на базе ИИ для людей',
    card1_title: '🎙️ Преобразование голоса в текст',
    card2_title: '📄 Выделение главного (Конспект)',
    card3_title: '🌐 Переводчик',
    card4_title: '💼 Создание профессионального CV',
    card4_btn: 'Создать CV',
    placeholder_name: 'Ваше имя',
    placeholder_exp: 'Ваш опыт работы',
    placeholder_skills: 'Ваши навыки (Skills)'
  },
  EN: {
    title: 'AuraKit.pro — All in 1 Click!',
    subtitle: 'The easiest AI assistant for everyone',
    card1_title: '🎙️ Speech to Text (Transcribe)',
    card2_title: '📄 Text Summarization',
    card3_title: '🌐 Translation Service',
    card4_title: '💼 Professional CV Builder',
    card4_btn: 'Create CV',
    placeholder_name: 'Your Name',
    placeholder_exp: 'Your Work Experience',
    placeholder_skills: 'Your Skills'
  }
};

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<'UZ' | 'RU' | 'EN'>('UZ');
  const [data, setData] = useState({ name: '', experience: '', skills: '' });
  const [cvResult, setCvResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') as 'UZ' | 'RU' | 'EN';
    if (savedLang && ['UZ', 'RU', 'EN'].includes(savedLang)) setCurrentLang(savedLang);
  }, []);

  const changeLanguage = (lang: 'UZ' | 'RU' | 'EN') => {
    setCurrentLang(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  const handleCreateCV = async () => {
    setLoading(true);
    const response = await fetch('/api/cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, language: currentLang }),
    });
    const result = await response.json();
    setCvResult(result.cv);
    setLoading(false);
  };

  const t = mainTranslations[currentLang];

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
      <div className="absolute top-6 right-6 flex bg-slate-800 p-1 rounded-xl border border-slate-700/50 z-10">
        {(['UZ', 'RU', 'EN'] as const).map((lang) => (
          <button key={lang} onClick={() => changeLanguage(lang)} className={`px-3 py-1.5 rounded-lg ${currentLang === lang ? 'bg-indigo-600' : 'text-slate-400'}`}>
            {lang}
          </button>
        ))}
      </div>

      <div className="text-center max-w-2xl mb-12 mt-12">
        <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">{t.title}</h1>
        <p className="text-slate-400">{t.subtitle}</p>
      </div>

      <div className="w-full max-w-2xl bg-slate-800/50 p-6 rounded-2xl border border-slate-700 mb-12">
        <h3 className="text-xl font-bold mb-4">{t.card4_title}</h3>
        <input className="w-full p-3 mb-3 bg-slate-900 rounded border border-slate-700" placeholder={t.placeholder_name} onChange={(e) => setData({...data, name: e.target.value})} />
        <textarea className="w-full p-3 mb-3 bg-slate-900 rounded border border-slate-700" placeholder={t.placeholder_exp} onChange={(e) => setData({...data, experience: e.target.value})} />
        <textarea className="w-full p-3 mb-4 bg-slate-900 rounded border border-slate-700" placeholder={t.placeholder_skills} onChange={(e) => setData({...data, skills: e.target.value})} />
        <button onClick={handleCreateCV} className="w-full bg-amber-600 py-3 rounded-xl font-bold hover:bg-amber-500 transition">
          {loading ? '...' : t.card4_btn}
        </button>
        {cvResult && <div className="mt-6 p-4 bg-white text-black rounded whitespace-pre-line">{cvResult}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <a href="/transcribe" className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-indigo-500">{t.card1_title}</a>
        <a href="/summarize" className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-purple-500">{t.card2_title}</a>
        <a href="/translate" className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-emerald-500">{t.card3_title}</a>
      </div>
    </main>
  );
}

