'use client';
import { useState } from 'react';

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
    <main className="min-h-screen bg-slate-900 text-white p-10 flex flex-col items-center">
      {/* Til tanlash (Rasmda ko'rganingizdek yuqorida) */}
      <div className="absolute top-6 right-6 flex bg-slate-800 p-1 rounded-xl">
        {(['UZ', 'RU', 'EN'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)} className={`px-4 py-1 rounded-lg ${lang === l ? 'bg-indigo-600' : ''}`}>{l}</button>
        ))}
      </div>

      {/* Rasmda ko'rsatgan 2x2 dizayn qismi */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl mt-16">
        <div className="col-span-2 bg-slate-800 p-8 rounded-2xl border border-slate-700">
           <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
           <input className="w-full p-4 mb-4 bg-slate-950 rounded-xl border border-slate-700" placeholder={t.name} onChange={(e) => setData({...data, name: e.target.value})} />
           <textarea className="w-full p-4 mb-4 bg-slate-950 rounded-xl border border-slate-700 h-24" placeholder={t.exp} onChange={(e) => setData({...data, experience: e.target.value})} />
           <textarea className="w-full p-4 mb-6 bg-slate-950 rounded-xl border border-slate-700 h-24" placeholder={t.skills} onChange={(e) => setData({...data, skills: e.target.value})} />
           <button onClick={handleSubmit} className="w-full bg-indigo-600 py-4 rounded-xl font-bold">{loading ? '...' : t.btn}</button>
           {cv && <div className="mt-8 p-6 bg-slate-950 rounded-xl border border-indigo-500 whitespace-pre-line">{cv}</div>}
        </div>
      </div>
    </main>
  );
}