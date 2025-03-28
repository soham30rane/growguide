"use client"
import React from 'react';
import ReactMarkdown from 'react-markdown';

const BlogDetails = ({ blog, onBack }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <button 
          onClick={onBack}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
        >
          <i className="fas fa-arrow-left mr-2"></i> Back to Blogs
        </button>
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
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          <ReactMarkdown>{blog.blog_content}</ReactMarkdown>
        </p>
      </div>
    </div>
  );
};

export default BlogDetails;
