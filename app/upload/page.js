'use client';

import { useState } from 'react';
import UploadForm from '../../components/UploadForm';
import Results from '../../components/Results';

export default function UploadPage() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysis = async (imageUrl) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const analysisResult = await response.json();
      setResults(analysisResult);
    } catch (error) {
      console.error('Error:', error);
      setError(`Error analyzing image: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Bottle Analyzer</h1>
      <div className="max-w-2xl mx-auto">
        <UploadForm onAnalysis={handleAnalysis} />
        {isLoading && (
          <div className="mt-4 text-center">
            <p className="text-gray-600">Analyzing image...</p>
          </div>
        )}
        {error && (
          <div className="mt-4 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        {results && Object.keys(results).length > 0 && (
          <div className="mt-8">
            <Results data={results} />
          </div>
        )}
      </div>
    </div>
  );
}
