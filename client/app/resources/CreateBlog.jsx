"use client"
import React, { useState, useEffect } from 'react';

const availableTags = [
  "Organic Farming",
  "Sustainable Farming",
  "Regenerative Agriculture",
  "Urban Farming",
  "Soil Health",
  "Precision Farming",
  "Water Management",
  "Irrigation",
  "Environment",
  "Pest Control",
  "Eco-Friendly",
  "Agriculture",
];

const CreateBlogModal = ({ isOpen, onClose }) => {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  // Prevent scrolling of the background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleTagToggle = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleSubmit = () => {
    const newBlog = {
      title: blogTitle,
      content: blogContent,
      tags: selectedTags,
      thumbnail: thumbnailUrl,
    };
    console.log("Blog Submitted:", newBlog);
    // Add logic to save the blog (e.g., API call)
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setBlogTitle('');
    setBlogContent('');
    setSelectedTags([]);
    setThumbnailUrl('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
      <div 
        className="relative max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 transition-all duration-300 transform scale-100" 
        style={{
          animation: "modalFadeIn 0.3s ease-out"
        }}
      >
        <style jsx>{`
          @keyframes modalFadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">
          Create a New Blog
        </h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Blog Title
          </label>
          <input
            type="text"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            placeholder="Enter blog title"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Thumbnail URL
          </label>
          <input
            type="text"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            placeholder="Enter image URL for thumbnail"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Blog Content (Markdown supported)
          </label>
          <textarea
            value={blogContent}
            onChange={(e) => setBlogContent(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            rows="10"
            placeholder="Write your blog content here using Markdown format..."
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedTags.includes(tag)
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                } transition-colors duration-200`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="w-1/2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-1/2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300"
          >
            Publish Blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogModal;
