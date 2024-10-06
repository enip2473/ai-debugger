// app/api/generate-ddl/route.ts
import { NextResponse } from 'next/server'
import { generateText } from '@/utils/openai'
import { limitGenerationPrompt, limitGenerationExample } from '@/utils/prompts'

export async function POST(request: Request) {
  const { prompt } = await request.json()

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  }
  try {
    const fullPrompt = `${prompt}${limitGenerationPrompt}${limitGenerationExample}`
    const response = await generateText(fullPrompt, true)

    if (!response) {
      return NextResponse.json({ error: 'Failed to generate DDL' }, { status: 500 })
    }

    return NextResponse.json({ response })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate DDL' }, { status: 500 })
  }
}
