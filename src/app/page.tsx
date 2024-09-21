// app/page.tsx
'use client';

import { useState } from 'react';
import JsonDisplay from '@/app/jsonDisplay';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jsonObject, setJsonObject] = useState('');
  const [generator, setGenerator] = useState('');
  const [validator, setValidator] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/testcase', {
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
        setJsonObject(parsedData);
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
          limit: jsonObject 
        }),
      });

      const validatorResponse = await fetch('/api/validator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          naturalLanguage: prompt,
          limit: jsonObject 
        }),
      });

      const generatorData = await generatorResponse.json();
      const validatorData = await validatorResponse.json();

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
        jsonObject && (
          <>
            <JsonDisplay jsonObject={jsonObject} setJsonObject={setJsonObject} />
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
          <h2 className="text-lg font-semibold mb-2">Generated Test Code</h2>
          <pre className="bg-gray-100 p-4 rounded-lg">{generator}</pre>
        </div>
      }

      {validator &&
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Generated Test Validator</h2>
          <pre className="bg-gray-100 p-4 rounded-lg">{validator}</pre>
        </div>
      }
    </div>
  );
}
