import { useState, useRef } from 'react';
import { supabase } from '../app/lib/supabaseClient';

export default function UploadForm({ setResults }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
  
    setUploading(true);
    try {
      console.log('Uploading file:', file.name);
      
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('bottle-images')
        .upload(fileName, file);
  
      if (error) {
        console.error('Storage Error:', error);
        throw error;
      }
  
      console.log('File uploaded successfully:', data);
  
      // Get public URL of uploaded file
      const { data: publicUrlData, error: urlError } = supabase.storage
        .from('bottle-images')
        .getPublicUrl(data.path);
  
      if (urlError) {
        console.error('URL Error:', urlError);
        throw urlError;
      }
  
      const publicURL = publicUrlData.publicUrl;  // Add this line
  
      console.log('Public URL:', publicURL);
  
      // Call API to analyze image
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: publicURL }),
      });
  
      if (!response.ok) {
        const responseText = await response.text();
        console.error('API Error:', responseText);
        throw new Error('Failed to analyze image: ' + responseText);
      }
  
      const analysisResult = await response.json();
      console.log('Analysis Result:', analysisResult);
      setResults(analysisResult);
  
      // Save results to Supabase database
      const { data: insertData, error: dbError } = await supabase
        .from('bottle_data')
        .insert({ 
          image_url: publicURL, 
          ocr_text: analysisResult.ocr_text,
          bottle_name: analysisResult.name,
          producer: analysisResult.producer,
          alcohol_percentage: parseFloat(analysisResult.alcohol_percentage),
          description: analysisResult.description,
          estimated_price_range: analysisResult.estimated_price_range,
          llm_summary: analysisResult.llm_summary
        })
        .select();  // Add this line to return the inserted data

      if (dbError) throw dbError;

      console.log('Data saved successfully:', insertData);

    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Wine Label Analyzer</h2>
        <form onSubmit={handleSubmit}>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-gray-600">Drag & drop your wine label image here, or click to select</p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Select Image
            </button>
          </div>
          {file && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Selected file: {file.name}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {uploading ? 'Analyzing...' : 'Analyze Label'}
          </button>
        </form>
      </div>
    </div>
  );
}