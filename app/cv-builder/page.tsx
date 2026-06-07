'use client';
import { useState } from 'react';

// Til matnlari (bosh sahifa bilan bir xil uslubda)
const translations = {
  UZ: { title: 'Professional CV tayyorlash', name: 'Ismingiz', exp: 'Ish tajribangiz', skills: 'Ko\'nikmalar', btn: 'CV yaratish' },
  RU: { title: 'Создание профессионального CV', name: 'Ваше имя', exp: 'Ваш опыт работы', skills: 'Ваши навыки', btn: 'Создать CV' },
  EN: { title: 'Professional CV Builder', name: 'Your Name', exp: 'Work Experience', skills: 'Skills', btn: 'Create CV' }
};

export default function CVBuilderPage() {
  const [lang, setLang] = useState<'UZ' | 'RU' | 'EN'>('EN');
  const [data, setData] = useState({ name: '', experience: '', skills: '' });
  const [cv, setCv] = useState('');
  const [loading, setLoading] = useState(false);

  const t = translations[lang];

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, language: lang }),
    });
    const result = await res.json();
    setCv(result.cv);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
      {/* Til tanlash tugmalari (dizaynga mos) */}
      <div className="absolute top-6 right-6 flex bg-slate-800 p-1 rounded-xl border border-slate-700/50">
        {(['UZ', 'RU', 'EN'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)} className={`px-3 py-1.5 rounded-lg ${lang === l ? 'bg-indigo-600' : 'text-slate-400'}`}>{l}</button>
        ))}
      </div>

      <div className="w-full max-w-2xl mt-16 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{t.title}</h1>
        
        <input className="w-full p-4 mb-4 bg-slate-900 rounded-xl border border-slate-700" placeholder={t.name} onChange={(e) => setData({...data, name: e.target.value})} />
        <textarea className="w-full p-4 mb-4 bg-slate-900 rounded-xl border border-slate-700 h-32" placeholder={t.exp} onChange={(e) => setData({...data, experience: e.target.value})} />
        <textarea className="w-full p-4 mb-6 bg-slate-900 rounded-xl border border-slate-700 h-32" placeholder={t.skills} onChange={(e) => setData({...data, skills: e.target.value})} />
        
        <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-4 rounded-xl font-bold hover:opacity-90 transition">
          {loading ? '...' : t.btn}
        </button>

        {cv && <div className="mt-8 p-6 bg-slate-900 rounded-2xl border border-indigo-500/30 whitespace-pre-line">{cv}</div>}
      </div>
    </main>
  );
}