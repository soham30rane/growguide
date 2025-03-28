"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';

const BlogDetails = ({ blog, onBack }) => {
  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('/api/markdown-to-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          markdown: `# ${blog.blog_title}\n\n${blog.tags.map(tag => `_${tag}_ `).join('')}\n\n${blog.blog_content}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${blog.blog_title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('PDF download failed: ' + error.message);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-start">
          <button 
            onClick={onBack}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
          >
            <i className="fas fa-arrow-left mr-2"></i> Back to Blogs
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mb-4"
            title="Download as PDF"
          >
            <i className="fas fa-file-pdf mr-2"></i> PDF
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{blog.blog_title}</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {blog.tags.map((tag, index) => (
            <span 
              key={index} 
              className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-6">
        <div className="text-gray-600 dark:text-gray-400 text-lg">
          <ReactMarkdown>{blog.blog_content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;