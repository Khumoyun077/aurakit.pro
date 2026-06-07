import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    // Endi 'language' ni ham qabul qilib olamiz
    const { name, experience, skills, language } = await req.json();

    // Tilga qarab promptni dinamik sozlaymiz
    const langPrompt = language === 'ru' ? 'на русском языке' : 
                       language === 'en' ? 'in English' : 'o‘zbek tilida';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: `Sen professional CV tuzuvchi mutaxassissan. Javobni har doim ${langPrompt} qaytar.` 
        },
        { 
          role: 'user', 
          content: `Ism: ${name}, Tajriba: ${experience}, Ko'nikmalar: ${skills}. Shular asosida chiroyli va professional CV tuz.` 
        }
      ],
    });

    return NextResponse.json({ cv: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}