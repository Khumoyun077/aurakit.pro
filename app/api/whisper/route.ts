import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: apiKey,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Fayl topilmadi' }, { status: 400 });
    }

    // Faylni OpenAI taniydigan formatga o'tkazish
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
     });

    return NextResponse.json({ text: transcription.text });

  } catch (error: any) {
    console.error('Whisper xatolik:', error);
    return NextResponse.json({ error: error.message || 'Ovozni matnga aylantirishda xatolik yuz berdi' }, { status: 500 });
  }
}