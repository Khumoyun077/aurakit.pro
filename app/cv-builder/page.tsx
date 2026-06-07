'use client';
import { useState } from 'react';

export default function CVBuilder() {
  const [data, setData] = useState({ name: '', experience: '', skills: '' });
  const [cv, setCv] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState<'UZ' | 'RU' | 'EN'>('UZ'); // Til state qo'shildi

  const handleSubmit = async () => {
    if (!data.name || !data.experience || !data.skills) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/cv', { // Manzil to'g'irlandi
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, language: currentLang }), // Til qo'shildi
      });
      
      const result = await res.json();
      if (result.cv) {
        setCv(result.cv);
      } else {
        alert("Xatolik yuz berdi: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Server bilan bog'lanishda xatolik.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto bg-slate-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Professional CV Builder</h1>

      {/* Til tanlash tugmalari */}
      <div className="flex gap-2 mb-6">
        {(['UZ', 'RU', 'EN'] as const).map((lang) => (
          <button 
            key={lang} 
            onClick={() => setCurrentLang(lang)} 
            className={`px-4 py-2 rounded font-bold ${currentLang === lang ? 'bg-indigo-600' : 'bg-slate-700'}`}
          >
            {lang}
          </button>
        ))}
      </div>
      
      <input 
        className="w-full p-3 mb-4 border border-slate-700 bg-slate-800 rounded text-white" 
        placeholder="Ismingiz" 
        onChange={(e) => setData({...data, name: e.target.value})} 
      />
      <textarea 
        className="w-full p-3 mb-4 border border-slate-700 bg-slate-800 rounded text-white h-32" 
        placeholder="Ish tajribangiz" 
        onChange={(e) => setData({...data, experience: e.target.value})} 
      />
      <textarea 
        className="w-full p-3 mb-4 border border-slate-700 bg-slate-800 rounded text-white h-32" 
        placeholder="Ko'nikmalaringiz (Skills)" 
        onChange={(e) => setData({...data, skills: e.target.value})} 
      />
      
      <button 
        onClick={handleSubmit} 
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-3 rounded font-bold hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'CV yaratilmoqda...' : 'CV yaratish'}
      </button>

      {cv && (
        <div className="mt-8 p-6 bg-slate-800 border border-slate-700 rounded whitespace-pre-line text-slate-300">
          <h2 className="text-xl font-bold mb-4 text-white">Sizning CV-ingiz:</h2>
          {cv}
        </div>
      )}
    </div>
  );
}