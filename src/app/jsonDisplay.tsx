import { useState } from 'react';

interface JsonEditorProps {
  jsonObject: any;
  setJsonObject: (newJsonObject: any) => void;
  title: string;
}

export default function JsonEditor({ jsonObject, setJsonObject, title }: JsonEditorProps) {
  const handleInputChange = (section: string, key: string, field: string, value: string | string[]) => {
    const updatedJson = { ...jsonObject };
    (updatedJson as any)[section][key][field] = value;
    setJsonObject(updatedJson);
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="mt-10 flex w-full justify-center">
        <div className="w-1/2">  
          <h3 className="text-lg font-semibold mb-2">Variables</h3>
          {Object.keys(jsonObject.variables).map((variableKey) => (
              <div key={variableKey} className="mb-6 border p-4 rounded-lg bg-white shadow">
              <h4 className="font-bold mb-2">{variableKey}</h4>
              <div className="mb-2">
                  <label className="block text-gray-700">Type:</label>
                  <input
                  type="text"
                  value={jsonObject.variables[variableKey].type}
                  onChange={(e) => handleInputChange('variables', variableKey, 'type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  />
              </div>
              <div className="mb-2">
                  <label className="block text-gray-700">Data Type:</label>
                  <input
                  type="text"
                  value={jsonObject.variables[variableKey].dataType}
                  onChange={(e) => handleInputChange('variables', variableKey, 'dataType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  />
              </div>
              <div className="mb-2">
                  <label className="block text-gray-700">Description:</label>
                  <input
                  type="text"
                  value={jsonObject.variables[variableKey].description}
                  onChange={(e) => handleInputChange('variables', variableKey, 'description', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  />
              </div>
              </div>
          ))}
        </div>

        {/* Limits Section */}
        <div className="w-1/2">
          <h3 className="text-lg font-semibold mb-2">Limits</h3>
          {Object.keys(jsonObject.limits).map((limitKey) => (
              <div key={limitKey} className="mb-6 border p-4 rounded-lg bg-white shadow">
              <h4 className="font-bold mb-2">{limitKey}</h4>
              <div className="mb-2">
                  <label className="block text-gray-700">Limit:</label>
                  <input
                  type="text"
                  value={jsonObject.limits[limitKey].limit}
                  onChange={(e) => handleInputChange('limits', limitKey, 'limit', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  />
              </div>
              <div className="mb-2">
                  <label className="block text-gray-700">Description:</label>
                  <input
                  type="text"
                  value={jsonObject.limits[limitKey].description}
                  onChange={(e) => handleInputChange('limits', limitKey, 'description', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  />
              </div>
              <div className="mb-2">
                  <label className="block text-gray-700">Variables:</label>
                  <input
                  type="text"
                  value={jsonObject.limits[limitKey].variables.join(', ')}
                  onChange={(e) => handleInputChange('limits', limitKey, 'variables', e.target.value.split(', '))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  />
              </div>
              </div>
          ))}
        </div>
      </div>
    </>
  );
}
