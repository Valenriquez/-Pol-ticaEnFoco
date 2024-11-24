"use client"
import React, { useState, useEffect } from 'react';
/*
Key Adjustments:
bg-transparent: Ensures the navbar background is transparent.
fixed top-0 left-0 w-full: Fixes the navbar at the top of the screen and spans the full width, making it suitable for a transparent navbar effect.
z-10: Ensures the navbar stays above other content.
Padding (p-4): Retains the padding around the navbar elements for styling
*/

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`p-4 fixed top-0 left-0 w-full z-10 transition-colors duration-300 ${
        isScrolled ? 'bg-black bg-opacity-50 text-white shadow-lg' : 'bg-transparent text-white'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="space-x-4">
          <a href="#features" className="hover:underline">Features</a>
          <a href="#pricing" className="hover:underline">Pricing</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </div>
        <input type="search" className="bg-purple-white shadow rounded border-0 p-3 dark:text-black" placeholder="Search by name..." />

      </div>
    </nav>
  );
};

export default Navbar;
