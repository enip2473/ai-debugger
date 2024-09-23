import { NextResponse } from 'next/server';
import { generateText } from '@/utils/openai';
import { checkerPrompt } from '@/utils/prompts';
import { PythonParser } from '@/utils/parser';

export async function POST(request: Request) {
  const { naturalLanguage, limit } = await request.json();
  const limitStr = JSON.stringify(limit);

  const prompt = checkerPrompt.replace('{problem}', naturalLanguage).replace('{conditions}', limitStr);
  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }
  try {
    const response = await generateText(prompt);

    if (!response) {
      return NextResponse.json({ error: 'Failed to generate' }, { status: 500 });
    }
    
    const pythonCode = PythonParser(response);
    return NextResponse.json({ response: pythonCode });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate' }, { status: 500 });
  }
}
