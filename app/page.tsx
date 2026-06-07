'use client';
import { useState, useEffect } from 'react';

const mainTranslations = {
  UZ: { title: 'AuraKit.pro — Hammasi 1 ta bosishda!', subtitle: 'Sun\'iy intellekt yordamchisi', card1: 'Ovozni matnga aylantirish', card2: 'Mag\'zini chiqarish', card3: 'Tarjima qilish', card4: 'Professional CV tayyorlash', create: 'Bajarish', back: 'Orqaga' },
  RU: { title: 'AuraKit.pro — Всё в 1 клик!', subtitle: 'Помощник на базе ИИ', card1: 'Преобразование голоса в текст', card2: 'Выделение главного', card3: 'Переводчик', card4: 'Создание профессионального CV', create: 'Выполнить', back: 'Назад' },
  EN: { title: 'AuraKit.pro — All in 1 Click!', subtitle: 'AI assistant for everyone', card1: 'Speech to Text', card2: 'Summarization', card3: 'Translation', card4: 'CV Builder', create: 'Execute', back: 'Back' }
};

// ✅ CV placeholder'lar tilga qarab
const cvPlaceholders = {
  UZ: { name: 'Ismingiz (masalan: Alisher Karimov)', experience: 'Ish tajribangiz (masalan: 3 yil React dasturchi)', skills: 'Ko\'nikmalaringiz (masalan: TypeScript, Next.js)' },
  RU: { name: 'Ваше имя (например: Алишер Каримов)', experience: 'Ваш опыт работы (например: 3 года React разработчик)', skills: 'Ваши навыки (например: TypeScript, Next.js)' },
  EN: { name: 'Your name (e.g. Alisher Karimov)', experience: 'Your experience (e.g. 3 years React developer)', skills: 'Your skills (e.g. TypeScript, Next.js)' }
};

const tabPlaceholders = {
  SUMMARY: { UZ: 'Qisqartiriladigan matnni kiriting...', RU: 'Введите текст для краткого изложения...', EN: 'Enter text to summarize...' },
  TRANSLATE: { UZ: 'Tarjima qilinadigan matnni kiriting...', RU: 'Введите текст для перевода...', EN: 'Enter text to translate...' },
};

type LangType = 'UZ' | 'RU' | 'EN';
type TabType = 'HOME' | 'AUDIO' | 'SUMMARY' | 'TRANSLATE' | 'CV';

interface CvData {
  name: string;
  experience: string;
  skills: string;
}

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<LangType>('UZ');
  const [activeTab, setActiveTab] = useState<TabType>('HOME');
  const [inputData, setInputData] = useState('');
  const [cvData, setCvData] = useState<CvData>({ name: '', experience: '', skills: '' });
  const [audioFile, setAudioFile] = useState<File | null>(null); // ✅ Audio fayl
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') as LangType;
    if (savedLang && ['UZ', 'RU', 'EN'].includes(savedLang)) setCurrentLang(savedLang);
  }, []);

  const t = mainTranslations[currentLang];
  const cvP = cvPlaceholders[currentLang]; // ✅ Tilga mos CV placeholder

  const handleBack = () => {
    setActiveTab('HOME');
    setResult('');
    setInputData('');
    setCvData({ name: '', experience: '', skills: '' });
    setAudioFile(null);
  };

  const handleAction = async () => {
    // Validatsiya
    if (activeTab === 'CV') {
      if (!cvData.name.trim() || !cvData.experience.trim() || !cvData.skills.trim()) {
        setResult('❌ Iltimos, barcha maydonlarni to\'ldiring!');
        return;
      }
    } else if (activeTab === 'AUDIO') {
      if (!audioFile) {
        setResult('❌ Iltimos, audio fayl tanlang!');
        return;
      }
    } else if (!inputData.trim()) {
      setResult('❌ Iltimos, matn kiriting!');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      let response: Response;

      if (activeTab === 'AUDIO') {
        // ✅ Audio — FormData yuborish
        const formData = new FormData();
        formData.append('file', audioFile!);
        formData.append('language', currentLang);
        response = await fetch('/api/whisper', {
          method: 'POST',
          body: formData,
        });

      } else if (activeTab === 'CV') {
        response = await fetch('/api/cv-builder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: cvData.name,
            experience: cvData.experience,
            skills: cvData.skills,
            language: currentLang
          }),
        });

      } else if (activeTab === 'TRANSLATE') {
        response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: inputData,
            targetLang: currentLang
          }),
        });

      } else {
        // SUMMARY
        response = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: inputData,
            language: currentLang
          }),
        });
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Xatolik: ${response.status}`);

      const output = data.result ?? data.cv ?? data.text ?? data.summary;
      setResult(output ?? 'Javob bo\'sh qaytdi');

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Noma\'lum xatolik';
      setResult('❌ Xatolik: ' + message);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
      {/* Til tanlash */}
      <div className="absolute top-6 right-6 flex bg-slate-800 p-1 rounded-xl border border-slate-700/50">
        {(['UZ', 'RU', 'EN'] as const).map((lang) => (
          <button key={lang} onClick={() => { setCurrentLang(lang); localStorage.setItem('selectedLanguage', lang); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${currentLang === lang ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            {lang}
          </button>
        ))}
      </div>

      {/* Sarlavha */}
      <div className="text-center max-w-2xl mb-12 mt-12">
        <h1 className="text-4xl font-extrabold mb-4">{t.title}</h1>
        <p className="text-slate-400">{t.subtitle}</p>
      </div>

      <div className="w-full max-w-4xl">
        {activeTab === 'HOME' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => setActiveTab('AUDIO')}
              className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-amber-500 transition text-left">
              🎙️ {t.card1}
            </button>
            <button onClick={() => setActiveTab('SUMMARY')}
              className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-amber-500 transition text-left">
              📄 {t.card2}
            </button>
            <button onClick={() => setActiveTab('TRANSLATE')}
              className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-amber-500 transition text-left">
              🌐 {t.card3}
            </button>
            <button onClick={() => setActiveTab('CV')}
              className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-amber-500 transition text-left">
              💼 {t.card4}
            </button>
          </div>
        ) : (
          <div className="bg-slate-800 border border-amber-500 p-8 rounded-2xl">

            {/* AUDIO tab */}
            {activeTab === 'AUDIO' && (
              <div className="mb-4">
                <label className="block text-slate-400 mb-2 text-sm">
                  {currentLang === 'UZ' ? 'Audio fayl tanlang (MP3, MP4, WAV)' :
                   currentLang === 'RU' ? 'Выберите аудио файл (MP3, MP4, WAV)' :
                   'Select audio file (MP3, MP4, WAV)'}
                </label>
                <input
                  type="file"
                  accept=".mp3,.mp4,.wav,.m4a,.webm"
                  onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                  className="w-full p-3 bg-slate-950 rounded border border-slate-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white file:cursor-pointer"
                />
                {audioFile && (
                  <p className="mt-2 text-green-400 text-sm">✅ {audioFile.name}</p>
                )}
              </div>
            )}

            {/* CV tab — ✅ tilga mos placeholder */}
            {activeTab === 'CV' && (
              <div className="flex flex-col gap-3 mb-4">
                <input
                  className="p-3 bg-slate-950 rounded border border-slate-700 text-white"
                  placeholder={cvP.name}
                  value={cvData.name}
                  onChange={(e) => setCvData(prev => ({ ...prev, name: e.target.value }))} />
                <textarea
                  className="p-3 bg-slate-950 rounded border border-slate-700 text-white h-24"
                  placeholder={cvP.experience}
                  value={cvData.experience}
                  onChange={(e) => setCvData(prev => ({ ...prev, experience: e.target.value }))} />
                <textarea
                  className="p-3 bg-slate-950 rounded border border-slate-700 text-white h-24"
                  placeholder={cvP.skills}
                  value={cvData.skills}
                  onChange={(e) => setCvData(prev => ({ ...prev, skills: e.target.value }))} />
              </div>
            )}

            {/* SUMMARY va TRANSLATE */}
            {(activeTab === 'SUMMARY' || activeTab === 'TRANSLATE') && (
              <textarea
                className="w-full p-4 mb-4 bg-slate-950 rounded border border-slate-700 h-40 text-white"
                placeholder={tabPlaceholders[activeTab]?.[currentLang]}
                value={inputData}
                onChange={(e) => setInputData(e.target.value)} />
            )}

            <button onClick={handleAction} disabled={loading}
              className="w-full bg-amber-600 py-3 rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50 mt-2">
              {loading ? '⏳...' : t.create}
            </button>
            <button onClick={handleBack}
              className="mt-4 text-slate-400 underline w-full">
              {t.back}
            </button>
            {result && (
              <div className="mt-6 p-4 bg-slate-950 rounded-lg border border-indigo-500 whitespace-pre-line">
                {result}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
