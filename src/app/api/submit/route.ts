import { NextResponse } from 'next/server'
import prisma from '@/db/index'
import { runPyrightOnCode } from '@/utils/runPyright'
import { generateText } from '@/utils/openai'
import { pythonCompilerExplanation } from '@/utils/prompts'

export async function POST(req: Request) {
  const { source, name, code, userId } = await req.json()
  const sourceProblemId = 'test'

  if (!source || !name || !code || !userId || !sourceProblemId) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
  }

  try {
    // Step 1: Check if the problem exists
    let problem = await prisma.problem.findFirst({
      where: {
        Source: source,
        SourceProblemId: sourceProblemId,
      },
    })

    // Step 2: If the problem doesn't exist, create it
    if (!problem) {
      problem = await prisma.problem.create({
        data: {
          Source: source,
          SourceProblemId: sourceProblemId,
          ProblemName: name,
          RawStatement: '',
          ProblemType: '',
          Input: '',
          Output: '',
        },
      })
    }

    // Step 3: Create a submission for the user
    const submission = await prisma.submission.create({
      data: {
        UserID: userId,
        ProblemId: problem.ProblemID,
        CreatedTime: new Date(),
        CodingLanguage: 'python',
        Status: 'pending',
      },
    })

    const pyrightOutput = await runPyrightOnCode(code)
    const llmPrompt = pythonCompilerExplanation.replace('{code}', code).replace('{compilerOutput}', pyrightOutput)
    const llmOutput = await generateText(llmPrompt, true)
    
    console.log('Pyright output:', pyrightOutput)
    console.log('LLM output:', llmOutput)
    // Step 5: Save the revision and Pyright output
    await prisma.revision.create({
      data: {
        SubmissionID: submission.SubmissionID,
        RevisionNumber: 1,
        RawCode: code,
        CreatedTime: new Date(),
        CompilerOutput: pyrightOutput, // Store the Pyright output here
        LLMsuggestions: llmOutput,
        CheckerOutput: '',
      },
    })

    return NextResponse.json({
      message: 'Submission created and type-checked successfully',
      url: `/submission/${submission.SubmissionID}/1`
    })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
