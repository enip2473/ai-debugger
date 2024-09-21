import { NextResponse } from 'next/server';
import { generateText } from '@/utils/openai';
import { validatorPrompt } from '@/utils/prompts';
import { PythonParser } from '@/utils/parser';

export async function POST(request: Request) {
  const { limit } = await request.json();
  const variables = JSON.stringify(limit.variables);
  const limits = JSON.stringify(limit.limits);
  const prompt = validatorPrompt.replace('{variables}', variables).replace('{limits}', limits);
  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }


  try {
    const response = await generateText(prompt);
    if (!response) {
        return NextResponse.json({ error: 'Failed to generate DDL' }, { status: 500 });
    }
    
    const pythonCode = PythonParser(response);
    return NextResponse.json({ response: pythonCode });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate DDL' }, { status: 500 });
  }
}
