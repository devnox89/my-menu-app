import React from "react";
import { Link } from "react-router-dom";

const PublicNavbar = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800 hover:text-yellow-500">
          MyMenu
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/login" className="text-gray-800 hover:text-yellow-500">
            Login
          </Link>
          <Link to="/register" className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 font-semibold">
            Registrati
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default PublicNavbar;
