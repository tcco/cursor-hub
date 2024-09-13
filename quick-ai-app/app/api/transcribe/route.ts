import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(request: NextRequest) {
  console.log('Transcription request received');

  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      console.error('No audio file provided');
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    console.log('Audio file received:', audioFile.name);

    const buffer = Buffer.from(await audioFile.arrayBuffer());

    console.log('Sending request to Groq');
    const response = await openai.audio.transcriptions.create({
      file: buffer,
      model: 'whisper-1',
    });

    console.log('Transcription received:', response.text);

    return NextResponse.json({ transcription: response.text });
  } catch (error) {
    console.error('Error during transcription:', error);
    return NextResponse.json({ error: 'Transcription failed', details: error.message }, { status: 500 });
  }
}