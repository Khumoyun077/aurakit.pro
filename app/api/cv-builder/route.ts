import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { name, experience, skills } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Sen professional CV tuzuvchi mutaxassissan.' },
        { role: 'user', content: `Ism: ${name}, Tajriba: ${experience}, Ko'nikmalar: ${skills}. Shular asosida chiroyli CV tuz.` }
      ],
    });

    return NextResponse.json({ cv: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}