'use client';
import { useState, useEffect } from 'react';

const mainTranslations = {
  UZ: { title: 'AuraKit.pro — Hammasi 1 ta bosishda!', subtitle: 'Odamlar va xalq uchun eng oson sun\'iy intellekt yordamchisi', card1: 'Ovozni matnga aylantirish', card2: 'Mag\'zini chiqarish', card3: 'Tarjima qilish', card4: 'Professional CV tayyorlash', input_placeholder: 'Ma\'lumotni shu yerga kiriting...', create: 'Bajarish', back: 'Orqaga' },
  RU: { title: 'AuraKit.pro — Всё в 1 клик!', subtitle: 'Самый простой помощник на базе ИИ для людей', card1: 'Преобразование голоса в текст', card2: 'Выделение главного (Конспект)', card3: 'Переводчик', card4: 'Создание профессионального CV', input_placeholder: 'Введите данные здесь...', create: 'Выполнить', back: 'Назад' },
  EN: { title: 'AuraKit.pro — All in 1 Click!', subtitle: 'The easiest AI assistant for everyone', card1: 'Speech to Text (Transcribe)', card2: 'Text Summarization', card3: 'Translation Service', card4: 'Professional CV Builder', input_placeholder: 'Enter your data here...', create: 'Execute', back: 'Back' }
};

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<'UZ' | 'RU' | 'EN'>('UZ');
  const [activeTab, setActiveTab] = useState<'HOME' | 'AUDIO' | 'SUMMARY' | 'TRANSLATE' | 'CV'>('HOME');
  const [inputData, setInputData] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') as 'UZ' | 'RU' | 'EN';
    if (savedLang) setCurrentLang(savedLang);
  }, []);

  const t = mainTranslations[currentLang];

  const handleAction = async () => {
    setLoading(true);
    setResult(''); // Eski natijani tozalaymiz
    
    // Har bir tab uchun tegishli API yo'li
    const endpoints = {
      AUDIO: '/api/whisper',      // Sizdagi papka nomi bo'yicha
      SUMMARY: '/api/summarize',  // Sizdagi papka nomi bo'yicha
      TRANSLATE: '/api/translate',// Sizdagi papka nomi bo'yicha
      CV: '/api/cv',
      HOME: ''
    };

    try {
      const res = await fetch(endpoints[activeTab], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputData, language: currentLang }),
      });
      const data = await res.json();
      
      // Har qanday API javobini olish (result, cv yoki text)
      setResult(data.result || data.cv || data.text || "Javob qaytmadi");
    } catch (error) {
      console.error("Xatolik:", error);
      setResult("Xatolik yuz berdi.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
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
        {activeTab !== 'HOME' && (
          <div className="bg-slate-800/50 border border-amber-500 p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">
              {activeTab === 'AUDIO' ? t.card1 : activeTab === 'SUMMARY' ? t.card2 : activeTab === 'TRANSLATE' ? t.card3 : t.card4}
            </h3>
            <textarea className="w-full p-4 mb-4 bg-slate-900 rounded border border-slate-700 h-40" 
                      placeholder={t.input_placeholder} value={inputData} onChange={(e) => setInputData(e.target.value)} />
            <button onClick={handleAction} className="w-full bg-amber-600 py-3 rounded-xl font-bold hover:bg-amber-700 transition">
              {loading ? '...' : t.create}
            </button>
            <button onClick={() => { setActiveTab('HOME'); setResult(''); setInputData(''); }} className="mt-4 text-slate-400 underline w-full text-center">{t.back}</button>
            {result && <div className="mt-6 p-4 bg-slate-950 rounded-lg border border-indigo-500 whitespace-pre-line">{result}</div>}
          </div>
        )}

        {activeTab === 'HOME' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => setActiveTab('AUDIO')} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-32 text-left hover:border-amber-500 transition">🎙️ {t.card1}</button>
            <button onClick={() => setActiveTab('SUMMARY')} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-32 text-left hover:border-amber-500 transition">📄 {t.card2}</button>
            <button onClick={() => setActiveTab('TRANSLATE')} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-32 text-left hover:border-amber-500 transition">🌐 {t.card3}</button>
            <button onClick={() => setActiveTab('CV')} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-32 text-left hover:border-amber-500 transition">💼 {t.card4}</button>
          </div>
        )}
      </div>
    </main>
  );
}


