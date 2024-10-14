'use client'
import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material'
import { Editor } from '@monaco-editor/react'

export default function SubmissionPage({ params: { submissionId, revisionId } } : { params: { submissionId: string, revisionId: string } }) {
  const [revisionData, setRevisionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch the revision data only if we have both submissionId and revisionId
    if (submissionId && revisionId) {
      fetch(`/api/revision/${submissionId}/${revisionId}`)
        .then((res) => res.json())
        .then((data) => {
          setRevisionData(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Failed to fetch revision:', err)
          setLoading(false)
        })
    }
  }, [submissionId, revisionId])

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    )
  }

  if (!revisionData) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Revision data could not be loaded.
        </Typography>
      </Container>
    )
  }

  const { RawCode, CompilerOutput, LLMsuggestions } = revisionData

  return (
    <Container>
      <Paper elevation={3}>
        <Box display='flex' height='100vh'>
          {/* Left side - Code editor */}
          <Box width='50%' p={4} sx={{ borderRight: '1px solid #ddd' }}>
            <Typography variant='h6'>Submitted Code</Typography>
            <Editor
              height='85%'
              language='python' // Adjust the language based on your use case
              value={RawCode}
              theme='vs-dark'
              options={{
                readOnly: true,
                padding: { top: 10, bottom: 10 },
              }}
            />
          </Box>

          {/* Right side - Compiler output and LLM suggestions */}
          <Box width='50%' p={4} className='flex flex-col'>
            <Typography variant='h6'>Compiler Output</Typography>
            <Box
              p={2}
              mt={2}
              sx={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd', height: '40%' }}
            >
              <Typography variant='body2'>{CompilerOutput || 'No compiler output'}</Typography>
            </Box>

            <Typography variant='h6' mt={4}>
              LLM Suggestions
            </Typography>
            <Box
              p={2}
              mt={2}
              sx={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd', height: '40%' }}
            >
              <Typography variant='body2'>{LLMsuggestions || 'No suggestions from LLM'}</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
