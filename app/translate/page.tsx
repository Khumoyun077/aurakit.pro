'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const translations = {
  UZ: {
    back: '← Orqaga qaytish',
    title: '🌐 Tarjima qilish (Translate)',
    desc: 'Matnlaringizni istalgan tilga sun\'iy intellekt yordamida professional tarzda tarjima qiling.',
    label: 'Tarjima qilinadigan matn:',
    selectLabel: 'Qaysi tilga tarjima qilinsin?',
    btn: '✨ Tarjima qilish',
    loading: '⏳ GPT matnni o\'girmoqda...',
    resultTitle: '📋 Tayyor tarjima:',
    copy: '📋 Nusxa olish',
    copied: '✅ Nusxalandi!',
    errorConn: 'Server bilan bog\'lanishda xatolik yuz berdi.',
    errorGen: 'Xatolik yuz berdi',
    placeholder: 'Bu yerga matnni yozing yoki joylashtiring...'
  },
  RU: {
    back: '← Назад',
    title: '🌐 Переводчик (Translate)',
    desc: 'Переводите свои тексты на любой язык профессионально с помощью искусственного интеллекта.',
    label: 'Текст для перевода:',
    selectLabel: 'На какой язык перевести?',
    btn: '✨ Перевести',
    loading: '⏳ GPT переводит текст...',
    resultTitle: '📋 Готовый перевод:',
    copy: '📋 Копировать',
    copied: '✅ Скопировано!',
    errorConn: 'Произошла ошибка соединения с сервером.',
    errorGen: 'Произошла ошибка',
    placeholder: 'Введите или вставьте текст сюда...'
  },
  EN: {
    back: '← Go Back',
    title: '🌐 AI Translation',
    desc: 'Translate your texts into any language professionally using artificial intelligence.',
    label: 'Text to translate:',
    selectLabel: 'Translate to which language?',
    btn: '✨ Translate Text',
    loading: '⏳ GPT is translating...',
    resultTitle: '📋 Translated Text:',
    copy: '📋 Copy Text',
    copied: '✅ Copied!',
    errorConn: 'A server connection error occurred.',
    errorGen: 'An error occurred',
    placeholder: 'Type or paste your text here...'
  }
};

export default function TranslatePage() {
  const [inputText, setInputText] = useState("");
  const [targetLang, setTargetLang] = useState("RU"); // Default maqsadli til
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [copied, setCopied] = useState(false);
  
  const [currentLang, setCurrentLang] = useState<'UZ' | 'RU' | 'EN'>('UZ');

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') as 'UZ' | 'RU' | 'EN';
    if (savedLang && ['UZ', 'RU', 'EN'].includes(savedLang)) {
      setCurrentLang(savedLang);
    }
  }, []);

  const t = translations[currentLang];

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setErrorText("");
    setTranslatedText("");

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText, targetLang: targetLang }),
      });

      const data = await response.json();

      if (response.ok) {
        setTranslatedText(data.translatedText);
      } else {
        setErrorText(data.error || t.errorGen);
      }
    } catch (err) {
      setErrorText(t.errorConn);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-3xl">
        
        {/* Navigatsiya va Til paneli */}
        <div className="flex items-center justify-between mb-8 w-full">
          <Link href="/" className="text-sm text-indigo-400 hover:underline">
            {t.back}
          </Link>
          
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700/50 text-xs font-semibold">
            {(['UZ', 'RU', 'EN'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setCurrentLang(lang);
                  localStorage.setItem('selectedLanguage', lang);
                }}
                className={`px-3 py-1.5 rounded-lg transition ${currentLang === lang ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-slate-400 mb-8 text-sm">
          {t.desc}
        </p>

        {/* Maqsadli tilni tanlash dropdown menyusi */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">{t.selectLabel}</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
          >
            <option value="O'zbek">O'zbekcha (UZ)</option>
            <option value="Русский">Русский (RU)</option>
            <option value="English">English (EN)</option>
          </select>
        </div>

        {/* Matn kiritish */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">{t.label}</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.placeholder}
            rows={6}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-slate-200 text-base focus:outline-none focus:border-emerald-500 transition resize-none"
          />
        </div>

        {/* Tugma */}
        <button
          onClick={handleTranslate}
          disabled={loading || !inputText.trim()}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-sm font-semibold transition shadow-lg disabled:opacity-40 mb-8"
        >
          {loading ? t.loading : t.btn}
        </button>

        {/* Natija */}
        {(loading || translatedText || errorText) && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col justify-between min-h-[150px]">
            <div>
              <h3 className="text-lg font-bold mb-4 text-emerald-400">{t.resultTitle}</h3>
              {loading && <p className="text-slate-400 text-sm italic animate-pulse">{t.loading}</p>}
              {!loading && translatedText && (
                <div className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap">
                  {translatedText}
                </div>
              )}
              {!loading && errorText && (
                <p className="text-red-400 text-sm font-medium">⚠️ {errorText}</p>
              )}
            </div>

            {!loading && translatedText && (
              <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-end">
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}
                >
                  {copied ? t.copied : t.copy}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}