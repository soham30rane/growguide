"use client"
import React, { useState } from 'react';
import { getRandomImage } from '../utils/randomImageGenerator';

const availableTags = [
  "Organic Farming",
  "Sustainable Farming",
  "Regenerative Agriculture",
  "Urban Farming",
  "Soil Health",
  "Precision Farming",
];

const TestBlogImagesPage = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [randomImage, setRandomImage] = useState(null);

  const handleTagToggle = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleGenerateImage = () => {
    const image = getRandomImage(selectedTags);
    console.log("Random Image:", image);
    setRandomImage(image);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-emerald-100 p-6 dark:from-[#1e3b2f] dark:via-[#1e3b2f] dark:to-[#1e3b2f]">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">
          Test Blog Images
        </h1>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Select Tags
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
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleGenerateImage}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300 mb-6"
        >
          Generate Random Image
        </button>
        {randomImage && (
          <div className="text-center">
            <img
              src={randomImage}
              alt="Random"
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            />
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Random image generated based on selected tags.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestBlogImagesPage;
