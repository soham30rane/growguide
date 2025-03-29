"use client"
import React, { useState, useEffect } from 'react';
import fetchBlogsAction from '@/actions/blogs';
import { getRandomImage } from '../utils/randomImageGenerator';
import BlogDetails from './BlogDetails';
import CreateBlogModal from '../resources/CreateBlog'; // adjust path if needed

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeBlog, setActiveBlog] = useState(null);
  const [show, setShow] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-5xl font-extrabold text-center mb-6 pb-8 bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">
            Blog Posts
          </h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-colors duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Blog
          </button>
        </div>
        {!show ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div 
                key={blog.uid} 
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2"
              >
                <div className="h-48 overflow-hidden relative group">
                  <img 
                    src={blog.thumbnail || getRandomImage(blog.tags)} 
                    alt={blog.blog_title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{blog.blog_title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {blog.blog_content.length > 100 ? `${blog.blog_content.slice(0, 100)}...` : blog.blog_content}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleBlogSelect(blog)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
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
      {isCreateModalOpen && (
        <CreateBlogModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default BlogPage;