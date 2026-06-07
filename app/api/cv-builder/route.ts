import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { name, experience, skills, language } = await req.json();

    if (!name || !experience || !skills) {
      return NextResponse.json(
        { error: 'Ism, tajriba va ko\'nikmalar majburiy' },
        { status: 400 }
      );
    }

    // ✅ KATTA harf bilan tekshirish
    const langPrompt = language === 'RU' ? 'на русском языке' :
                       language === 'EN' ? 'in English' :
                       'o\'zbek tilida';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Sen professional CV tuzuvchi mutaxassissan. Javobni har doim ${langPrompt} qaytar.`
        },
        {
          role: 'user',
          content: `Ism: ${name}\nTajriba: ${experience}\nKo'nikmalar: ${skills}\n\nShular asosida chiroyli va professional CV tuz.`
        }
      ],
    });

    return NextResponse.json({ result: response.choices[0].message.content });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}