'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const translations = {
  UZ: {
    back: '← Orqaga qaytish',
    title: '📄 Mag\'zini chiqarish (Summarize)',
    desc: 'Uzoq matnlaringizni kiriting va sun\'iy intellekt uning eng muhim joylarini konspekt qilib beradi.',
    label: 'Konspekt qilinadigan matnni kiriting:',
    btn: '✨ Mag\'zini chiqarish',
    loading: '⏳ GPT matnning mag\'zini chaqmoqda...',
    resultTitle: '📋 Tayyor konspekt:',
    copy: '📋 Nusxa olish',
    copied: '✅ Nusxalandi!',
    errorConn: 'Server bilan bog\'lanishda xatolik yuz berdi.',
    errorGen: 'Xatolik yuz berdi',
    placeholder: 'Bu yerga matnni joylashtiring...'
  },
  RU: {
    back: '← Назад',
    title: '📄 Выделение главного (Конспект)',
    desc: 'Вставьте длинный текст, и искусственный интеллект сделает краткую выжимку самых важных моментов.',
    label: 'Введите текст для конспектирования:',
    btn: '✨ Выделить главное',
    loading: '⏳ GPT анализирует текст...',
    resultTitle: '📋 Готовый конспект:',
    copy: '📋 Копировать',
    copied: '✅ Скопировано!',
    errorConn: 'Произошла ошибка соединения с сервером.',
    errorGen: 'Произошла ошибка',
    placeholder: 'Вставьте текст сюда...'
  },
  EN: {
    back: '← Go Back',
    title: '📄 Text Summarization',
    desc: 'Insert your long texts and AI will summarize the most important points for you.',
    label: 'Enter text to summarize:',
    btn: '✨ Summarize Text',
    loading: '⏳ GPT is extracting the core points...',
    resultTitle: '📋 Summary Insights:',
    copy: '📋 Copy Text',
    copied: '✅ Copied!',
    errorConn: 'A server connection error occurred.',
    errorGen: 'An error occurred',
    placeholder: 'Paste your text here...'
  }
};

export default function SummarizePage() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryText, setSummaryText] = useState("");
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

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setErrorText("");
    setSummaryText("");

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText, lang: currentLang }),
      });

      const data = await response.json();

      if (response.ok) {
        setSummaryText(data.summary);
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
    if (!summaryText) return;
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-3xl">
        
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
        </div>

        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-slate-400 mb-8 text-sm">
          {t.desc}
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">{t.label}</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.placeholder}
            rows={8}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-slate-200 text-base focus:outline-none focus:border-purple-500 transition resize-none"
          />
        </div>

        <button
          onClick={handleSummarize}
          disabled={loading || !inputText.trim()}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-sm font-semibold transition shadow-lg disabled:opacity-40 mb-8"
        >
          {loading ? t.loading : t.btn}
        </button>

        {(loading || summaryText || errorText) && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col justify-between min-h-[150px]">
            <div>
              <h3 className="text-lg font-bold mb-4 text-purple-400">{t.resultTitle}</h3>
              
              {loading && <p className="text-slate-400 text-sm italic animate-pulse">{t.loading}</p>}
              
              {!loading && summaryText && (
                <div className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap prose prose-invert">
                  {summaryText}
                </div>
              )}
              
              {!loading && errorText && (
                <p className="text-red-400 text-sm font-medium">⚠️ {errorText}</p>
              )}
            </div>

            {!loading && summaryText && (
              <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-end">
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                    copied 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
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