'use client';
import { useState, useEffect } from 'react';

const mainTranslations = {
  UZ: { title: 'AuraKit.pro — Hammasi 1 ta bosishda!', subtitle: 'Sun\'iy intellekt yordamchisi', card1: 'Ovozni matnga aylantirish', card2: 'Mag\'zini chiqarish', card3: 'Tarjima qilish', card4: 'Professional CV tayyorlash', input_placeholder: 'Ma\'lumotni shu yerga kiriting...', create: 'Bajarish', back: 'Orqaga' },
  RU: { title: 'AuraKit.pro — Всё в 1 клик!', subtitle: 'Помощник на базе ИИ', card1: 'Преобразование голоса в текст', card2: 'Выделение главного', card3: 'Переводчик', card4: 'Создание профессионального CV', input_placeholder: 'Введите данные...', create: 'Выполнить', back: 'Назад' },
  EN: { title: 'AuraKit.pro — All in 1 Click!', subtitle: 'AI assistant for everyone', card1: 'Speech to Text', card2: 'Summarization', card3: 'Translation', card4: 'CV Builder', input_placeholder: 'Enter data...', create: 'Execute', back: 'Back' }
};

const tabPlaceholders = {
  AUDIO: { UZ: 'Audio fayl yuklanmagan (hozircha matn kiriting)', RU: 'Аудио файл (пока введите текст)', EN: 'Audio file (enter text for now)' },
  SUMMARY: { UZ: 'Qisqartiriladigan matnni kiriting...', RU: 'Введите текст для краткого изложения...', EN: 'Enter text to summarize...' },
  TRANSLATE: { UZ: 'Tarjima qilinadigan matnni kiriting...', RU: 'Введите текст для перевода...', EN: 'Enter text to translate...' },
  CV: { UZ: 'Ismingizni kiriting...', RU: 'Введите ваше имя...', EN: 'Enter your name...' },
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
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') as LangType;
    if (savedLang && ['UZ', 'RU', 'EN'].includes(savedLang)) setCurrentLang(savedLang);
  }, []);

  const t = mainTranslations[currentLang];

  const handleAction = async () => {
    if (activeTab === 'CV') {
      if (!cvData.name.trim() || !cvData.experience.trim() || !cvData.skills.trim()) {
        setResult('❌ Iltimos, barcha CV maydonlarini to\'ldiring!');
        return;
      }
    } else if (activeTab !== 'AUDIO' && !inputData.trim()) {
      setResult('❌ Iltimos, matn kiriting!');
      return;
    }

    setLoading(true);
    setResult('');

    const apiMap: Record<string, string> = {
      AUDIO: '/api/whisper',
      SUMMARY: '/api/summarize',
      TRANSLATE: '/api/translate',
      CV: '/api/cv-builder'
    };

    try {
      type PayloadType =
        | { text: string; language: LangType }
        | { text: string; targetLang: LangType }
        | { name: string; experience: string; skills: string; language: LangType }
        | { language: LangType };

      let bodyData: PayloadType;

      if (activeTab === 'CV') {
        bodyData = {
          name: cvData.name,
          experience: cvData.experience,
          skills: cvData.skills,
          language: currentLang
        };
      } else if (activeTab === 'TRANSLATE') {
        bodyData = {
          text: inputData,
          targetLang: currentLang
        };
      } else if (activeTab === 'SUMMARY') {
        bodyData = {
          text: inputData,
          language: currentLang
        };
      } else {
        bodyData = { language: currentLang };
      }

      const response = await fetch(apiMap[activeTab], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Server xatoligi: ${response.status}`);

      const output = data.result ?? data.cv ?? data.translatedText ?? data.summary ?? data.text;
      setResult(output ?? 'Javob bo\'sh qaytdi');

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Noma\'lum xatolik';
      setResult('❌ Xatolik: ' + message);
    }

    setLoading(false);
  };

  const handleBack = () => {
    setActiveTab('HOME');
    setResult('');
    setInputData('');
    setCvData({ name: '', experience: '', skills: '' });
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
      <div className="absolute top-6 right-6 flex bg-slate-800 p-1 rounded-xl border border-slate-700/50">
        {(['UZ', 'RU', 'EN'] as const).map((lang) => (
          <button key={lang} onClick={() => { setCurrentLang(lang); localStorage.setItem('selectedLanguage', lang); }}
            className={`px-3 py-1.5 rounded-lg ${currentLang === lang ? 'bg-indigo-600' : 'text-slate-400'}`}>
            {lang}
          </button>
        ))}
      </div>

      <div className="text-center max-w-2xl mb-12 mt-12">
        <h1 className="text-4xl font-extrabold mb-4">{t.title}</h1>
        <p className="text-slate-400">{t.subtitle}</p>
      </div>

      <div className="w-full max-w-4xl">
        {activeTab === 'HOME' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ✅ AUDIO — hozircha o'chirilgan */}
            <button disabled
              className="bg-slate-800 p-6 rounded-2xl border border-slate-700 opacity-40 cursor-not-allowed text-left">
              🎙️ {t.card1}
              <span className="block text-xs text-slate-500 mt-1">Tez kunda...</span>
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

            {activeTab === 'CV' ? (
              <div className="flex flex-col gap-3 mb-4">
                <input
                  className="p-3 bg-slate-950 rounded border border-slate-700 text-white"
                  placeholder="Ismingiz (masalan: Alisher Karimov)"
                  value={cvData.name}
                  onChange={(e) => setCvData(prev => ({ ...prev, name: e.target.value }))} />
                <textarea
                  className="p-3 bg-slate-950 rounded border border-slate-700 text-white h-24"
                  placeholder="Ish tajribangiz (masalan: 3 yil React dasturchi)"
                  value={cvData.experience}
                  onChange={(e) => setCvData(prev => ({ ...prev, experience: e.target.value }))} />
                <textarea
                  className="p-3 bg-slate-950 rounded border border-slate-700 text-white h-24"
                  placeholder="Ko'nikmalaringiz (masalan: TypeScript, Next.js, Node.js)"
                  value={cvData.skills}
                  onChange={(e) => setCvData(prev => ({ ...prev, skills: e.target.value }))} />
              </div>
            ) : (
              <textarea
                className="w-full p-4 mb-4 bg-slate-950 rounded border border-slate-700 h-40 text-white"
                placeholder={tabPlaceholders[activeTab]?.[currentLang] ?? t.input_placeholder}
                value={inputData}
                onChange={(e) => setInputData(e.target.value)} />
            )}

            <button onClick={handleAction} disabled={loading}
              className="w-full bg-amber-600 py-3 rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50">
              {loading ? '⏳ Ishlanmoqda...' : t.create}
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
