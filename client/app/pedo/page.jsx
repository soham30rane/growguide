'use client';
import { useState } from 'react';

export default function MarkdownToPDF() {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown PDF Converter
  
## Features

- **Accurate** Markdown rendering
- Code block support:
  \`\`\`javascript
  console.log("Hello World!");
  \`\`\`
  
> Beautiful blockquotes
`);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/markdown-to-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Download failed:', err);
      setError(err.message || 'Failed to generate PDF');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Markdown to PDF Converter</h1>
      
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className="w-full h-96 p-4 border rounded-lg font-mono mb-4"
      />
      
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className={`px-6 py-2 rounded-md text-white font-medium ${
          isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Generating PDF...' : 'Download PDF'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          Error: {error}
        </div>
      )}
    </div>
  );
}