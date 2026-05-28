import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Matn yoki maqsadli til kiritilmadi' }, { status: 400 });
    }

    // GPT uchun aniq professional tarjimon ko'rsatmasi
    const systemPrompt = `Siz professional va yuqori malakali tarjimonsiz. Berilgan matnni ma'nosini buzmagan holda, eng mos va tabiiy so'zlar bilan shundoq ${targetLang} tiliga tarjima qilib bering. Faqat tarjima qilingan matnning o'zini qaytaring, ortiqcha izoh yoki so'zlar qo'shmang.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.3, // Tarjima aniq bo'lishi uchun haroratni pasaytiramiz
    });

    return NextResponse.json({ translatedText: response.choices[0].message.content });

  } catch (error: any) {
    console.error('Translate xatolik:', error);
    return NextResponse.json({ error: error.message || 'Tarjima qilishda xatolik yuz berdi' }, { status: 500 });
  }
}