import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex items-center">
        <Link to="/" className="text-2xl font-bold hover:text-green-400 transition-colors duration-300 mr-4">
          All-Intuition
        </Link>
        <p className="text-sm md:text-base text-gray-300">
          Train your Poker pattern-recognition abilities
        </p>
      </div>
    </header>
  );
}

export default Header;
