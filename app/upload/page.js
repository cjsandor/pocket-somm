'use client';

import { useState, useMemo } from 'react';
import UploadForm from '../../components/UploadForm';
import Results from '../../components/Results';

export default function UploadPage() {
  const [results, setResults] = useState(null);

  // Memoize the results data
  const memoizedResults = useMemo(() => results, [results]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Upload Image</h1>
      <UploadForm setResults={setResults} />
      {memoizedResults && Array.isArray(memoizedResults) && memoizedResults.length > 0 && (
        <div className="mt-8">
          <Results data={memoizedResults} />
        </div>
      )}
    </div>
  );
}