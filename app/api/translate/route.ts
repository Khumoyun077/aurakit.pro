import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Til kodini to'liq nomga aylantirish
const langNames: Record<string, string> = {
  UZ: "o'zbek",
  RU: "rus",
  EN: "ingliz"
};

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Matn yoki maqsadli til kiritilmadi' },
        { status: 400 }
      );
    }

    // ✅ "UZ" → "o'zbek" ga aylantirish
    const langName = langNames[targetLang] ?? targetLang;

    const systemPrompt = `Siz professional tarjimonsiz. Berilgan matnni ${langName} tiliga tarjima qilib bering. Faqat tarjima qilingan matnni qaytaring.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
    });

    // ✅ page.tsx da: data.result ?? data.translatedText
    return NextResponse.json({
      result: response.choices[0].message.content
    });

  } catch (error: any) {
    console.error('Translate xatolik:', error);
    return NextResponse.json(
      { error: error.message || 'Tarjima qilishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}