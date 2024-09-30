// app/page.tsx
'use client';

import { useState } from 'react';
import { CodeExecution } from '@/utils/piston';
import { pythonMainFunction } from '@/utils/prompts';
import JsonDisplay, {limitsJson, variablesJson} from '@/app/jsonDisplay';

type variables = {
  limits: limitsJson;
  variables: variablesJson;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputLimit, setInputLimit] = useState<variables>({limits: {}, variables: {}});
  const [outputLimit, setOutputLimit] = useState<variables>({limits: {}, variables: {}});
  const [generator, setGenerator] = useState('');
  const [validator, setValidator] = useState('');
  const [checker, setChecker] = useState('');
  const [testCase, setTestCase] = useState('');
  const [userCode, setUserCode] = useState('');  // Added for user's input code
  const [testResult, setTestResult] = useState(''); // Result after test execution
  const [checkerResult, setcheckerResult] = useState(''); // Result after checker execution
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/variables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        let parsedData;
        try {
          parsedData = JSON.parse(data.response); // Parse the string into a JSON object
        } catch (parseError) {
          console.error(parseError);
          setError('Failed to parse response as JSON');
          return;
        }
        setInputLimit(parsedData.input);
        setOutputLimit(parsedData.output);
      } else {
        setError(data.error || 'Failed to generate response');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTest = async () => {
    setLoading(true);
    setError('');

    try {
      const generatorResponse = await fetch('/api/generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          naturalLanguage: prompt,
          limit: inputLimit 
        }),
      });

      const validatorResponse = await fetch('/api/validator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          naturalLanguage: prompt,
          limit: inputLimit 
        }),
      });

      const checkerResponse = await fetch('/api/checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          naturalLanguage: prompt,
          limit: outputLimit 
        }),
      });

      const generatorData = await generatorResponse.json();
      const validatorData = await validatorResponse.json();
      const checkerData = await checkerResponse.json();

      const generateResult = await CodeExecution("python", generatorData.response);
      const validateResult = await CodeExecution("python", validatorData.response, generateResult.stdout);

      setChecker(checkerData.response);
      console.log(generateResult);
      console.log(validateResult);
      if (validateResult.code === 0) {
        setTestCase(generateResult.stdout)
      }
      if (generatorResponse.ok && validatorResponse.ok) {
        setGenerator(generatorData.response);
        setValidator(validatorData.response);
      } else {
        setError(generatorData.error + validatorData.error || 'Failed to generate response');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const handleRunTest = async () => {
    setLoading(true);
    setError('');
    const fullCode = pythonMainFunction.replace("{userCode}", userCode);  // Combine the main function with user's input code
    console.log(fullCode)
    try {
      const result = await CodeExecution('python', fullCode, testCase);  // Execute user code with test case
      console.log(result);
      const parsedResult = JSON.parse(result.stdout);  // Parse stdout as JSON
      const checkerInput = JSON.stringify({
        input: JSON.parse(testCase),
        output: parsedResult.output,
      });
      const checkerExecution = await CodeExecution('python', checker, checkerInput);  // Execute output checker
      setTestResult(result.stdout);
      console.log(checkerExecution);
      setcheckerResult(checkerExecution.stdout);
    } catch (err) {
      console.error("Error parsing result:", error);  // Handle potential parsing errors  
      setError('Failed to run test');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-col container mx-auto p-8 w-4/5 justify-center items-center">
      <h1 className="text-3xl font-bold text-center mb-6">AI Debugger</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mx-16">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter natural language description..."
          rows={4}
          required
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {loading ? 'Generating...' : 'Identify Variables'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

      {
        inputLimit && (
          <>
            <JsonDisplay jsonObject={inputLimit} setJsonObject={setInputLimit} title="Input Variables and Limit"/>
          </>
        )
      }

      {
        outputLimit && (
          <>
            <JsonDisplay jsonObject={outputLimit} setJsonObject={setOutputLimit} title="Output Variables and Limit"/>
            <button
              disabled={loading}
              onClick={handleGenerateTest}
              className={`mt-4 py-2 px-4 rounded-lg text-white font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {loading ? 'Generating...' : 'Generate Test Code'}
            </button>

          </>
        )
      }


      {generator && 
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Generated Test Generator</h2>
          <pre className="bg-gray-100 p-4 rounded-lg">{generator}</pre>
        </div>
      }

      {validator &&
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Generated Test Validator</h2>
          <pre className="bg-gray-100 p-4 rounded-lg">{validator}</pre>
        </div>
      }

      {checker &&
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Generated Output Checker</h2>
          <pre className="bg-gray-100 p-4 rounded-lg">{checker}</pre>
        </div>
      }


      {
        testCase && (
          <div className="mt-8 flex space-x-8">
            {/* Left Side: JSON Test Case Display */}
            <div className="w-1/2 bg-gray-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Generated Test Case</h2>
              <pre>{JSON.stringify(testCase, null, 2)}</pre>
            </div>

            {/* Right Side: User Input Code */}
            <div className="w-1/2">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                placeholder="Enter your code here..."
                rows={10}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                disabled={loading}
                onClick={handleRunTest}
                className={`mt-4 py-2 px-4 rounded-lg text-white font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {loading ? 'Running...' : 'Run Test'}
              </button>

              {testResult && (
                <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">Test Result</h2>
                  <pre>{testResult}</pre>
                </div>
              )}

              {checkerResult && (
                <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">Checker Result</h2>
                  <pre>{checkerResult}</pre>
                </div>
              )}

            </div>
          </div>
        )
      }
    </div>
  );
}
