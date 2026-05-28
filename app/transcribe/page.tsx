'use client';
import { useState } from 'react';
import Link from 'next/link';

// 1. Ko'p tilli tarjimalar lug'ati
const translations = {
  UZ: {
    back: '← Orqaga qaytish',
    title: '🎙️ Ovozni matnga aylantirish',
    desc: 'Audio yoki video faylni yuklang va sun\'iy intellekt uni bir zumda matnga aylantirib beradi.',
    placeholderClick: 'Audio yoki video faylni tanlash uchun shu yerga bosing',
    placeholderFormat: 'MP3, WAV, MP4, WEBM (Maksimal 25MB)',
    loadingWhisper: 'AI audio faylni eshitmoqda, iltimos kuting...',
    selectedFile: 'Tanlangan fayl:',
    loadingTranscribe: 'Sun\'iy intellekt matnga o\'girmoqda...',
    resultPlaceholder: 'Natija bu yerda ko\'rinadi...',
    words: 'So‘zlar:',
    chars: 'Belgilar:',
    aiKonspekt: '✨ AI Konspekt',
    aiKonspektLoading: '⏳ Tayyorlanmoqda...',
    nuxsaOlish: '📋 Nusxa olish',
    nuxsaOlingan: '✅ Nusxalandi!',
    txtYuklash: '📥 .TXT yuklash',
    summaryTitle: '✨ Sun\'iy intellekt konspekti',
    summaryLoading: 'GPT matnni o‘qib, eng muhim joylarini yozib bormoqda...',
    errorConnection: 'Server bilan bog\'lanishda xatolik yuz berdi.',
    errorGeneral: 'Xatolik yuz berdi'
  },
  RU: {
    back: '← Назад',
    title: '🎙️ Преобразование речи в текст',
    desc: 'Загрузите аудио- или видеофайл, и искусственный интеллект мгновенно превратит if его в текст.',
    placeholderClick: 'Нажмите сюда, чтобы выбрать аудио- или видеофайл',
    placeholderFormat: 'MP3, WAV, MP4, WEBM (Максимум 25МБ)',
    loadingWhisper: 'ИИ слушает аудиофайл, пожалуйста, подождите...',
    selectedFile: 'Выбранный файл:',
    loadingTranscribe: 'Искусственный интеллект расшифровывает...',
    resultPlaceholder: 'Результат появится здесь...',
    words: 'Слова:',
    chars: 'Символы:',
    aiKonspekt: '✨ AI Конспект',
    aiKonspektLoading: '⏳ Готовится...',
    nuxsaOlish: '📋 Копировать',
    nuxsaOlingan: '✅ Скопировано!',
    txtYuklash: '📥 Скачать .TXT',
    summaryTitle: '✨ Конспект искусственного интеллекта',
    summaryLoading: 'GPT читает текст и записывает самые важные моменты...',
    errorConnection: 'Произошла ошибка соединения с сервером.',
    errorGeneral: 'Произошла ошибка'
  },
  EN: {
    back: '← Go Back',
    title: '🎙️ Speech to Text',
    desc: 'Upload an audio or video file and AI will instantly convert it into text.',
    placeholderClick: 'Click here to select an audio or video file',
    placeholderFormat: 'MP3, WAV, MP4, WEBM (Max 25MB)',
    loadingWhisper: 'AI is listening to the audio file, please wait...',
    selectedFile: 'Selected file:',
    loadingTranscribe: 'Artificial intelligence is transcribing...',
    resultPlaceholder: 'The result will appear here...',
    words: 'Words:',
    chars: 'Characters:',
    aiKonspekt: '✨ AI Summary',
    aiKonspektLoading: '⏳ Processing...',
    nuxsaOlish: '📋 Copy Text',
    nuxsaOlingan: '✅ Copied!',
    txtYuklash: '📥 Download .TXT',
    summaryTitle: '✨ AI Summary Insights',
    summaryLoading: 'GPT is reading the text and summarizing the key points...',
    errorConnection: 'A server connection error occurred.',
    errorGeneral: 'An error occurred'
  }
};

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [copied, setCopied] = useState(false);

  // Konspekt uchun state'lar
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [summaryError, setSummaryError] = useState("");

  // Joriy faol tilni saqlash (Boshlang'ich: UZ)
  const [currentLang, setCurrentLang] = useState<'UZ' | 'RU' | 'EN'>('UZ');

  const t = translations[currentLang]; // Kodni qisqartirish uchun qulay o'zgaruvchi

  // Fayl tanlanganda ishlaydigan funksiya
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setLoading(true);
      setErrorText("");
      setResultText("");
      setSummaryText(""); 
      setSummaryError("");

      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch('/api/whisper', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setResultText(data.text);
        } else {
          setErrorText(data.error || t.errorGeneral);
        }
      } catch (err) {
        setErrorText(t.errorConnection);
      } finally {
        setLoading(false);
      }
    }
  };

  // Konspekt qilish funksiyasi
  const handleSummarize = async () => {
    if (!resultText) return;
    setSummaryLoading(true);
    setSummaryError("");
    setSummaryText("");

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: resultText }),
      });

      const data = await response.json();

      if (response.ok) {
        setSummaryText(data.summary);
      } else {
        setSummaryError(data.error || t.errorGeneral);
      }
    } catch (err) {
      setSummaryError(t.errorConnection);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Matndan nusxa olish funksiyasi
  const handleCopy = async () => {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Nusxa olishda xatolik:", err);
    }
  };

  // Matnni .txt fayl qilib yuklab olish funksiyasi
  const handleDownload = () => {
    if (!resultText) return;
    const element = document.createElement("a");
    const fileBlob = new Blob([resultText], { type: 'text/plain' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = file ? `${file.name.split('.')[0]}_matn.txt` : "aurakit_matn.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const wordCount = resultText ? resultText.trim().split(/\s+/).length : 0;
  const charCount = resultText ? resultText.length : 0;

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-3xl">
        
        {/* Yuqori boshqaruv paneli: Orqaga qaytish va Til tugmalari */}
        <div className="flex items-center justify-between mb-8 w-full">
          <Link href="/" className="text-sm text-indigo-400 hover:underline flex items-center gap-1">
            {t.back}
          </Link>
          
          {/* O'zgaruvchan dynamic til paneli */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/50 text-xs font-semibold shadow-lg">
            {(['UZ', 'RU', 'EN'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setCurrentLang(lang)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${currentLang === lang ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md font-bold scale-105' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-slate-400 mb-8 text-sm">
          {t.desc}
        </p>

        {/* Audio/Video yuklash qutisi */}
        <label className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition mb-6 block bg-slate-800/50 ${loading ? 'border-amber-500 pointer-events-none' : 'border-slate-700 hover:border-indigo-500'}`}>
          <input 
            type="file" 
            accept="audio/*,video/*" 
            className="hidden" 
            onChange={handleFileChange} 
            disabled={loading}
          />
          <span className={`text-4xl block mb-4 ${loading ? 'animate-bounce' : ''}`}>
            {loading ? '⏳' : '🎵'}
          </span>
          
          {loading ? (
            <p className="text-amber-400 font-medium mb-1">{t.loadingWhisper}</p>
          ) : file ? (
            <p className="text-emerald-400 font-medium mb-1">{t.selectedFile} {file.name}</p>
          ) : (
            <>
              <p className="text-slate-300 font-medium mb-1">{t.placeholderClick}</p>
              <p className="text-xs text-slate-500">{t.placeholderFormat}</p>
            </>
          )}
        </label>

        {/* Natija chiqadigan oyna */}
        <div className={`bg-slate-800 rounded-2xl p-6 min-h-[150px] border ${errorText ? 'border-red-500/50' : 'border-slate-700'} flex flex-col justify-between mb-6`}>
          
          <div>
            {loading && <p className="text-slate-400 text-sm italic animate-pulse">{t.loadingTranscribe}</p>}
            
            {!loading && resultText && (
              <div className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap selection:bg-indigo-500 selection:text-white">
                {resultText}
              </div>
            )}
            
            {!loading && errorText && (
              <p className="text-red-400 text-sm font-medium">⚠️ {errorText}</p>
            )}

            {!loading && !resultText && !errorText && (
              <p className="text-slate-500 text-sm italic">{t.resultPlaceholder}</p>
            )}
          </div>

          {/* Matn tayyor bo'lganda chiqadigan dynamic tugmalar va statistika */}
          {!loading && resultText && (
            <div className="mt-6 pt-4 border-t border-slate-700/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              
              <div className="flex gap-4 text-xs text-slate-400">
                <span>{t.words} <strong className="text-slate-200">{wordCount}</strong></span>
                <span>{t.chars} <strong className="text-slate-200">{charCount}</strong></span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {/* 1. AI Konspekt tugmasi (Dynamic) */}
                <button
                  onClick={handleSummarize}
                  disabled={summaryLoading}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-medium transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {summaryLoading ? t.aiKonspektLoading : t.aiKonspekt}
                </button>

                {/* 2. Nusxa olish tugmasi (Dynamic) */}
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}
                >
                  {copied ? t.nuxsaOlingan : t.nuxsaOlish}
                </button>
                
                {/* 3. .TXT yuklash tugmasi (Dynamic) */}
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
                >
                  {t.txtYuklash}
                </button>
              </div>

            </div>
          )}
        </div>

        {/* AI Konspekt natijasi chiqadigan joy (Dynamic) */}
        {(summaryLoading || summaryText || summaryError) && (
          <div className="bg-gradient-to-b from-indigo-950/40 to-slate-800 rounded-2xl p-6 border border-indigo-500/30 animate-fade-in">
            <h3 className="text-lg font-bold mb-3 text-indigo-300 flex items-center gap-2">
              {t.summaryTitle}
            </h3>
            
            {summaryLoading && (
              <p className="text-slate-400 text-sm italic animate-pulse">{t.summaryLoading}</p>
            )}

            {summaryText && (
              <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none">
                {summaryText}
              </div>
            )}

            {summaryError && (
              <p className="text-red-400 text-sm font-medium">⚠️ {summaryError}</p>
            )}
          </div>
        )}

      </div>
    </main>
  );
}