'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../app/lib/supabaseClient';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Data Analyzer
        </Link>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleMenu}
            className="flex items-center focus:outline-none"
          >
            <span className="mr-2">Menu</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isMenuOpen && (
            <ul className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
              <li>
                <Link href="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/upload" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Upload
                </Link>
              </li>
              <li>
                <Link href="/history" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  History
                </Link>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}