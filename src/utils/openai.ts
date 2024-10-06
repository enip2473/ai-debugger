import OpenAI from 'openai'

const openai = new OpenAI()

export async function generateText(prompt: string, json: boolean = false): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: json ? { type: 'json_object' } : undefined,
  })
  return completion.choices[0].message.content as string
}
