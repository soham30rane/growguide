"use client"

import React from 'react';
import Link from 'next/link';
import '@/styles/agro.css';
import '@/styles/navbar.css';
import { FaHome, FaSearch, FaUsers, FaBook, FaRobot } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/">
          <span className="navbar-logo-text">GrowGuide</span>
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link href="/dashboard">
            <button className="navbar-button">
              <FaHome className="navbar-icon" />
              <span className="navbar-text">Dashboard</span>
            </button>
          </Link>
        </li>
        <li>
          <Link href="/scan">
            <button className="navbar-button">
              <FaSearch className="navbar-icon" />
              <span className="navbar-text">Scan</span>
            </button>
          </Link>
        </li>
        <li>
          <Link href="/community">
            <button className="navbar-button">
              <FaUsers className="navbar-icon" />
              <span className="navbar-text">Community</span>
            </button>
          </Link>
        </li>
        <li>
          <Link href="/resources">
            <button className="navbar-button">
              <FaBook className="navbar-icon" />
              <span className="navbar-text">Resources</span>
            </button>
          </Link>
        </li>
        <li>
          <Link href="/ai-assistant">
            <button className="navbar-button">
              <FaRobot className="navbar-icon" />
              <span className="navbar-text">AI Assistant</span>
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
