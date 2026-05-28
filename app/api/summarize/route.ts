import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, lang } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Matn kiritilmadi' }, { status: 400 });
    }

    // Har bir til uchun GPT'ga qanday konspekt qilish bo'yicha ko'rsatma beramiz
    let systemPrompt = "Siz matnning eng muhim joylarini ajratib beruvchi yordamchisiz. Berilgan matnni tahlil qiling va eng asosiy mag'zini, muhim tezislarini o'zbek tilida, qisqa va tushunarli punktlar (bullet points) ko'rinishida chiqarib bering.";
    
    if (lang === 'RU') {
      systemPrompt = "Вы помощник, который выделяет главное из текста. Проанализируйте текст и выделите основную суть и важные тезисы на русском языке, в виде кратких и понятных пунктов (bullet points).";
    } else if (lang === 'EN') {
      systemPrompt = "You are an assistant that extracts the core insights from text. Analyze the text and summarize the main essence and key points in English, using short and clear bullet points.";
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.5,
    });

    return NextResponse.json({ summary: response.choices[0].message.content });

  } catch (error: any) {
    console.error('Summarize xatolik:', error);
    return NextResponse.json({ error: error.message || 'Konspekt qilishda xatolik' }, { status: 500 });
  }
}