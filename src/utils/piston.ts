import axios from 'axios'

interface PistonResponse {
  run: {
    stdout: string
    stderr: string
    output: string
    code: number
    signal: string | null
  }
}

export async function CodeExecution(
  language: string,
  content: string,
  stdin?: string,
): Promise<PistonResponse['run']> {
  try {
    console.log(content)
    console.log('stdin', stdin)
    const response = await axios.post<PistonResponse>('https://emkc.org/api/v2/piston/execute', {
      language,
      version: '*',
      files: [
        {
          name: 'main',
          content,
        },
      ],
      stdin,
    })

    return response.data.run
  } catch (error) {
    console.error('Error executing code with Piston:', error)
    throw new Error('Failed to execute code')
  }
}
