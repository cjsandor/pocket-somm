'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function UploadForm({ setResults }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('bottle-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { publicURL, error: urlError } = supabase.storage
        .from('bottle-images')
        .getPublicUrl(data.path);

      if (urlError) throw urlError;

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: publicURL }),
      });

      if (!response.ok) throw new Error('Failed to analyze image');

      const analysisResult = await response.json();
      setResults(analysisResult);

      const { error: dbError } = await supabase
        .from('bottle_data')
        .insert({ 
          image_url: publicURL,
          ...analysisResult // Spread the analysis result fields
        });

      if (dbError) throw dbError;
    } catch (error) {
      console.error('Error:', error);
      setError(`Error uploading file: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // ... rest of the component (render method) remains the same
}