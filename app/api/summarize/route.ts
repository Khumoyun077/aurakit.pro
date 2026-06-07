import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, language } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Matn kiritilmadi' }, { status: 400 });
    }

    // ✅ 'lang' o'rniga 'language' — page.tsx bilan mos
    let systemPrompt = "Berilgan matnni tahlil qiling va eng asosiy mag'zini o'zbek tilida, qisqa bullet points ko'rinishida chiqarib bering.";

    if (language === 'RU') {
      systemPrompt = "Проанализируйте текст и выделите основную суть на русском языке, в виде кратких bullet points.";
    } else if (language === 'EN') {
      systemPrompt = "Analyze the text and summarize the key points in English, using short bullet points.";
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.5,
    });

    return NextResponse.json({ result: response.choices[0].message.content });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Xatolik' }, { status: 500 });
  }
}