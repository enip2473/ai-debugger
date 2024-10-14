import { NextResponse } from 'next/server'
import prisma from '@/db/index'

// GET request to fetch revision details by submissionId and revisionId
export async function GET(req: Request, { params }: { params: { submissionId: string, revisionNumber: string } }) {
  const { submissionId, revisionNumber } = params

  if (!submissionId || !revisionNumber) {
    return NextResponse.json({ message: 'Missing submissionId or revisionId' }, { status: 400 })
  }

  try {
    const revision = await prisma.revision.findFirst({
      where: {
        SubmissionID: Number(submissionId),
        RevisionNumber: Number(revisionNumber),
      },
      select: {
        RawCode: true,
        CompilerOutput: true,
        LLMsuggestions: true,
      },
    })

    if (!revision) {
      return NextResponse.json({ message: 'Revision not found' }, { status: 404 })
    }

    return NextResponse.json(revision)
  } catch (error) {
    console.error('Error fetching revision:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
