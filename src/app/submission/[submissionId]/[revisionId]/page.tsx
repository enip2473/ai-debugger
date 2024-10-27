'use client'
import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Stack
} from '@mui/material'
import Link from 'next/link'
import { Editor } from '@monaco-editor/react'
import { MessageWithIcon, type Diagnose } from "./TextBox"

type RevisionData = {
  RawCode: string,
  CompilerOutput: string,
  LLMsuggestions: string,
}

export default function SubmissionPage({ params: { submissionId, revisionId } } : { params: { submissionId: string, revisionId: string } }) {
  const [revisionData, setRevisionData] = useState<RevisionData>()
  const [loading, setLoading] = useState(true)
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null); // null, 'yes', or 'no'

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
  const compilerJson = CompilerOutput && JSON.parse(CompilerOutput)
  const llmJson = LLMsuggestions && JSON.parse(LLMsuggestions)
  return (
    <Container>
      <Paper elevation={3}>
        <Box display='flex' height='100vh'>
          <Box width='50%' p={4} sx={{ borderRight: '1px solid #ddd' }}>
            <Typography variant='h6'>Submitted Code</Typography>
            <Editor
              height='85%'
              language='python' // Adjust the language based on your use case
              value={RawCode}
              theme='vs-dark'
              options={{
                readOnly: true,
                padding: { top: 10,},
                minimap: {
                  enabled: false,
                },
              }}
            />
            <Box className="flex items-center">
              <Typography variant="subtitle1" mt={2} mr={4}>Is this helpful?</Typography>
              {isHelpful === null ? (
                <Stack direction="row" spacing={2} mt={1}>
                  <Button variant="contained" color="primary" onClick={() => setIsHelpful(true)}>
                    Yes
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => setIsHelpful(false)}>
                    No
                  </Button>
                </Stack>
              ) : isHelpful ? (
                <Typography variant="body2" color="success.main" mt={2}>
                  Thanks for your feedback!
                </Typography>
              ) : (
                <Stack spacing={1} mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Would you like to try a more advanced version?
                  </Typography>

                  <Link href="/advanced" passHref>
                    <Button variant="contained" color="primary">
                      Yes, show me
                    </Button>
                  </Link>
                </Stack>
              )}
            </Box>
          </Box>

          {/* Right side - Compiler output and LLM suggestions */}
          <Box width='50%' p={4} className='flex flex-col'>
            <Typography variant='h6'>Compiler Output</Typography>
            <Box
              p={2}
              mt={2}
            >
              {compilerJson && compilerJson.generalDiagnostics.map((diagnose: Diagnose, index: number) => (
                <MessageWithIcon key={index} severity={diagnose.severity} message={diagnose.message} />
              ))}
              {!compilerJson && <Typography variant='body2' className="break-words whitespace-pre-wrap">{CompilerOutput || 'No compiler output'}</Typography>}
            </Box>

            <Typography variant='h6' mt={4}>
              LLM Explanation on Compiler Output
            </Typography>
            <Box
              p={2}
              mt={2}
              className="overflow-auto"
            >
              {llmJson && llmJson.compiler.map((message: string, index: number) => ( 
                <MessageWithIcon key={index} severity="info" message={message} /> 
              ))}
            </Box>

            <Typography variant='h6' mt={4}>
              LLM Suggestions
            </Typography>
            <Box
              p={2}
              mt={2}
              className="overflow-auto"
            >
              {llmJson && llmJson.feedback.map((message: string, index: number) => ( 
                <MessageWithIcon key={index} severity="info" message={message} /> 
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
