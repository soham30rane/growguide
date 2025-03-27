"use client"
import React, { useState, useEffect } from 'react';
import fetchBlogsAction from '@/actions/blogs';
import { getRandomImage } from '../utils/randomImageGenerator';
import BlogDetails from './BlogDetails';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeBlog, setActiveBlog] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      const result = await fetchBlogsAction();
      if (result.success) {
        setBlogs(result.blogs);
      } else {
        console.error("Failed to fetch blogs");
      }
    };
    fetchBlogs();
  }, []);

  const handleBlogSelect = (blog) => {
    setActiveBlog(blog);
    setShow(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-emerald-100 p-6 dark:from-[#1e3b2f] dark:via-[#1e3b2f] dark:to-[#1e3b2f]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-6 pb-8 bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">
          Blog Posts
        </h1>
        {!show ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div 
                key={blog.uid} 
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={blog.thumbnail || getRandomImage(blog.tags)} 
                    alt={blog.blog_title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{blog.blog_title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {blog.blog_content.length > 100 ? `${blog.blog_content.slice(0, 100)}...` : blog.blog_content}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleBlogSelect(blog)}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <BlogDetails blog={activeBlog} onBack={() => setShow(false)} />
        )}
      </div>
    </div>
  );
};

export default BlogPage;