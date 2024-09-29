"use client";
import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { Editor } from '@monaco-editor/react';


export default function CodeEditorPage() {
  const [problemSource, setProblemSource] = useState('Leetcode');
  const [problemName, setProblemName] = useState('');
  const [code, setCode] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null); 


  const handleSourceChange = (e: any) => {
    setProblemSource(e.target.value);
  };

  const handleNameChange = (e: any) => {
    setProblemName(e.target.value);
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result;
        if (typeof fileContent === "string") {
          setCode(fileContent); // Update Monaco editor content
        }
      };
      reader.readAsText(file); // Read file as text
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  return (
    <Container className="w-4/5">
      <Paper elevation={3}>
        <Box display="flex" height="100vh">
          <Box
            width="25%"
            p={4}
            sx={{ backgroundColor: '#f5f5f5', borderRight: '1px solid #ddd' }}
          >
            <Typography variant="h6" gutterBottom>
              Select Problem Source
            </Typography>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="problem-source-label">Source</InputLabel>
              <Select
                labelId="problem-source-label"
                value={problemSource}
                onChange={handleSourceChange}
                label="Source"
              >
                <MenuItem value="Leetcode">Leetcode</MenuItem>
                <MenuItem value="Codeforces">Codeforces</MenuItem>
                <MenuItem value="AP325">AP325</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="h6" className="mt-2" gutterBottom>
              Problem Name / ID
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              label="Problem Name/Number"
              value={problemName}
              onChange={handleNameChange}
            />
          </Box>

          {/* Right Section - Code Editor & File Upload */}
          <Box width="75%" p={4} className="flex flex-col">
            <Typography variant="h6">
              Your Code
            </Typography>

            <Editor
              height="80%"
              language="python"
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                padding: { top: 10, bottom: 10 },
              }}
            />

            <Box mt={2}>
              <Button variant="contained" onClick={triggerFileInput}>
                Upload File
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept=".cpp,.py" // Adjust based on the file types you want to support
                  onChange={handleFileUpload} // Handle file change
                />
              </Button>
            </Box>

            <Box mt={2}>
              <Button variant="contained" color="primary">
                Let's Go!
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}